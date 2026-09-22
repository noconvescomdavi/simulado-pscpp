import officialExams from "../data/pscpp/official-exams.json";
import generatedQuestions from "../data/pscpp/generated-questions.json";
import arteNavalCap1Questions from "../data/pscpp/arte-naval-cap1-552.json";
import { generatedPscppBatchQuestions } from "./generated-pscpp-batches.js";
import { buildHistoricalExam, historicalBlueprint } from "./historical-exam-blueprint.js";

export const PSCPP_SUBJECT = "simulado-pscpp";
export const PSCPP_SIZE = 70;

// Matriz híbrida para o edital vigente:
// 50% incidência histórica + 30% extensão do conteúdo atual + 20% bibliografia atual,
// com pisos editoriais para Comunicações e Conhecimentos Gerais.
export const PSCPP_SUBJECT_QUOTAS = Object.freeze({
  manobrabilidade: 19,
  "arte-naval": 9,