import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { collectActivePscppQuestions } from "../lib/pscpp-exam-source.js";
import { isQuestionActive } from "../lib/question-quality-policy.js";
import { reformulateLeakingStem } from "../lib/question-quality.js";

const raw = readFileSync(new URL("../data/pscpp/simulado-cis-colreg-lacunas-50.json", import.meta.url), "utf8");
const bank = JSON.parse(raw);
const questions = bank.questions;
assert.equal(questions.length, 50);
assert.equal(bank.exclusive_scope, "simulado-pscpp");
assert.equal(new Set(questions.map(q => q.id)).size, 50);
assert.equal(new Set(questions.map(q => q.topic)).size, 50);
assert.equal(new Set(questions.map(q => q.question.normalize("NFD").toLowerCase())).size, 50);

const letters = "ABCDE".split("");
for (const q of questions) {
  assert.equal(q.bank, "PSCPP", q.id);
  assert.equal(q.source_subject, "navegacao-aguas-restritas", q.id);
  assert.equal(q.active, true, q.id);
  assert.equal(q.validation_status, "approved", q.id);
  assert.equal(q.options.length, 5, q.id);
  assert.deepEqual(q.options.map(o => o.key), letters, q.id);
  assert.equal(new Set(q.options.map(o => o.text)).size, 5, q.id);
  assert.ok(letters.includes(q.correct_answer), q.id);
  assert.ok(q.explanation.length > 90, q.id);
  assert.ok(q.bibliography.locator.startsWith("Regra "), q.id);
  assert.equal(q.provenance.scope, "simulado-pscpp-only", q.id);
  const n = (q.question.match(/_{6,}/g) || []).length;
  assert.equal(n, q.secondary_source ? 2 : 1, q.id);
  assert.equal(isQuestionActive(reformulateLeakingStem(q)), true, q.id);
  const answer = q.options[letters.indexOf(q.correct_answer)].text;
  assert.ok(answer.includes(q.bibliography.locator), q.id);
  if (q.secondary_source) {
    assert.ok(/^\w+ — Regra \d+/.test(answer), q.id);
    assert.ok(q.secondary_source.locator.includes("sinal"), q.id);
  } else assert.ok(/^Regra \d+/.test(answer), q.id);
}
assert.equal(questions.filter(q => q.secondary_source).length, 16);
assert.equal(questions.filter(q => !q.secondary_source).length, 34);
assert.deepEqual(Object.fromEntries(letters.map(k => [k, questions.filter(q => q.correct_answer === k).length])),
  { A: 10, B: 10, C: 10, D: 10, E: 10 });

const pscppSource = readFileSync(new URL("../lib/pscpp-exam-source.js", import.meta.url), "utf8");
const commonSource = readFileSync(new URL("../lib/question-banks-source.js", import.meta.url), "utf8");
assert.ok(pscppSource.includes("simulado-cis-colreg-lacunas-50.json"));
assert.ok(pscppSource.includes("cisColregLacunas50.questions"));
assert.ok(!commonSource.includes("simulado-cis-colreg-lacunas-50.json"));

const poolIds = new Set(collectActivePscppQuestions().map(q => String(q.id)));
for (const question of questions) assert.ok(poolIds.has(question.id),
  "Questão ausente do pool ativo PSCPP: " + question.id);
console.log("OK: 50 questões ativas e exclusivas do Simulado PSCPP, 16 CIS/COLREG e 34 apenas COLREG.");
