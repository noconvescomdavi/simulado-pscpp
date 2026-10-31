import assert from 'node:assert/strict';
import fs from 'node:fs';
import { reformulateLeakingStem, auditQuestion } from '../lib/question-quality.js';
import { normalizeEditorialStem } from '../lib/question-editorial-normalization.js';
import { questionQualityState, isQuestionActive } from '../lib/question-quality-policy.js';
import legislationSource from '../data/questions/legislacao-regulamentacao.json';
import { applyQuestionRestorations, applyContentEditorialRestoration } from '../lib/question-restorations.js';
import { canonicalizeQuestionTaxonomy } from '../lib/question-taxonomy.js';
import { restoreCompleteNotebookStem } from '../lib/notebook-stem-restorations.js';
import { applyMiguensCap45Review } from '../lib/miguens-cap45-review.js';
import { collectActiveQuestionBanks } from '../lib/question-banks-source.js';
import { hasLocatorOnlyCommand } from '../lib/question-locator-audit.js';
import { classifyQuestionStructure } from '../lib/question-structure.js';

const read=p=>JSON.parse(fs.readFileSync(new URL(`../${p}`,import.meta.url),'utf8'));
const baseline=read('scripts/fixtures/legislacao-localizador-baseline.json').questions;
const reviewed=read('data/question-restorations/legislacao-regulamentacao-06.json').questions;
const runtime=collectActiveQuestionBanks()['legislacao-regulamentacao'].questions;
const byId=new Map(runtime.map(q=>[q.id,q]));
assert.equal(baseline.length,322);
assert.equal(reviewed.length,322);
assert.equal(new Set(reviewed.map(q=>q.id)).size,322);
assert.deepEqual(new Set(reviewed.map(q=>q.id)),new Set(baseline.map(q=>q.id)));
assert.ok(baseline.every(hasLocatorOnlyCommand),'baseline must reproduce the actual defective runtime templates');
// The active notebook grows as independently audited legislation sources are added.
// Verify every previously active source question survives runtime processing,
// rather than freezing the total at 826 and rejecting legitimate additions.
const restoredSource = applyQuestionRestorations('legislacao-regulamentacao', legislationSource).questions;
const processedSource = restoredSource
 .map(canonicalizeQuestionTaxonomy)
 .map(q=>applyContentEditorialRestoration('legislacao-regulamentacao',q))
 .map(reformulateLeakingStem)
 .map(normalizeEditorialStem)
 .map(q=>restoreCompleteNotebookStem('legislacao-regulamentacao',q))
 .map(q=>applyMiguensCap45Review('Cadernos',q));
const sourceActiveIds = processedSource.filter(isQuestionActive).map(q=>q.id);
const sourceQuarantined = processedSource.filter(q=>!isQuestionActive(q));
assert.equal(processedSource.length,legislationSource.questions.length,'a canonical source question disappeared before quality filtering');
assert.equal(new Set(processedSource.map(q=>q.id)).size,processedSource.length,'duplicate IDs in the canonical Legislation source');
assert.equal(byId.size,runtime.length,'duplicate IDs in the active Legislation notebook');
for (const id of sourceActiveIds) assert.ok(byId.has(id),`${id}: eligible canonical legislation question missing from runtime`);
for (const q of sourceQuarantined) {
 assert.ok(questionQualityState(q).reason,`${q.id}: missing documented quality reason for quarantine`);
 assert.ok(!byId.has(q.id),`${q.id}: quarantined canonical question unexpectedly active`);
}
assert.ok(runtime.length>=sourceActiveIds.length,'runtime lost eligible canonical Legislation questions');
assert.deepEqual(runtime.filter(hasLocatorOnlyCommand).map(q=>q.id),[],'locator-only commands remain in the active notebook');
for(const edit of reviewed) {
 const q=byId.get(edit.id);
 assert.ok(q,`${edit.id}: missing from runtime (including LEG-B extensions)`);
 assert.equal(q.question,edit.question,`${q.id}: reviewed stem changed during generation`);
 assert.equal(q.correct_answer,baseline.find(b=>b.id===q.id).correct_answer);
 assert.deepEqual(q.options,edit.options);
 assert.equal(q.options.length,5);
 assert.deepEqual(q.options.map(o=>o.key),['A','B','C','D','E']);
 const normalized=q.options.map(o=>o.text.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim());
 assert.equal(new Set(normalized).size,5,`${q.id}: equivalent options`);
 assert.ok(q.options.every(o=>o.text.trim()));
 const correct=q.options.find(o=>o.key===q.correct_answer).text;
 const contrast=edit.editorial_review.contrast;
 assert.ok(correct.includes(contrast.correct));
 const expected=[correct,...contrast.distractors.map(value=>correct.replace(contrast.correct,value))];
 assert.deepEqual(new Set(q.options.map(o=>o.text)),new Set(expected),`${q.id}: alternatives do not differ solely at the reviewed contrast`);
 assert.ok(q.explanation.startsWith(`Gabarito: ${q.correct_answer}. ${correct}`));
 assert.ok(q.explanation.includes(q.source.locator));
 for(const option of q.options.filter(o=>o.key!==q.correct_answer)) assert.ok(q.explanation.includes(`${option.key}: incorreta`));
 assert.equal(questionQualityState(q).active,true,`${q.id}: unexpectedly quarantined`);
 assert.equal(auditQuestion(q).issues.filter(issue=>['critical','high'].includes(issue.severity)).length,0,`${q.id}: high-risk editorial finding`);
 assert.equal(classifyQuestionStructure(q).type,'simple',`${q.id}: obsolete assertion/fill formatting`);
 assert.deepEqual(normalizeEditorialStem(reformulateLeakingStem(reformulateLeakingStem(q))),q,`${q.id}: regeneration is not idempotent`);
}
// The audit must catch both article/item templates and page/block-only ones,
// while legitimate source locators and an explicit technical subject pass.
assert.ok(hasLocatorOnlyCommand({question:'Considerando os requisitos estabelecidos em item 3.1, c) de NORMAM 601, qual alternativa apresenta corretamente uma das disposições aplicáveis?'}));
assert.ok(hasLocatorOnlyCommand({question:'De acordo com uma publicação, acerca de página 14, bloco 6, assinale a alternativa que apresenta corretamente a disposição, requisito ou conceito previsto na publicação.'}));
assert.equal(hasLocatorOnlyCommand({question:'De acordo com NORMAM 601, sobre o sinal lateral de canal preferencial a bombordo, qual alternativa está correta?',source:{locator:'item 3.1, c)'}}),false);
// A reviewed marker cannot suppress a genuinely distinctive answer clue.
const leaked={...reviewed[0],question:reviewed[0].options.find(o=>o.key===reviewed[0].correct_answer).text,options:reviewed[0].options.map(o=>({...o,text:o.key===reviewed[0].correct_answer?o.text:'Outro conceito sem relação com a resposta.'}))};
assert.ok(auditQuestion(leaked).issues.some(issue=>issue.code==='stem_answer_overlap'));
console.log(`Legislação: 322 revisões ativas; ${sourceActiveIds.length} questões elegíveis da fonte canônica preservadas; ${sourceQuarantined.length} exclusões justificadas pela política editorial; ${runtime.length} questões ativas no total; 0 comandos por localizador; 5 alternativas distintas; gabaritos, comentários, formato e regeneração validados.`);
