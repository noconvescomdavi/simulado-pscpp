import {BIBLIOGRAPHY} from "../data/study/bibliography.js";

export const SUBJECT_TAXONOMY={
  manobrabilidade:{id:"I",slug:"manobrabilidade",label:"I — Manobrabilidade do Navio (Ship Manoeuvrability)"},
  "arte-naval":{id:"II",slug:"arte-naval",label:"II — Arte Naval"},
  "navegacao-aguas-restritas":{id:"III",slug:"navegacao-aguas-restritas",label:"III — Navegação em Águas Restritas"},
  "legislacao-regulamentacao":{id:"IV",slug:"legislacao-regulamentacao",label:"IV — Legislação e Regulamentação"},
  "meteorologia-oceanografia":{id:"V",slug:"meteorologia-oceanografia",label:"V — Meteorologia, Oceanografia e Navegação"},
  comunicacoes:{id:"VI",slug:"comunicacoes",label:"VI — Comunicações"},
  "conhecimentos-gerais":{id:"VII",slug:"conhecimentos-gerais",label:"VII — Conhecimentos Gerais"}
};

export function taxonomyCatalog(){
  const publications=[],chapters=[];
  for(const [subjectSlug,entries] of Object.entries(BIBLIOGRAPHY)){
    const subject=SUBJECT_TAXONOMY[subjectSlug];
    if(!subject)continue;
    for(const entry of entries){
      publications.push({subject_id:subject.id,subject_slug:subject.slug,bibliography_id:entry.key,label:entry.title});
      for(const section of entry.sections||[]){
        chapters.push({
          subject_id:subject.id,subject_slug:subject.slug,bibliography_id:entry.key,
          chapter_id:entry.key+"::"+section.key,section_key:section.key,
          label:section.chapter||section.label,page_start:section.pageStart??null,page_end:section.pageEnd??null
        });
      }
    }
  }
  return {subjects:Object.values(SUBJECT_TAXONOMY),publications,chapters};
}

const C=taxonomyCatalog();
const PUB=new Map(C.publications.map(x=>[x.bibliography_id,x]));
const CH=new Map(C.chapters.map(x=>[x.chapter_id,x]));

export function validateQuestionTaxonomy(question,bankSlug){
  const t=question?.taxonomy;
  const errors=[];
  if(!t)return {legacy:true,errors:["taxonomy ausente"]};
  const subject=SUBJECT_TAXONOMY[bankSlug];
  if(!subject)return {legacy:false,errors:["matéria desconhecida: "+bankSlug]};
  if(t.subject_id!==subject.id)errors.push("subject_id divergente");
  if(t.subject_slug!==subject.slug)errors.push("subject_slug divergente");
  const pub=PUB.get(t.bibliography_id);
  if(!pub)errors.push("bibliography_id inexistente");
  else if(pub.subject_slug!==bankSlug)errors.push("bibliography_id pertence a outra matéria");
  const ch=CH.get(t.chapter_id);
  if(!ch)errors.push("chapter_id inexistente");
  else if(ch.bibliography_id!==t.bibliography_id)errors.push("chapter_id não pertence à publicação");
  if(!String(t.topic_id||"").trim())errors.push("topic_id ausente");
  return {legacy:false,errors};
}

export function questionMatchesFilters(q,filters={}){
  const t=q?.taxonomy||{};
  if(filters.bibliography_id&&t.bibliography_id!==filters.bibliography_id)return false;
  if(filters.chapter_id&&t.chapter_id!==filters.chapter_id)return false;
  if(filters.topic_id&&t.topic_id!==filters.topic_id)return false;
  if(filters.subtopic_id&&t.subtopic_id!==filters.subtopic_id)return false;
  if(filters.difficulty&&q.difficulty!==filters.difficulty)return false;
  if(filters.style&&q.style!==filters.style)return false;
  return true;
}
