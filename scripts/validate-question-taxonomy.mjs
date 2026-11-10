import fs from "node:fs";
import path from "node:path";
import {pathToFileURL} from "node:url";

const root=process.cwd();
const {validateQuestionTaxonomy,taxonomyCatalog}=await import(pathToFileURL(path.join(root,"lib/question-taxonomy.js")).href);
const dir=path.join(root,"data/questions");
const files=fs.readdirSync(dir).filter(x=>x.endsWith(".json")).sort();
const baseline=JSON.parse(fs.readFileSync(path.join(root,"data/audit-baselines/taxonomy-preexisting-main-20261110.json"),"utf8"));
const expected=new Map();
for(const [id,reason] of baseline.exceptions){
  const sig=JSON.stringify([String(id),String(reason)]);
  expected.set(sig,(expected.get(sig)||0)+1);
}
const rows=[];let invalid=0,preexistingInvalid=0,quarantinedInvalid=0,legacy=0,total=0;
const newViolations=[];const addedExtensions=[];
for(const file of files){
  const slug=file.replace(/\.json$/,"");
  const bank=JSON.parse(fs.readFileSync(path.join(dir,file),"utf8"));
  const coverage=new Map();
  for(const q of bank.questions||[]){
    total++;
    const result=validateQuestionTaxonomy(q,slug);
    if(result.legacy){legacy++;continue}
    if(result.errors.length){if(q.active===false||["inactive","deactivated","quarantined"].includes(String(q.status||"").toLowerCase())){quarantinedInvalid++;continue}invalid++;
      const reason=result.errors.slice().sort().join("; ");
      const sig=JSON.stringify([String(q.id),reason]);
      const remaining=expected.get(sig)||0;
      if(remaining>0){expected.set(sig,remaining-1);preexistingInvalid++}
      else{newViolations.push({bank:slug,id:String(q.id),reason});console.error("NOVA TAXONOMIA INVÁLIDA "+slug+"/"+q.id+": "+reason)}
      continue}
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
// Exceções do main não são homologadas. Somente sua repetição exata é
// tolerada para não bloquear a admissão de lotes independentes.
const extensionDir=path.join(root,"data/question-extensions");
for(const file of fs.readdirSync(extensionDir).filter(name=>/^manobrabilidade-santos-lote-\d+\.json$/.test(name)).sort()){
  const bank=JSON.parse(fs.readFileSync(path.join(extensionDir,file),"utf8"));
  const ids=new Set();
  for(const q of bank.questions||[]){
    if(ids.has(q.id))newViolations.push({bank:file,id:q.id,reason:"id duplicado no lote"});
    ids.add(q.id);
    const check=validateQuestionTaxonomy(q,"manobrabilidade");
    if(check.errors.length)newViolations.push({bank:file,id:q.id,reason:check.errors.join("; ")});
    if(q.active!==true||q.validation_status!=="approved")newViolations.push({bank:file,id:q.id,reason:"questão não homologada"});
  }
  addedExtensions.push({file,count:ids.size});
}
report.preexisting_invalid=preexistingInvalid;
report.new_invalid=newViolations.length;
report.new_violations=newViolations;
report.audited_santos_lotes=addedExtensions;
fs.writeFileSync(path.join(root,"reports/question-coverage.json"),JSON.stringify(report,null,2)+"\n");
console.log("Questões:",total,"| taxonomia inválida ativa total:",invalid,
  "| dívida anterior documentada:",preexistingInvalid,"| violações novas:",newViolations.length,
  "| taxonomia inválida em quarentena:",quarantinedInvalid);
console.log("Capítulos críticos:",chapterCoverage.filter(x=>x.count===0).length);
console.log("Lotes Santos auditados:",JSON.stringify(addedExtensions));
if(newViolations.length)process.exit(1);
