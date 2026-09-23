import officialExams from "../data/pscpp/official-exams.json";
import generatedQuestions from "../data/pscpp/generated-questions.json";
import arteNavalCap1Questions from "../data/pscpp/arte-naval-cap1-552.json";
import arteNavalCap23Questions from "../data/pscpp/arte-naval-cap2-cap3-459.json";
import arteNavalCap8Questions from "../data/pscpp/arte-naval-cap8-504.json";
import { generatedPscppBatchQuestions } from "./generated-pscpp-batches";
import { isQuestionActive } from "./question-quality-policy";
import { reformulateLeakingStem } from "./question-quality";
import { approvedPscppDriveQuestions } from "./approved-pscpp-drive-blocks";
import { buildDiversePscppExam, PSCPP_FIXED_QUOTAS } from "./historical-exam-blueprint";

export const PSCPP_SUBJECT = "simulado-pscpp";
export const PSCPP_SIZE = 100;

function runtimeStructuralSafe(q) {
  const stem=String(q?.question||""), assertions=Array.isArray(q?.assertions)?q.assertions:[], options=Array.isArray(q?.options)?q.options:[];
  const texts=options.map(o=>String(typeof o==="string"?o:o?.text||"").trim()), blob=texts.join(" ");
  if((/analis[ea].*(afirmativ|assertiv)|identifique.*(?:verdadeir|fals)|julgue.*(?:item|afirmativ)/i.test(stem)||/(?:apenas|todas).*(?:\bI\b|\bII\b|\bIII\b|afirmativ|assertiv)/i.test(blob))&&assertions.length<2)return false;
  if(/<\s*PARSED TEXT FOR PAGE|PARSED TEXT FOR PAGE|\[object Object\]/i.test(stem+" "+blob))return false;
  if(/\bcorrelacione\b/i.test(stem)&&!/(?:\n|Coluna\s+I|1\))/i.test(stem))return false;
  if(options.length!==5)return false;
  const norm=t=>t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim();
  if(new Set(texts.map(norm)).size!==texts.length)return false;
  if(/acerca de\s+(?:generalidades|introdu[cç][aã]o|conceitos?|disposi[cç][oõ]es?|aspectos gerais)\b/i.test(stem)&&/assinale a alternativa/i.test(stem))return false;
  const ws=t=>new Set(norm(t).split(/\s+/).filter(w=>w.length>=4)),sim=(a,b)=>{const A=ws(a),B=ws(b);if(!A.size||!B.size)return 0;let n=0;for(const w of A)if(B.has(w))n++;return n/Math.min(A.size,B.size)};
  const ans=String(q.correct_answer||q.answer||"").trim().toUpperCase(),ci=/^[A-E]$/.test(ans)?ans.charCodeAt(0)-65:-1;
  if(ci>=0&&texts[ci]){const cross=texts.map((t,i)=>i===ci?1:sim(texts[ci],t));if(cross.filter((v,i)=>i!==ci&&v<.08).length>=3)return false;const lens=texts.map(t=>ws(t).size).sort((a,b)=>a-b),med=lens[Math.floor(lens.length/2)]||1;if(ws(texts[ci]).size>Math.max(med*1.8,med+10))return false;}
  if(/\bI\b/.test(stem)&&/\bV\b/.test(stem)&&!/[\n\r]/.test(stem))return false;
  return true;
}

function valid(items) {
  return (items || [])
    .filter((q) => q && q.active !== false && !q.annulled && q.validation_status !== "rejected")
    .map(reformulateLeakingStem)
    .filter(isQuestionActive)
    .filter(runtimeStructuralSafe);
}
export function getPscppPool() {
  return [...valid(officialExams.questions), ...valid(generatedQuestions.questions), ...valid(arteNavalCap1Questions.questions), ...valid(arteNavalCap23Questions.questions), ...valid(arteNavalCap8Questions.questions), ...valid(generatedPscppBatchQuestions), ...valid(approvedPscppDriveQuestions)];
}
export function getPscppQuestion(id) {
  return getPscppPool().find((q) => String(q.id) === String(id)) || null;
}
export function buildPscppExam(seed=Date.now()) {
  return buildDiversePscppExam(getPscppPool(), { seed });
}
export function pscppBlueprint(){
  return {
    size:PSCPP_SIZE,
    selection:"fixed_quota_concept_diverse",
    target_quotas:PSCPP_FIXED_QUOTAS,
    target_percentages:PSCPP_FIXED_QUOTAS,
    semantic_deduplication:true,
    shortage_policy:"fail_closed",
    origin_visibility:"admin_only",
    common_bank_dependency:false
  };
}
