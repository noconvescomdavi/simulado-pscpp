import officialExams from "../data/pscpp/official-exams.json";
import { historicalSubject } from "./historical-exam-blueprint";

const nonAnnulledQuestions = (officialExams.questions || []).filter(
  (question) => question && !question.annulled
);

const activeQuestions = nonAnnulledQuestions.filter(
  (question) =>
    question.active !== false &&
    question.validation_status !== "rejected" &&
    !String(question.validation_status || "").startsWith("quarantined")
);

const byId = new Map(activeQuestions.map((question) => [String(question.id), question]));

export const OFFICIAL_EXAM_CORPUS_COUNT = nonAnnulledQuestions.length;
export const OFFICIAL_EXAM_ACTIVE_COUNT = activeQuestions.length;

export function officialExamSubject(question) {
  return historicalSubject(question);
}

export function getOfficialExamPool({ subjects = [] } = {}) {
  const wanted = new Set((subjects || []).filter(Boolean));
  if (!wanted.size) return activeQuestions;
  return activeQuestions.filter((question) => wanted.has(officialExamSubject(question)));
}

export function getOfficialExamQuestion(id) {
  return byId.get(String(id)) || null;
}
