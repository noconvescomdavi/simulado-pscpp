import fs from 'node:fs';
import path from 'node:path';
import { isQuestionActive, questionQualityState, UNSAFE_PROVENANCE } from '../lib/question-quality-policy.js';

const root=process.cwd();
const dir=path.join(root,'data','questions');
const out=path.join(root,'reports','pscpp-integral-source-review.json');
const subjects=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const badPhrases=[
  /problema-base/i,/caracteriza[cç][aã]o tecnicamente correta/i,
  /em rela[cç][aã]o a .{1,100}, considere a seguinte caracter[ií]stica/i,
  /a descri[cç][aã]o t[eé]cnica [“"]?a seguir/i,/no contexto de .{1,100}, a associa[cç][aã]o/i
];
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
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.totals,null,2));
if(report.totals.answer_explanation_mismatch>0 || report.totals.active_unsafe>0){
 console.error('Gate integral falhou: há inconsistência explícita ou item inseguro ainda ativo.');
 process.exitCode=1;
}
