import manobrabilidade from "../data/questions/manobrabilidade.json";
import arteNaval from "../data/questions/arte-naval.json";
import arteNavalCap9 from "../data/pscpp/arte-naval-cap9-108.json";
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
import pscppCadernoBloco007 from "../data/question-extensions/pscpp-caderno-bloco-007.json";
import pscppCadernoBloco006 from "../data/question-extensions/pscpp-caderno-bloco-006.json";
import pscppCadernoBloco004 from "../data/question-extensions/pscpp-caderno-bloco-004.json";
import pscppCadernoBloco003 from "../data/question-extensions/pscpp-caderno-bloco-003.json";
import { isQuestionActive } from "./question-quality-policy";
import { reformulateLeakingStem } from "./question-quality";
import { applyQuestionRestorations, applyContentEditorialRestoration } from "./question-restorations";
import { normalizeEditorialStem } from "./question-editorial-normalization";
import { restoreCompleteNotebookStem } from "./notebook-stem-restorations";
import { applyMiguensCap45Review } from "./miguens-cap45-review";
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

const cadernoExtensionQuestions = [
  ...(pscppCadernoBloco001.questions || []),
  ...(pscppCadernoBloco002.questions || []),
  ...(pscppCadernoBloco003.questions || []),
  ...(pscppCadernoBloco004.questions || []),
  ...(pscppCadernoBloco005.questions || []),
  ...(pscppCadernoBloco006.questions || []),
  ...(pscppCadernoBloco007.questions || []),
  ...(pscppCadernoBloco008.questions || []),
  ...(pscppCadernoBloco009.questions || []),
  ...(pscppCadernoBloco010.questions || []),
  ...(pscppCadernoBloco011.questions || []),
  ...(pscppCadernoBloco012.questions || []),
  ...(pscppCadernoBloco013.questions || []),
  ...(pscppCadernoBloco014.questions || []),
  ...(pscppCadernoBloco015.questions || []),
  ...(pscppCadernoBloco016.questions || []),
  ...(pscppCadernoBloco017.questions || []),
  ...(pscppCadernoBloco018.questions || []),
  ...(pscppCadernoBloco019.questions || []),
  ...(pscppCadernoBloco020.questions || []),
  ...(pscppCadernoBloco021.questions || []),
  ...(pscppCadernoBloco022.questions || []),
  ...(pscppCadernoBloco023.questions || []),
  ...(pscppCadernoBloco024.questions || []),
  ...(pscppCadernoBloco025.questions || []),
  ...(pscppCadernoBloco026.questions || []),
];

function isNormam112(question) {
  return question?.taxonomy?.bibliography_id === "normam112"
    || /^LEG-N112-/i.test(String(question?.id || ""))
    || /NORMAM-112\/DPC/i.test(String(question?.source?.title || question?.module || ""));
}

function withCadernoBlock(slug, bank) {
  const baseQuestions = bank?.questions || [];
  const hasCanonicalNormam112 = slug === "legislacao-regulamentacao"
    && baseQuestions.some((question) =>
      /^LEG-N112-/i.test(String(question?.id || ""))
      && question?.taxonomy?.bibliography_id === "normam112"
    );

  const extensions = cadernoExtensionQuestions
    .filter((question) => question?.taxonomy?.subject_slug === slug)
    // The audited NORMAM-112 bank in data/questions is canonical. Do not mix
    // older extension questions from the same work into cadernos/facets.
    .filter((question) => !(hasCanonicalNormam112 && isNormam112(question)));

  return {
    ...bank,
    questions: [...baseQuestions, ...extensions],
  };
}

const BANKS = {
  manobrabilidade: withCadernoBlock("manobrabilidade", applyQuestionRestorations("manobrabilidade", manobrabilidade)),
  "arte-naval": withCadernoBlock("arte-naval", applyQuestionRestorations("arte-naval", {
    ...arteNaval,
    questions: [...(arteNaval.questions || []), ...(arteNavalCap9.questions || [])],
  })),
  "navegacao-aguas-restritas": withCadernoBlock("navegacao-aguas-restritas", navegacaoComRipeamTeorico),
  "situacoes-de-manobra-ripeam": ripeamSituacoes,
  "legislacao-regulamentacao": withCadernoBlock("legislacao-regulamentacao", applyQuestionRestorations("legislacao-regulamentacao", legislacao)),
  "meteorologia-oceanografia": withCadernoBlock("meteorologia-oceanografia", applyQuestionRestorations("meteorologia-oceanografia", meteorologia)),
  comunicacoes: withCadernoBlock("comunicacoes", applyQuestionRestorations("comunicacoes", comunicacoes)),
  "conhecimentos-gerais": withCadernoBlock("conhecimentos-gerais", applyQuestionRestorations("conhecimentos-gerais", gerais)),
};


export function collectActiveQuestionBanks() {
  return Object.fromEntries(Object.entries(BANKS).map(([slug, bank]) => [slug, { ...bank, questions: (bank.questions || []).map(q => applyContentEditorialRestoration(slug, q)).map(reformulateLeakingStem).map(normalizeEditorialStem).map(q => restoreCompleteNotebookStem(slug, q)).map(q => applyMiguensCap45Review("Cadernos", q)).filter(isQuestionActive) }]));
}
