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

// Contraexemplo determinístico: existe uma prova válida, mas a seleção gulosa
// pode consumir o conceito compartilhado antes da disciplina seguinte.
const constrainedPool = Object.entries(PSCPP_QUOTAS).flatMap(([subject, quota]) =>
  Array.from({ length: quota + (subject === "manobrabilidade" ? 1 : 0) }, (_, i) => ({
    id: subject === "manobrabilidade" ? `man-${i}` : `${subject}-fixed-${i}`,
    source_subject: subject,
    topic: `${subject}-unique-${i}`,
    question: `Constrained ${subject} question ${i}?`,
    concept_ids: (subject === "manobrabilidade" && i === 25) ||
      (subject === "navegacao-aguas-restritas" && i === 0)
      ? ["shared-required-by-navigation"] : [`${subject}-unique-${i}`],
  }))
);
const feasibleExam = constrainedPool.filter(q => q.id !== "man-25");
assert.equal(feasibleExam.length, 100);
assert.equal(new Set(feasibleExam.flatMap(q => q.concept_ids)).size, 100);
const repairedExam = buildFixedPscppExam(constrainedPool, "greedy-counterexample");
assert.equal(repairedExam.length, 100);
assert.equal(new Set(repairedExam.flatMap(q => q.concept_ids)).size, 100);
for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
  assert.equal(repairedExam.filter(q => historicalSubject(q) === subject).length, quota);
}

console.log("Concept ID selection regression: OK (bounded greedy repair verified)");
