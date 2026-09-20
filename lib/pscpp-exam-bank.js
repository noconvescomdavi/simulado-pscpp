import officialExams from "../data/pscpp/official-exams.json";
import generatedQuestions from "../data/pscpp/generated-questions.json";
import { generatedPscppBatchQuestions } from "./generated-pscpp-batches";
import { buildHistoricalExam, pscpp70Blueprint, PSCPP_70_SUBJECT_QUOTAS, PSCPP_EXAM_SIZE } from "./historical-exam-blueprint";

export const PSCPP_SUBJECT = "simulado-pscpp";
export const PSCPP_SIZE = PSCPP_EXAM_SIZE;

function valid(items) {
  return (items || []).filter((q) => q && q.active !== false && !q.annulled && q.validation_status !== "rejected");
}
export function getPscppPool() {
  return [...valid(officialExams.questions), ...valid(generatedQuestions.questions), ...valid(generatedPscppBatchQuestions)];
}
export function getPscppQuestion(id) {
  return getPscppPool().find((q) => String(q.id) === String(id)) || null;
}
export function buildPscppExam(seed=Date.now()) {
  return buildHistoricalExam(getPscppPool(), { seed, size: PSCPP_SIZE, quotas: PSCPP_70_SUBJECT_QUOTAS });
}
export function pscppBlueprint(){
  return {
    size:PSCPP_SIZE,
    ...pscpp70Blueprint(),
    origin_visibility:"admin_only",
    common_bank_dependency:false
  };
}
