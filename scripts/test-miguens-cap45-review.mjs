import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { applyMiguensCap45Review, isRetiredMiguensCap45Stem } from "../lib/miguens-cap45-review.js";
import { auditQuestion } from "../lib/question-quality.js";
import { questionQualityState } from "../lib/question-quality-policy.js";
import { classifyQuestionStructure } from "../lib/question-structure.js";

const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const review = await read("../data/question-restorations/miguens-cap45-reviewed.json");
const banks = await read("../data/questions/runtime-active-banks.json");
const exam = await read("../data/pscpp/runtime-active-questions.json");
const pools = {
  Cadernos: Object.values(banks.banks).flatMap(bank => bank.questions),
  "Simulado PSCPP": exam.questions,
};
assert.equal(review.edits.length, 307);
assert.equal(new Set(review.edits.map(e => `${e.pool}::${e.id}`)).size, 307);
assert.equal(review.edits.filter(e => e.reasons.includes("semantic_duplicate")).length, 267);
assert.equal(review.edits.filter(e => e.reasons.includes("source_support_unverified")).length, 36);
assert.equal(review.edits.filter(e => !e.question.active).length, 271);
for (const edit of review.edits) {
  const final = pools[edit.pool].find(q => q.id === edit.id);
  if (!edit.question.active) {
    assert.equal(final, undefined, `Inactive question resurfaced: ${edit.pool}/${edit.id}`);
    assert.equal(questionQualityState(edit.question).active, false);
    if (edit.duplicate_of) assert.ok(review.edits.some(e => e.pool === edit.pool && e.id === edit.duplicate_of));
    continue;
  }
  assert.ok(final, `Reviewed question missing: ${edit.pool}/${edit.id}`);
  assert.equal(questionQualityState(final).active, true);
  assert.equal(auditQuestion(final).ok, true, `${edit.id}: critical or high quality issue`);
  for (const field of ["question", "options", "assertions", "correct_answer", "source", "topic_code", "taxonomy"])
    assert.deepEqual(final[field], edit.question[field], `${edit.id}: stale ${field}`);
  assert.ok(final.options.some(o => o.key === final.correct_answer));
  const restored = applyMiguensCap45Review(edit.pool, { id: edit.id, question: "stale restoration", active: false });
  assert.equal(restored.question, final.question);
  assert.equal(restored.active, true);
}
for (const [pool, expected] of [["Cadernos", 32], ["Simulado PSCPP", 4]]) {
  const active = pools[pool].filter(q => q.editorial_review?.miguens_cap45_version === review.version);
  assert.equal(active.length, expected);
  const fingerprint = q => JSON.stringify(q.options.map(o => o.text.trim().toLowerCase()).sort());
  assert.equal(new Set(active.map(fingerprint)).size, expected, `${pool}: repeated option sets`);
}
for (const id of ["MEO-1164", "MEO-1176"]) {
  const question = pools.Cadernos.find(q => q.id === id);
  const structure = classifyQuestionStructure(question);
  assert.equal(structure.type, "assertions");
  assert.equal(structure.blocks.find(b => b.type === "assertions").items.length, 4);
}
assert.equal(pools.Cadernos.find(q => q.id === "MEO-0486").question.includes("rumo usado"), true);
for (const stem of review.retired_runtime_stems) assert.equal(isRetiredMiguensCap45Stem({ question: stem }), true);
assert.equal(exam.questions.some(isRetiredMiguensCap45Stem), false);
const untouched = { id: "unrelated", question: "Unrelated content" };
assert.equal(applyMiguensCap45Review("Cadernos", untouched), untouched);
console.log("Capítulo 45: 307 registros revisados, 32 cadernos + 4 PSCPP ativos; quarentena, duplicatas e assertivas verificadas.");
