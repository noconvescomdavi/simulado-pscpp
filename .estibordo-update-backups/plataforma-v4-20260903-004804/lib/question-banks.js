import manobrabilidade from "../data/questions/manobrabilidade.json";
import { normalizeSubject } from "./subjects";

const BANKS = {
  manobrabilidade,
};

const INDEXES = new Map();

export function getQuestionBank(subject) {
  return BANKS[normalizeSubject(subject)] || null;
}

export function getQuestion(subject, questionId) {
  const slug = normalizeSubject(subject);
  const bank = BANKS[slug];
  if (!bank) return null;

  if (!INDEXES.has(slug)) {
    INDEXES.set(slug, new Map(bank.questions.map((question) => [question.id, question])));
  }
  return INDEXES.get(slug).get(String(questionId)) || null;
}

export function publicQuestionBank(subject) {
  const bank = getQuestionBank(subject);
  if (!bank) return null;

  return {
    schema_version: bank.schema_version,
    bank_id: bank.bank_id,
    title: bank.title,
    language: bank.language,
    question_type: bank.question_type,
    questions: bank.questions.map((question) => ({
      id: question.id,
      subject: question.subject,
      module: question.module,
      topic_code: question.topic_code,
      topic: question.topic,
      difficulty: question.difficulty,
      style: question.style,
      question: question.question,
      options: question.options,
      tags: question.tags,
    })),
  };
}
