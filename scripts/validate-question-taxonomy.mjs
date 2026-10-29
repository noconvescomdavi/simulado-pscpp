import fs from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";

const root=process.cwd();
const {validateQuestionTaxonomy,taxonomyCatalog,canonicalizeQuestionTaxonomy}=await import(pathToFileURL(path.join(root,"lib/question-taxonomy.js")).href);
// Source-title variants coexist in the base branch and in historical
// Volume-2 records. Both must map to the same canonical catalog entry.
const legacyVolume2Id="1Kuftc9vCw2Oqbzutdaz1NsXWOV1nL-Ec";
for(const title of ["Arte Naval - Volume 2 - 8ª edição","Arte Naval, v. 2"]){
  const fixture={taxonomy:{subject_slug:"arte-naval",bibliography_id:legacyVolume2Id,chapter_id:"Capítulo 9"},source:{title,drive_file_id:legacyVolume2Id}};
  const normalized=canonicalizeQuestionTaxonomy(fixture);
  if(normalized.taxonomy.bibliography_id!=="fonseca-arte-v2"||normalized.taxonomy.chapter_id!=="fonseca-arte-v2::ch9"){
    throw new Error("Fonseca Volume-2 source-title normalization regression: "+title);
  }
}
const unrelated={taxonomy:{subject_slug:"arte-naval",bibliography_id:legacyVolume2Id,chapter_id:"Capítulo 9"},source:{title:"Outra publicação",drive_file_id:legacyVolume2Id}};
if(canonicalizeQuestionTaxonomy(unrelated)!==unrelated)throw new Error("Unrelated source was incorrectly canonicalized");

const dir=path.join(root,"data/questions");
const files=fs.readdirSync(dir).filter(x=>x.endsWith(".json")).sort();
const rows=[];let invalid=0,quarantinedInvalid=0,legacy=0,total=0,canonicalized=0;
for(const file of files){
  const slug=file.replace(/\.json$/,"");
  const bank=JSON.parse(fs.readFileSync(path.join(dir,file),"utf8"));
  const coverage=new Map();
  for(const original of bank.questions||[]){
    const q=canonicalizeQuestionTaxonomy(original);
    if(q!==original)canonicalized++;
    total++;
    const result=validateQuestionTaxonomy(q,slug);
    if(result.legacy){legacy++;continue}
    if(result.errors.length){if(q.active===false||["inactive","deactivated","quarantined"].includes(String(q.status||"").toLowerCase())){quarantinedInvalid++;continue}invalid++;console.error(q.id+": "+result.errors.join("; "));continue}
    const t=q.taxonomy;
    const key=t.chapter_id+"|"+t.topic_id;
    coverage.set(key,(coverage.get(key)||0)+1);
  }
  for(const [key,count] of coverage){
    const [chapter_id,topic_id]=key.split("|");
    rows.push({slug,chapter_id,topic_id,count,status:count===0?"CRITICO":count<25?"INSUFICIENTE":count<=50?"ALVO":"AMPLO"});
  }
}
const catalog=taxonomyCatalog();
const byChapter=new Map();
for(const row of rows)byChapter.set(row.slug+"|"+row.chapter_id,(byChapter.get(row.slug+"|"+row.chapter_id)||0)+row.count);
const chapterCoverage=catalog.chapters.map(ch=>{
  const count=byChapter.get(ch.subject_slug+"|"+ch.chapter_id)||0;
  return {...ch,count,status:count===0?"CRITICO":count<25?"INSUFICIENTE":count<=50?"ALVO":"AMPLO"};
});
const report={generated_at:new Date().toISOString(),total_questions:total,legacy_questions:legacy,canonicalized_fonseca_v2:canonicalized,invalid_taxonomy:invalid,chapter_coverage:chapterCoverage,topic_coverage:rows};
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports/question-coverage.json"),JSON.stringify(report,null,2)+"\n");
console.log("Questões:",total,"| v2:",total-legacy,"| legacy:",legacy,"| IDs Fonseca v2 canonicalizados:",canonicalized,"| taxonomia inválida ativa:",invalid,"| taxonomia inválida em quarentena:",quarantinedInvalid);
console.log("Capítulos críticos:",chapterCoverage.filter(x=>x.count===0).length);
if(invalid)process.exit(1);
