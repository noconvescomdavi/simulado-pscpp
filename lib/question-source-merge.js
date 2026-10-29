// Canonical bank entries retain precedence over supplemental copies. Preserve
// source files and IDs so saved answers still resolve to the canonical record.
export function appendMissingQuestionIds(canonical = [], supplemental = []) {
  const seen = new Set(canonical.map(question => String(question.id)));
  const result = [...canonical];
  for (const question of supplemental) {
    const id = String(question.id);
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(question);
  }
  return result;
}
