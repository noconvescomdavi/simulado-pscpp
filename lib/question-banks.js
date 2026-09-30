import runtimeBanks from "../data/questions/runtime-active-banks.json";
import { getPscppPool, getPscppQuestion, PSCPP_SUBJECT } from "./pscpp-exam-bank";
import { classifyQuestionStructure } from "./question-structure";
import { normalizeSubject, ALL_SUBJECTS_SLUG, TRIAL_SUBJECT_SLUG } from "./subjects";
import { buildQuestionFilterFacets, filterQuestions, isRipeamQuestion, questionTaxonomy } from "./question-filters";

import { getOfficialNotebookQuestion } from "./official-notebook-questions";

const BANKS = runtimeBanks.banks;
const INDEXES = new Map();
let ALL_QUESTIONS = null;

function activeQuestions(bank) { return bank?.questions || []; }

function allQuestions() {
  if (ALL_QUESTIONS) return ALL_QUESTIONS;
  ALL_QUESTIONS = Object.entries(BANKS).flatMap(([slug, bank]) =>
    activeQuestions(bank).map((question) => ({
      ...question,
      id: `${slug}::${question.id}`,
      source_subject: slug,
      source_id: String(question.id),
    }))
  );
  return ALL_QUESTIONS;
}

function virtualBank(key) {
  const all = allQuestions();

  if (key === TRIAL_SUBJECT_SLUG) {
    return { title: "Simulado de teste", questions: all };
  }

  return { title: "Todas as matérias", questions: all };
}

export function getQuestionBank(subject) {
  const key = normalizeSubject(subject);
  if (key === PSCPP_SUBJECT) return { title: "SIMULADO PSCPP", questions: getPscppPool() };
  if (key === ALL_SUBJECTS_SLUG || key === TRIAL_SUBJECT_SLUG) {
    return virtualBank(key);
  }
  const bank = BANKS[key];
  return bank ? { ...bank, questions: activeQuestions(bank) } : null;
}

export function getQuestion(subject, id) {
  const key = normalizeSubject(subject);
  if (key === PSCPP_SUBJECT) return getPscppQuestion(id);

  if (key === ALL_SUBJECTS_SLUG || key === TRIAL_SUBJECT_SLUG) {
    const raw = String(id || "");
    const separator = raw.indexOf("::");
    if (separator < 1) return null;

    const sourceSubject = raw.slice(0, separator);
    const sourceId = raw.slice(separator + 2);
    const question = getQuestion(sourceSubject, sourceId);
    return question
      ? {
          ...question,
          id: raw,
          source_subject: sourceSubject,
          source_id: sourceId,
        }
      : null;
  }

  const official = getOfficialNotebookQuestion(key, id);
  if (official) return official;
  const bank = BANKS[key];
  if (!bank) return null;

  if (!INDEXES.has(key)) {
    INDEXES.set(
      key,
      new Map(activeQuestions(bank).map((question) => [String(question.id), question]))
    );
  }

  return INDEXES.get(key).get(String(id)) || null;
}

export function publicQuestion(question) {
  const subject = question.source_subject || question.tracking?.subject_slug || question.subject;

  return {
    id: question.id,
    subject,
    ...(question.origin === "official_exam" && question.source_subject !== PSCPP_SUBJECT
      ? { origin: question.origin, year: question.year, number: question.number }
      : {}),
    module: question.module,
    topic_code: question.topic_code,
    topic: question.topic,
    difficulty: question.difficulty,
    style: question.style,
    pscpp_format: question.pscpp_format || null,
    cognitive_level: question.cognitive_level || null,
    question: question.question,
    options: question.options,
    assertions: question.assertions || null,
    contentBlocks: question.contentBlocks || null,
    table: question.table || null,
    image: question.image || null,
    tags: question.tags,
    taxonomy: question.taxonomy || null,
    structure: classifyQuestionStructure(question),
    tracking: questionTaxonomy(question, subject),
  };
}

export function publicQuestionBank(subject) {
  const bank = getQuestionBank(subject);
  return bank
    ? { ...bank, questions: (bank.questions || []).map(publicQuestion) }
    : null;
}

export function filterQuestionBank(subject, filters = {}) {
  const normalized = normalizeSubject(subject);
  const bank = getQuestionBank(normalized);
  if (!bank) return null;
  return {
    ...bank,
    questions: filterQuestions(bank.questions, filters, normalized),
  };
}

export const filteredQuestionBank = filterQuestionBank;

export function getQuestionFilterFacets(subject) {
  const normalized = normalizeSubject(subject);
  const bank = getQuestionBank(normalized);
  return bank
    ? buildQuestionFilterFacets(bank.questions, normalized)
    : { works: [], chapters: [], modules: [] };
}

export function availableQuestionBanks({ includeFilters = false, includePscpp = false } = {}) {
  const entries = Object.entries(BANKS);
  if (includePscpp) entries.push([PSCPP_SUBJECT, { title: "SIMULADO PSCPP", questions: getPscppPool() }]);
  return entries.map(([slug, bank]) => ({
    slug,
    title: bank.title || slug,
    count: activeQuestions(bank).length,
    ripeam_count: activeQuestions(bank).filter(isRipeamQuestion).length,
    ...(includeFilters
      ? { filters: buildQuestionFilterFacets(activeQuestions(bank), slug) }
      : {}),
}));
}
