import officialExams from "../data/pscpp/official-exams.json";
import generatedQuestions from "../data/pscpp/generated-questions.json";
import arteNavalCap1Questions from "../data/pscpp/arte-naval-cap1-552.json";
import { generatedPscppBatchQuestions } from "./generated-pscpp-batches";
import { buildHistoricalExam, historicalBlueprint } from "./historical-exam-blueprint";

export const PSCPP_SUBJECT = "simulado-pscpp";
export const PSCPP_SIZE = 70;

// Matriz híbrida para o edital vigente:
// 50% incidência histórica + 30% extensão do conteúdo atual + 20% bibliografia atual,
// com pisos editoriais para Comunicações e Conhecimentos Gerais.
export const PSCPP_SUBJECT_QUOTAS = Object.freeze({
  manobrabilidade: 19,
  "arte-naval": 9,
  "navegacao-aguas-restritas": 19,
  "legislacao-regulamentacao": 8,
  "meteorologia-oceanografia": 6,
  comunicacoes: 4,
  "conhecimentos-gerais": 5,
});

export const PSCPP_FORMAT_TARGETS = Object.freeze({
  situation: 23,
  direct: 20,
  assertions: 14,
  true_false_sequence: 5,
  fill_sequence: 4,
  calculation: 2,
  association: 2,
});

export const PSCPP_DIFFICULTY_TARGETS = Object.freeze({
  easy: 10,
  medium: 35,
  hard: 25,
});

function valid(items) {
  return (items || []).filter((q) => q && q.active !== false && !q.annulled && q.validation_status !== "rejected");
}
export function getPscppPool() {
  return [...valid(officialExams.questions), ...valid(generatedQuestions.questions), ...valid(arteNavalCap1Questions.questions), ...valid(generatedPscppBatchQuestions)];
}
export function getPscppQuestion(id) {
  return getPscppPool().find((q) => String(q.id) === String(id)) || null;
}
export function buildPscppExam(seed=Date.now()) {
  return buildHistoricalExam(getPscppPool(), { seed, size: PSCPP_SIZE, quotas: PSCPP_SUBJECT_QUOTAS });
}
export function pscppBlueprint(){
  return {
    size:PSCPP_SIZE,
    ...historicalBlueprint(PSCPP_SIZE),
    selection:"current_program_historical_hybrid",
    target_quotas:PSCPP_SUBJECT_QUOTAS,
    target_percentages:Object.fromEntries(Object.entries(PSCPP_SUBJECT_QUOTAS).map(([subject, quota]) => [subject, Number((quota * 100 / PSCPP_SIZE).toFixed(2))])),
    format_targets:PSCPP_FORMAT_TARGETS,
    difficulty_targets:PSCPP_DIFFICULTY_TARGETS,
    weighting:{historical_incidence:0.50,current_program_topics:0.30,current_bibliography:0.20},
    editorial_floors:{comunicacoes:4,"conhecimentos-gerais":5},
    origin_visibility:"admin_only",
    common_bank_dependency:false
  };
}