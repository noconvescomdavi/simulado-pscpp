import assert from "node:assert/strict";
import {availableQuestionBanks as sourceBanks,getQuestionFilterFacets as sourceFacets,getQuestion} from "../lib/question-banks.js";
import {availableQuestionBanks as catalogBanks,getQuestionFilterFacets as catalogFacets,getQuestionCatalogCount} from "../lib/question-catalog.js";
import {getNotebookScopeEntry} from "../lib/notebook-scope-index.js";
import {availableQuestionBanks as summaryBanks,getQuestionCatalogCount as summaryCount} from "../lib/question-summary.js";
import {questionTaxonomy} from "../lib/question-filters.js";
import {ALL_SUBJECTS_SLUG,TRIAL_SUBJECT_SLUG} from "../lib/subjects.js";
import runtimeBanks from "../data/questions/runtime-active-banks.json";

for(const filters of [false,true])for(const pscpp of [false,true]){
  const options={includeFilters:filters,includePscpp:pscpp};
  assert.deepEqual(catalogBanks(options),sourceBanks(options),`Lista de bancos divergente: ${JSON.stringify(options)}`);
}
for(const pscpp of [false,true])assert.deepEqual(summaryBanks({includePscpp:pscpp}),sourceBanks({includePscpp:pscpp}));
for(const subject of [ALL_SUBJECTS_SLUG,TRIAL_SUBJECT_SLUG,...Object.keys(runtimeBanks.banks),"simulado-pscpp"]){
  assert.deepEqual(catalogFacets(subject),sourceFacets(subject),`Filtros divergentes: ${subject}`);
  assert.equal(summaryCount(subject),getQuestionCatalogCount(subject));
  assert.equal(getQuestionCatalogCount(subject),sourceBanks({includePscpp:true}).filter(b=>b.slug===subject).reduce((n,b)=>n+b.count,0)||
    ([ALL_SUBJECTS_SLUG,TRIAL_SUBJECT_SLUG].includes(subject)?Object.values(runtimeBanks.banks).reduce((n,b)=>n+b.questions.length,0):0));
}
let checked=0;
for(const [subject,bank] of Object.entries(runtimeBanks.banks))for(const question of bank.questions){
  const actual=getQuestion(subject,question.id),taxonomy=questionTaxonomy(actual,subject);
  const expected={work_id:taxonomy.work?.id||null,work_label:taxonomy.work?.label||taxonomy.work?.title||null,
    chapter_id:taxonomy.chapter?.id||null,chapter_label:taxonomy.chapter?.label||taxonomy.chapter?.title||null};
  assert.deepEqual(getNotebookScopeEntry(subject,question.id),expected,`Escopo divergente: ${subject}/${question.id}`);
  checked++;
}
console.log(`Catálogo equivalente ao banco ativo: ${checked} referências, contagens e filtros completos`);
