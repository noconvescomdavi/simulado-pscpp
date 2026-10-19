import fs from 'node:fs';
import { gunzipSync } from 'node:zlib';

// Release evidence only: rule-based triage and legacy validation flags do not
// count as a bibliographic review. A changed effective hash invalidates review.
const dir = 'docs/auditoria-pscpp';
const readLines = text => text.split('\n').filter(s => s.trim()).map(s => JSON.parse(s));
const runtime = readLines(gunzipSync(fs.readFileSync(`${dir}/INVENTARIO_RUNTIME.jsonl.gz`)).toString());
const ledgerPath = `${dir}/REVISOES_EDITORIAIS.jsonl`;
const ledger = fs.existsSync(ledgerPath) ? readLines(fs.readFileSync(ledgerPath,'utf8')) : [];
const key = row => `${row.consumer}::${row.id}::${row.hash}`;
const reviews = new Map();
const errors = [];
for (const review of ledger) {
  if (reviews.has(key(review))) errors.push({id:review.id,code:'DUPLICATE_REVIEW'});
  reviews.set(key(review),review);
}
let accepted = 0;
for (const row of runtime) {
  const review = reviews.get(key(row));
  const missing = [];
  if (!review) missing.push('individual_review');
  else {
    for (const field of ['reviewer','reviewed_at','concept','format','cognitive_level','verdict','rationale']) if (!review[field]) missing.push(field);
    if (review.verdict !== 'approved') missing.push('approved_verdict');
    if (!['A','B','C','D','E'].includes(review.format)) missing.push('valid_format');
    if (!['L1','L2','L3','L4'].includes(review.cognitive_level)) missing.push('valid_cognitive_level');
    const sources = review.primary_sources;
    if (!Array.isArray(sources) || !sources.length || sources.some(s => !s.title || !s.edition || !s.locator || !/^[a-f0-9]{64}$/.test(s.sha256 || '') || !s.supports_answer)) missing.push('primary_source_evidence');
    if (['A','B','C','D','E'].some(letter => !review.alternative_rationales?.[letter])) missing.push('five_alternative_rationales');
    if (review.unique_answer_verified !== true) missing.push('unique_answer_verification');
    if (review.program_alignment_verified !== true) missing.push('program_alignment');
    if (review.independent_recheck !== true) missing.push('independent_recheck');
  }
  if (missing.length) errors.push({consumer:row.consumer,id:row.id,hash:row.hash,missing});
  else accepted++;
}
const result = {scope:'Effective occurrences by consumer, stable ID and content hash',runtime_occurrences:runtime.length,
  accepted_occurrences:accepted,pending_or_invalid_occurrences:runtime.length-accepted,
  editorial_gate_passed:errors.length===0,merge_permitted:false,
  note:'This checks evidence completeness, not truth of evidence; all other release gates still apply.',findings:errors};
fs.writeFileSync(`${dir}/GATE_EVIDENCIAS.json`,JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,findings:undefined},null,2));
if (errors.length) process.exitCode=2;
