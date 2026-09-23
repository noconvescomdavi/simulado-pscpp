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

const generatedBatchDirectory = new URL("../data/pscpp/generated-batches/", import.meta.url);
const generatedBatchQuestions = fs.existsSync(generatedBatchDirectory)
  ? fs.readdirSync(generatedBatchDirectory)
    .filter((file) => /^batch_\d{3}\.json$/.test(file))
    .sort()
    .flatMap((file) => JSON.parse(fs.readFileSync(new URL(file, generatedBatchDirectory), "utf8")).questions || [])
  : [];

const sampleOfficial = officialExams.questions.filter((question) => !question.annulled);\nconst activeOfficial = sampleOfficial.filter((question) => question.active !== false);\nassert.equal(sampleOfficial.length, HISTORICAL_SAMPLE.valid_questions);\n\nconst observed = Object.fromEntries(Object.keys(HISTORICAL_SUBJECT_COUNTS).map((subject) => [subject, 0]));
for (const question of sampleOfficial) observed[historicalSubject(question)] += 1;
assert.deepEqual(observed, HISTORICAL_SUBJECT_COUNTS, "A classificação histórica divergiu da amostra oficial");

const expected100 = {
  manobrabilidade: 36,
  "navegacao-aguas-restritas": 30,
  "legislacao-regulamentacao": 11,
  "arte-naval": 10,
  "meteorologia-oceanografia": 7,
  comunicacoes: 6,
  "conhecimentos-gerais": 0,
};
assert.deepEqual(historicalQuotas(100), expected100);

for (const seed of ["alpha", "bravo", "charlie", "delta"]) {
  const exam = buildHistoricalExam([...activeOfficial, ...generatedQuestions.questions, ...generatedBatchQuestions], { seed, size: 100 });
  assert.equal(exam.length, 100);
  assert.equal(new Set(exam.map((question) => question.id)).size, 100);
  const distribution = Object.fromEntries(Object.keys(expected100).map((subject) => [subject, 0]));
  for (const question of exam) distribution[historicalSubject(question)] += 1;
  assert.deepEqual(distribution, expected100, `Distribuição inválida para seed ${seed}`);
}

console.log("Blueprint histórico: OK");
console.log(JSON.stringify({ sample: HISTORICAL_SAMPLE, observed, quotas_100: expected100 }, null, 2));
