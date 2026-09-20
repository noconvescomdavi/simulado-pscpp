const ROMAN = "(?:X{0,3}(?:IX|IV|V?I{1,3}))";

function clean(value) {
  return String(value ?? "").replace(/\r\n?/g, "\n").trim();
}

function romanValue(raw) {
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100 };
  let total = 0;
  let previous = 0;
  for (const ch of String(raw || "").toUpperCase().split("").reverse()) {
    const value = values[ch] || 0;
    total += value < previous ? -value : value;
    previous = Math.max(previous, value);
  }
  return total;
}

function assertionMarkers(text) {
  const re = new RegExp(`(^|\\s)(${ROMAN})[\\)\\.]\\s*`, "g");
  const found = [];
  let match;
  while ((match = re.exec(text))) {
    found.push({ label: match[2].toUpperCase(), start: match.index + match[1].length, contentStart: re.lastIndex });
  }
  return found;
}

function sequentialAssertions(markers) {
  if (markers.length < 2 || markers[0].label !== "I") return false;
  return markers.every((marker, index) => romanValue(marker.label) === index + 1);
}

function splitAssertions(text) {
  const markers = assertionMarkers(text);
  if (!sequentialAssertions(markers)) return null;
  const stem = text.slice(0, markers[0].start).trim();
  if (!stem) return null;
  const assertions = markers.map((marker, index) => ({
    label: marker.label,
    text: text.slice(marker.contentStart, markers[index + 1]?.start ?? text.length).trim(),
  }));
  if (assertions.some((item) => !item.text)) return null;
  return { stem, assertions };
}

function splitEnumerated(text, kind) {
  const re = kind === "letter"
    ? /(^|\\s)(?:\\(([a-eA-E])\\)|([a-eA-E])\\)[.:]?\\s*/g
    : /(^|\\s)(?:\\((\\d{1,2})\\)|(\\d{1,2})[\\).])\\s*/g;
  const markers = [];
  let match;
  while ((match = re.exec(text))) {
    markers.push({ label: match[2] || match[3], start: match.index + match[1].length, contentStart: re.lastIndex });
  }
  if (markers.length < 2) return null;
  if (kind === "letter") {
    const first = markers[0].label.toLowerCase().charCodeAt(0);
    if (!markers.every((marker, index) => marker.label.toLowerCase().charCodeAt(0) === first + index)) return null;
  } else {
    const first = Number(markers[0].label);
    if (!markers.every((marker, index) => Number(marker.label) === first + index)) return null;
  }
  const stem = text.slice(0, markers[0].start).trim();
  if (!stem) return null;
  const items = markers.map((marker, index) => ({
    label: marker.label,
    text: text.slice(marker.contentStart, markers[index + 1]?.start ?? text.length).trim(),
  }));
  if (items.some((item) => !item.text)) return null;
  return { stem, items };
}

function splitCheckStatements(text) {
  const lines = text.split(/\n+/).map((line) => clean(line)).filter(Boolean);
  const first = lines.findIndex((line) => /^\(\s*\)\s*/.test(line));
  if (first < 1) return null;
  const stem = lines.slice(0, first).join(" ");
  const statements = lines.slice(first);
  if (statements.length < 2 || statements.some((line) => !/^\(\s*\)\s*\S/.test(line))) return null;
  return {
    stem,
    items: statements.map((line, index) => ({
      label: String(index + 1),
      text: line.replace(/^\(\s*\)\s*/, "").trim(),
    })),
  };
}

function normalizeSequence(value) {
  const raw = clean(value);
  if (!/^(?:[VF]\s*[-–—]\s*)+[VF]$/i.test(raw)) return raw;
  return raw.toUpperCase().split(/\s*[-–—]\s*/).join(" – ");
}

function splitColumns(text) {
  const match = /\bCOLUNA\s+A\b([\s\S]*?)\bCOLUNA\s+B\b([\s\S]*)/i.exec(text);
  if (!match) return null;
  const before = text.slice(0, match.index).trim();
  const a = clean(match[1]);
  const b = clean(match[2]);
  if (!a || !b) return null;
  return { before, columnA: a, columnB: b };
}

export function classifyQuestionStructure(question) {
  const text = clean(question?.question);
  const rawOptions = Array.isArray(question?.options) ? question.options : [];
  const options = rawOptions.map((option) => typeof option === "string" ? clean(option) : clean(option?.text ?? option?.value ?? option?.label ?? ""));
  if (!text) return { type: "simple", confidence: "high", blocks: [] };

  const columns = splitColumns(text);
  if (columns) {
    return {
      type: "correlation",
      confidence: "high",
      blocks: [
        ...(columns.before ? [{ type: "stem", text: columns.before }] : []),
        { type: "columns", columnA: columns.columnA, columnB: columns.columnB },
      ],
      options: rawOptions.map((option) => typeof option === "string" ? normalizeSequence(option) : option),
    };
  }

  const assertions = splitAssertions(text);
  if (assertions) {
    const vf = /verdadeir|fals|\bV\s*\/\s*F\b/i.test(assertions.stem) || options.filter((option) => /^(?:[VF]\s*[-–—]\s*)+[VF]$/i.test(option)).length >= 2;
    return {
      type: vf ? "true_false" : "assertions",
      confidence: "high",
      blocks: [
        { type: "stem", text: assertions.stem },
        { type: "assertions", items: assertions.assertions },
      ],
      options: rawOptions.map((option) => typeof option === "string" ? normalizeSequence(option) : option),
    };
  }

  const checks = splitCheckStatements(text);
  if (checks) {
    return {
      type: /verdadeir|fals|\bV\s*\/\s*F\b/i.test(checks.stem) ? "true_false" : "statements",
      confidence: "high",
      blocks: [
        { type: "stem", text: checks.stem },
        { type: "items", style: "statement", items: checks.items },
      ],
      options: rawOptions.map((option) => typeof option === "string" ? normalizeSequence(option) : option),
    };
  }

  const lettered = splitEnumerated(text, "letter");
  const numbered = lettered ? null : splitEnumerated(text, "number");
  const enumeration = lettered || numbered;
  const paragraphBlocks = text.includes("\n")
    ? text.split(/\n+/).map((part) => clean(part)).filter(Boolean).map((part) => ({ type: "paragraph", text: part }))
    : [{ type: "stem", text }];
  const enumerationVf = enumeration && /verdadeir|fals|\bV\s*\/\s*F\b/i.test(enumeration.stem);
  return {
    type: enumerationVf ? "true_false" : enumeration ? "enumeration" : paragraphBlocks.length > 1 ? "paragraphs" : "simple",
    confidence: "high",
    blocks: enumeration
      ? [{ type: "stem", text: enumeration.stem }, { type: "items", style: enumerationVf ? "statement" : lettered ? "letter" : "number", items: enumeration.items }]
      : paragraphBlocks,
    options: rawOptions.map((option) => typeof option === "string" ? normalizeSequence(option) : option),
  };
}

export function structuredPublicQuestion(question) {
  return { ...question, structure: question?.structure?.blocks?.length ? question.structure : classifyQuestionStructure(question) };
}
