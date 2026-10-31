import { historicalSubject } from "./historical-exam-blueprint.js";

export const PSCPP_QUOTAS = Object.freeze({
  manobrabilidade: 25,
  "navegacao-aguas-restritas": 25,
  "legislacao-regulamentacao": 10,
  "arte-naval": 10,
  "meteorologia-oceanografia": 10,
  comunicacoes: 10,
  "conhecimentos-gerais": 10,
});

function normalize(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}

function hash(value) {
  let result = 2166136261;
  for (const char of String(value)) { result ^= char.charCodeAt(0); result = Math.imul(result, 16777619); }
  return result >>> 0;
}

function ranked(items, seed) {
  return [...items].sort((a, b) => hash(`${seed}:${a.id}`) - hash(`${seed}:${b.id}`) || String(a.id).localeCompare(String(b.id)));
}

// A tabela do capítulo 2/3 foi achatada pelo OCR; sem a fonte tabular não há
// como garantir o gabarito. Preservamos IDs para sessões antigas, mas não os sorteamos.
export function isPscppEditoriallyEligible(question){
  const assertions=(question?.assertions||[]).map(a=>String(typeof a==="string"?a:a?.text||"").trim());
  const fields=[question?.question,question?.explanation,...(question?.options||[]).map(o=>typeof o==="string"?o:o?.text),...assertions];
  const optionLikeAssertion=/^(?:\s*(?:I|II|III|IV|V|VI|VII|VIII|IX|X|[a-e])\s*[).:-]?\s*)?(?:(?:apenas|somente)\s+(?:(?:as\s+)?(?:afirmativas?|assertivas?)\s+)?(?:I|II|III|IV|V|VI|VII|VIII|IX|X)(?:\s*[,;]\s*(?:I|II|III|IV|V|VI|VII|VIII|IX|X))*(?:\s+e\s+(?:I|II|III|IV|V|VI|VII|VIII|IX|X))?\s+(?:s[aã]o|est[aã]o)\s+(?:verdadeiras?|falsas?|corretas?|incorretas?)|(?:todas|nenhuma|as)\s+(?:as\s+)?(?:afirmativas?|assertivas?)\s+(?:s[aã]o|est[aã]o)\s+(?:verdadeiras?|falsas?|corretas?|incorretas?))/i;
  if(assertions.some(value=>optionLikeAssertion.test(value))) return false;
  return !fields.some(value=>/MODO DE REPRESEN TAR VISTA DO AS LINHAS DO NAVIO/i.test(String(value||"")));
}

export function buildFixedPscppExam(pool, seed = Date.now(), {preferredIds = null} = {}) {
  const selected = [], ids = new Set(), stems = new Set();
  for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
    const topics = new Set();
    const eligible=(pool || []).filter((q) => q && q.active !== false && !q.annulled && isPscppEditoriallyEligible(q) && historicalSubject(q) === subject);
    // A opção de revisão prioriza todas as questões inéditas antes de recorrer
    // a respostas anteriores, sem alterar cotas nem diversidade de tópicos.
    const candidates=preferredIds instanceof Set
      ? [...ranked(eligible.filter(q=>preferredIds.has(String(q.id))), `${seed}:${subject}:new`),
         ...ranked(eligible.filter(q=>!preferredIds.has(String(q.id))), `${seed}:${subject}:review`)]
      : ranked(eligible, `${seed}:${subject}`);
    for (const question of candidates) {
      const id = String(question.id || ""), stem = normalize(question.question);
      // The topic label is the available concept identifier; an unclassified
      // official question may still be used once when its stem is distinct.
      const topic = normalize(question.topic || question.topic_code) || `unclassified:${id}`;
      if (!id || !stem || ids.has(id) || stems.has(stem) || topics.has(topic)) continue;
      selected.push(question);
      ids.add(id);
      stems.add(stem);
      topics.add(topic);
      if (topics.size === quota) break;
    }
    if (topics.size !== quota) {
      throw new Error(`Banco PSCPP insuficiente em ${subject}: ${topics.size}/${quota} tópicos distintos`);
    }
  }
  return ranked(selected, `${seed}:final`);
}
