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
import pscppCadernoBloco001 from "../data/question-extensions/pscpp-caderno-bloco-001.json";
import pscppCadernoBloco002 from "../data/question-extensions/pscpp-caderno-bloco-002.json";
import pscppCadernoBloco005 from "../data/question-extensions/pscpp-caderno-bloco-005.json";
import pscppCadernoBloco008 from "../data/question-extensions/pscpp-caderno-bloco-008.json";
import pscppCadernoBloco009 from "../data/question-extensions/pscpp-caderno-bloco-009.json";
import pscppCadernoBloco010 from "../data/question-extensions/pscpp-caderno-bloco-010.json";
import pscppCadernoBloco011 from "../data/question-extensions/pscpp-caderno-bloco-011.json";
import pscppCadernoBloco012 from "../data/question-extensions/pscpp-caderno-bloco-012.json";
import pscppCadernoBloco013 from "../data/question-extensions/pscpp-caderno-bloco-013.json";
import pscppCadernoBloco014 from "../data/question-extensions/pscpp-caderno-bloco-014.json";
import pscppCadernoBloco015 from "../data/question-extensions/pscpp-caderno-bloco-015.json";
import pscppCadernoBloco016 from "../data/question-extensions/pscpp-caderno-bloco-016.json";
import pscppCadernoBloco017 from "../data/question-extensions/pscpp-caderno-bloco-017.json";
import pscppCadernoBloco018 from "../data/question-extensions/pscpp-caderno-bloco-018.json";
import pscppCadernoBloco019 from "../data/question-extensions/pscpp-caderno-bloco-019.json";
import pscppCadernoBloco020 from "../data/question-extensions/pscpp-caderno-bloco-020.json";
import pscppCadernoBloco021 from "../data/question-extensions/pscpp-caderno-bloco-021.json";
import pscppCadernoBloco022 from "../data/question-extensions/pscpp-caderno-bloco-022.json";
import pscppCadernoBloco023 from "../data/question-extensions/pscpp-caderno-bloco-023.json";
import pscppCadernoBloco024 from "../data/question-extensions/pscpp-caderno-bloco-024.json";
import pscppCadernoBloco025 from "../data/question-extensions/pscpp-caderno-bloco-025.json";
import pscppCadernoBloco026 from "../data/question-extensions/pscpp-caderno-bloco-026.json";
import pscppCadernoBloco027 from "../data/question-extensions/pscpp-caderno-bloco-027.json";
import pscppCadernoBloco028 from "../data/question-extensions/pscpp-caderno-bloco-028.json";
import pscppCadernoBloco029 from "../data/question-extensions/pscpp-caderno-bloco-029.json";
import pscppCadernoBloco007 from "../data/question-extensions/pscpp-caderno-bloco-007.json";
import pscppCadernoBloco006 from "../data/question-extensions/pscpp-caderno-bloco-006.json";
import pscppCadernoBloco004 from "../data/question-extensions/pscpp-caderno-bloco-004.json";
import pscppCadernoBloco003 from "../data/question-extensions/pscpp-caderno-bloco-003.json";
import { getPscppPool, getPscppQuestion, PSCPP_SUBJECT } from "./pscpp-exam-bank";
import { classifyQuestionStructure } from "./question-structure";
import { isQuestionActive } from "./question-quality-policy";
import { reformulateLeakingStem } from "./question-quality";
import { applyQuestionRestorations } from "./question-restorations";
import {
  normalizeSubject,
  ALL_SUBJECTS_SLUG,
  TRIAL_SUBJECT_SLUG,
} from "./subjects";
import {
  buildQuestionFilterFacets,
  filterQuestions,
  isRipeamQuestion,
  questionTaxonomy,
} from "./question-filters";

const ripeamSituacoes = {
  title: "Situações de Manobra / RIPEAM",
  questions: [
    ...(ripeamSituacoes01.questions || []),
    ...(ripeamSituacoes02.questions || []),
    ...(ripeamSituacoes03.questions || []),
    ...(ripeamSituacoes04.questions || []),
    ...(ripeamSituacoes05.questions || []),
    ...(ripeamExpansao06.questions || []),
    ...(ripeamExpansao07.questions || []),
  ],
};

const navegacaoRestaurada = applyQuestionRestorations("navegacao-aguas-restritas", navegacao);

const navegacaoComRipeamTeorico = {
  ...navegacaoRestaurada,
  questions: [
    ...(navegacaoRestaurada.questions || []),
    ...(ripeamExpansao01.questions || []),
    ...(ripeamExpansao02.questions || []),
    ...(ripeamExpansao03.questions || []),
    ...(ripeamExpansao04.questions || []),
    ...(ripeamExpansao05.questions || []),
  ],
};

function withCadernoBlock(slug, bank) {
  return {
    ...bank,
    questions: [
      ...(bank?.questions || []),
      ...(pscppCadernoBloco001.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco002.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco003.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco004.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco005.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco006.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco007.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco008.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco009.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco010.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco011.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco012.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco013.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco014.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco015.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco016.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco017.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco018.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco019.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco020.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco021.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco022.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco023.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco024.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco025.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco026.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco027.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco028.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
      ...(pscppCadernoBloco029.questions || []).filter((question) => question?.taxonomy?.subject_slug === slug),
    ],
  };
}

const BANKS = {
  manobrabilidade: withCadernoBlock("manobrabilidade", applyQuestionRestorations("manobrabilidade", manobrabilidade)),
  "arte-naval": withCadernoBlock("arte-naval", applyQuestionRestorations("arte-naval", arteNaval)),
  "navegacao-aguas-restritas": withCadernoBlock("navegacao-aguas-restritas", navegacaoComRipeamTeorico),
  "situacoes-de-manobra-ripeam": ripeamSituacoes,
  "legislacao-regulamentacao": withCadernoBlock("legislacao-regulamentacao", applyQuestionRestorations("legislacao-regulamentacao", legislacao)),
  "meteorologia-oceanografia": withCadernoBlock("meteorologia-oceanografia", applyQuestionRestorations("meteorologia-oceanografia", meteorologia)),
  comunicacoes: withCadernoBlock("comunicacoes", applyQuestionRestorations("comunicacoes", comunicacoes)),
  "conhecimentos-gerais": withCadernoBlock("conhecimentos-gerais", applyQuestionRestorations("conhecimentos-gerais", gerais)),
};

const INDEXES = new Map();

function activeQuestions(bank) {
  return (bank?.questions || []).map(reformulateLeakingStem).filter(isQuestionActive);
}

function allQuestions() {
  return Object.entries(BANKS).flatMap(([slug, bank]) =>
    activeQuestions(bank).map((question) => ({
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
    structure: question.structure || classifyQuestionStructure(question),
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
