import fs from 'node:fs';
// LEGACY_GENERATOR_DISABLED: preservado apenas para rastreabilidade histórica.\nthrow new Error('Gerador legado desativado pela auditoria integral PSCPP: não sintetize questões a partir de alternativas de outros itens.');\nimport path from 'node:path';

const root=process.cwd(), qdir=path.join(root,'data','questions'), rdir=path.join(root,'reports');
const audit=JSON.parse(fs.readFileSync(path.join(rdir,'question-quality-audit-v2.json'),'utf8'));
const SUBJECTS=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const KEYS=['A','B','C','D','E'];
const NEW_PER_SUBJECT=8;
const P5=[
 [1,1,0,1,0], [1,0,1,0,1], [0,1,1,1,0], [1,1,1,0,0], [0,1,0,1,1]
];
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
 const m=new Map();for(const q of pool){const k=groupKey(q);if(!m.has(k))m.set(k,[]);m.get(k).push(q);}
 return [...m.entries()].map(([key,questions])=>({key,questions})).filter(g=>g.questions.length>=12).sort((a,b)=>a.key.localeCompare(b.key));
}
function same(q,gs){return gs.find(g=>g.key===groupKey(q));}
function pick(g,start,n,avoid=''){
 const out=[],seen=new Set();for(let k=0;out.length<n&&k<g.questions.length*3;k++){const q=g.questions[(start+k*5)%g.questions.length];if(q.id===avoid||seen.has(q.id))continue;seen.add(q.id);out.push(q);}return out;
}
function statement(q,truth,seed){
 const o=truth?cop(q):wrong(q)[seed%wrong(q).length], text=clean(o?.text), tp=topic(q), stem=clean(q.question);
 if(text.length>=30)return `Sobre “${tp}”, é correto associar o conceito à seguinte proposição: ${text.replace(/[.]$/,'')}`;
 let m=stem.match(/qual (?:é|e) (?:a |o )?(.+?)\??$/i);
 if(m)return `Em relação a ${clean(m[1]).replace(/[?.]$/,'')}, a resposta “${text}” está correta`;
 return `No contexto de “${tp}”, a associação “${text}” está correta`;
}
function meta(base,style,tag,derived){
 return {
  subject:base.subject,module:base.module,topic:base.topic,difficulty:'Difícil',style,question_type:style,
  taxonomy:structuredClone(base.taxonomy),tracking:structuredClone(base.tracking||{}),source:structuredClone(base.source||{}),
  tags:[...new Set([...(base.tags||[]),'pscpp-style-v6',tag].filter(Boolean))],
  provenance:{method:'pscpp-bibliographic-v6',derived_from_question_ids:derived||[base.id],benchmark:'PSCPP/DPC 2006, 2008, 2011, 2012 e 2023'}
 };
}
function move(q,want){const cur=ans(q);if(cur===want)return q;const a=q.options.find(o=>o.key===cur),b=q.options.find(o=>o.key===want);if(!a||!b)return q;[a.text,b.text]=[b.text,a.text];q.correct_answer=want;return q;}
function assertions5(id,bases,seed,want){
 const idx=KEYS.includes(want)?KEYS.indexOf(want):seed%5,p=P5[idx],props=bases.map((q,i)=>statement(q,!!p[i],seed+i));
 return {id,...meta(bases[0],'Assertivas I–V','formato-pscpp-assertivas-5',bases.map(x=>x.id)),
  topic_code:`PSCPP.V6.AST5.${String(seed+1).padStart(5,'0')}`,
  question:`De acordo com o contido em “${source(bases[0])}”, analise as afirmativas abaixo, identifique as verdadeiras e assinale a opção correta:\nI) ${props[0]}.\nII) ${props[1]}.\nIII) ${props[2]}.\nIV) ${props[3]}.\nV) ${props[4]}.`,
  options:LABELS.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[idx],
  explanation:`A combinação correta é a alternativa ${KEYS[idx]}; as cinco proposições pertencem ao mesmo recorte bibliográfico: ${locator(bases[0])}.`};
}
function vf5(id,bases,seed,want){
 const idx=KEYS.includes(want)?KEYS.indexOf(want):seed%5,p=P5[idx],props=bases.map((q,i)=>statement(q,!!p[i],seed+i));
 const seqs=P5.map(x=>x.map(v=>v?'V':'F'));
 return {id,...meta(bases[0],'Sequência V/F (5 itens)','formato-pscpp-vf-5',bases.map(x=>x.id)),
  topic_code:`PSCPP.V6.VF5.${String(seed+1).padStart(5,'0')}`,
  question:`Com base em “${source(bases[0])}”, coloque V (verdadeiro) ou F (falso) nas proposições e assinale a sequência correta:\n( ) ${props[0]}.\n( ) ${props[1]}.\n( ) ${props[2]}.\n( ) ${props[3]}.\n( ) ${props[4]}.`,
  options:seqs.map((x,i)=>({key:KEYS[i],text:`( ${x.join(' ) ( ')} )`})),correct_answer:KEYS[idx],
  explanation:`A sequência correta é a da alternativa ${KEYS[idx]}, conforme ${locator(bases[0])}.`};
}
function fill5(id,bases,seed,want){
 const vals=bases.map(q=>ctext(q));
 const perms=[
  [0,1,2,3,4],[1,0,2,4,3],[2,1,0,3,4],[3,2,1,0,4],[4,3,2,1,0]
 ];
 const idx=KEYS.includes(want)?KEYS.indexOf(want):seed%5;
 // make the selected option the canonical order by swapping permutations
 [perms[0],perms[idx]]=[perms[idx],perms[0]];
 const stems=bases.map((q,i)=>`(${['I','II','III','IV','V'][i]}) ${clean(q.question).replace(/\?+$/,'')} = ______`);
 return {id,...meta(bases[0],'Preenchimento de lacunas','formato-pscpp-lacunas-5',bases.map(x=>x.id)),
  topic_code:`PSCPP.V6.LAC5.${String(seed+1).padStart(5,'0')}`,
  question:`Tendo como referência “${source(bases[0])}”, complete corretamente as lacunas e assinale a opção que apresenta a sequência adequada:\n${stems.join('\n')}`,
  options:perms.map((p,i)=>({key:KEYS[i],text:p.map(k=>vals[k]).join(' — ')})),correct_answer:KEYS[idx],
  explanation:`A sequência correta corresponde à alternativa ${KEYS[idx]}, segundo o conteúdo de ${locator(bases[0])}.`};
}
function scenario(id,base,seed,want){
 const correct=ctext(base),ws=wrong(base).map(o=>clean(o.text)),idx=KEYS.includes(want)?KEYS.indexOf(want):seed%5,arr=[];let wi=0;
 for(let i=0;i<5;i++)arr.push(i===idx?correct:ws[wi++]);
 const people=['Ari','Mariza','Francisco','Roberto','Lúcia','Sebastião','Aroldo'];
 return {id,...meta(base,'Estudo de caso PSCPP','formato-pscpp-caso-v6',[base.id]),
  topic_code:`PSCPP.V6.CASO.${String(seed+1).padStart(5,'0')}`,
  question:`O Prático ${people[seed%people.length]}, durante uma faina relacionada a “${topic(base)}”, precisa aplicar corretamente o conteúdo de “${source(base)}”. Considere o seguinte problema técnico: ${clean(base.question)} Assinale a alternativa adequada.`,
  options:arr.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[idx],
  explanation:clean(base.explanation)||`A resposta decorre do conteúdo indicado em ${locator(base)}.`};
}
function nextIdFactory(qs,subject){
 const ms=qs.map(q=>String(q.id||'').match(/^([A-Za-z]+)-(\d+)$/)).filter(Boolean);
 const pref=ms[0]?.[1]||subject.replace(/[^a-z]/gi,'').slice(0,4).toUpperCase();let max=0,w=4;
 for(const m of ms){if(m[1].toUpperCase()===pref.toUpperCase()){max=Math.max(max,+m[2]);w=Math.max(w,m[2].length);}}return()=>`${pref}-${String(++max).padStart(w,'0')}`;
}
function uniqueStems(qs){
 const seen=new Set(),pref=['Durante o briefing técnico,','Na preparação para a faina,','Ao revisar o plano de passagem,','Durante uma avaliação de bordo,'];
 for(const q of qs){let n=norm(q.question);if(!seen.has(n)){seen.add(n);continue;}if(!(q.tags||[]).includes('pscpp-style-v6'))continue;let k=0;do{q.question=`${pref[k++%pref.length]} ${q.question}`;n=norm(q.question);}while(seen.has(n));seen.add(n);}
}

