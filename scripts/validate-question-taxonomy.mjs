import fs from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";

const root=process.cwd();
const {validateQuestionTaxonomy,taxonomyCatalog}=await import(pathToFileURL(path.join(root,"lib/question-taxonomy.js")).href);
const dir=path.join(root,"data/questions");
const files=fs.readdirSync(dir).filter(x=>x.endsWith(".json")).sort();
const rows=[];let invalid=0,legacy=0,total=0;
for(const file of files){
  const slug=file.replace(/\.json$/,"");
  const bank=JSON.parse(fs.readFileSync(path.join(dir,file),"utf8"));
  const coverage=new Map();
  for(const q of bank.questions||[]){
    total++;
    const result=validateQuestionTaxonomy(q,slug);
    if(result.legacy){legacy++;continue}
    if(result.errors.length){invalid++;console.error(q.id+": "+result.errors.join("; "));continue}
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
const report={generated_at:new Date().toISOString(),total_questions:total,legacy_questions:legacy,invalid_taxonomy:invalid,chapter_coverage:chapterCoverage,topic_coverage:rows};
fs.mkdirSync(path.join(root,"reports"),{recursive:true});
fs.writeFileSync(path.join(root,"reports/question-coverage.json"),JSON.stringify(report,null,2)+"\n");
console.log("Questões:",total,"| v2:",total-legacy,"| legacy:",legacy,"| taxonomia inválida:",invalid);
console.log("Capítulos críticos:",chapterCoverage.filter(x=>x.count===0).length);
if(invalid)process.exit(1);
