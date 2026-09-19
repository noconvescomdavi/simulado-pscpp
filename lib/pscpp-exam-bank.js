import officialExams from "../data/pscpp/official-exams.json";
import generatedQuestions from "../data/pscpp/generated-questions.json";

export const PSCPP_SUBJECT = "simulado-pscpp";
export const PSCPP_SIZE = 100;

function hash(value) {
  let h = 2166136261;
  for (const c of String(value)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function ranked(items, seed) {
  return [...items].sort((a,b)=>hash(seed+":"+a.id)-hash(seed+":"+b.id));
}
function valid(items) {
  return (items || []).filter((q) => q && q.active !== false && !q.annulled && q.validation_status !== "rejected");
}
export function getPscppPool() {
  return [...valid(officialExams.questions), ...valid(generatedQuestions.questions)];
}
export function getPscppQuestion(id) {
  return getPscppPool().find((q) => String(q.id) === String(id)) || null;
}
export function buildPscppExam(seed=Date.now()) {
  const official = ranked(valid(officialExams.questions), seed+":official");
  const generated = ranked(valid(generatedQuestions.questions), seed+":generated");
  const generatedTarget = generated.length >= 65 ? 65 : generated.length;
  const officialTarget = Math.min(PSCPP_SIZE-generatedTarget, official.length);
  const chosen=[...official.slice(0,officialTarget),...generated.slice(0,generatedTarget)];
  if(chosen.length<PSCPP_SIZE){
    const used=new Set(chosen.map(q=>String(q.id)));
    for(const q of ranked(getPscppPool(),seed+":fill")){
      if(used.has(String(q.id))) continue;
      chosen.push(q); used.add(String(q.id));
      if(chosen.length>=PSCPP_SIZE) break;
    }
  }
  return ranked(chosen,seed+":final").slice(0,PSCPP_SIZE);
}
export function pscppBlueprint(){
  return {
    size:PSCPP_SIZE,
    selection:"controlled_blueprint",
    target_mix:{official:35,generated:65},
    fallback:"fill_from_valid_independent_pscpp_pool",
    origin_visibility:"admin_only",
    common_bank_dependency:false
  };
}
