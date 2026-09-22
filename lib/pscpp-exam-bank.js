import officialExams from "../data/pscpp/official-exams.json";
import generatedQuestions from "../data/pscpp/generated-questions.json";
import arteNavalCap1Questions from "../data/pscpp/arte-naval-cap1-552.json";
import arteNavalCap23Questions from "../data/pscpp/arte-naval-cap2-cap3-459.json";
import { generatedPscppBatchQuestions } from "./generated-pscpp-batches";
import { buildHistoricalExam, historicalBlueprint } from "./historical-exam-blueprint";

export const PSCPP_SUBJECT = "simulado-pscpp";
export const PSCPP_SIZE = 100;

function valid(items) {
  return (items || []).filter((q) => q && q.active !== false && !q.annulled && q.validation_status !== "rejected");
}
export function getPscppPool() {
  return [...valid(officialExams.questions), ...valid(generatedQuestions.questions), ...valid(arteNavalCap1Questions.questions), ...valid(arteNavalCap23Questions.questions), ...valid(generatedPscppBatchQuestions)];
}
export function getPscppQuestion(id) {
  return getPscppPool().find((q) => String(q.id) === String(id)) || null;
}
export function buildPscppExam(seed=Date.now()) {
  return buildHistoricalExam(getPscppPool(), { seed, size: PSCPP_SIZE });
}
export function pscppBlueprint(){
  return {
    size:PSCPP_SIZE,
    ...historicalBlueprint(PSCPP_SIZE),
    origin_visibility:"admin_only",
    common_bank_dependency:false
  };
}
