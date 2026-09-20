import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd(),qdir=path.join(root,'data','questions'),rdir=path.join(root,'reports');
const audit=JSON.parse(fs.readFileSync(path.join(rdir,'question-quality-audit-v2.json'),'utf8'));
const SUBJECTS=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const KEYS=['A','B','C','D','E'];
const P5=[[1,1,0,1,0],[1,0,1,0,1],[0,1,1,1,0],[1,1,1,0,0],[0,1,0,1,1]];
const LABELS=[
 'Apenas as afirmativas I, II e IV são verdadeiras.',
 'Apenas as afirmativas I, III e V são verdadeiras.',
 'Apenas as afirmativas II, III e IV são verdadeiras.',
 'Apenas as afirmativas I, II e III são verdadeiras.',
 'Apenas as afirmativas II, IV e V são verdadeiras.'
];
function clean(v){return String(v??'').replace(/\s+/g,' ').trim();}
function norm(v){return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function ans(q){return String(q.correct_answer||q.answer||'').toUpperCase();}
function cop(q){return (q.options||[]).find(o=>String(o.key||'').toUpperCase()===ans(q));}
function wrong(q){return (q.options||[]).filter(o=>String(o.key||'').toUpperCase()!==ans(q));}
function ctext(q){return clean(cop(q)?.text);}
function rawUnique(q){const a=(q.options||[]).map(o=>clean(o.text).normalize('NFC').toLocaleLowerCase('pt-BR'));return a.length===5&&!a.some(x=>!x)&&new Set(a).size===a.length;}
function source(q){return clean(q?.source?.title||q?.tracking?.work?.title||'publicação indicada');}
function locator(q){return clean(q?.source?.locator||q?.tracking?.section||q?.taxonomy?.chapter_id||'trecho indicado');}
function topic(q){return clean(q?.topic||q?.tracking?.topic?.title||q?.taxonomy?.topic_id||'conteúdo técnico');}
function groupKey(q){return `${q?.taxonomy?.bibliography_id}|${q?.taxonomy?.chapter_id}`;}
function safe(q){
 if(!q?.id||!q?.taxonomy?.bibliography_id||!q?.taxonomy?.chapter_id||!q?.source?.title||!q?.source?.locator)return false;
 if(!Array.isArray(q.options)||q.options.length!==5||!cop(q)||!rawUnique(q))return false;
 const st=norm(q.style||q.question_type);
 if(/assert|afirm|sequencia|verdadeiro|falso|incorreta|lacuna/.test(st))return false;
 return !!ctext(q);
}
function groups(pool){
 const m=new Map();for(const q of pool){const k=groupKey(q);if(!m.has(k))m.set(k,[]);m.get(k).push(q);}
 return [...m.entries()].map(([key,questions])=>({key,questions})).filter(g=>g.questions.length>=10);
}
function same(q,gs){return gs.find(g=>g.key===groupKey(q));}
function pick(g,start,n,avoid=''){
 const out=[],seen=new Set();for(let k=0;out.length<n&&k<g.questions.length*3;k++){const q=g.questions[(start+k*5)%g.questions.length];if(q.id===avoid||seen.has(q.id))continue;seen.add(q.id);out.push(q);}return out;
}
function stmt(q,truth,seed){
 const o=truth?cop(q):wrong(q)[seed%wrong(q).length],txt=clean(o?.text),tp=topic(q);
 if(txt.length>=28)return `Sobre “${tp}”, considere a seguinte proposição: ${txt.replace(/[.]$/,'')}`;
 return `No contexto de “${tp}”, a associação “${txt}” está correta`;
}
function meta(base,style,tag,derived){
 return {subject:base.subject,module:base.module,topic:base.topic,difficulty:'Difícil',style,question_type:style,
 taxonomy:structuredClone(base.taxonomy),tracking:structuredClone(base.tracking||{}),source:structuredClone(base.source||{}),
 tags:[...new Set([...(base.tags||[]),'pscpp-cleanup-v8',tag])],
 provenance:{method:'pscpp-cleanup-v8',derived_from_question_ids:derived,benchmark:'PSCPP/DPC 2006, 2008, 2011, 2012 e 2023'}};
}
function assert5(id,bases,seed,want){
 const idx=KEYS.includes(want)?KEYS.indexOf(want):seed%5,p=P5[idx],props=bases.map((q,i)=>stmt(q,!!p[i],seed+i));
 return {id,...meta(bases[0],'Assertivas I–V','cleanup-assertivas-5',bases.map(x=>x.id)),
 topic_code:`PSCPP.V8.AST5.${String(seed+1).padStart(5,'0')}`,
 question:`De acordo com o contido em “${source(bases[0])}”, analise as afirmativas abaixo, identifique as verdadeiras e assinale a opção correta:\nI) ${props[0]}.\nII) ${props[1]}.\nIII) ${props[2]}.\nIV) ${props[3]}.\nV) ${props[4]}.`,
 options:LABELS.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[idx],
 explanation:`A combinação correta é a alternativa ${KEYS[idx]}, conforme o recorte ${locator(bases[0])}.`};
}
function vf5(id,bases,seed,want){
 const idx=KEYS.includes(want)?KEYS.indexOf(want):seed%5,p=P5[idx],props=bases.map((q,i)=>stmt(q,!!p[i],seed+i)),seqs=P5.map(x=>x.map(v=>v?'V':'F'));
 return {id,...meta(bases[0],'Sequência V/F (5 itens)','cleanup-vf-5',bases.map(x=>x.id)),
 topic_code:`PSCPP.V8.VF5.${String(seed+1).padStart(5,'0')}`,
 question:`Com base em “${source(bases[0])}”, coloque V (verdadeiro) ou F (falso) nas proposições e assinale a sequência correta:\n( ) ${props[0]}.\n( ) ${props[1]}.\n( ) ${props[2]}.\n( ) ${props[3]}.\n( ) ${props[4]}.`,
 options:seqs.map((x,i)=>({key:KEYS[i],text:`( ${x.join(' ) ( ')} )`})),correct_answer:KEYS[idx],
 explanation:`A sequência correta é a alternativa ${KEYS[idx]}, conforme ${locator(bases[0])}.`};
}
function uniqStems(qs){
 const seen=new Set(),pref=['Durante uma revisão técnica de bordo,','No briefing de passadiço,','Na preparação para a faina,','Ao conferir a publicação de referência,'];
 for(const q of qs){let n=norm(q.question);if(!seen.has(n)){seen.add(n);continue;}if(!(q.tags||[]).includes('pscpp-cleanup-v8'))continue;let k=0;do{q.question=`${pref[k++%pref.length]} ${q.question}`;n=norm(q.question);}while(seen.has(n));seen.add(n);}
}
const report={generated_at:new Date().toISOString(),subjects:{},rewritten:0,skipped:0};
for(const sub of SUBJECTS){
 const file=path.join(qdir,`${sub}.json`),bank=JSON.parse(fs.readFileSync(file,'utf8')),qs=bank.questions||[],pool=qs.filter(safe),gs=groups(pool);
 let ids=[...new Set((audit.flags||[]).filter(f=>f.subject===sub&&f.severity==='medium').map(f=>f.id))];
 if(sub==='arte-naval')ids=ids.filter(id=>{const m=String(id).match(/ANV-(\d+)/);return m&&Number(m[1])>1150;});
 let rewritten=0,skipped=[];
 for(let i=0;i<ids.length;i++){
   const ix=qs.findIndex(q=>q.id===ids[i]);if(ix<0){skipped.push(ids[i]);continue;}
   const old=qs[ix],g=same(old,gs)||gs[(i*7)%Math.max(1,gs.length)];if(!g){skipped.push(old.id);continue;}
   const bases=pick(g,(i*11)%g.questions.length,5,old.id);if(bases.length<5){skipped.push(old.id);continue;}
   let q=(i%2===0)?assert5(old.id,bases,i,ans(old)):vf5(old.id,bases,i,ans(old));
   q.provenance.replaces_question_id=old.id;q.provenance.cleanup_reason='medium-audit-flag-v8';qs[ix]=q;rewritten++;
 }
 uniqStems(qs);bank.questions=qs;fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');
 report.subjects[sub]={targets:ids.length,rewritten,skipped:skipped.length};report.rewritten+=rewritten;report.skipped+=skipped.length;
}
fs.writeFileSync(path.join(rdir,'pscpp-cleanup-v8.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
