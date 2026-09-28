import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile,writeFile} from "node:fs/promises";
import {buildQuestionFilterFacets,isRipeamQuestion,questionTaxonomy} from "../lib/question-filters.js";
import {isPscppEditoriallyEligible} from "../lib/pscpp-exam-selection.js";

const root=new URL("../",import.meta.url);
const output=new URL("../data/questions/runtime-question-catalog.json",import.meta.url);
const facetsOutput=new URL("../data/questions/runtime-question-facets.json",import.meta.url);
const scopeOutput=new URL("../data/questions/runtime-notebook-scope.json",import.meta.url);
const notebook=JSON.parse(await readFile(new URL("data/questions/runtime-active-banks.json",root),"utf8"));
const pscpp=JSON.parse(await readFile(new URL("data/pscpp/runtime-active-questions.json",root),"utf8"));
const digest=createHash("sha256");
for(const source of ["lib/question-filters.js","lib/pscpp-exam-selection.js","lib/subjects.js"]){
  digest.update(source).update(await readFile(new URL(source,root)));
}
const sourceHash=digest.update(notebook.source_hash).update(pscpp.source_hash).digest("hex");

if(process.argv.includes("--check")){
  const saved=JSON.parse(await readFile(output,"utf8"));
  const facets=JSON.parse(await readFile(facetsOutput,"utf8"));
  const scope=JSON.parse(await readFile(scopeOutput,"utf8"));
  assert.equal(saved.source_hash,sourceHash,"Catálogo de questões desatualizado; execute npm run generate:question-catalog");
  assert.equal(facets.source_hash,sourceHash,"Filtros de questões desatualizados; execute npm run generate:question-catalog");
  assert.equal(scope.source_hash,sourceHash,"Escopo dos cadernos desatualizado; execute npm run generate:question-catalog");
  console.log(`Catálogo pronto: ${saved.banks.length} bancos`);
}else{
  const banks=Object.entries(notebook.banks).map(([slug,bank])=>({
    slug,title:bank.title||slug,count:bank.questions.length,
    ripeam_count:bank.questions.filter(isRipeamQuestion).length,
    filters:buildQuestionFilterFacets(bank.questions,slug)
  }));
  const all=Object.entries(notebook.banks).flatMap(([slug,bank])=>bank.questions.map(q=>({...q,source_subject:slug})));
  const scope_index=Object.fromEntries(Object.entries(notebook.banks).map(([slug,bank])=>[
    slug,Object.fromEntries(bank.questions.map(q=>{
      const taxonomy=questionTaxonomy(q,slug);
      return [String(q.id),{
        work_id:taxonomy.work?.id||null,work_label:taxonomy.work?.label||taxonomy.work?.title||null,
        chapter_id:taxonomy.chapter?.id||null,chapter_label:taxonomy.chapter?.label||taxonomy.chapter?.title||null
      }];
    }))
  ]));
  const eligible=pscpp.questions.filter(isPscppEditoriallyEligible);
  banks.push({slug:"simulado-pscpp",title:"SIMULADO PSCPP",count:eligible.length,
    ripeam_count:eligible.filter(isRipeamQuestion).length,
    filters:buildQuestionFilterFacets(eligible,"simulado-pscpp")});
  await writeFile(output,JSON.stringify({source_hash:sourceHash,banks:banks.map(({filters,...summary})=>summary)}));
  await writeFile(facetsOutput,JSON.stringify({source_hash:sourceHash,by_slug:Object.fromEntries(banks.map(bank=>[bank.slug,bank.filters])),combined_filters:buildQuestionFilterFacets(all)}));
  await writeFile(scopeOutput,JSON.stringify({source_hash:sourceHash,scope_index}));
  console.log(`Catálogo gerado: ${banks.length} bancos, ${all.length} questões indexadas`);
}
