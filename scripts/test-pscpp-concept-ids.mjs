import assert from "node:assert/strict";
import { buildFixedPscppExam, isPscppEditoriallyEligible, PSCPP_QUOTAS } from "../lib/pscpp-exam-selection.js";
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



// Known limitation: three independent mandatory conflicts cannot be repaired
// by the current single/double bounded strategy. Assert the limitation explicitly
// until a verified multi-replacement algorithm is implemented.
const tripleSeed = "triple-cross-subject-conflict";
const triplePool = Object.entries(PSCPP_QUOTAS).flatMap(([subject, quota]) =>
  Array.from({ length: quota + (subject === "manobrabilidade" ? 3 : 0) }, (_, i) => ({
    id: `${subject}-triple-${i}`,
    source_subject: subject,
    topic: `${subject}-triple-topic-${i}`,
    question: `Triple conflict ${subject} question ${i}?`,
    concept_ids: [`${subject}-triple-concept-${i}`],
  }))
);
const tripleMan = triplePool.filter(q => q.source_subject === "manobrabilidade")
  .sort((a, b) => selectionHash(`${tripleSeed}:manobrabilidade:${a.id}`) -
    selectionHash(`${tripleSeed}:manobrabilidade:${b.id}`) || a.id.localeCompare(b.id));
for (let i = 0; i < 3; i++) {
  tripleMan[i].concept_ids = [`mandatory-navigation-triple-${i}`];
  triplePool.find(q => q.id === `navegacao-aguas-restritas-triple-${i}`).concept_ids =
    [`mandatory-navigation-triple-${i}`];
}
const feasibleTriple = triplePool.filter(q => !tripleMan.slice(0, 3).includes(q));
assert.equal(feasibleTriple.length, 100);
assert.equal(new Set(feasibleTriple.flatMap(q => q.concept_ids)).size, 100);
assert.throws(() => buildFixedPscppExam(triplePool, tripleSeed), /Banco PSCPP insuficiente/);

// Ineligible records at the front of the pool must not consume all 40 repair slots.
const inactiveSeed = "inactive-prefix-conflict";
const inactivePool = Object.entries(PSCPP_QUOTAS).flatMap(([subject, quota]) =>
  Array.from({ length: quota + (subject === "manobrabilidade" ? 1 : 0) }, (_, i) => ({
    id: `${subject}-inactive-test-${i}`,
    source_subject: subject,
    topic: `${subject}-inactive-topic-${i}`,
    question: `Inactive prefix ${subject} question ${i}?`,
    concept_ids: [`${subject}-inactive-concept-${i}`],
  }))
);
const inactiveMan = inactivePool.filter(q => q.source_subject === "manobrabilidade")
  .sort((a, b) => selectionHash(`${inactiveSeed}:manobrabilidade:${a.id}`) -
    selectionHash(`${inactiveSeed}:manobrabilidade:${b.id}`) || a.id.localeCompare(b.id));
inactiveMan[0].concept_ids = ["required-navigation-inactive-prefix"];
inactivePool.find(q => q.id === "navegacao-aguas-restritas-inactive-test-0").concept_ids =
  ["required-navigation-inactive-prefix"];
const ineligiblePrefix = Array.from({ length: 45 }, (_, i) => ({
  id: `inactive-prefix-${i}`,
  source_subject: "manobrabilidade",
  topic: `inactive-prefix-topic-${i}`,
  question: `Inactive question ${i}?`,
  concept_ids: ["required-navigation-inactive-prefix"],
  active: false,
}));
const inactiveExam = buildFixedPscppExam([...ineligiblePrefix, ...inactivePool], inactiveSeed);
assert.equal(inactiveExam.length, 100);
assert.equal(inactiveExam.some(q => q.active === false), false);
assert.equal(new Set(inactiveExam.flatMap(q => q.concept_ids)).size, 100);
for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
  assert.equal(inactiveExam.filter(q => historicalSubject(q) === subject).length, quota);
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


// Assertion answer summaries must not be accepted as independent assertions.
// Regression: a literal \\s in the regex failed to match these normal spaces.
for (const assertion of [
  "Apenas as afirmativas I e II são corretas",
  "  II) Somente as assertivas I, III e IV estão corretas",
  "Todas as afirmativas são verdadeiras",
  "Nenhuma das assertivas está correta",
]) {
  assert.equal(isPscppEditoriallyEligible({
    question: "Qual é a opção correta?",
    options: ["A", "B"],
    assertions: [assertion],
  }), false, `Must reject option-like assertion: ${assertion}`);
}
assert.equal(isPscppEditoriallyEligible({
  question: "Avalie as assertivas.",
  options: ["A", "B"],
  assertions: ["I. O avanço é medido até 90 graus de mudança de proa."],
}), true);

console.log("Concept ID selection regression: OK (bounded single/double repair verified)");
