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

const correctionLog = JSON.parse(fs.readFileSync('docs/auditoria-pscpp/CORRECOES_RUNTIME.json'));
const frozen = correctionLog.baseline_commit;
const stable = value => Array.isArray(value) ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
const hash = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
const frozenRuntime = gunzipSync(execFileSync('git', ['show', `${frozen}:docs/auditoria-pscpp/INVENTARIO_RUNTIME.jsonl.gz`], {maxBuffer:64*1024*1024}))
  .toString().split('\n').filter(Boolean).map(JSON.parse);
const before = frozenRuntime.filter(r => r.consumer === 'cadernos');
const examBefore = frozenRuntime.filter(r => r.consumer === 'simulado_pscpp');
const examAfter = JSON.parse(fs.readFileSync('data/pscpp/runtime-active-questions.json')).questions;
assert.equal(examAfter.length, examBefore.length);
const examHashes = new Map(examBefore.map(q => [q.id,q.hash]));
assert.equal(new Set(examAfter.map(q => q.id)).size, examAfter.length);
assert.deepEqual(examAfter.map(q => q.id).sort(), examBefore.map(q => q.id).sort());
for (const q of examAfter) assert.equal(hash(q), examHashes.get(q.id), `Unrelated PSCPP content changed: ${q.id}`);
const banks = JSON.parse(fs.readFileSync('data/questions/runtime-active-banks.json')).banks;
const after = Object.values(banks).flatMap(bank => bank.questions);
assert.equal(after.length, before.length, 'Correction must not add or remove active IDs');
assert.equal(new Set(after.map(q => q.id)).size, after.length, 'No duplicate IDs after correction');
assert.deepEqual(after.map(q => q.id).sort(), before.map(q => q.id).sort(), 'Active ID membership changed');
const previous = new Map(before.map(r => [r.id, r.hash]));
assert.equal(previous.size, before.length);
const changed = after.filter(q => hash(q) !== previous.get(q.id)).map(q => q.id);
assert.deepEqual(changed.sort(), correctionLog.corrections.map(q => q.id).sort(), 'Unrelated effective content changed');
for (const correction of correctionLog.corrections) {
  const q = after.find(q => q.id === correction.id);
  assert.equal(previous.get(q.id), correction.before_hash, `Frozen before hash changed: ${q.id}`);
  assert.equal(hash(q), correction.after_hash, `Effective corrected hash changed: ${q.id}`);
  const primaryFile = ['ANV-0005','ANV-0020','ANV-0765','ANV-0790','ANV-0964','ANV-0794','ANV-0795','ANV-0798','ANV-0803','ANV-0806','ANV-0809','ANV-0814','ANV-0972','ANV-0823','ANV-0975','ANV-1034','ANV-0826','ANV-0976','ANV-0827','ANV-0829','ANV-0977','ANV-0832','ANV-0978','ANV-0836','ANV-0841','ANV-0981','ANV-0843','ANV-0845','ANV-0148','ANV-0846'].includes(q.id)
    ? 'data/questions/arte-naval.json' : 'data/question-restorations/arte-naval.json';
  const primary = JSON.parse(fs.readFileSync(primaryFile)).questions.find(row => row.id === q.id);
  assert.ok(primary, `Missing reviewed source: ${q.id}`);
  assert.equal(q.question, primary.question, `Reviewed stem overwritten downstream: ${q.id}`);
  assert.equal(q.explanation, primary.explanation, `Reviewed explanation overwritten downstream: ${q.id}`);
  assert.equal(q.correct_answer, correction.key);
  assert.equal(q.source.printed_page, correction.printed_page);
  assert.equal(q.source.pdf_page, correction.pdf_page);
  assert.equal(q.provenance?.mass_reformulation, undefined, `Corrected propositions were reformulated: ${q.id}`);
  if (correction.format === 'direct') {
    assert.ok(['ANV-0765','ANV-0790','ANV-0964','ANV-0794','ANV-0795','ANV-0798','ANV-0803','ANV-0806','ANV-0809','ANV-0814','ANV-0972','ANV-0823','ANV-0975','ANV-1034','ANV-0826','ANV-0976','ANV-0827','ANV-0829','ANV-0977','ANV-0832','ANV-0978','ANV-0836','ANV-0841','ANV-0981','ANV-0843','ANV-0845','ANV-0846'].includes(q.id), 'Only documented direct repairs use this contract');
    if (q.id === 'ANV-0964') {
      const {initial, final, threshold, percent} = correction.calculation;
      assert.equal((final-initial)/initial*100, percent);
      assert.ok(percent > threshold);
      assert.ok(q.question.includes(`${initial} m`) && q.question.includes(`${final} m`));
    }
    assert.equal(q.options.length, 5);
    assert.equal(new Set(q.options.map(o => o.text)).size, 5);
    assert.deepEqual(q.options.map(o => o.key), ['A','B','C','D','E']);
    assert.equal(q.options.find(o => o.key === q.correct_answer)?.text, correction.primary_checked_answer);
    assert.equal(correction.proposition_truths, undefined);
    continue;
  }
  // Independently recompute the answer combination from the source-reviewed
  // truth vector, rather than merely checking an unchanged answer letter.
  // The vector is manual primary-source evidence, not automated proof of truth.
  assert.equal(correction.proposition_truths.length, 4);
  assert.ok(correction.proposition_truths.every(value => typeof value === 'boolean'));
  const labels = ['I','II','III','IV'];
  const correctSet = labels.filter((_,i) => correction.proposition_truths[i]).sort().join(',');
  const matches = q.options.filter(option => {
    const terms = [...option.text.matchAll(/\b(?:IV|III|II|I)\b/g)].map(m => m[0]);
    assert.equal(new Set(terms).size, terms.length, `Repeated proposition label: ${q.id}/${option.key}`);
    return terms.sort().join(',') === correctSet;
  });
  assert.equal(matches.length, 1, `Answer combination is not unique: ${q.id}`);
  assert.equal(matches[0].key, q.correct_answer, `Truth-vector resolution disagrees with key: ${q.id}`);
}
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
let rendered = 0;
let directOptionsPreserved = 0;
for (const correction of correctionLog.corrections) {
  const q = after.find(q => q.id === correction.id);
  const props = classifyQuestionStructure(q).blocks.filter(b => b.type === 'assertions' || b.type === 'items').flatMap(b => b.items || []);
  assert.equal(props.length, correction.format === 'direct' ? 0 : 4, `Expected proposition count: ${q.id}`);
  assert.equal(new Set(q.options.map(o => o.text)).size, 5);
  for (const option of q.options) assert.ok(q.distractor_analysis?.[option.key], `Missing alternative rationale: ${q.id}/${option.key}`);
  const html = renderToStaticMarkup(React.createElement(compiled.exports.default, {question:publicQuestion(q)}));
  if (correction.format === 'direct') {
    const escaped = renderToStaticMarkup(React.createElement('span', null, q.question)).slice(6,-7);
    assert.ok(html.includes(escaped), `Direct stem absent from rendered HTML: ${q.id}`);
    // StructuredQuestion renders the stem; options are passed separately by the
    // notebook adapter. Verify that publicQuestion preserves every option.
    assert.deepEqual(publicQuestion(q).options, q.options);
    directOptionsPreserved += q.options.length;
  }
  for (const item of props) {
    const escaped = renderToStaticMarkup(React.createElement('span', null, item.text)).slice(6,-7);
    assert.ok(html.includes(escaped), `Proposition absent from rendered HTML: ${q.id}/${item.label}`);
    rendered++;
  }
}
console.log(JSON.stringify({id:question.id, before_hash:previous.get(question.id), after_hash:hash(question),
  changed_effective_ids:changed, preserved_occurrences:after.length-correctionLog.corrections.length, propositions_rendered:rendered,
  direct_options_preserved:directOptionsPreserved, editorial_release_approval:false},null,2));
