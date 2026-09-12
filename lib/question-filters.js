function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function slug(value) {
  return normalizeText(value).replace(/\s+/g, "-") || "nao-informado";
}

function cleanFilter(value, maximum = 160) {
  return String(value ?? "").trim().slice(0, maximum);
}

function sourceData(question) {
  if (question?.source && typeof question.source === "object") {
    return question.source;
  }

  return {
    title: typeof question?.source === "string" ? question.source : "",
    locator: "",
  };
}

function derivedChapter(locator, workId) {
  const text = String(locator ?? "").trim();
  const match = text.match(/\b(?:cap(?:\.|ítulo|itulo|ter)?)\s*(\d+)/i);
  if (!match) return null;

  const number = match[1];
  const detail = text.split(",").slice(1).join(",").trim();
  const title = detail || `Capítulo ${number}`;

  return {
    id: `${workId}-cap-${String(number).padStart(2, "0")}`,
    number,
    title,
    label: detail ? `Capítulo ${number} - ${detail}` : `Capítulo ${number}`,
  };
}

export function normalizeQuestionFilters(filters = {}) {
  return {
    work_id: cleanFilter(filters.work_id || filters.bibliography_id),
    chapter_id: cleanFilter(filters.chapter_id),
    topic_id: cleanFilter(filters.topic_id),
    subtopic_id: cleanFilter(filters.subtopic_id),
    module: cleanFilter(filters.module),
    difficulty: cleanFilter(filters.difficulty),
    style: cleanFilter(filters.style),
    scenario_only: filters.scenario_only === true || filters.scenario_only === "true" || filters.scenario_only === "1",
    query: cleanFilter(filters.query, 120),
  };
}

export function questionTaxonomy(question, fallbackSubject = "") {
  const canonical = question?.taxonomy && typeof question.taxonomy === "object"
    ? question.taxonomy
    : {};
  const tracked = question?.tracking && typeof question.tracking === "object"
    ? question.tracking
    : {};
  const source = sourceData(question);
  const workTitle = cleanFilter(tracked.work?.title || source.title || "Obra não informada", 240);
  const workId = cleanFilter(canonical.bibliography_id || tracked.work?.id || slug(workTitle));
  const chapter = tracked.chapter && typeof tracked.chapter === "object"
    ? {
        id: cleanFilter(canonical.chapter_id || tracked.chapter.id),
        number: cleanFilter(tracked.chapter.number, 30),
        title: cleanFilter(tracked.chapter.title, 240),
        label: cleanFilter(
          tracked.chapter.label ||
            `Capítulo ${tracked.chapter.number || ""} - ${tracked.chapter.title || ""}`,
          280
        ),
      }
    : canonical.chapter_id
      ? {
          id: cleanFilter(canonical.chapter_id),
          number: "",
          title: cleanFilter(source.locator || canonical.chapter_id, 240),
          label: cleanFilter(source.locator || canonical.chapter_id, 280),
        }
      : derivedChapter(source.locator, workId);

  return {
    subject_slug: cleanFilter(
      question?.source_subject || canonical.subject_slug || tracked.subject_slug || fallbackSubject || question?.subject
    ),
    work: {
      id: workId,
      title: workTitle,
      author: cleanFilter(tracked.work?.author || source.author, 240),
    },
    chapter,
    section: cleanFilter(tracked.section || source.locator, 280),
    module: cleanFilter(tracked.module || question?.module, 200),
    topic: {
      id: cleanFilter(canonical.topic_id || tracked.topic?.id || question?.topic_code || slug(question?.topic)),
      title: cleanFilter(tracked.topic?.title || question?.topic, 240),
    },
    subtopic_id: cleanFilter(canonical.subtopic_id),
  };
}

export function questionMatchesFilters(question, rawFilters, fallbackSubject = "") {
  const filters = normalizeQuestionFilters(rawFilters);
  const taxonomy = questionTaxonomy(question, fallbackSubject);

  if (filters.work_id && taxonomy.work.id !== filters.work_id) return false;
  if (filters.chapter_id && taxonomy.chapter?.id !== filters.chapter_id) return false;
  if (filters.topic_id && taxonomy.topic.id !== filters.topic_id) return false;
  if (filters.subtopic_id && taxonomy.subtopic_id !== filters.subtopic_id) return false;
  if (filters.module && taxonomy.module !== filters.module) return false;
  if (filters.difficulty && question?.difficulty !== filters.difficulty) return false;
  if (filters.style && question?.style !== filters.style) return false;
  if (filters.scenario_only) {
    const tags = Array.isArray(question?.tags) ? question.tags : [];
    if (question?.scenario_only !== true && question?.ripeam_only !== true && !tags.includes("ripeam-banco") && !tags.includes("ripeam-situacional") && !tags.includes("situacao-de-manobra")) return false;
  }

  if (filters.query) {
    const wanted = normalizeText(filters.query);
    const source = sourceData(question);
    const searchable = normalizeText([
      taxonomy.work.title,
      taxonomy.work.author,
      taxonomy.chapter?.label,
      taxonomy.section,
      taxonomy.module,
      taxonomy.topic.title,
      question?.topic_code,
      ...(Array.isArray(question?.tags) ? question.tags : []),
      question?.question,
      source.title,
      source.locator,
    ].filter(Boolean).join(" "));

    if (!wanted.split(" ").every((part) => searchable.includes(part))) return false;
  }

  return true;
}

export function filterQuestions(questions, filters, fallbackSubject = "") {
  return (questions || []).filter((question) =>
    questionMatchesFilters(question, filters, fallbackSubject)
  );
}

function addFacet(map, id, label, subject, extra = {}) {
  if (!id || !label) return;
  const current = map.get(id) || {
    id,
    label,
    count: 0,
    subjects: new Set(),
    ...extra,
  };
  current.count += 1;
  if (subject) current.subjects.add(subject);
  map.set(id, current);
}

function finalizeFacets(map) {
  return [...map.values()]
    .map((item) => ({ ...item, subjects: [...item.subjects].sort() }))
    .sort((a, b) => a.label.localeCompare(b.label, "pt-BR", { numeric: true }));
}

export function buildQuestionFilterFacets(questions, fallbackSubject = "") {
  const works = new Map();
  const chapters = new Map();
  const modules = new Map();

  for (const question of questions || []) {
    const taxonomy = questionTaxonomy(question, fallbackSubject);
    const subject = taxonomy.subject_slug || fallbackSubject;

    addFacet(works, taxonomy.work.id, taxonomy.work.title, subject);
    addFacet(modules, taxonomy.module, taxonomy.module, subject);

    if (taxonomy.chapter) {
      addFacet(
        chapters,
        taxonomy.chapter.id,
        `${taxonomy.work.title} · ${taxonomy.chapter.label}`,
        subject,
        { work_id: taxonomy.work.id }
      );
    }
  }

  return {
    works: finalizeFacets(works),
    chapters: finalizeFacets(chapters),
    modules: finalizeFacets(modules),
  };
}
