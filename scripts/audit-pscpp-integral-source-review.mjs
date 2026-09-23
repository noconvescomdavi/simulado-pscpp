import fs from 'node:fs';
import path from 'node:path';
import { isQuestionActive, questionQualityState, UNSAFE_PROVENANCE } from '../lib/question-quality-policy.js';

const root=process.cwd();
const dir=path.join(root,'data','questions');
const pscppDir=path.join(root,'data','pscpp');
const out=path.join(root,'reports','pscpp-integral-source-review.json');
fs.mkdirSync(path.dirname(out),{recursive:true});
const subjects=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const badPhrases=[
  /problema-base/i,/caracteriza[cç][aã]o tecnicamente correta/i,
  /em rela[cç][aã]o a .{1,100}, considere a seguinte caracter[ií]stica/i,
  /a descri[cç][aã]o t[eé]cnica [“"]?a seguir/i,/no contexto de .{1,100}, a associa[cç][aã]o/i
];
const pscppSources=[
 ['official-exams',path.join(pscppDir,'official-exams.json')],
 ['generated-questions',path.join(pscppDir,'generated-questions.json')],
 ['arte-naval-cap1',path.join(pscppDir,'arte-naval-cap1-552.json')],
 ['arte-naval-cap23',path.join(pscppDir,'arte-naval-cap2-cap3-459.json')],
 ['arte-naval-cap8',path.join(pscppDir,'arte-naval-cap8-504.json')],
 ...Array.from({length:50},(_,i)=>['generated-batch-'+String(i+11).padStart(3,'0'),path.join(pscppDir,'generated-batches','batch_'+String(i+11).padStart(3,'0')+'.json')]),
 ...Array.from({length:20},(_,i)=>['approved-drive-block-'+String(i+1).padStart(3,'0'),path.join(pscppDir,'approved-drive-blocks','block_'+String(i+1).padStart(3,'0')+'.json')])
];
const structuralIssues=q=>{
 const stem=String(q.question||''); const assertions=Array.isArray(q.assertions)?q.assertions:[]; const options=Array.isArray(q.options)?q.options:[];
 const blob=options.map(o=>String(typeof o==='string'?o:o?.text||'')).join(' ');
 const issues=[];
 const inlineAssertionLabels=[...stem.matchAll(/(?:^|\n|\s)(I{1,3}|IV|V)\s*[).:-]/g)].map(m=>m[1]);
 const assertionCount=Math.max(assertions.length,new Set(inlineAssertionLabels).size);
 if((/analis[ea].*(afirmativ|assertiv)|identifique.*(?:verdadeir|fals)|julgue.*(?:item|afirmativ)/i.test(stem)||/(?:apenas|todas).*(?:\bI\b|\bII\b|\bIII\b|afirmativ|assertiv)/i.test(blob))&&assertionCount<2)issues.push('MISSING_ASSERTIONS');
 if(/<\s*PARSED TEXT FOR PAGE|PARSED TEXT FOR PAGE|\[object Object\]/i.test(stem+' '+blob))issues.push('PARSING_ARTIFACT');
 if(/\bcorrelacione\b/i.test(stem)&&!/(?:\n|Coluna\s+I|1\))/i.test(stem))issues.push('MALFORMED_CORRELATION');
 if(options.length!==5)issues.push('OPTION_COUNT_'+options.length);
 const texts=options.map(o=>String(typeof o==='string'?o:o?.text||'').trim());
 const normalized=texts.map(t=>t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim());
 if(new Set(normalized).size!==normalized.length)issues.push('DUPLICATE_OPTIONS');
 const generic=/acerca de\s+(?:generalidades|introdu[cç][aã]o|conceitos?|disposi[cç][oõ]es?|aspectos gerais)\b/i.test(stem)&&/assinale a alternativa/i.test(stem);
 if(generic)issues.push('GENERIC_OR_UNDEFINED_OBJECT');
 const wordset=t=>new Set(t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9 ]/g,' ').split(/\s+/).filter(w=>w.length>=4));
 const sim=(a,b)=>{const A=wordset(a),B=wordset(b);if(!A.size||!B.size)return 0;let n=0;for(const w of A)if(B.has(w))n++;return n/Math.min(A.size,B.size)};
 const answer=String(q.correct_answer||q.answer||'').trim().toUpperCase(); const ci=/^[A-E]$/.test(answer)?answer.charCodeAt(0)-65:-1;
 if(ci>=0&&texts[ci]){const ss=texts.map(t=>sim(stem,t));const order=[...ss].sort((a,b)=>b-a);if(ss[ci]===order[0]&&order[0]-Number(order[1]||0)>=.28)issues.push('ANSWER_LEAK_OR_SIMILARITY_CUE');
 const cross=texts.map((t,i)=>i===ci?1:sim(texts[ci],t));if(cross.filter((v,i)=>i!==ci&&v<.08).length>=3)issues.push('WEAK_OR_HETEROGENEOUS_DISTRACTORS');
 const lens=texts.map(t=>wordset(t).size).sort((a,b)=>a-b),median=lens[Math.floor(lens.length/2)]||1;if(wordset(texts[ci]).size>Math.max(median*1.8,median+10))issues.push('ANSWER_LENGTH_CUE');}
 const roman=inlineAssertionLabels;if(roman.length>=2&&new Set(roman).size!==roman.length)issues.push('ASSERTION_NUMBERING_FORMAT');
 if(roman.length>=2&&!/[\n\r]/.test(stem))issues.push('ASSERTIONS_FLATTENED_IN_STEM');
 return issues;
};
const report={generated_at:new Date().toISOString(),subjects:{},totals:{questions:0,active:0,quarantined:0,legacy:0,template_risk:0,answer_explanation_mismatch:0,active_unsafe:0}};
for(const subject of subjects){
 const bank=JSON.parse(fs.readFileSync(path.join(dir,subject+'.json'),'utf8'));
 const rows=[]; let active=0,quarantined=0,legacyCount=0,template=0,mismatch=0,activeUnsafe=0;
 for(const q of bank.questions||[]){
  const reasons=[]; const method=String(q?.provenance?.method||''); const isActive=isQuestionActive(q);
  if(isActive) active++; else quarantined++;
  if(UNSAFE_PROVENANCE.has(method)){reasons.push('LEGACY_COMPOSITION_PROVENANCE');legacyCount++;}
  if(badPhrases.some(re=>re.test(String(q.question||'')))){reasons.push('TEMPLATE_LANGUAGE');template++;}
  const ans=String(q.correct_answer||q.answer||'').toUpperCase();
  const m=String(q.explanation||'').match(/(?:alternativa|op[cç][aã]o)\s+([A-E])\b/i);
  if(m&&ans&&m[1].toUpperCase()!==ans){reasons.push('ANSWER_EXPLANATION_MISMATCH');mismatch++;}
  if(isActive && reasons.length){activeUnsafe++; reasons.push('ACTIVE_UNSAFE');}
  if(reasons.length||!isActive)rows.push({id:q.id,active:isActive,quality_state:questionQualityState(q),reasons,provenance:method||null,source:q?.source||null});
 }
 report.subjects[subject]={questions:(bank.questions||[]).length,active,quarantined,legacy:legacyCount,template_risk:template,answer_explanation_mismatch:mismatch,active_unsafe:activeUnsafe,review_ids:rows};
 for(const [k,v] of Object.entries({questions:(bank.questions||[]).length,active,quarantined,legacy:legacyCount,template_risk:template,answer_explanation_mismatch:mismatch,active_unsafe:activeUnsafe})) report.totals[k]+=v;
}
report.pscpp_runtime_sources={}; report.totals.runtime_questions=0; report.totals.runtime_structural_issues=0; report.totals.runtime_active_structural_issues=0; report.totals.runtime_inactive=0;
for(const [name,file] of pscppSources){
 if(!fs.existsSync(file))continue;
 const bank=JSON.parse(fs.readFileSync(file,'utf8')); const rows=[];
 for(const q of bank.questions||[]){const issues=structuralIssues(q);const quality=questionQualityState(q);const state={...quality,active:quality.active&&issues.length===0,reason:!quality.active?quality.reason:(issues.length?"runtime-structural-quarantine":null)};report.totals.runtime_questions++;if(!state.active)report.totals.runtime_inactive++;if(issues.length){report.totals.runtime_structural_issues+=issues.length;if(state.active)report.totals.runtime_active_structural_issues+=issues.length;rows.push({id:q.id,issues,state});}}
 report.pscpp_runtime_sources[name]={questions:(bank.questions||[]).length,flagged:rows.length,review_ids:rows};
}
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.totals,null,2));
if(report.totals.active_unsafe>0 || report.totals.runtime_active_structural_issues>0){
 console.error('Gate integral falhou: há item inseguro ainda ativo. Inconsistências já quarentenadas permanecem no relatório para reconstrução rastreável.');
 process.exitCode=1;
}