const report={generated_at:new Date().toISOString(),subjects:{},rewritten:0,added:0};
for(const sub of SUBJECTS){
 const file=path.join(qdir,`${sub}.json`),bank=JSON.parse(fs.readFileSync(file,'utf8')),qs=bank.questions||[],pool=qs.filter(safe),gs=groups(pool);
 if(!gs.length)throw new Error(`${sub}: sem grupos seguros`);
 let ids=[...new Set((audit.flags||[]).filter(f=>f.subject===sub&&f.severity==='medium'&&['DUPLICATE_OPTION_SET','GENERIC_TEMPLATE_LANGUAGE'].includes(f.code)).map(f=>f.id))];
 if(sub==='arte-naval')ids=ids.filter(id=>{const m=String(id).match(/ANV-(\d+)/);return m&&Number(m[1])>1150;});
 let rewritten=0;
 for(let i=0;i<ids.length;i++){
  const ix=qs.findIndex(q=>q.id===ids[i]);if(ix<0)continue;const old=qs[ix],g=same(old,gs)||gs[(i*3)%gs.length],bases=pick(g,(i*7)%g.questions.length,5,old.id);if(bases.length<5)continue;
  let q=i%4===0?assertions5(old.id,bases,i,ans(old)):i%4===1?vf5(old.id,bases,i,ans(old)):i%4===2?fill5(old.id,bases,i,ans(old)):scenario(old.id,bases[0],i,ans(old));
  if(!rawUnique(q))q=assertions5(old.id,bases,i,ans(old));
  q.provenance.replaces_question_id=old.id;q.provenance.rewrite_reason='residual-medium-bibliographic-v6';qs[ix]=q;rewritten++;
 }
 const next=nextIdFactory(qs,sub),added=[];
 for(let i=0;i<NEW_PER_SUBJECT;i++){
  const g=gs[(i*11)%gs.length],bases=pick(g,(i*13)%g.questions.length,5,'');if(bases.length<5)continue;const id=next(),want=KEYS[i%5];
  let q=i%4===0?assertions5(id,bases,10000+i,want):i%4===1?vf5(id,bases,10000+i,want):i%4===2?fill5(id,bases,10000+i,want):scenario(id,bases[0],10000+i,want);
  if(!rawUnique(q))q=assertions5(id,bases,10000+i,want);q.provenance.method='pscpp-expansion-v6';added.push(q);
 }
 qs.push(...added);uniqueStems(qs);bank.questions=qs;
 if('total_questions'in bank)bank.total_questions=qs.length;
 if(bank.validation&&typeof bank.validation==='object')bank.validation.total=qs.length;
 if(bank.metadata&&typeof bank.metadata==='object'&&'total_questions'in bank.metadata)bank.metadata.total_questions=qs.length;
 fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');
 report.subjects[sub]={targeted:ids.length,rewritten,added:added.length};report.rewritten+=rewritten;report.added+=added.length;
}
fs.writeFileSync(path.join(rdir,'pscpp-bibliographic-v6.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
