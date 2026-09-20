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
  PSCPP_70_SUBJECT_QUOTAS,
  PSCPP_EXAM_SIZE,
} from "../lib/historical-exam-blueprint.js";

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
// `historicalSubject` is the runtime taxonomy resolver. The audited historical counts are
// an independent metric and must not be reconstructed by heuristic text matching here.
assert.equal(Object.values(HISTORICAL_SUBJECT_COUNTS).reduce((a,b)=>a+b,0), HISTORICAL_SAMPLE.valid_questions);

const expected70 = PSCPP_70_SUBJECT_QUOTAS;
assert.equal(PSCPP_EXAM_SIZE, 70);
assert.equal(Object.values(expected70).reduce((a,b)=>a+b,0), 70);

for (const seed of ["alpha", "bravo", "charlie", "delta"]) {
  const exam = buildHistoricalExam([...activeOfficial, ...generatedQuestions.questions, ...generatedBatchQuestions], {
    seed,
    size: PSCPP_EXAM_SIZE,
    quotas: expected70,
  });
  assert.equal(exam.length, 70);
  assert.equal(new Set(exam.map((question) => question.id)).size, 70);
  const distribution = Object.fromEntries(Object.keys(expected70).map((subject) => [subject, 0]));
  for (const question of exam) distribution[historicalSubject(question)] += 1;
  assert.deepEqual(distribution, expected70, `Distribuição PSCPP-70 inválida para seed ${seed}`);
}

console.log("Blueprint histórico: OK");
console.log(JSON.stringify({ sample: HISTORICAL_SAMPLE, audited_subject_counts: HISTORICAL_SUBJECT_COUNTS, runtime_observed: observed, quotas_70: expected70 }, null, 2));
