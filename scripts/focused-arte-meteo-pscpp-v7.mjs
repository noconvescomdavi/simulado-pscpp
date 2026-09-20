import fs from 'node:fs';
// LEGACY_GENERATOR_DISABLED: preservado apenas para rastreabilidade histórica.\nthrow new Error('Gerador legado desativado pela auditoria integral PSCPP: não sintetize questões a partir de alternativas de outros itens.');\nimport path from 'node:path';

const root=process.cwd(), qdir=path.join(root,'data','questions'), rdir=path.join(root,'reports');
const TARGETS=['arte-naval','meteorologia-oceanografia'];
const KEYS=['A','B','C','D','E'];
const ADD=40;
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
function ctext(q){return clean(cop(q)?.text);}
function wrong(q){return (q.options||[]).filter(o=>String(o.key||'').toUpperCase()!==ans(q));}
function source(q){return clean(q?.source?.title||q?.tracking?.work?.title||'publicação indicada');}
function locator(q){return clean(q?.source?.locator||q?.tracking?.section||q?.taxonomy?.chapter_id||'trecho indicado');}
function topic(q){return clean(q?.topic||q?.tracking?.topic?.title||q?.taxonomy?.topic_id||'conteúdo técnico');}
function rawUnique(q){const a=(q.options||[]).map(o=>clean(o.text).normalize('NFC').toLocaleLowerCase('pt-BR'));return a.length===5&&!a.some(x=>!x)&&new Set(a).size===a.length;}
function safe(q){
 if(!q?.id||!q?.taxonomy?.bibliography_id||!q?.taxonomy?.chapter_id||!q?.source?.title||!q?.source?.locator)return false;
 if(!Array.isArray(q.options)||q.options.length!==5||!cop(q)||!rawUnique(q))return false;
 const st=norm(q.style||q.question_type);
 if(/assert|afirm|sequencia|verdadeiro|falso|incorreta|lacuna/.test(st))return false;
 return !!ctext(q);
}
function key(q){return `${q.taxonomy.bibliography_id}|${q.taxonomy.chapter_id}`;}
function groups(qs){
 const m=new Map();for(const q of qs.filter(safe)){const k=key(q);if(!m.has(k))m.set(k,[]);m.get(k).push(q);}
 return [...m.entries()].map(([key,questions])=>({key,questions})).filter(g=>g.questions.length>=10);
}
function pick(g,start,n){
 const out=[],seen=new Set();for(let i=0;out.length<n&&i<g.questions.length*3;i++){const q=g.questions[(start+i*3)%g.questions.length];if(seen.has(q.id))continue;seen.add(q.id);out.push(q);}return out;
}
function stmt(q,truth,seed){
 const o=truth?cop(q):wrong(q)[seed%wrong(q).length],txt=clean(o?.text),tp=topic(q);
 if(txt.length>30)return `Sobre “${tp}”, é correto afirmar: ${txt.replace(/[.]$/,'')}`;
 return `No contexto de “${tp}”, a associação “${txt}” está correta`;
}
function meta(base,style,tag,derived){
 return {subject:base.subject,module:base.module,topic:base.topic,difficulty:'Difícil',style,question_type:style,
 taxonomy:structuredClone(base.taxonomy),tracking:structuredClone(base.tracking||{}),source:structuredClone(base.source||{}),
 tags:[...new Set([...(base.tags||[]),'pscpp-focused-extension-v7',tag])],
 provenance:{method:'pscpp-focused-extension-v7',derived_from_question_ids:derived,benchmark:'PSCPP/DPC 2006, 2008, 2011, 2012 e 2023; foco Arte Naval e Meteorologia'}};
}
function nextIdFactory(qs,sub){
 const ms=qs.map(q=>String(q.id||'').match(/^([A-Za-z]+)-(\d+)$/)).filter(Boolean),pref=ms[0]?.[1]||sub.slice(0,3).toUpperCase();let max=0,w=4;
 for(const m of ms){if(m[1].toUpperCase()===pref.toUpperCase()){max=Math.max(max,+m[2]);w=Math.max(w,m[2].length);}}return()=>`${pref}-${String(++max).padStart(w,'0')}`;
}
function assert5(id,bases,seed){
 const idx=seed%5,p=P5[idx],props=bases.map((q,i)=>stmt(q,!!p[i],seed+i));
 return {id,...meta(bases[0],'Assertivas I–V','dpc-assertivas-5',bases.map(x=>x.id)),
 topic_code:`PSCPP.V7.AST5.${String(seed+1).padStart(4,'0')}`,
 question:`De acordo com o contido em “${source(bases[0])}”, analise as afirmativas abaixo, identifique as verdadeiras e assinale a opção correta:\nI) ${props[0]}.\nII) ${props[1]}.\nIII) ${props[2]}.\nIV) ${props[3]}.\nV) ${props[4]}.`,
 options:LABELS.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[idx],
 explanation:`A combinação correta é a alternativa ${KEYS[idx]}, considerando o recorte ${locator(bases[0])}.`};
}
function vf5(id,bases,seed){
 const idx=seed%5,p=P5[idx],props=bases.map((q,i)=>stmt(q,!!p[i],seed+i)),seqs=P5.map(x=>x.map(v=>v?'V':'F'));
 return {id,...meta(bases[0],'Sequência V/F (5 itens)','dpc-vf-5',bases.map(x=>x.id)),
 topic_code:`PSCPP.V7.VF5.${String(seed+1).padStart(4,'0')}`,
 question:`Com base em “${source(bases[0])}”, coloque V (verdadeiro) ou F (falso) nas proposições e assinale a sequência correta:\n( ) ${props[0]}.\n( ) ${props[1]}.\n( ) ${props[2]}.\n( ) ${props[3]}.\n( ) ${props[4]}.`,
 options:seqs.map((x,i)=>({key:KEYS[i],text:`( ${x.join(' ) ( ')} )`})),correct_answer:KEYS[idx],
 explanation:`A sequência correta corresponde à alternativa ${KEYS[idx]}, conforme ${locator(bases[0])}.`};
}
function fill5(id,bases,seed){
 const vals=bases.map(q=>ctext(q));
 const perms=[[0,1,2,3,4],[1,0,3,2,4],[2,3,0,4,1],[3,4,1,0,2],[4,2,3,1,0]],idx=seed%5;
 [perms[0],perms[idx]]=[perms[idx],perms[0]];
 const lines=bases.map((q,i)=>`${['I','II','III','IV','V'][i]}) ${clean(q.question).replace(/\?+$/,'')} = ______`);
 return {id,...meta(bases[0],'Preenchimento de lacunas','dpc-lacunas-5',bases.map(x=>x.id)),
 topic_code:`PSCPP.V7.LAC5.${String(seed+1).padStart(4,'0')}`,
 question:`Assinale a opção que completa corretamente as lacunas abaixo, tendo como referência “${source(bases[0])}”:\n${lines.join('\n')}`,
 options:perms.map((p,i)=>({key:KEYS[i],text:p.map(k=>vals[k]).join(' — ')})),correct_answer:KEYS[idx],
 explanation:`A sequência correta é a alternativa ${KEYS[idx]}, de acordo com ${locator(bases[0])}.`};
}
function scenario(id,base,seed,sub){
 const idx=seed%5,correct=ctext(base),ws=wrong(base).map(o=>clean(o.text)),arr=[];let wi=0;for(let i=0;i<5;i++)arr.push(i===idx?correct:ws[wi++]);
 let intro;
 if(sub==='meteorologia-oceanografia'){
  const people=['Francisco','Mariza','Ari','Roberto','Lúcia'];
  intro=`O Prático ${people[seed%people.length]} encontra-se preparando uma manobra e acompanha continuamente carta sinótica, meteoromarinha e observações de bordo. Ao revisar o tópico “${topic(base)}” em “${source(base)}”, depara-se com a seguinte questão técnica: `;
 }else{
  const people=['Ari','Sebastião','Aroldo','Claudionor','Roberto'];
  intro=`Durante a preparação de uma faina de convés, o Prático ${people[seed%people.length]} revisa “${source(base)}” para confirmar um detalhe de “${topic(base)}”. Considere a seguinte situação técnica: `;
 }
 return {id,...meta(base,'Estudo de caso PSCPP','dpc-caso-aplicado',[base.id]),
 topic_code:`PSCPP.V7.CASO.${String(seed+1).padStart(4,'0')}`,
 question:`${intro}${clean(base.question)} Assinale a alternativa correta.`,
 options:arr.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[idx],
 explanation:clean(base.explanation)||`A resposta decorre de ${locator(base)}.`};
}

