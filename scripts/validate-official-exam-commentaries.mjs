import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), "utf8"));
const bank = read("data/pscpp/official-exams.json");
const progress = read("data/pscpp/official-exam-commentary-progress.json");
const commentaries = read("data/pscpp/official-exam-commentaries/block-001.json");
const lookup = new Map(bank.questions.map((q) => [q.id, q]));
assert.equal(bank.questions.length, 264, "Official corpus changed: review blocks again.");
assert.equal(progress.blocks.reduce((sum, b) => sum + b.questions.length, 0), 264);
assert.equal(new Set(progress.blocks.flatMap((b) => b.questions.map((q) => q.id))).size, 264);
const seen = new Set();
for (const q of commentaries.questions) {
  assert.ok(!seen.has(q.id), `Duplicate commentary: ${q.id}`);
  seen.add(q.id);
  const original = lookup.get(q.id);
  assert.ok(original, `Unknown question: ${q.id}`);
  assert.equal(q.correct_answer, original.correct_answer, `Answer key mismatch: ${q.id}`);
  assert.equal(q.verification_status, "bibliography_verified", `Unverified text: ${q.id}`);
  assert.ok(q.correct_reason?.length > 40, `Missing explanation: ${q.id}`);
  for (const option of original.options) {
    if (option.key === original.correct_answer) continue;
    assert.ok(q.incorrect_reasons?.[option.key]?.length > 30, `Missing reason for option ${option.key}: ${q.id}`);
  }
  assert.ok(q.bibliography?.length, `Bibliography missing: ${q.id}`);
  for (const bib of q.bibliography) {
    assert.ok(bib.author && bib.title && bib.edition && bib.year && bib.pages?.length && bib.verified_quote && bib.source_url, `Incomplete bibliography: ${q.id}`);
  }
}
console.log(`OK: ${seen.size} of 264 official questions have complete, structured, source-marked commentaries.`);
