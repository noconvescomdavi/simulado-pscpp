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
// A prova inteira, não apenas cada disciplina, deve evitar conceitos repetidos.
const crossSubjectPool = pool.map(q => ({
  ...q,
  concept_ids: (q.source_subject === "manobrabilidade" && q.id.endsWith("-2")) ||
    (q.source_subject === "navegacao-aguas-restritas" && q.id.endsWith("-2"))
    ? ["shared-cross-subject-concept"] : q.concept_ids,
}));
for (const seed of ["alpha", "bravo", "charlie"]) {
  const exam = buildFixedPscppExam(crossSubjectPool, seed);
  assert.equal(exam.length, 100);
  assert.equal(exam.filter(q => q.concept_ids.includes("shared-cross-subject-concept")).length, 1);
  for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
    assert.equal(exam.filter(q => historicalSubject(q) === subject).length, quota);
  }
}
const insufficient = pool.filter(q => q.source_subject !== "manobrabilidade" || Number(q.id.split("-").at(-1)) < 25);
assert.throws(() => buildFixedPscppExam(insufficient, "shortage"), /manobrabilidade: 24\/25/);
console.log("Concept ID selection regression: OK");
