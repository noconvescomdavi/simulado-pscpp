import runtimeBank from "../data/pscpp/runtime-active-questions.json";
import { buildFixedPscppExam, PSCPP_QUOTAS } from "./pscpp-exam-selection";

export const PSCPP_SUBJECT = "simulado-pscpp";
export const PSCPP_SIZE = 100;

const questions = runtimeBank.questions;
const byId = new Map(questions.map((question) => [String(question.id), question]));

export function getPscppPool() { return questions; }
export function getPscppQuestion(id) { return byId.get(String(id)) || null; }
export function buildPscppExam(seed = Date.now()) { return buildFixedPscppExam(questions, seed); }
export function pscppBlueprint() {
  return {
    size: PSCPP_SIZE,
    version: "2026.09-fixed",
    selection: "fixed_subject_quotas_distinct_topics",
    target_quotas: PSCPP_QUOTAS,
    target_percentages: Object.fromEntries(Object.entries(PSCPP_QUOTAS).map(([subject, quota]) => [subject, quota])),
    origin_visibility: "admin_only",
    common_bank_dependency: false,
  };
}
