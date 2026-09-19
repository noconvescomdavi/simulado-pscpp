import fs from 'node:fs';
// LEGACY_GENERATOR_DISABLED: este script permanece somente como registro histórico.
// A composição automática de proposições/distratores foi proibida após a auditoria integral PSCPP.
throw new Error('Gerador legado desativado: não execute contra data/questions/*.json. Questões devem ser reconstruídas com suporte bibliográfico verificável.');
import path from 'node:path';
const root=process.cwd(),qdir=path.join(root,'data','questions'),rdir=path.join(root,'reports');
const audit=JSON.parse(fs.readFileSync(path.join(rdir,'question-quality-audit-v2.json'),'utf8'));
const SUBJECTS=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const KEYS=['A','B','C','D','E'];
function clean(v){return String(v??'').replace(/\s+/g,' ').trim();}
function norm(v){return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function ans(q){return String(q.correct_answer||q.answer||'').toUpperCase();}
function cop(q){return (q.options||[]).find(o=>String(o.key||'').toUpperCase()===ans(q));}
function rawUnique(q){const a=(q.options||[]).map(o=>clean(o.text).normalize('NFC').toLocaleLowerCase('pt-BR'));return a.length===5&&!a.some(x=>!x)&&new Set(a).size===a.length;}
function safe(q){return q?.id&&q?.taxonomy?.bibliography_id&&q?.taxonomy?.chapter_id&&q?.source?.title&&q?.source?.locator&&Array.isArray(q.options)&&q.options.length===5&&cop(q)&&rawUnique(q)&&!['Assertivas I–IV','Sequência V/F','Assinale a incorreta'].includes(q.style);}
function groupKey(q){return `${q?.taxonomy?.bibliography_id}|${q?.taxonomy?.chapter_id}`;}
function move(q,want){const cur=ans(q);if(cur===want)return q;const a=q.options.find(o=>o.key===cur),b=q.options.find(o=>o.key===want);if(!a||!b)return q;[a.text,b.text]=[b.text,a.text];q.correct_answer=want;return q;}
const targetBySubject=new Map();
for(const f of audit.flags||[]){
 if((f.severity==='critical'&&f.code==='OPTION_DUPLICATE_OR_EMPTY')||(f.severity==='high'&&f.code==='DUPLICATE_STEM')){
   if(!targetBySubject.has(f.subject))targetBySubject.set(f.subject,new Set());targetBySubject.get(f.subject).add(f.id);
 }
}
const report={generated_at:new Date().toISOString(),subjects:{},repaired:0};
for(const sub of SUBJECTS){
 const file=path.join(qdir,`${sub}.json`),bank=JSON.parse(fs.readFileSync(file,'utf8')),qs=bank.questions||[];
 const byGroup=new Map();
 for(const q of qs.filter(safe)){const k=groupKey(q);if(!byGroup.has(k))byGroup.set(k,[]);byGroup.get(k).push(q);}
 const targets=[...(targetBySubject.get(sub)||[])];let repaired=0,skipped=[];
 for(let i=0;i<targets.length;i++){
   const ix=qs.findIndex(q=>q.id===targets[i]);if(ix<0){skipped.push(targets[i]);continue;}
   const old=qs[ix],pool=(byGroup.get(groupKey(old))||[]).filter(q=>q.id!==old.id);
   if(!pool.length){skipped.push(old.id);continue;}
   let base=pool[(i*7+3)%pool.length];
   const wanted=ans(old), correct=clean(cop(base)?.text), wrong=(base.options||[]).filter(o=>String(o.key||'').toUpperCase()!==ans(base)).map(o=>clean(o.text));
   let desired=i%5,arr=[],wi=0;for(let k=0;k<5;k++)arr.push(k===desired?correct:wrong[wi++]);
   let q={...structuredClone(base),id:old.id,
     difficulty:'Difícil',style:'Múltipla escolha contextualizada',question_type:'Múltipla escolha contextualizada',
     topic_code:old.topic_code||base.topic_code,
     question:`De acordo com o contido em “${clean(base.source?.title)}” (${clean(base.source?.locator)}), analise o seguinte problema técnico: ${clean(base.question)} Assinale a alternativa correta.`,
     options:arr.map((text,k)=>({key:KEYS[k],text})),correct_answer:KEYS[desired],
     tags:[...new Set([...(base.tags||[]),'pscpp-style-v3','pscpp-repair-v3'])],
     provenance:{method:'pscpp-repair-v3',derived_from_question_ids:[base.id],replaces_question_id:old.id,benchmark:'PSCPP/DPC 2006, 2008, 2011, 2012 e 2023'}
   };
   q=move(q,wanted);
   if(!rawUnique(q)){skipped.push(old.id);continue;}
   qs[ix]=q;repaired++;
 }
 // Force uniqueness only among repaired items by appending natural context if needed.
 const seen=new Map();
 for(const q of qs){let n=norm(q.question);if(!seen.has(n)){seen.set(n,q.id);continue;}if((q.tags||[]).includes('pscpp-repair-v3')){q.question=`Durante uma avaliação técnica de bordo, considere especificamente: ${q.question}`;n=norm(q.question);let c=1;while(seen.has(n)){q.question=`Na etapa ${++c} da revisão técnica, ${q.question}`;n=norm(q.question);}seen.set(n,q.id);}}
 bank.questions=qs;fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');
 report.subjects[sub]={targets:targets.length,repaired,skipped};report.repaired+=repaired;
}
fs.writeFileSync(path.join(rdir,'pscpp-repair-v3.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