const report={generated_at:new Date().toISOString(),subjects:{},added:0};
for(const sub of TARGETS){
 const file=path.join(qdir,`${sub}.json`),bank=JSON.parse(fs.readFileSync(file,'utf8')),qs=bank.questions||[],gs=groups(qs),next=nextIdFactory(qs,sub),added=[];
 if(!gs.length)throw new Error(`${sub}: sem grupos seguros`);
 for(let i=0;i<ADD;i++){
  const g=gs[(i*7)%gs.length],bases=pick(g,(i*11)%g.questions.length,5);if(bases.length<5)continue;
  const id=next();let q;
  if(i<10)q=assert5(id,bases,1000+i);
  else if(i<20)q=vf5(id,bases,1000+i);
  else if(i<30)q=fill5(id,bases,1000+i);
  else q=scenario(id,bases[0],1000+i,sub);
  if(!rawUnique(q))q=assert5(id,bases,1000+i);added.push(q);
 }
 qs.push(...added);bank.questions=qs;
 if('total_questions'in bank)bank.total_questions=qs.length;
 if(bank.validation&&typeof bank.validation==='object')bank.validation.total=qs.length;
 if(bank.metadata&&typeof bank.metadata==='object'&&'total_questions'in bank.metadata)bank.metadata.total_questions=qs.length;
 fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');report.subjects[sub]={added:added.length,groups:gs.length};report.added+=added.length;
}
fs.writeFileSync(path.join(rdir,'pscpp-focused-extension-v7.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
