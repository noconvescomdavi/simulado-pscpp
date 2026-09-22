import assert from "node:assert/strict";
import fs from "node:fs";
import officialExams from "../data/pscpp/official-exams.json" with { type: "json" };
import generatedQuestions from "../data/pscpp/generated-questions.json" with { type: "json" };
import {
  HISTORICAL_SAMPLE,
  HISTORICAL_SUBJECT_COUNTS,
  buildHistoricalExam,
  historicalQuotas,
  historicalSubject,
} from "../lib/historical-exam-blueprint.js";
import { PSCPP_SIZE, PSCPP_SUBJECT_QUOTAS, buildPscppExam } from "../lib/pscpp-exam-bank.js";

const generatedBatchDirectory = new URL("../data/pscpp/generated-batches/", import.meta.url);
const generatedBatchQuestions = fs.existsSync(generatedBatchDirectory)
  ? fs.readdirSync(generatedBatchDirectory)
    .filter((file) => /^batch_\d{3}\.json$/.test(file))
    .sort()
    .flatMap((file) => JSON.parse(fs.readFileSync(new URL(file, generatedBatchDirectory), "utf8")).questions || [])
  : [];

const activeOfficial = officialExams.questions.filter((question) => !question.annulled && question.active !== false);
assert.equal(activeOfficial.length, HISTORICAL_SAMPLE.valid_questions);

const observed = Object.fromEntries(Object.keys(HISTORICAL_SUBJECT_COUNTS).map((subject) => [subject, 0]));
for (const question of activeOfficial) observed[historicalSubject(question)] += 1;
assert.deepEqual(observed, HISTORICAL_SUBJECT_COUNTS, "A classificação histórica divergiu da amostra oficial");

const expected70 = {
  manobrabilidade: 25,
  "navegacao-aguas-restritas": 21,
  "legislacao-regulamentacao": 8,
  "arte-naval": 7,
  "meteorologia-oceanografia": 5,
  comunicacoes: 4,
  "conhecimentos-gerais": 0,
};
assert.deepEqual(historicalQuotas(70), expected70);

for (const seed of ["alpha", "bravo", "charlie", "delta"]) {
  const exam = buildHistoricalExam([...activeOfficial, ...generatedQuestions.questions, ...generatedBatchQuestions], { seed, size: 70 });
  assert.equal(exam.length, 70);
  assert.equal(new Set(exam.map((question) => question.id)).size, 70);
  const distribution = Object.fromEntries(Object.keys(expected70).map((subject) => [subject, 0]));
  for (const question of exam) distribution[historicalSubject(question)] += 1;
  assert.deepEqual(distribution, expected70, `Distribuição inválida para seed ${seed}`);
}

console.log("Blueprint histórico: OK");
console.log(JSON.stringify({ sample: HISTORICAL_SAMPLE, observed, quotas_70: expected70 }, null, 2));

assert.equal(PSCPP_SIZE, 70);
assert.equal(Object.values(PSCPP_SUBJECT_QUOTAS).reduce((sum, value) => sum + value, 0), 70);

for (const seed of ["current-alpha", "current-bravo", "current-charlie", "current-delta"]) {
  const exam = buildPscppExam(seed);
  assert.equal(exam.length, 70);
  assert.equal(new Set(exam.map((question) => question.id)).size, 70);
  const distribution = Object.fromEntries(Object.keys(PSCPP_SUBJECT_QUOTAS).map((subject) => [subject, 0]));
  for (const question of exam) distribution[historicalSubject(question)] += 1;
  assert.deepEqual(distribution, PSCPP_SUBJECT_QUOTAS, `Distribuição híbrida inválida para seed ${seed}`);
}

console.log("Blueprint vigente PSCPP: OK");
console.log(JSON.stringify({ size: PSCPP_SIZE, quotas: PSCPP_SUBJECT_QUOTAS }, null, 2));
