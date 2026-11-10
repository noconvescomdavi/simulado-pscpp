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

// Legacy Fonseca Volume 2 records used the Google Drive file ID as
// bibliography_id. Keep that immutable source locator in source.drive_file_id,
// while presenting the sanctioned library catalog IDs in effective questions.
// This is a narrow, evidence-based correction, not a validation exemption.
// Only reclassify records whose original locator identifies an unambiguous
// section in the verified whole-book catalog. Never change IDs, answers, source
// locators or quarantine state; preserve raw JSON for a separate editorial migration.
const VERIFIED_LEGACY_SECTION_RULES={
  radioperador:{subject:"comunicacoes",old:"radioperador::integral",
    title:/Radioperador Geral|EROG/i,
    classify(locator){
      if(/^Anexo(?:s)?\\s*\\d+/i.test(locator))return "annexes";
      if(/^(?:Unidade\\s*1\\b|Item\\s*1\\.)/i.test(locator))return "unit1";
      if(/^(?:Unidade\\s*2\\b|Item\\s*2\\.)/i.test(locator))return "unit2";
      if(/^(?:Unidade\\s*3\\b|Item\\s*3\\.)/i.test(locator))return "unit3";
      return null;
    }},
  normam224:{subject:"conhecimentos-gerais",old:"normam224::integral",
    title:/NORMAM-224\\/DPC/i,
    classify(locator){const m=locator.match(/^seção\\s+([123])\\./i);return m?"ch"+m[1]:null;}}
};
function canonicalizeVerifiedLegacyChapter(q){
  const t=q?.taxonomy;
  const spec=VERIFIED_LEGACY_SECTION_RULES[t?.bibliography_id];
  if(!spec||t.subject_slug!==spec.subject||t.chapter_id!==spec.old||
    q.active===false||["inactive","deactivated","quarantined"].includes(String(q.status||"").toLowerCase())||
    q.tracking?.chapter?.id!==spec.old||!spec.title.test(String(q.source?.title||"")))return null;
  const key=spec.classify(String(q.source?.locator||""));
  const chapter=CH.get(t.bibliography_id+"::"+key);
  if(!key||!chapter||chapter.bibliography_id!==t.bibliography_id||chapter.subject_slug!==t.subject_slug)return null;
  return {...q,taxonomy:{...t,chapter_id:chapter.chapter_id},tracking:{...q.tracking,
    chapter:{...q.tracking.chapter,id:chapter.chapter_id,number:key,title:chapter.label,label:chapter.label},
    ...(q.tracking.section!==undefined?{section:chapter.label}:{})}};
}

export function canonicalizeQuestionTaxonomy(question) {
  const verifiedChapter=canonicalizeVerifiedLegacyChapter(question);
  if(verifiedChapter)return verifiedChapter;
  const legacyDriveId="1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec";
  if (question?.taxonomy?.bibliography_id !== legacyDriveId) return question;
  const match=String(question.taxonomy.chapter_id||"").match(/^Capítulo (9|10)$/);
  if (!match || question.taxonomy.subject_slug !== "arte-naval"
    || question.source?.drive_file_id !== legacyDriveId
    || !/\bArte Naval\b[^\n]{0,40}\b(?:Volume|v\.?)\s*2\b/i.test(String(question.source?.title||""))) {
    return question; // unmatched legacy references remain invalid and visible to audit
  }
  const canonicalChapterId="fonseca-arte-v2::ch"+match[1];
  return {
    ...question,
    taxonomy: {
      ...question.taxonomy,
      bibliography_id: "fonseca-arte-v2",
      chapter_id: canonicalChapterId,
    },
    tracking: question.tracking ? {
      ...question.tracking,
      work_id: "fonseca-arte-v2",
      chapter_id: canonicalChapterId,
    } : question.tracking,
  };
}

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
