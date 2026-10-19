import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { collectActiveQuestionBanks } from '../lib/question-banks-source.js';
import { collectActivePscppQuestions } from '../lib/pscpp-exam-source.js';
import { questionQualityState } from '../lib/question-quality-policy.js';
import { classifyQuestionStructure } from '../lib/question-structure.js';
import { historicalSubject } from '../lib/historical-exam-blueprint.js';
import { isPscppEditoriallyEligible } from '../lib/pscpp-exam-selection.js';
import { gzipSync } from 'node:zlib';

// Read-only inventory of source records AND effective pipelines. Heuristic
// findings never confer editorial or bibliographic approval.
const out = 'docs/auditoria-pscpp';
fs.mkdirSync(out, { recursive: true });
const sha = value => crypto.createHash('sha256').update(value).digest('hex');
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  return value;
}
const canonical = value => JSON.stringify(stable(value));
const norm = value => String(value ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
function* records(value, pointer = '') {
  if (!value || typeof value !== 'object') return;
  if (!Array.isArray(value) && (typeof value.question === 'string' || typeof value.stem === 'string') && ('id' in value || Array.isArray(value.options) || 'correct_answer' in value)) {
    yield { question: value, pointer }; return;
  }
  for (const [key, child] of Object.entries(value)) yield* records(child, `${pointer}/${key.replaceAll('~','~0').replaceAll('/','~1')}`);
}
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' }).split('\0').filter(Boolean).sort();
const moduleFiles = tracked.filter(f => /\.(?:[cm]?js|jsx|tsx?|json)$/.test(f));
const moduleSet = new Set(moduleFiles);
const graph = new Map();
for (const file of moduleFiles.filter(f => !f.endsWith('.json'))) {
  const text = fs.readFileSync(file, 'utf8');
  const dependencies = [];
  const re = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*|\brequire\s*\(\s*)["'](\.[^"']+)["']/g;
  for (const m of text.matchAll(re)) {
    const base = path.posix.normalize(path.posix.join(path.posix.dirname(file), m[1]));
    const target = [base, `${base}.js`, `${base}.json`, `${base}/index.js`].find(p => moduleSet.has(p));
    if (target) dependencies.push(target);
  }
  graph.set(file, [...new Set(dependencies)].sort());
}
function closure(root) {
  const found = new Set(); const queue = [root];
  while (queue.length) { const item = queue.pop(); if (found.has(item)) continue; found.add(item); queue.push(...(graph.get(item) || [])); }
  return found;
}
const notebookDeps = closure('lib/question-banks-source.js');
const examDeps = closure('lib/pscpp-exam-source.js');
const officialDeps = closure('lib/official-exam-bank.js');
const runtime = [];
for (const [subject, bank] of Object.entries(collectActiveQuestionBanks())) for (const q of bank.questions || []) runtime.push({ consumer: 'cadernos', subject, q });
for (const q of collectActivePscppQuestions()) runtime.push({ consumer: 'simulado_pscpp', subject: historicalSubject(q), q });
const effectiveById = new Map();
for (const row of runtime) { const id = String(row.q.id ?? ''); const values = effectiveById.get(id) || []; values.push(row); effectiveById.set(id, values); }
const byId = new Map();
for (const file of tracked.filter(f => f.endsWith('.json'))) {
  if (!file.startsWith('data/') && !file.startsWith('scripts/fixtures/')) continue;
  let data; try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { continue; }
  for (const { question: q, pointer } of records(data)) {
    const id = String(q.id ?? '');
    const list = byId.get(id) || []; list.push({ file, pointer, q }); byId.set(id, list);
  }
}
const full = []; const manifest = [];
for (const file of tracked.filter(f => f.endsWith('.json'))) {
  if (!file.startsWith('data/') && !file.startsWith('scripts/fixtures/')) continue;
  const bytes = fs.readFileSync(file); let data;
  try { data = JSON.parse(bytes); } catch { continue; }
  const qs = [...records(data)];
  manifest.push({ file, bytes: bytes.length, sha256: sha(bytes), records: qs.length,
    notebook_dependency: notebookDeps.has(file), exam_dependency: examDeps.has(file), official_dependency: officialDeps.has(file),
    classification: file.startsWith('scripts/fixtures/') ? 'test_fixture' : (notebookDeps.has(file) || examDeps.has(file) || officialDeps.has(file)) ? 'pipeline_dependency' : 'not_statically_linked' });
  for (const { question: q, pointer } of qs) {
    const id = String(q.id ?? ''); const copies = byId.get(id) || [];
    const consumers = effectiveById.get(id) || [];
    const isHistorical = q.origin === 'official_exam' || q.pscpp_origin === 'official_exam' || file.endsWith('/official-exams.json');
    const state = questionQualityState(q);
    full.push({ record_key: `${file}#${pointer}`, id, file, pointer,
      source_role: file.startsWith('scripts/fixtures/') ? 'test_fixture' : 'bank_source',
      record_kind: Array.isArray(q.options) ? 'question' : 'partial_editorial_patch',
      dependency_cadernos: notebookDeps.has(file), dependency_simulado: examDeps.has(file),
      category: q.source_subject || q.taxonomy?.subject_slug || data.subject || q.subject || '',
      bibliography_id: q.taxonomy?.bibliography_id || '', source: q.source ?? null, tracking: q.tracking ?? null,
      chapter: q.taxonomy?.chapter || q.chapter || '', topic: q.topic || '',
      historical_exam: isHistorical, raw_active: q.active ?? null, raw_status: q.validation_status || q.status || '',
      automatic_policy_active: state.active, automatic_policy_reason: state.reason,
      runtime_consumers_for_id: [...new Set(consumers.map(c => c.consumer))],
      exact_runtime_matches: consumers.filter(c => canonical(c.q) === canonical(q)).map(c => c.consumer),
      copies_of_id: copies.length, distinct_hashes_for_id: new Set(copies.map(c => sha(canonical(c.q)))).size,
      automatic_structure: classifyQuestionStructure(q).type,
      editorial_status: 'pending_individual_review', bibliographic_status: 'pending_primary_source_check',
      normalized_stem: norm(q.question || q.stem), options_count: q.options?.length ?? null,
      answer: q.correct_answer || q.answer || '', explanation: q.explanation || '',
      hash_before: sha(canonical(q)), hash_after: sha(canonical(q)), question: q });
  }
}
const physicalById = Object.fromEntries([...byId].map(([id, list]) => [id, list.map(c => ({ file:c.file, pointer:c.pointer, hash:sha(canonical(c.q)) }))]));
const effective = runtime.map(({ consumer, subject, q }) => ({ consumer, subject, id:q.id,
  selection_eligible:consumer === 'simulado_pscpp' ? isPscppEditoriallyEligible(q) : null,
  hash:sha(canonical(q)), source_records:physicalById[String(q.id)] || [],
  historical_exam:q.origin === 'official_exam' || q.pscpp_origin === 'official_exam',
  automatic_structure:classifyQuestionStructure(q).type,
  editorial_status:'pending_individual_review', bibliographic_status:'pending_primary_source_check', question:q }));
const countBy = (rows, fn) => { const o={}; for(const r of rows){const k=String(fn(r));o[k]=(o[k]||0)+1;}return o; };
const bankSources = full.filter(r => r.source_role === 'bank_source');
const summary = {
  baseline_sha:execFileSync('git',['merge-base','HEAD','origin/main'],{encoding:'utf8'}).trim(),
  scope:'Tracked data JSON and fixtures; effective source pipelines; live SQL/offline/production reconciliation still pending.',
  json_files:manifest.length, question_files:manifest.filter(r=>r.records>0).length,
  physical_records:full.length, bank_source_records:bankSources.length, fixture_records:full.length-bankSources.length,
  partial_editorial_patches:full.filter(r=>r.record_kind==='partial_editorial_patch').length,
  unique_bank_ids:new Set(bankSources.map(r=>r.id)).size,
  runtime_occurrences:effective.length, runtime_unique_ids:new Set(effective.map(r=>r.id)).size,
  runtime_by_consumer:countBy(effective,r=>r.consumer), runtime_by_subject:countBy(effective,r=>`${r.consumer}/${r.subject}`),
  runtime_historical:countBy(effective,r=>`${r.consumer}/${r.historical_exam?'historical':'authorial'}`),
  runtime_selection_excluded:effective.filter(r=>r.selection_eligible===false).length,
  physical_by_directory:countBy(full,r=>r.file.split('/').slice(0,2).join('/')),
  active_ids_without_physical_source:[...new Set(effective.filter(r=>!r.source_records.length).map(r=>r.id))],
  same_id_multiple_versions:[...byId].filter(([,v])=>new Set(v.map(r=>sha(canonical(r.q)))).size>1).length,
  reviewed_individually:0, verified_primary_source:0,
  gates:Object.fromEntries(Array.from({length:8},(_,i)=>[`gate_${i+1}`,'pending'])), merge_permitted:false
};
const write = (name, value) => fs.writeFileSync(`${out}/${name}`, typeof value === 'string' ? value : JSON.stringify(value,null,2)+'\n');
write('MANIFESTO_ARQUIVOS.json',manifest);
write('DEPENDENCIAS_RUNTIME.json',Object.fromEntries(graph));
fs.writeFileSync(`${out}/INVENTARIO_BANCO.jsonl.gz`, gzipSync(full.map(r=>JSON.stringify(r)).join('\n')+'\n'));
fs.writeFileSync(`${out}/INVENTARIO_RUNTIME.jsonl.gz`, gzipSync(effective.map(r=>JSON.stringify(r)).join('\n')+'\n'));
write('RESUMO_INVENTARIO.json',summary);
const cols=['record_key','id','file','category','bibliography_id','chapter','topic','historical_exam','raw_active','raw_status','automatic_policy_active','automatic_policy_reason','copies_of_id','distinct_hashes_for_id','automatic_structure','options_count','answer','hash_before','hash_after','editorial_status','bibliographic_status','normalized_stem'];
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
const csvInventory='\uFEFF'+[cols.join(','),...full.map(r=>cols.map(c=>csv(r[c])).join(','))].join('\n')+'\n';
write('INVENTARIO_BANCO.csv',csvInventory);
fs.writeFileSync(`${out}/INVENTARIO_BANCO.csv.gz`,gzipSync(csvInventory));
console.log(JSON.stringify(summary,null,2));
