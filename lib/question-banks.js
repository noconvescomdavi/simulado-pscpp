import manobrabilidade from "../data/questions/manobrabilidade.json";
import arteNaval from "../data/questions/arte-naval.json";
import navegacao from "../data/questions/navegacao-aguas-restritas.json";
import legislacao from "../data/questions/legislacao-regulamentacao.json";
import meteorologia from "../data/questions/meteorologia-oceanografia.json";
import comunicacoes from "../data/questions/comunicacoes.json";
import gerais from "../data/questions/conhecimentos-gerais.json";
import ripeamSituacoes01 from "../data/question-extensions/ripeam-situacoes-01.json";
import ripeamSituacoes02 from "../data/question-extensions/ripeam-situacoes-02.json";
import ripeamSituacoes03 from "../data/question-extensions/ripeam-situacoes-03.json";
import ripeamSituacoes04 from "../data/question-extensions/ripeam-situacoes-04.json";
import ripeamSituacoes05 from "../data/question-extensions/ripeam-situacoes-05.json";
import ripeamExpansao01 from "../data/question-extensions/ripeam-expansao-01.json";
import ripeamExpansao02 from "../data/question-extensions/ripeam-expansao-02.json";
import ripeamExpansao03 from "../data/question-extensions/ripeam-expansao-03.json";
import ripeamExpansao04 from "../data/question-extensions/ripeam-expansao-04.json";
import ripeamExpansao05 from "../data/question-extensions/ripeam-expansao-05.json";
import ripeamExpansao06 from "../data/question-extensions/ripeam-expansao-06.json";
import ripeamExpansao07 from "../data/question-extensions/ripeam-expansao-07.json";
import {
  normalizeSubject,
  ALL_SUBJECTS_SLUG,
  TRIAL_SUBJECT_SLUG,
} from "./subjects";
import {
  buildQuestionFilterFacets,
  filterQuestions,
  questionTaxonomy,
} from "./question-filters";

const navegacaoComSituacoes = {
  ...navegacao,
  questions: [
    ...(navegacao.questions || []),
    ...(ripeamSituacoes01.questions || []),
    ...(ripeamSituacoes02.questions || []),
    ...(ripeamSituacoes03.questions || []),
    ...(ripeamSituacoes04.questions || []),
    ...(ripeamSituacoes05.questions || []),
    ...(ripeamExpansao01.questions || []),
    ...(ripeamExpansao02.questions || []),
    ...(ripeamExpansao03.questions || []),
    ...(ripeamExpansao04.questions || []),
    ...(ripeamExpansao05.questions || []),
    ...(ripeamExpansao06.questions || []),
    ...(ripeamExpansao07.questions || []),
  ],
};

const BANKS = {
  manobrabilidade,
  "arte-naval": arteNaval,
  "navegacao-aguas-restritas": navegacaoComSituacoes,
  "legislacao-regulamentacao": legislacao,
  "meteorologia-oceanografia": meteorologia,
  comunicacoes,
  "conhecimentos-gerais": gerais,
};

const INDEXES = new Map();

function allQuestions() {
  return Object.entries(BANKS).flatMap(([slug, bank]) =>
    (bank.questions || []).map((question) => ({
      ...question,
      id: `${slug}::${question.id}`,
      source_subject: slug,
      source_id: String(question.id),
    }))
  );
}

function virtualBank(key) {
  const all = allQuestions();

  if (key === TRIAL_SUBJECT_SLUG) {
    const copy = [...all];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return { title: "Simulado de teste", questions: copy.slice(0, 10) };
  }

  return { title: "Todas as matérias", questions: all };
}

export function getQuestionBank(subject) {
  const key = normalizeSubject(subject);
  if (key === ALL_SUBJECTS_SLUG || key === TRIAL_SUBJECT_SLUG) {
    return virtualBank(key);
  }
  return BANKS[key] || null;
}

export function getQuestion(subject, id) {
  const key = normalizeSubject(subject);

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

  const bank = BANKS[key];
  if (!bank) return null;

  if (!INDEXES.has(key)) {
    INDEXES.set(
      key,
      new Map((bank.questions || []).map((question) => [String(question.id), question]))
    );
  }

  return INDEXES.get(key).get(String(id)) || null;
}

export function publicQuestion(question) {
  const subject = question.source_subject || question.tracking?.subject_slug || question.subject;

  return {
    id: question.id,
    subject,
    module: question.module,
    topic_code: question.topic_code,
    topic: question.topic,
    difficulty: question.difficulty,
    style: question.style,
    question: question.question,
    options: question.options,
    tags: question.tags,
    taxonomy: question.taxonomy || null,
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

export function availableQuestionBanks({ includeFilters = false } = {}) {
  return Object.entries(BANKS).map(([slug, bank]) => ({
    slug,
    title: bank.title || slug,
    count: (bank.questions || []).length,
    ...(includeFilters
      ? { filters: buildQuestionFilterFacets(bank.questions, slug) }
      : {}),
}));
}
