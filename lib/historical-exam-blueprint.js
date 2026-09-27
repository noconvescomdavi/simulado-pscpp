export const BLUEPRINT_VERSION = "2026.09";

export const HISTORICAL_SAMPLE = Object.freeze({
  years: [2006, 2008, 2011, 2012],
  valid_questions: 254,
  excluded_annulled: 10,
});

export const HISTORICAL_SUBJECT_COUNTS = Object.freeze({
  manobrabilidade: 92,
  "navegacao-aguas-restritas": 77,
  "legislacao-regulamentacao": 27,
  "arte-naval": 25,
  "meteorologia-oceanografia": 19,
  comunicacoes: 14,
  "conhecimentos-gerais": 0,
});

const OFFICIAL_OVERRIDES = new Map([
  ["2006:4", "navegacao-aguas-restritas"], ["2006:23", "legislacao-regulamentacao"],
  ["2006:26", "manobrabilidade"], ["2006:28", "manobrabilidade"],
  ["2006:34", "manobrabilidade"], ["2006:36", "manobrabilidade"],
  ["2006:37", "manobrabilidade"], ["2006:43", "manobrabilidade"],
  ["2006:46", "manobrabilidade"], ["2006:48", "legislacao-regulamentacao"],
  ["2006:58", "navegacao-aguas-restritas"], ["2008:2", "arte-naval"],
  ["2008:3", "manobrabilidade"], ["2008:12", "navegacao-aguas-restritas"],
  ["2008:24", "manobrabilidade"], ["2008:32", "navegacao-aguas-restritas"],
  ["2008:34", "manobrabilidade"], ["2008:36", "arte-naval"],
  ["2008:42", "manobrabilidade"], ["2008:53", "navegacao-aguas-restritas"],
  ["2008:54", "arte-naval"], ["2008:58", "navegacao-aguas-restritas"],
  ["2008:61", "manobrabilidade"], ["2008:66", "navegacao-aguas-restritas"],
  ["2008:71", "manobrabilidade"], ["2008:72", "arte-naval"],
  ["2011:5", "meteorologia-oceanografia"], ["2011:12", "arte-naval"],
  ["2011:19", "navegacao-aguas-restritas"], ["2012:3", "arte-naval"],
  ["2012:24", "navegacao-aguas-restritas"], ["2012:25", "navegacao-aguas-restritas"],
  ["2012:35", "legislacao-regulamentacao"], ["2012:36", "legislacao-regulamentacao"],
  ["2012:38", "legislacao-regulamentacao"],
  ["2008:19", "navegacao-aguas-restritas"],
]);

