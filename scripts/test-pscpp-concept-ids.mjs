import assert from "node:assert/strict";
import { buildFixedPscppExam, PSCPP_QUOTAS } from "../lib/pscpp-exam-selection.js";
import { historicalSubject } from "../lib/historical-exam-blueprint.js";

const pool = Object.entries(PSCPP_QUOTAS).flatMap(([subject, quota]) =>
  Array.from({ length: quota + 2 }, (_, i) => ({
    id: `${subject}-concept-${i}`,
    source_subject: subject,
    topic: `${subject}-topic-${i}`,
    question: `${subject} question ${i}?`,
    concept_ids: subject === "manobrabilidade" && i < 2 ? ["tactical-diameter"] : [`${subject}-concept-${i}`],
  }))
);
for (const seed of ["alpha", "bravo", "charlie"]) {
  const exam = buildFixedPscppExam(pool, seed);
  assert.equal(exam.length, 100);
  const man = exam.filter(q => historicalSubject(q) === "manobrabilidade");
  assert.equal(man.length, 25);
  assert.equal(man.filter(q => q.concept_ids.includes("tactical-diameter")).length, 1);
}
const insufficient = pool.filter(q => q.source_subject !== "manobrabilidade" || Number(q.id.split("-").at(-1)) < 25);
assert.throws(() => buildFixedPscppExam(insufficient, "shortage"), /manobrabilidade: 24\/25/);
console.log("Concept ID selection regression: OK");
