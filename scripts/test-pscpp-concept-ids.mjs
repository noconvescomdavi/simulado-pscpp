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

// Two separate cross-subject conflicts require two replacements, not one.
const doubleSeed = "double-cross-subject-conflict";
function selectionHash(value) {
  let result = 2166136261;
  for (const char of String(value)) {
    result ^= char.charCodeAt(0);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}
const doublePool = Object.entries(PSCPP_QUOTAS).flatMap(([subject, quota]) =>
  Array.from({ length: quota + (subject === "manobrabilidade" ? 2 : 0) }, (_, i) => ({
    id: `${subject}-double-${i}`,
    source_subject: subject,
    topic: `${subject}-double-topic-${i}`,
    question: `Double conflict ${subject} question ${i}?`,
    concept_ids: [`${subject}-double-concept-${i}`],
  }))
);
const manRanked = doublePool.filter(q => q.source_subject === "manobrabilidade")
  .sort((a, b) => selectionHash(`${doubleSeed}:manobrabilidade:${a.id}`) -
    selectionHash(`${doubleSeed}:manobrabilidade:${b.id}`) || a.id.localeCompare(b.id));
for (let i = 0; i < 2; i++) {
  manRanked[i].concept_ids = [`mandatory-navigation-${i}`];
  doublePool.find(q => q.id === `navegacao-aguas-restritas-double-${i}`).concept_ids =
    [`mandatory-navigation-${i}`];
}
const feasibleDouble = doublePool.filter(q => !manRanked.slice(0, 2).includes(q));
assert.equal(feasibleDouble.length, 100);
assert.equal(new Set(feasibleDouble.flatMap(q => q.concept_ids)).size, 100);
const doubleExam = buildFixedPscppExam(doublePool, doubleSeed);
assert.equal(doubleExam.length, 100);
assert.equal(new Set(doubleExam.flatMap(q => q.concept_ids)).size, 100);
for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
  assert.equal(doubleExam.filter(q => historicalSubject(q) === subject).length, quota);
}


// Invalid concept_ids metadata must not crash the bounded repair path.
// This pool forces a cross-subject conflict while including malformed metadata.
const malformedPool = constrainedPool.map(q => ({
  ...q,
  concept_ids: q.id === "man-1" ? "unexpected-string" : q.concept_ids,
}));
const malformedExam = buildFixedPscppExam(malformedPool, "greedy-counterexample");
assert.equal(malformedExam.length, 100);
const malformedConcepts = malformedExam.flatMap(q => Array.isArray(q.concept_ids) ? q.concept_ids : []);
assert.equal(new Set(malformedConcepts).size, malformedConcepts.length);
for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
  assert.equal(malformedExam.filter(q => historicalSubject(q) === subject).length, quota);
}

console.log("Concept ID selection regression: OK (bounded single/double repair verified)");
