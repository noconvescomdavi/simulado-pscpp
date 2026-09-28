// Editorial normalization for question stems.
// Bibliographic locators remain in question.source.locator for traceability; they must not
// replace the technical object the student is expected to understand.
const LOCATOR_WORDS = String.raw`(?:item|itens|art(?:igo)?\\.?|artigos?|se[cç][aã]o|cap[ií]tulo|al[ií]nea|par[aá]grafo|anexo|regra|verbete)`;

export function hasLocatorDependentStem(question) {
  const stem = String(question?.question || question?.stem || "");
  const hasLocator = new RegExp(`\\b${LOCATOR_WORDS}\\s+(?:n[º°.]?\\s*)?[0-9IVXLCDM]`, "i").test(stem);
  const hasExplicitObject = /[“"][^”"]{8,}[”"]|(?:sobre|relativo a|referente a|em relação a|que trata de)\s+[^?.:]{8,}/i.test(stem);
  return hasLocator && !hasExplicitObject;
}

export function normalizeEditorialStem(question) {
  if (!question || typeof question !== "object") return question;
  let stem = String(question.question || question.stem || "");
  const original = stem;

  // Internal generator coordinates ("item 7", "cenário 3") do not belong in the exam command.
  stem = stem.replace(/,\s*(?:item|cen[aá]rio)\s+\d+[A-Za-z]?\s*,\s*/gi, ", ");

  // Keep chapter/section/item coordinates in source.locator, not as a prerequisite to understand the command.
  stem = stem.replace(
    /(De acordo com o contido em [“"][^”"]+[”"])\s*\((?:cap[ií]tulo|cap\.|anexo|se[cç][aã]o|item)[^)]+\)(?=,\s*(?:considere|analise))/gi,
    "$1"
  );

  let match = stem.match(/^(?:Conforme|Considerando a ordem normativa de)\s+(.+?),\s+qual disposição (?:está expressamente associada a|pertence a)\s+.+?(?:,\s+que trata de|\s+no tema)\s+[“"]([^”"]+)[”"]\??$/i);
  if (match) {
    stem = `De acordo com ${match[1]}, sobre “${match[2]}”, qual alternativa apresenta corretamente a disposição aplicável?`;
  }

  match = stem.match(/^Considerando os conceitos adotados por\s+(.+?),\s+o que se afirma corretamente em\s+.+?\s+sobre\s+[“"]([^”"]+)[”"]\??$/i);
  if (match) {
    stem = `De acordo com ${match[1]}, sobre “${match[2]}”, o que se afirma corretamente?`;
  }

  match = stem.match(/^Ao analisar um caso prático sobre\s+[“"]([^”"]+)[”"],\s+o responsável recorre a\s+.+?\s+de\s+(.+?)\.\s+Qual regra deve observar\?$/i);
  if (match) {
    stem = `De acordo com ${match[2]}, em relação a “${match[1]}”, qual regra deve ser observada?`;
  }

  // A bare chapter label must not be the object; preserve the named concept instead.
  stem = stem.replace(
    /^Considerando\s+(?:Cap[ií]tulo|Se[cç][aã]o|Anexo)\s+[^,]+,\s+(qual alternativa caracteriza corretamente\s+[“"][^”"]+[”"]\?)/i,
    "Considerando o conceito indicado, $1"
  );

  stem = stem.replace(/\s{2,}/g, " ").replace(/\s+([,.;:?])/g, "$1").trim();
  if (stem === original) return question;
  return {
    ...question,
    question: stem,
    editorial_review: {
      ...(question.editorial_review || {}),
      locator_dependency_repaired: true,
      rule: "technical_object_explicit_locator_metadata_only",
    },
  };
}
