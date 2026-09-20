const UNSAFE_PROVENANCE = new Set([
  "format-expansion-v1",
  "pscpp-style-upgrade-v3",
  "pscpp-deep-refine-v4",
  "pscpp-deep-refine-v5",
  "pscpp-refinement-v3",
  "pscpp-repair-v3",
  "pscpp-cleanup-v8",
  "pscpp-bibliographic-v6",
  "pscpp-focused-extension-v7",
]);

const UNSAFE_TAGS = new Set([
  "expansao-formatos-v1",
  "pscpp-style-upgrade-v3",
  "pscpp-deep-refine-v4",
  "pscpp-deep-refine-v5",
  "pscpp-refinement-v3",
  "pscpp-repair-v3",
  "pscpp-cleanup-v8",
  "pscpp-style-v6",
  "pscpp-focused-extension-v7",
]);

export function questionQualityState(question) {
  if (!question) return { active: false, reason: "missing-question" };
  if (question.active === false || ["inactive","deactivated","quarantined"].includes(String(question.status || "").toLowerCase())) {
    return { active: false, reason: "explicitly-inactive" };
  }
  const method = String(question?.provenance?.method || "");
  if (UNSAFE_PROVENANCE.has(method)) return { active: false, reason: `legacy-generator:${method}` };
  const tag = (question.tags || []).find((value) => UNSAFE_TAGS.has(String(value)));
  if (tag) return { active: false, reason: `legacy-tag:${tag}` };
  return { active: true, reason: null };
}

export function isQuestionActive(question) {
  return questionQualityState(question).active;
}

export { UNSAFE_PROVENANCE };
