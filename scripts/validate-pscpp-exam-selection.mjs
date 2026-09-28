import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildFixedPscppExam, isPscppEditoriallyEligible, PSCPP_QUOTAS } from "../lib/pscpp-exam-selection.js";
import { historicalSubject } from "../lib/historical-exam-blueprint.js";

const pool = Object.entries(PSCPP_QUOTAS).flatMap(([subject, quota]) =>
  Array.from({ length: quota + 4 }, (_, index) => ({
    id: `${subject}:${index}`,
    source_subject: subject,
    topic: `${subject}:tópico ${index}`,
    question: `${subject}: pergunta ${index}?`,
  }))
);

for (const seed of ["alpha", "bravo", "charlie", "delta"]) {
  const exam = buildFixedPscppExam(pool, seed);
  assert.equal(exam.length, 100);
  assert.equal(new Set(exam.map((q) => q.id)).size, 100);
  for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
    const questions = exam.filter((q) => historicalSubject(q) === subject);
    assert.equal(questions.length, quota, `${seed}: ${subject}`);
    assert.equal(new Set(questions.map((q) => q.topic)).size, quota);
  }
}

const shortage = pool.filter((q) => q.source_subject !== "comunicacoes" || Number(q.id.split(":")[1]) < 9);
assert.throws(() => buildFixedPscppExam(shortage, "shortage"), /comunicacoes: 9\/10/);
assert.throws(() => buildFixedPscppExam(pool.map((q) => q.source_subject === "comunicacoes" ? { ...q, topic: "same concept" } : q), "duplicates"), /comunicacoes: 1\/10/);

const runtime = JSON.parse(await readFile(new URL("../data/pscpp/runtime-active-questions.json", import.meta.url), "utf8")).questions;
assert.ok(runtime.length >= 100);
assert.equal(runtime.filter(q=>!isPscppEditoriallyEligible(q)).length,11,"A quarentena editorial mudou: rever os itens antes de publicar");
for (const seed of ["alpha", "bravo", "charlie", "delta"]) {
  const exam = buildFixedPscppExam(runtime, seed);
  assert.equal(exam.length, 100);
  assert.ok(exam.every(isPscppEditoriallyEligible));
  for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
    assert.equal(exam.filter((q) => historicalSubject(q) === subject).length, quota, `${seed}: banco ativo ${subject}`);
  }
}

console.log("Matriz fixa PSCPP: OK");
