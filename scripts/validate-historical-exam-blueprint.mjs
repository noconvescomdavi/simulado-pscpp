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
  isSituationalQuestion,
} from "../lib/historical-exam-blueprint.js";
import arteNavalCap1Questions from "../data/pscpp/arte-naval-cap1-552.json" with { type: "json" };

const PSCPP_SIZE = 70;
const PSCPP_SUBJECT_QUOTAS = {
  manobrabilidade: 19,
  "arte-naval": 9,
  "navegacao-aguas-restritas": 19,
  "legislacao-regulamentacao": 8,
  "meteorologia-oceanografia": 6,
  comunicacoes: 4,
  "conhecimentos-gerais": 5,
};
const PSCPP_SITUATIONAL_MINIMUMS = {
  manobrabilidade: 8,
  "navegacao-aguas-restritas": 7,
  "arte-naval": 3,
  "legislacao-regulamentacao": 2,
  "meteorologia-oceanografia": 1,
  comunicacoes: 1,
  "conhecimentos-gerais": 1,
};
const valid = (items) => (items || []).filter((q) => q && q.active !== false && !q.annulled && q.validation_status !== "rejected");
const pscppPool = [...valid(officialExams.questions), ...valid(generatedQuestions.questions), ...valid(arteNavalCap1Questions.questions), ...valid(generatedBatchQuestions)];
const buildPscppExam = (seed) => buildHistoricalExam(pscppPool, { seed, size: PSCPP_SIZE, quotas: PSCPP_SUBJECT_QUOTAS, situationalQuotas: PSCPP_SITUATIONAL_MINIMUMS });

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
assert.equal(Object.values(PSCPP_SITUATIONAL_MINIMUMS).reduce((sum, value) => sum + value, 0), 23);

for (const seed of ["current-alpha", "current-bravo", "current-charlie", "current-delta"]) {
  const exam = buildPscppExam(seed);
  assert.equal(exam.length, 70);
  assert.equal(new Set(exam.map((question) => question.id)).size, 70);
  const distribution = Object.fromEntries(Object.keys(PSCPP_SUBJECT_QUOTAS).map((subject) => [subject, 0]));
  for (const question of exam) distribution[historicalSubject(question)] += 1;
  assert.deepEqual(distribution, PSCPP_SUBJECT_QUOTAS, `Distribuição híbrida inválida para seed ${seed}`);
  const situationalDistribution = Object.fromEntries(Object.keys(PSCPP_SITUATIONAL_MINIMUMS).map((subject) => [subject, 0]));
  for (const question of exam.filter(isSituationalQuestion)) situationalDistribution[historicalSubject(question)] += 1;
  for (const [subject, minimum] of Object.entries(PSCPP_SITUATIONAL_MINIMUMS)) {
    assert.ok(situationalDistribution[subject] >= minimum, `Mínimo situacional não atendido em ${subject} para seed ${seed}: ${situationalDistribution[subject]} < ${minimum}`);
  }
  assert.ok(exam.filter(isSituationalQuestion).length >= 23, `Simulado deve ter ao menos 23 questões situacionais para seed ${seed}`);
}

console.log("Blueprint vigente PSCPP: OK");
console.log(JSON.stringify({ size: PSCPP_SIZE, quotas: PSCPP_SUBJECT_QUOTAS }, null, 2));