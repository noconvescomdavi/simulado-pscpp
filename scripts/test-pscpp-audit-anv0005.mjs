import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';
import { createRequire, Module } from 'node:module';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { classifyQuestionStructure } from '../lib/question-structure.js';
import { publicQuestion } from '../lib/question-banks.js';

const frozen = '309ec933f90e0242cd7c7334d89fbba572fbbc2b';
const stable = value => Array.isArray(value) ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const hash = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
const before = gunzipSync(execFileSync('git', ['show', `${frozen}:docs/auditoria-pscpp/INVENTARIO_RUNTIME.jsonl.gz`], {maxBuffer:64*1024*1024}))
  .toString().split('\n').filter(Boolean).map(JSON.parse).filter(r => r.consumer === 'cadernos');
const banks = JSON.parse(fs.readFileSync('data/questions/runtime-active-banks.json')).banks;
const after = Object.values(banks).flatMap(bank => bank.questions);
assert.equal(after.length, before.length, 'Correction must not add or remove active IDs');
const previous = new Map(before.map(r => [r.id, r.hash]));
assert.equal(previous.size, before.length);
const changed = after.filter(q => hash(q) !== previous.get(q.id)).map(q => q.id);
assert.deepEqual(changed, ['ANV-0005'], 'Unrelated effective content changed');
const question = after.find(q => q.id === 'ANV-0005');
const raw = JSON.parse(fs.readFileSync('data/questions/arte-naval.json')).questions.find(q => q.id === question.id);
assert.equal(question.question, raw.question, 'Pipeline must preserve the individually corrected propositions');
assert.equal(question.correct_answer, 'E');
assert.equal(question.cognitive_level, 2);
assert.equal(question.source.printed_page, 543);
assert.equal(question.source.pdf_page, 541);
assert.equal(question.source.sha256, '792beebaea10aaff4b65288c0cfc3dd76c507f779297ee42583d078a7ec1dd20');
assert.equal(question.provenance?.mass_reformulation, undefined);
const items = classifyQuestionStructure(question).blocks.filter(b => b.type === 'assertions' || b.type === 'items').flatMap(b => b.items || []);
assert.equal(items.length, 4, 'All four propositions must be parsed');
assert.equal(new Set(question.options.map(o => o.text)).size, 5);

// Exercise the same public adapter and component used by notebook questions.
const require = createRequire(import.meta.url);
const filename = fileURLToPath(new URL('../app/components/StructuredQuestion.js', import.meta.url));
const babel = require('next/dist/compiled/babel/core');
const {code} = babel.transformSync(fs.readFileSync(filename, 'utf8'), {filename, babelrc:false, configFile:false,
  presets:[[require.resolve('next/babel'), {'preset-env':{modules:'commonjs'}, 'transform-runtime':{helpers:false,regenerator:false}}]]});
const compiled = new Module(filename);
compiled.filename = filename;
const componentRequire = createRequire(filename);
compiled.require = specifier => specifier.endsWith('.css') ? {}
  : specifier === '../../lib/question-structure' ? {classifyQuestionStructure} : componentRequire(specifier);
compiled._compile(code, filename);
const html = renderToStaticMarkup(React.createElement(compiled.exports.default, {question:publicQuestion(question)}));
for (const item of items) {
  const escaped = renderToStaticMarkup(React.createElement('span', null, item.text)).slice(6,-7);
  assert.ok(html.includes(escaped), `Proposition absent from rendered HTML: ${item.label}`);
}
console.log(JSON.stringify({id:question.id, before_hash:previous.get(question.id), after_hash:hash(question),
  changed_effective_ids:changed, preserved_occurrences:after.length-1, propositions_rendered:items.length,
  editorial_release_approval:false},null,2));
