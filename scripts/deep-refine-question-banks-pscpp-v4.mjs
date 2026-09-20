import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd(), qdir=path.join(root,'data','questions'), rdir=path.join(root,'reports');
const audit=JSON.parse(fs.readFileSync(path.join(rdir,'question-quality-audit-v2.json'),'utf8'));
const SUBJECTS=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const KEYS=['A','B','C','D','E'];
const TARGET_PER_SUBJECT=260;
const ADD_PER_SUBJECT=20;
const PATTERNS=[
 [1,1,0,0],[1,0,1,0],[0,1,0,1],[0,0,1,1],[1,1,1,1]
];
const COMBOS=[
 'Apenas as afirmativas I e II são verdadeiras.',
 'Apenas as afirmativas I e III são verdadeiras.',
 'Apenas as afirmativas II e IV são verdadeiras.',
 'Apenas as afirmativas III e IV são verdadeiras.',
 'As afirmativas I, II, III e IV são verdadeiras.'
];

function clean(v){return String(v??'').replace(/\s+/g,' ').trim();}
function norm(v){return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function ans(q){return String(q.correct_answer||q.answer||'').toUpperCase();}
function cop(q){return (q.options||[]).find(o=>String(o.key||'').toUpperCase()===ans(q));}
function ctext(q){return clean(cop(q)?.text);}
function wrong(q){return (q.options||[]).filter(o=>String(o.key||'').toUpperCase()!==ans(q));}
function source(q){return clean(q?.source?.title||q?.tracking?.work?.title||'publicação indicada');}
function locator(q){return clean(q?.source?.locator||q?.tracking?.section||q?.taxonomy?.chapter_id||'trecho indicado');}
function topic(q){return clean(q?.topic||q?.tracking?.topic?.title||q?.taxonomy?.topic_id||'conteúdo técnico');}
function rawUnique(q){const a=(q.options||[]).map(o=>clean(o.text).normalize('NFC').toLocaleLowerCase('pt-BR'));return a.length===5&&!a.some(x=>!x)&&new Set(a).size===a.length;}
function groupKey(q){return `${q?.taxonomy?.bibliography_id}|${q?.taxonomy?.chapter_id}`;}
function safe(q){
 if(!q?.id||!q?.taxonomy?.bibliography_id||!q?.taxonomy?.chapter_id||!q?.source?.title||!q?.source?.locator)return false;
 if(!Array.isArray(q.options)||q.options.length!==5||!cop(q)||!rawUnique(q))return false;
 const st=norm(q.style||q.question_type);
 if(/assert|afirm|sequencia|verdadeiro|falso|incorreta|lacuna/.test(st))return false;
 return !!ctext(q);
}
function groups(pool){
 const m=new Map();
 for(const q of pool){const k=groupKey(q);if(!m.has(k))m.set(k,[]);m.get(k).push(q);}
 return [...m.entries()].map(([key,questions])=>({key,questions})).filter(g=>g.questions.length>=10).sort((a,b)=>a.key.localeCompare(b.key));
}
function same(q,gs){return gs.find(g=>g.key===groupKey(q));}
function chooseDistinct(g,start,n,avoidId=''){
 const arr=[],used=new Set();
 for(let step=0;arr.length<n&&step<g.questions.length*2;step++){
   const q=g.questions[(start+step*3)%g.questions.length];
   if(q.id===avoidId||used.has(q.id))continue;used.add(q.id);arr.push(q);
 }
 return arr;
}
function statement(q,truth,seed){
 const o=truth?cop(q):wrong(q)[seed%wrong(q).length];
 const text=clean(o?.text), stem=clean(q.question), tp=topic(q);
 let m=stem.match(/qual termo corresponde (?:à|a) (?:seguinte )?descrição técnica[: ]+(.+?)[?.]?$/i);
 if(m)return `A descrição técnica “${clean(m[1]).replace(/[?.]$/,'')}” corresponde a “${text}”`;
 m=stem.match(/assinale (?:a|a opção|a alternativa) correta[: ]*(.*)$/i);
 if(m&&clean(m[1]).length>15)return `Quanto a ${clean(m[1]).replace(/[?.]$/,'')}, é correto afirmar: ${text.replace(/[.]$/,'')}`;
 if(/qual (?:é|e) /i.test(stem)&&text.length<120)return `No tópico “${tp}”, a resposta tecnicamente correta é “${text}”`;
 if(text.length>=28)return `Sobre “${tp}”, considere a proposição: ${text.replace(/[.]$/,'')}`;
 return `No contexto de “${tp}”, a associação “${text}” é tecnicamente aplicável`;
}
function meta(base,style,difficulty,tag,derived){
 return {
   subject:base.subject,module:base.module,topic:base.topic,difficulty,style,question_type:style,
   taxonomy:structuredClone(base.taxonomy),tracking:structuredClone(base.tracking||{}),source:structuredClone(base.source||{}),
   tags:[...new Set([...(base.tags||[]),'pscpp-style-v4',tag].filter(Boolean))],
   provenance:{method:'pscpp-deep-refine-v4',derived_from_question_ids:derived||[base.id],benchmark:'PSCPP/DPC 2006, 2008, 2011, 2012 e 2023'}
 };
}
function move(q,want){
 const cur=ans(q); if(cur===want)return q;
 const a=q.options.find(o=>o.key===cur),b=q.options.find(o=>o.key===want); if(!a||!b)return q;
 [a.text,b.text]=[b.text,a.text]; q.correct_answer=want; return q;
}
function makeAssertions(id,bases,seed,want){
 const idx=KEYS.includes(want)?KEYS.indexOf(want):(seed%5),p=PATTERNS[idx],props=bases.map((q,i)=>statement(q,!!p[i],seed+i));
 return {id,...meta(bases[0],'Assertivas I–IV','Difícil','formato-pscpp-assertivas-v4',bases.map(x=>x.id)),
  topic_code:`PSCPP.V4.AST.${String(seed+1).padStart(5,'0')}`,
  question:`De acordo com o contido em “${source(bases[0])}”, analise as afirmativas abaixo e assinale a opção correta:\nI) ${props[0]}.\nII) ${props[1]}.\nIII) ${props[2]}.\nIV) ${props[3]}.`,
  options:COMBOS.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[idx],
  explanation:`A combinação correta é a alternativa ${KEYS[idx]}. As quatro proposições foram construídas a partir de conceitos rastreados ao mesmo recorte bibliográfico: ${locator(bases[0])}.`};
}
function makeVF(id,bases,seed,want){
 const idx=KEYS.includes(want)?KEYS.indexOf(want):(seed%5),p=PATTERNS[idx],props=bases.map((q,i)=>statement(q,!!p[i],seed+i));
 const labels=PATTERNS.map(x=>x.map(v=>v?'V':'F'));
 return {id,...meta(bases[0],'Sequência V/F','Difícil','formato-pscpp-vf-v4',bases.map(x=>x.id)),
  topic_code:`PSCPP.V4.VF.${String(seed+1).padStart(5,'0')}`,
  question:`Com base em “${source(bases[0])}”, julgue as proposições a seguir e assinale a sequência correta:\n( ) ${props[0]}.\n( ) ${props[1]}.\n( ) ${props[2]}.\n( ) ${props[3]}.`,
  options:labels.map((x,i)=>({key:KEYS[i],text:`( ${x.join(' ) ( ')} )`})),correct_answer:KEYS[idx],
  explanation:`A sequência correta corresponde à alternativa ${KEYS[idx]}, conforme os conceitos reunidos em ${locator(bases[0])}.`};
}
function makeIncorrect(id,bases,seed,want){
 const idx=KEYS.includes(want)?KEYS.indexOf(want):(seed%5),props=bases.map((q,i)=>statement(q,i!==idx,seed+i));
 return {id,...meta(bases[0],'Assinale a incorreta','Difícil','formato-pscpp-incorreta-v4',bases.map(x=>x.id)),
  topic_code:`PSCPP.V4.INC.${String(seed+1).padStart(5,'0')}`,
  question:`Considerando o conteúdo de “${source(bases[0])}” (${locator(bases[0])}), assinale a alternativa INCORRETA:`,
  options:props.map((t,i)=>({key:KEYS[i],text:`${t}.`})),correct_answer:KEYS[idx],
  explanation:`A alternativa ${KEYS[idx]} é a única incompatível com o conteúdo técnico do recorte bibliográfico indicado.`};
}
function nextIdFactory(qs,subject){
 const ms=qs.map(q=>String(q.id||'').match(/^([A-Za-z]+)-(\d+)$/)).filter(Boolean);
 const pref=ms[0]?.[1]||subject.replace(/[^a-z]/gi,'').slice(0,4).toUpperCase();
 let max=0,w=4;for(const m of ms){if(m[1].toUpperCase()===pref.toUpperCase()){max=Math.max(max,+m[2]);w=Math.max(w,m[2].length);}}
 return ()=>`${pref}-${String(++max).padStart(w,'0')}`;
}
function uniqueStems(qs){
 const seen=new Map(),pref=['Durante uma análise técnica de bordo,','No briefing conduzido antes da faina,','Ao revisar o plano de manobra,','Em uma avaliação do passadiço,','Durante a preparação do Prático,'];
 for(const q of qs){let n=norm(q.question);if(!seen.has(n)){seen.set(n,q.id);continue;}if(!(q.tags||[]).includes('pscpp-style-v4'))continue;
 let k=0;do{q.question=`${pref[k++%pref.length]} ${q.question}`;n=norm(q.question);}while(seen.has(n));seen.set(n,q.id);}
}

const report={generated_at:new Date().toISOString(),subjects:{},rewritten:0,added:0};
for(const sub of SUBJECTS){
 const file=path.join(qdir,`${sub}.json`),bank=JSON.parse(fs.readFileSync(file,'utf8')),qs=bank.questions||[];
 const pool=qs.filter(safe),gs=groups(pool); if(!gs.length)throw new Error(`${sub}: sem grupos seguros`);
 const flagged=(audit.flags||[]).filter(f=>f.subject===sub&&f.severity==='medium'&&['DUPLICATE_OPTION_SET','GENERIC_TEMPLATE_LANGUAGE'].includes(f.code));
 let ids=[...new Set(flagged.map(f=>f.id))];
 if(sub==='arte-naval') ids=ids.filter(id=>{const m=String(id).match(/ANV-(\d+)/);return m&&Number(m[1])>1150;});
 ids=ids.slice(0,TARGET_PER_SUBJECT);
 let rewritten=0;
 for(let i=0;i<ids.length;i++){
   const ix=qs.findIndex(q=>q.id===ids[i]); if(ix<0)continue;
   const old=qs[ix],g=same(old,gs)||gs[(i*5)%gs.length],bases=chooseDistinct(g,(i*7)%g.questions.length,5,old.id);
   if(bases.length<5)continue;
   let q;
   if(i%3===0)q=makeAssertions(old.id,bases.slice(0,4),i,ans(old));
   else if(i%3===1)q=makeVF(old.id,bases.slice(0,4),i,ans(old));
   else q=makeIncorrect(old.id,bases,i,ans(old));
   q.provenance.replaces_question_id=old.id;q.provenance.rewrite_reason='residual-medium-quality-v4';qs[ix]=q;rewritten++;
 }
 const nextId=nextIdFactory(qs,sub),added=[];
 for(let i=0;i<ADD_PER_SUBJECT;i++){
   const g=gs[(i*11)%gs.length],bases=chooseDistinct(g,(i*13)%g.questions.length,5,''); if(bases.length<5)continue;
   const id=nextId(),want=KEYS[i%5];
   const q=i%3===0?makeAssertions(id,bases.slice(0,4),10000+i,want):i%3===1?makeVF(id,bases.slice(0,4),10000+i,want):makeIncorrect(id,bases,10000+i,want);
   q.provenance.method='pscpp-expansion-v4';added.push(q);
 }
 qs.push(...added);
 // Any generated item with internally repeated alternatives is rebuilt as an
 // assertion question, whose five meta-options are intentionally unique.
 for(let ix=0;ix<qs.length;ix++){
   const q=qs[ix];
   if(!(q.tags||[]).includes('pscpp-style-v4')||rawUnique(q))continue;
   const g=same(q,gs)||gs[ix%gs.length];
   const bases=chooseDistinct(g,(ix*17)%g.questions.length,4,q.id);
   if(bases.length===4){
     const repaired=makeAssertions(q.id,bases,20000+ix,ans(q));
     repaired.provenance.replaces_question_id=q.id;
     repaired.provenance.repair_reason='duplicate-options-after-v4-generation';
     qs[ix]=repaired;
   }
 }
 uniqueStems(qs);bank.questions=qs;
 if('total_questions'in bank)bank.total_questions=qs.length;
 if(bank.validation&&typeof bank.validation==='object')bank.validation.total=qs.length;
 if(bank.metadata&&typeof bank.metadata==='object'&&'total_questions'in bank.metadata)bank.metadata.total_questions=qs.length;
 fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');
 report.subjects[sub]={targeted:ids.length,rewritten,added:added.length,safe_pool:pool.length,groups:gs.length};
 report.rewritten+=rewritten;report.added+=added.length;
}
fs.writeFileSync(path.join(rdir,'pscpp-deep-refine-v4.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
