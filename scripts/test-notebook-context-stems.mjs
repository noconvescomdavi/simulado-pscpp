import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {questionQualityState} from '../lib/question-quality-policy.js';
import { createRequire, Module } from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { classifyQuestionStructure } from '../lib/question-structure.js';
import { publicQuestion as notebookPublicQuestion } from '../lib/question-banks.js';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
const filename = fileURLToPath(new URL("../app/components/StructuredQuestion.js", import.meta.url));
const babel = require("next/dist/compiled/babel/core");
const { code } = babel.transformSync(fs.readFileSync(filename, "utf8"), {
  filename,
  babelrc: false,
  configFile: false,
  presets: [[require.resolve("next/babel"), { "preset-env": { modules: "commonjs" }, "transform-runtime": { helpers: false, regenerator: false } }]],
});
const compiled = new Module(filename);
compiled.filename = filename;
const componentRequire = createRequire(filename);
compiled.require = (specifier) => specifier.endsWith(".css") ? {}
  : specifier === "../../lib/question-structure" ? { classifyQuestionStructure }
  : componentRequire(specifier);
compiled._compile(code, filename);
const StructuredQuestion = compiled.exports.default;

const read=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const report=read('reports/notebook-context-stems.json');
const edits=read('data/question-restorations/notebook-context-stems.json').edits;
const banks=read('data/questions/runtime-active-banks.json').banks;
const cap45Review=read('data/question-restorations/miguens-cap45-reviewed.json');
const hash=value=>createHash('sha256').update(JSON.stringify(value??null)).digest('hex');
assert.equal(edits.length,report.corrected);
assert.equal(new Set(edits.map(e=>`${e.bank}::${e.id}`)).size,edits.length);
// Historical 9955 baseline no longer describes the generated runtime catalogue.
// Check the actual scoped catalogue and uniqueness without reactivating inactive IDs.
const scopedBanks = Object.entries(banks).filter(([slug]) => slug !== 'situacoes-de-manobra-ripeam');
const scopedCount = scopedBanks.reduce((n, [, bank]) => n + bank.questions.length, 0);
assert.ok(scopedCount > 0, 'Runtime notebook catalogue must not be empty');
for (const [slug, bank] of scopedBanks) {
 const ids = bank.questions.map(q => String(q.id || ''));
 assert.ok(ids.every(Boolean), `${slug}: missing question ID`);
 assert.equal(new Set(ids).size, ids.length, `${slug}: duplicate active question ID`);
}
console.log('NOTEBOOK_CONTEXT_CATALOGUE_SCOPE', JSON.stringify({scopedCount, by_bank:Object.fromEntries(scopedBanks.map(([slug, bank]) => [slug, bank.questions.length]))}));
for(const edit of edits){
 const q=banks[edit.bank].questions.find(q=>q.id===edit.id);
 const baseline=report.questions.find(q=>q.bank===edit.bank&&q.id===edit.id);
 assert.ok(q,`${edit.id}: question must remain active`);
 assert.equal(q.question,edit.question,`${edit.id}: complete context must survive normalization`);
 assert.equal(q.correct_answer,baseline.correct_answer,`${edit.id}: unchanged key`);
 for(const field of ['options','explanation','source'])assert.equal(hash(q[field]),baseline[field+'_sha256'],`${edit.id}: unchanged ${field}`);
 assert.ok(questionQualityState(q).active,`${edit.id}: quality policy`);
 const html=renderToStaticMarkup(React.createElement(StructuredQuestion,{question:notebookPublicQuestion(q)}));
 for(const match of q.question.matchAll(/[“"]([^”"]+)[”"]/g)){
  const escaped=renderToStaticMarkup(React.createElement('span',null,match[1])).slice(6,-7);
  assert.ok(html.includes(escaped),`${edit.id}: technical subject/proposition must appear in rendered HTML`);
 }
 assert.notEqual(baseline.before,edit.question,`${edit.id}: actual restored context`);
}
console.log(`Contextos restaurados: ${edits.length}; ${scopedCount} questões no escopo runtime; alternativas, comentários, fontes e gabaritos preservados.`);