function normalized(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

export function historicalSubject(question) {
  const direct = normalized(question?.source_subject || question?.subject);
  if (direct && !["simulado-pscpp", "todas-as-materias", "teste-gratuito"].includes(direct)) return direct;

  const module = normalized(question?.module);
  if (module.includes("manobr")) return "manobrabilidade";
  if (module.includes("arte naval")) return "arte-naval";
  if (module.includes("naveg")) return "navegacao-aguas-restritas";
  if (module.includes("legis")) return "legislacao-regulamentacao";
  if (module.includes("meteor") || module.includes("ocean")) return "meteorologia-oceanografia";
  if (module.includes("comunic")) return "comunicacoes";
  if (module.includes("conhecimento")) return "conhecimentos-gerais";

  const override = OFFICIAL_OVERRIDES.get(`${question?.year}:${question?.number}`);
  if (override) return override;

  const text = normalized(question?.question);
  if (/arte naval|mauril/.test(text)) return "arte-naval";
  if (/meteorolog|oceanograf|carta sinotica|imagem de satelite|sistema frontal|massa de ar|nuvem|brisa maritima/.test(text)) return "meteorologia-oceanografia";
  if (/codigo internacional de sinais|\bcis\b|gmdss|smcp|standard marine communication|radioperador|mayday|\bvhf\b|comunicac|reserve sources of energy/.test(text)) return "comunicacoes";
  if (/lei n|lesta|rlesta|tribunal maritimo|normam-?0?3|normam-?0?6|normam-?1?2|normam-?2?6|normas da autoridade maritima|portaria|autoridade maritima|inquerit|investigacao de seguranca|delegado da delegacia|servico de praticagem/.test(text)) return "legislacao-regulamentacao";
  if (/colreg|ripeam|navegacao: a ciencia e a arte|bridge team management|bridge procedures|ecdis|carta nautica|balizamento|farol|mare|corrente de mare|aviso aos navegantes|informacoes de seguranca maritima|\bais\b|racon|radar|agulha|rumo verdadeiro|linha de posicao|navegacao costeira|canal estreito/.test(text)) return "navegacao-aguas-restritas";
  if (/principles of naval arch|shiphandling|naval shiphandling|tug use|rebocadores portuarios|rebocador|squat|manobr|propuls|leme|curva de giro|aguas rasas|shallow water|resistencia ao avanco|cavitac|efeito do vento|efeito da corrente|interacao|fundear com dois|dois ferros/.test(text)) return "manobrabilidade";
  return "conhecimentos-gerais";
}

function hash(value) {
  let result = 2166136261;
  for (const char of String(value)) { result ^= char.charCodeAt(0); result = Math.imul(result, 16777619); }
  return result >>> 0;
}

function ranked(items, seed) {
  return [...items].sort((left, right) => hash(`${seed}:${left.id}`) - hash(`${seed}:${right.id}`));
}

export function historicalQuotas(size = 100) {
  const total = Object.values(HISTORICAL_SUBJECT_COUNTS).reduce((sum, value) => sum + value, 0);
  const rows = Object.entries(HISTORICAL_SUBJECT_COUNTS).map(([subject, observed]) => {
    const exact = size * observed / total;
    return { subject, observed, exact, quota: Math.floor(exact), remainder: exact - Math.floor(exact) };
  });
  let missing = size - rows.reduce((sum, row) => sum + row.quota, 0);
  for (const row of [...rows].sort((a, b) => b.remainder - a.remainder || b.observed - a.observed)) {
    if (missing <= 0) break;
    row.quota += 1;
    missing -= 1;
  }
  return Object.fromEntries(rows.map((row) => [row.subject, row.quota]));
}


export const PSCPP_FIXED_QUOTAS=Object.freeze({manobrabilidade:25,"navegacao-aguas-restritas":25,"legislacao-regulamentacao":10,"arte-naval":10,"meteorologia-oceanografia":10,comunicacoes:10,"conhecimentos-gerais":10});
function conceptKey(q){return normalized(q?.taxonomy?.topic_code||q?.topic_code||q?.taxonomy?.topic||q?.topic||q?.tracking?.module||q?.module||q?.question).replace(/[^a-z0-9]+/g," ").trim().split(" ").slice(0,12).join(" ")}
export function buildPscppFixedExam(pool,{seed=Date.now()}={}){const valid=(pool||[]).filter(q=>q&&q.active!==false&&!q.annulled&&q.validation_status!=="rejected"),selected=[],usedIds=new Set(),usedConcepts=new Set();for(const [subject,quota] of Object.entries(PSCPP_FIXED_QUOTAS)){const candidates=ranked(valid.filter(q=>historicalSubject(q)===subject),seed+":"+subject);for(const q of candidates){const id=String(q.id),concept=conceptKey(q);if(usedIds.has(id)||(concept&&usedConcepts.has(concept)))continue;selected.push(q);usedIds.add(id);if(concept)usedConcepts.add(concept);if(selected.filter(x=>historicalSubject(x)===subject).length>=quota)break;}if(selected.filter(x=>historicalSubject(x)===subject).length<quota)throw new Error("Banco insuficiente para a matriz PSCPP: "+subject);}return ranked(selected,seed+":pscpp-fixed");}

export function buildHistoricalExam(pool, { seed = Date.now(), size = 100 } = {}) {
  const valid = (pool || []).filter((question) => question && question.active !== false && !question.annulled && question.validation_status !== "rejected");
  const target = Math.min(Math.max(1, Number(size) || 100), valid.length);
  const quotas = historicalQuotas(target);
  const selected = [];
  const used = new Set();

  for (const [subject, quota] of Object.entries(quotas)) {
    for (const question of ranked(valid.filter((item) => historicalSubject(item) === subject), `${seed}:${subject}`).slice(0, quota)) {
      selected.push(question);
      used.add(String(question.id));
    }
  }

  if (selected.length < target) {
    for (const question of ranked(valid, `${seed}:historical-fallback`)) {
      if (used.has(String(question.id))) continue;
      selected.push(question);
      used.add(String(question.id));
      if (selected.length >= target) break;
    }
  }

  return ranked(selected, `${seed}:final`).slice(0, target);
}

export function historicalBlueprint(size = 100) {
  const quotas = historicalQuotas(size);
  return {
    version: BLUEPRINT_VERSION,
    selection: "historical_incidence_stratified",
    sample: HISTORICAL_SAMPLE,
    observed_counts: HISTORICAL_SUBJECT_COUNTS,
    target_quotas: quotas,
    target_percentages: Object.fromEntries(Object.entries(quotas).map(([subject, quota]) => [subject, Number((quota * 100 / size).toFixed(2))])),
    fallback: "redistribute_shortage_across_valid_pool",
  };
}


export function historicalHeatmap(){
  const total=Object.values(HISTORICAL_SUBJECT_COUNTS).reduce((sum,v)=>sum+v,0)||1;
  return Object.entries(HISTORICAL_SUBJECT_COUNTS).map(([subject,count])=>({subject,count,incidence:Number((count*100/total).toFixed(1)),sample_years:HISTORICAL_SAMPLE.years,blueprint_version:BLUEPRINT_VERSION})).sort((a,b)=>b.count-a.count);
}

export function questionExamFidelity(question={}){
  let score=0;const reasons=[];
  if(question.source||question.tracking?.work){score+=25;reasons.push("fonte rastreável")}
  if(question.topic||question.topic_code){score+=20;reasons.push("tópico classificado")}
  if(question.explanation){score+=15;reasons.push("explicação disponível")}
  if(Array.isArray(question.options)&&question.options.length>=4){score+=15;reasons.push("distratores estruturados")}
  if(question.year||question.source_exam){score+=15;reasons.push("referência de prova")}
  if(String(question.question||"").length>=80){score+=10;reasons.push("enunciado contextualizado")}
  return{score:Math.min(100,score),reasons};
}
