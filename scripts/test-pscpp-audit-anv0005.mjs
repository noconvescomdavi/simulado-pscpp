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
  const primaryFile = ['ANV-0005','ANV-0020','ANV-0765','ANV-0790','ANV-0964','ANV-0794','ANV-0795','ANV-0798','ANV-0803','ANV-0806','ANV-0809','ANV-0814','ANV-0972','ANV-0823','ANV-0975','ANV-1034','ANV-0826','ANV-0976','ANV-0827','ANV-0829','ANV-0977','ANV-0832','ANV-0978','ANV-0836','ANV-0841','ANV-0981','ANV-0843','ANV-0845','ANV-0148','ANV-0846','ANV-0151','ANV-0152','ANV-0849','ANV-0850','ANV-0984','ANV-0163','ANV-0164','ANV-0861','ANV-0862','ANV-0988','ANV-0165','ANV-0863','ANV-0166','ANV-0864','ANV-0179','ANV-0877','ANV-0993','ANV-0378','ANV-0181','ANV-0879','ANV-0190','ANV-0888','ANV-0198','ANV-0199','ANV-0897','ANV-0200','ANV-0898','ANV-1000','ANV-0203','ANV-0601','ANV-0901','ANV-0204','ANV-0602','ANV-0213','ANV-0611','ANV-0214','ANV-0612','ANV-0218','ANV-0616','ANV-0906','ANV-0221','ANV-0619','AN-C10-1014-M1','AN-C10-1014-M2','AN-C10-1014-M3','ANV-0223','ANV-0621','AN-C09-916-M1','AN-C09-916-M2','AN-C09-916-M3','ANV-0227','ANV-0625','ANV-0909','AN-C12-1228-M1','AN-C12-1228-M2','AN-C12-1228-M3','ANV-0235','ANV-0633','ANV-0237','ANV-0635','AN-C12-125-M1','AN-C12-125-M2','AN-C12-125-M3','ANV-0254','ANV-0652','ANV-0256','ANV-0654','AN-C11-115b-M1','AN-C11-115b-M2','AN-C11-115b-M3','ANV-0262','ANV-0660','AN-C10-1016-M1','AN-C10-1016-M2','AN-C10-1016-M3','ANV-0263','ANV-0661','ANV-0921','AN-C11-114e-M1','AN-C11-114e-M2','AN-C11-114e-M3'].includes(q.id)
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
    assert.ok(['ANV-0765','ANV-0790','ANV-0964','ANV-0794','ANV-0795','ANV-0798','ANV-0803','ANV-0806','ANV-0809','ANV-0814','ANV-0972','ANV-0823','ANV-0975','ANV-1034','ANV-0826','ANV-0976','ANV-0827','ANV-0829','ANV-0977','ANV-0832','ANV-0978','ANV-0836','ANV-0841','ANV-0981','ANV-0843','ANV-0845','ANV-0846','ANV-0849','ANV-0850','ANV-0984','ANV-0861','ANV-0862','ANV-0988','ANV-0863','ANV-0864','ANV-0877','ANV-0993','ANV-0378','ANV-0879','ANV-0888','ANV-0897','ANV-0898','ANV-1000','ANV-0601','ANV-0901','ANV-0602','ANV-0611','ANV-0612','ANV-0616','ANV-0906','ANV-0619','AN-C10-1014-M2','ANV-0621','AN-C09-916-M1','AN-C09-916-M2','ANV-0625','ANV-0909','AN-C12-1228-M2','ANV-0633','ANV-0635','AN-C12-125-M2','ANV-0652','ANV-0654','AN-C11-115b-M2','ANV-0660','AN-C10-1016-M2','ANV-0661','ANV-0921','AN-C11-114e-M2'].includes(q.id), 'Only documented direct repairs use this contract');
    if (q.id === 'ANV-0964') {
      const {initial, final, threshold, percent} = correction.calculation;
      assert.equal((final-initial)/initial*100, percent);
      assert.ok(percent > threshold);
      assert.ok(q.question.includes(`${initial} m`) && q.question.includes(`${final} m`));
    }
    if (q.id === 'ANV-0633') {
      const c = correction.calculation;
      assert.equal(c.kind, 'metacentric_height');
      assert.ok(c.KM_m > c.KG_m && c.KG_m > 0);
      assert.ok(Math.abs(c.KM_m - c.KG_m - c.GM_m) < 1e-12);
      for (const value of [c.KM_m,c.KG_m]) assert.ok(q.question.includes(`${String(value).replace('.', ',')} m`));
      const value = Number.parseFloat(q.options.find(o => o.key === q.correct_answer).text.replace(',', '.'));
      assert.equal(value, c.GM_m);
    }
    if (q.id === 'ANV-0602') {
      const {crest_positions_m, interval_count, wavelength_m} = correction.calculation;
      assert.equal(crest_positions_m.length - 1, interval_count);
      const intervals = crest_positions_m.slice(1).map((position, i) => position - crest_positions_m[i]);
      assert.ok(intervals.every(value => value === wavelength_m));
      assert.equal((crest_positions_m.at(-1) - crest_positions_m[0]) / interval_count, wavelength_m);
      for (const position of crest_positions_m) assert.ok(q.question.includes(`${position} m`));
      assert.equal(Number.parseFloat(q.options.find(option => option.key === q.correct_answer).text), wavelength_m);
    }
    if (['ANV-0621','AN-C09-916-M1','AN-C09-916-M2'].includes(q.id)) {
      const c = correction.calculation;
      assert.equal(c.unit, 'kgf');
      for (const value of [c.P,c.F]) assert.ok(Number.isFinite(value) && value > 0);
      assert.ok(q.question.includes(`${c.P} kgf`) && q.question.includes(`n = ${c.n}`));
      if (c.kind === 'efficiency') {
        assert.ok(Math.abs(c.P/(c.n*c.F) - c.R) < 1e-12);
        assert.ok(c.R > 0 && c.R <= 1);
        assert.ok(q.question.includes(`${c.F} kgf`));
        const displayed = q.options.find(o => o.key === q.correct_answer).text;
        if (q.id === 'ANV-0621') assert.equal(Number.parseFloat(displayed), c.R*100);
        if (q.id === 'AN-C09-916-M1') assert.equal(Number.parseFloat(displayed.split('=').at(-1).trim().replace(',', '.')), c.R);
      } else {
        assert.equal(c.kind, 'passive_force');
        assert.equal((1+c.m*c.passive_fraction)*c.P/c.n, c.F);
        assert.equal(Number.parseFloat(q.options.find(o => o.key === q.correct_answer).text), c.F);
        assert.ok(q.question.includes(`m = ${c.m}`));
      }
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
  if (correction.format === 'true_false') {
    assert.ok(['AN-C10-1014-M3','AN-C09-916-M3','AN-C12-1228-M3','AN-C12-125-M3','AN-C11-115b-M3','AN-C10-1016-M3','AN-C11-114e-M3'].includes(q.id), 'Only documented V/F repairs use this contract');
    const expectedSequence = correction.proposition_truths.map(value => value ? 'V' : 'F').join(',');
    const sequences = q.options.map(option => {
      const terms = option.text.match(/\b[VF]\b/g) || [];
      assert.equal(terms.length, correction.proposition_truths.length, `Incomplete V/F option: ${q.id}/${option.key}`);
      return {key:option.key, sequence:terms.join(',')};
    });
    assert.equal(new Set(sequences.map(row => row.sequence)).size, q.options.length);
    const matches = sequences.filter(row => row.sequence === expectedSequence);
    assert.equal(matches.length, 1, `V/F answer is not unique: ${q.id}`);
    assert.equal(matches[0].key, q.correct_answer, `V/F sequence disagrees with key: ${q.id}`);
    continue;
  }
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
