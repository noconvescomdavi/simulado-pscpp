import manobrabilidade from "../data/questions/manobrabilidade.json";
import arteNaval from "../data/questions/arte-naval.json";
import navegacao from "../data/questions/navegacao-aguas-restritas.json";
import legislacao from "../data/questions/legislacao-regulamentacao.json";
import meteorologia from "../data/questions/meteorologia-oceanografia.json";
import comunicacoes from "../data/questions/comunicacoes.json";
import gerais from "../data/questions/conhecimentos-gerais.json";
import sit01 from "../data/question-extensions/ripeam-situacoes-01.json";
import sit02 from "../data/question-extensions/ripeam-situacoes-02.json";
import sit03 from "../data/question-extensions/ripeam-situacoes-03.json";
import sit04 from "../data/question-extensions/ripeam-situacoes-04.json";
import sit05 from "../data/question-extensions/ripeam-situacoes-05.json";
import officialExams from "../data/pscpp/official-exams.json";
import { questionTaxonomy } from "./question-filters";

export const PSCPP_SUBJECT = "simulado-pscpp";
export const PSCPP_SIZE = 100;

const SOURCE_BANKS={manobrabilidade,"arte-naval":arteNaval,"navegacao-aguas-restritas":navegacao,"situacoes-de-manobra-ripeam":{questions:[...(sit01.questions||[]),...(sit02.questions||[]),...(sit03.questions||[]),...(sit04.questions||[]),...(sit05.questions||[])]},"legislacao-regulamentacao":legislacao,"meteorologia-oceanografia":meteorologia,comunicacoes,"conhecimentos-gerais":gerais};
const sourceBank=(subject)=>SOURCE_BANKS[subject]||null;

const SUBJECT_QUOTAS = {
  manobrabilidade: 14,
  "arte-naval": 12,
  "navegacao-aguas-restritas": 16,
  "situacoes-de-manobra-ripeam": 14,
  "legislacao-regulamentacao": 14,
  "meteorologia-oceanografia": 12,
  comunicacoes: 8,
  "conhecimentos-gerais": 10,
};

function hash(value) {
  let h = 2166136261;
  for (const c of String(value)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function ranked(items, seed) {
  return [...items].sort((a,b)=>hash(seed+":"+a.id)-hash(seed+":"+b.id));
}
function enrich(question, subject) {
  const taxonomy=questionTaxonomy(question,subject);
  return {
    ...question,
    id: `pscpp::${subject}::${question.id}`,
    source_subject: subject,
    source_id: String(question.id),
    pscpp_origin: question.pscpp_origin || "curated_existing",
    pscpp_format: question.pscpp_format || question.style || "multiple_choice",
    cognitive_level: question.cognitive_level || (question.scenario_only ? "application" : "understanding"),
    bibliography_id: taxonomy.work?.id || null,
  };
}
export function getPscppPool() {
  const official=(officialExams.questions||[]).filter(q=>q.active!==false&&!q.annulled);
  const generated=Object.keys(SUBJECT_QUOTAS).flatMap(subject => {
    const bank=sourceBank(subject);
    return (bank?.questions||[]).map(q=>enrich(q,subject));
  });
  return [...official,...generated];
}
export function getPscppQuestion(id) {
  const parts=String(id||"").split("::");
  if(parts.length<3||parts[0]!=="pscpp") return null;
  const subject=parts[1], sourceId=parts.slice(2).join("::");
  const official=(officialExams.questions||[]).find(x=>String(x.id)===String(id)&&x.active!==false&&!x.annulled);
  if(official) return official;
  const q=(sourceBank(subject)?.questions||[]).find(x=>String(x.id)===sourceId);
  return q?enrich(q,subject):null;
}
export function buildPscppExam(seed=Date.now()) {
  const chosen=[];
  const officialPool=ranked((officialExams.questions||[]).filter(q=>q.active!==false&&!q.annulled),seed+":official");
  const officialTarget=Math.min(35,officialPool.length);
  for(const q of officialPool.slice(0,officialTarget)) chosen.push(q);
  const used=new Set();
  for(const [subject,quota] of Object.entries(SUBJECT_QUOTAS)){
    const candidates=ranked((sourceBank(subject)?.questions||[]).map(q=>enrich(q,subject)),seed+":"+subject);
    const bibliography=new Map();
    for(const q of candidates){
      if(chosen.length>=PSCPP_SIZE) break;
      const key=q.bibliography_id||"unknown";
      const count=bibliography.get(key)||0;
      if(count>=Math.max(3,Math.ceil(quota/3))) continue;
      chosen.push(q); used.add(q.id); bibliography.set(key,count+1);
      if([...chosen].filter(x=>x.source_subject===subject).length>=quota) break;
    }
    if([...chosen].filter(x=>x.source_subject===subject).length<quota){
      for(const q of candidates){
        if(used.has(q.id)) continue;
        chosen.push(q); used.add(q.id);
        if([...chosen].filter(x=>x.source_subject===subject).length>=quota) break;
      }
    }
  }
  const unique=[...new Map(chosen.map(q=>[q.id,q])).values()];
  if(unique.length<PSCPP_SIZE){
    for(const q of ranked(getPscppPool(),seed+":fill")){if(!unique.some(x=>x.id===q.id))unique.push(q);if(unique.length>=PSCPP_SIZE)break;}
  }
  return ranked(unique,seed+":final").slice(0,PSCPP_SIZE);
}
export function pscppBlueprint(){
  return {size:PSCPP_SIZE,subject_quotas:{...SUBJECT_QUOTAS},selection:"controlled_blueprint",origin_visibility:"admin_only"};
}
