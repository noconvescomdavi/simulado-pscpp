import fs from "node:fs";
import path from "node:path";
import {BIBLIOGRAPHY} from "../data/study/bibliography.js";

const slug=process.argv[2];
if(!slug)throw new Error("Uso: node scripts/migrate-question-taxonomy.mjs <subject-slug>");

const configs={
  manobrabilidade:()=>import("./taxonomy-maps/manobrabilidade.mjs")
};
if(!configs[slug])throw new Error(`Mapeamento ainda não configurado para ${slug}`);
const cfg=await configs[slug]();
const classifier=cfg.classifyManobrabilidade;
const sourceAvailability=cfg.sourceAvailability||{};
const sourcePendingNotes=cfg.sourcePendingNotes||{};

const subjectIds={
  manobrabilidade:"I","arte-naval":"II","navegacao-aguas-restritas":"III",
  "legislacao-regulamentacao":"IV","meteorologia-oceanografia":"V",comunicacoes:"VI","conhecimentos-gerais":"VII"
};
const subjectId=subjectIds[slug];
if(!subjectId)throw new Error(`Matéria desconhecida: ${slug}`);

const root=process.cwd();
const bankPath=path.join(root,"data/questions",`${slug}.json`);
const reportPath=path.join(root,"reports",`${slug}-migration.json`);
const bank=JSON.parse(fs.readFileSync(bankPath,"utf8"));
const questions=Array.isArray(bank.questions)?bank.questions:[];
const catalog=BIBLIOGRAPHY[slug]||[];
const works=new Map(catalog.map(w=>[w.key,w]));
const chapters=new Map();
for(const work of catalog)for(const section of work.sections||[])chapters.set(`${work.key}::${section.key}`,{work,section});

const norm=(v)=>String(v??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const slugify=(v)=>norm(v).replace(/\s+/g,"-").replace(/^-+|-+$/g,"").slice(0,80)||"topico";
const uniq=(xs)=>[...new Set(xs.filter(Boolean))];
const inc=(m,k)=>m.set(k,(m.get(k)||0)+1);
const beforeIds=questions.map(q=>q.id);
const mappedCounts=new Map(), confidenceCounts=new Map(), unmappedReasons=new Map();
const unmappedSamples=[];
let migrated=0, alreadyV2=0, sourceLocatorImproved=0;

function topicIdFor(q,bibliographyId,sectionKey){
  return `MAN-${bibliographyId}-${sectionKey}-${slugify(q.topic_code)}-${slugify(q.topic)}`;
}

for(const q of questions){
  if(q?.taxonomy?.subject_slug===slug){alreadyV2++;continue;}
  const hit=classifier(q);
  if(!hit){
    const reason=`sem classificação segura: ${q?.source?.title||"fonte sem título"} / ${q?.topic||"sem tópico"}`;
    inc(unmappedReasons,reason);
    if(unmappedSamples.length<200)unmappedSamples.push({id:q.id,module:q.module,topic_code:q.topic_code,topic:q.topic,source:q.source});
    continue;
  }
  const chapterId=`${hit.bibliography_id}::${hit.section_key}`;
  const cat=chapters.get(chapterId);
  if(!cat)throw new Error(`Classificador retornou chapter_id inexistente: ${chapterId} (${q.id})`);
  const topicId=topicIdFor(q,hit.bibliography_id,hit.section_key);
  q.taxonomy={
    subject_id:subjectId,
    subject_slug:slug,
    bibliography_id:hit.bibliography_id,
    chapter_id:chapterId,
    topic_id:topicId,
    subtopic_id:null
  };
  q.tracking={
    subject_slug:slug,
    work:{id:hit.bibliography_id,title:cat.work.title,author:String(q?.source?.author||"")},
    chapter:{id:chapterId,number:hit.section_key,title:cat.section.chapter||cat.section.label||hit.section_key,label:cat.section.label||cat.section.chapter||hit.section_key},
    section:cat.section.chapter||cat.section.label||String(q?.source?.locator||""),
    module:String(q.module||""),
    topic:{id:topicId,title:String(q.topic||"")}
  };
  q.tags=uniq([...(Array.isArray(q.tags)?q.tags:[]),slug,hit.bibliography_id,chapterId,slugify(q.topic)]);
  if(sourceAvailability[hit.bibliography_id]===true&&hit.confidence==="high"&&q?.source){
    const exact=cat.section.chapter||cat.section.label;
    if(exact&&q.source.locator!==exact){q.source.locator=exact;sourceLocatorImproved++;}
  }
  migrated++;
  inc(mappedCounts,chapterId);
  inc(confidenceCounts,hit.confidence||"unknown");
}

const afterIds=questions.map(q=>q.id);
if(beforeIds.length!==afterIds.length||beforeIds.some((id,i)=>id!==afterIds[i]))throw new Error("Preservação de IDs/ordem falhou durante migração");
if(new Set(afterIds).size!==afterIds.length)throw new Error("IDs duplicados após migração");

const countsByChapter=new Map();
let v2=0,legacy=0;
for(const q of questions){
  if(q?.taxonomy?.subject_slug===slug){v2++;inc(countsByChapter,q.taxonomy.chapter_id);}else legacy++;
}
const coverage=[];
for(const work of catalog){
  const available=sourceAvailability[work.key]!==false;
  for(const section of work.sections||[]){
    const chapterId=`${work.key}::${section.key}`;
    const count=countsByChapter.get(chapterId)||0;
    let status;
    if(!available)status="fonte_pendente";
    else if(count===0)status="critico";
    else if(count<25)status="insuficiente";
    else if(count<=50)status="meta_atingida";
    else status="cobertura_ampla";
    coverage.push({bibliography_id:work.key,work:work.title,chapter_id:chapterId,unit:section.chapter||section.label,count,source_available:available,status,pending_note:available?null:(sourcePendingNotes[work.key]||"Fonte pendente")});
  }
}
const summary={
  total:questions.length,v2,legacy,migrated,already_v2:alreadyV2,source_locator_improved:sourceLocatorImproved,
  mapped_confidence:Object.fromEntries(confidenceCounts),unmapped_samples:unmappedSamples.length,
  coverage:{critical:coverage.filter(x=>x.status==="critico").length,insufficient:coverage.filter(x=>x.status==="insuficiente").length,goal:coverage.filter(x=>x.status==="meta_atingida").length,wide:coverage.filter(x=>x.status==="cobertura_ampla").length,source_pending:coverage.filter(x=>x.status==="fonte_pendente").length}
};

bank.schema_version=bank.schema_version||"3.0.0";
bank.questions=questions;
fs.writeFileSync(bankPath,JSON.stringify(bank,null,2)+"\n");
fs.mkdirSync(path.dirname(reportPath),{recursive:true});
fs.writeFileSync(reportPath,JSON.stringify({generated_at:new Date().toISOString(),subject_slug:slug,summary,coverage,unmapped_samples:unmappedSamples,unmapped_reasons:[...unmappedReasons].map(([reason,count])=>({reason,count}))},null,2)+"\n");
console.log(JSON.stringify(summary,null,2));
