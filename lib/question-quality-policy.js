import { auditQuestion } from "./question-quality";
const UNSAFE_PROVENANCE = new Set([
  "format-expansion-v1","pscpp-style-upgrade-v3","pscpp-deep-refine-v4","pscpp-deep-refine-v5",
  "pscpp-refinement-v3","pscpp-repair-v3","pscpp-cleanup-v8","pscpp-bibliographic-v6","pscpp-focused-extension-v7",
  "revisao-contextual-v2","pscpp-stem-dedup-v5"
]);

const UNSAFE_TAGS = new Set([
  "expansao-formatos-v1","pscpp-style-upgrade-v3","pscpp-deep-refine-v4","pscpp-deep-refine-v5",
  "pscpp-refinement-v3","pscpp-repair-v3","pscpp-cleanup-v8","pscpp-style-v6","pscpp-focused-extension-v7",
  "revisao-contextual-v2","pscpp-stem-dedup-v5","cobertura-v2"
]);

const LEAKING_STEM_PATTERNS = [
  /[“"][^”"]{18,}[”"]/,
  /(?:relativo|referente|trata|sobre)\s+a\s+[“"][^”"]+[”"]/i,
  /(?:atividade|opera[cç][aã]o|procedimentos?)\s+envolvendo\s+[“"][^”"]+[”"]/i,
  /(?:ao examinar|a respeito de)\s+[^?]{0,120}[“"][^”"]+[”"]/i
];

const TEMPLATE_RISK = [
  /problema-base/i,
  /caracteriza[cç][aã]o tecnicamente correta/i,
  /em rela[cç][aã]o a .{1,100}, considere a seguinte caracter[ií]stica/i,
  /a descri[cç][aã]o t[eé]cnica [“"]?a seguir/i,
  /no contexto de .{1,100}, a associa[cç][aã]o/i
];

function explicitAnswerExplanationMismatch(question) {
  const answer = String(question?.correct_answer || question?.answer || "").toUpperCase();
  const match = String(question?.explanation || "").match(/(?:alternativa|op[cç][aã]o)\s+([A-E])\b/i);
  return Boolean(match && answer && match[1].toUpperCase() !== answer);
}

export function questionQualityState(question) {
  if (!question) return { active: false, reason: "missing-question" };
  if (question.active === false || ["inactive","deactivated","quarantined"].includes(String(question.status || "").toLowerCase())) {
    return { active: false, reason: "explicitly-inactive" };
  }
  const method = String(question?.provenance?.method || "");
  if (UNSAFE_PROVENANCE.has(method)) return { active: false, reason: `legacy-generator:${method}` };
  const tag = (question.tags || []).find((value) => UNSAFE_TAGS.has(String(value)));
  if (tag) return { active: false, reason: `legacy-tag:${tag}` };
  if (explicitAnswerExplanationMismatch(question)) return { active: false, reason: "answer-explanation-mismatch" };
  if (TEMPLATE_RISK.some((re) => re.test(String(question.question || "")))) return { active: false, reason: "template-risk" };
  if (LEAKING_STEM_PATTERNS.some((re)=>re.test(String(question.question||"")))) return {active:false,reason:"stem-quotes-source-answer"};
  const stem=String(question.question||"");
  const assertions=Array.isArray(question.assertions)?question.assertions:[];
  const options=Array.isArray(question.options)?question.options:[];
  const optionBlob=options.map(o=>String(typeof o==="string"?o:o?.text||"")).join(" ");
  const asksAssertions=/analis[ea].*(afirmativ|assertiv)|identifique.*(?:verdadeir|fals)|julgue.*(?:item|afirmativ)/i.test(stem);
  const comboAssertions=/(?:apenas|todas).*(?:\bI\b|\bII\b|\bIII\b|afirmativ|assertiv)/i.test(optionBlob);
  if((asksAssertions||comboAssertions)&&assertions.length<2)return {active:false,reason:"missing-assertions"};
  if(/<\s*PARSED TEXT FOR PAGE|PARSED TEXT FOR PAGE|\[object Object\]/i.test(stem+" "+optionBlob))return {active:false,reason:"parsing-artifact"};
  if(/\bcorrelacione\b/i.test(stem)&&!/(?:\n|Coluna\s+I|1\))/i.test(stem))return {active:false,reason:"malformed-correlation-stem"};
  const audit=auditQuestion(question);
  const leak=audit.issues.find(issue=>["stem_answer_continuation","stem_answer_overlap","answer_similarity_leak"].includes(issue.code)&&["critical","high"].includes(issue.severity));
  if(leak)return {active:false,reason:`answer-leak:${leak.code}`};
  return { active: true, reason: null };
}

export function isQuestionActive(question) { return questionQualityState(question).active; }
export { UNSAFE_PROVENANCE, UNSAFE_TAGS, TEMPLATE_RISK, LEAKING_STEM_PATTERNS, explicitAnswerExplanationMismatch };
