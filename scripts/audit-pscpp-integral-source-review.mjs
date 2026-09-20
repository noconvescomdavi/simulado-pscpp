import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const dir=path.join(root,'data','questions');
const out=path.join(root,'reports','pscpp-integral-source-review.json');
const subjects=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const legacy=new Set(['format-expansion-v1','pscpp-style-upgrade-v3','pscpp-deep-refine-v4','pscpp-deep-refine-v5','pscpp-refinement-v3','pscpp-repair-v3','pscpp-cleanup-v8','pscpp-bibliographic-v6','pscpp-focused-extension-v7']);
const badPhrases=[
  /problema-base/i,/caracteriza[cç][aã]o tecnicamente correta/i,/a refer[eê]ncia\s/i,
  /em rela[cç][aã]o a .{1,100}, considere a seguinte caracter[ií]stica/i,
  /a descri[cç][aã]o t[eé]cnica [“"]?a seguir/i,/no contexto de .{1,100}, a associa[cç][aã]o/i
];
const report={generated_at:new Date().toISOString(),subjects:{},totals:{questions:0,legacy:0,template_risk:0,answer_explanation_mismatch:0}};
for(const subject of subjects){
 const bank=JSON.parse(fs.readFileSync(path.join(dir,subject+'.json'),'utf8'));
 const rows=[]; let legacyCount=0,template=0,mismatch=0;
 for(const q of bank.questions||[]){
  const reasons=[];
  if(legacy.has(String(q?.provenance?.method||''))){reasons.push('LEGACY_COMPOSITION_PROVENANCE');legacyCount++;}
  if(badPhrases.some(re=>re.test(String(q.question||'')))){reasons.push('TEMPLATE_LANGUAGE');template++;}
  const ans=String(q.correct_answer||q.answer||'').toUpperCase();
  const m=String(q.explanation||'').match(/(?:alternativa|op[cç][aã]o)\s+([A-E])\b/i);
  if(m&&ans&&m[1].toUpperCase()!==ans){reasons.push('ANSWER_EXPLANATION_MISMATCH');mismatch++;}
  if(reasons.length)rows.push({id:q.id,reasons,provenance:q?.provenance?.method||null,source:q?.source||null});
 }
 report.subjects[subject]={questions:(bank.questions||[]).length,legacy:legacyCount,template_risk:template,answer_explanation_mismatch:mismatch,review_ids:rows};
 report.totals.questions+=(bank.questions||[]).length;report.totals.legacy+=legacyCount;report.totals.template_risk+=template;report.totals.answer_explanation_mismatch+=mismatch;
}
fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report.totals,null,2));
if(report.totals.answer_explanation_mismatch>0){
 console.error('Há inconsistências explícitas entre gabarito e explicação; revisão obrigatória.');
 process.exitCode=1;
}
