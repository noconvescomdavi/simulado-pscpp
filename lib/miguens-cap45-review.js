import review from "../data/question-restorations/miguens-cap45-reviewed.json";

const edits = new Map(review.edits.map(edit => [`${edit.pool}::${edit.id}`, edit.question]));

// This is the final, source-reviewed version. Earlier restorations must not
// reactivate duplicates or put incomplete propositions back into the pool.
export function applyMiguensCap45Review(pool, question) {
  const edit = edits.get(`${pool}::${question?.id}`);
  return edit ? { ...question, ...edit } : question;
}

// Replacing a generic stem must not expose the next unreviewed item that
// the previous runtime stem deduplication had hidden.
const retiredStems = new Set(review.retired_runtime_stems);
export function isRetiredMiguensCap45Stem(question) {
  return retiredStems.has(question?.question);
}
