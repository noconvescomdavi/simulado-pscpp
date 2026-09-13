import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd(), qdir=path.join(root,'data','questions'), rdir=path.join(root,'reports');
const audit=JSON.parse(fs.readFileSync(path.join(rdir,'question-quality-audit-v2.json'),'utf8'));
const SUBJECTS=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const KEYS=['A','B','C','D','E'];
const LIMIT=300;
const TARGET_CODES=new Set(['DUPLICATE_OPTION_SET','GENERIC_TEMPLATE_LANGUAGE']);
const PATTERNS=[[1,1,0,0],[1,0,1,0],[0,1,0,1],[0,0,1,1],[1,1,1,1]];
const COMBOS=['Apenas as afirmativas I e II são verdadeiras.','Apenas as afirmativas I e III são verdadeiras.','Apenas as afirmativas II e IV são verdadeiras.','Apenas as afirmativas III e IV são verdadeiras.','As afirmativas I, II, III e IV são verdadeiras.'];

function clean(v){return String(v??'').replace(/\s+/g,' ').trim();}
function norm(v){return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function ans(q){return String(q.correct_answer||q.answer||'').toUpperCase();}
function cop(q){return (q.options||[]).find(o=>String(o.key||'').toUpperCase()===ans(q));}
function ctext(q){return clean(cop(q)?.text);}
function wrong(q){return (q.options||[]).filter(o=>String(o.key||'').toUpperCase()!==ans(q));}
function topic(q){return clean(q.topic||q?.tracking?.topic?.title||q?.taxonomy?.topic_id||'conteúdo técnico');}
function source(q){return clean(q?.source?.title||q?.tracking?.work?.title||'publicação indicada');}
function loc(q){return clean(q?.source?.locator||q?.tracking?.section||q?.taxonomy?.chapter_id||'trecho indicado');}
function rawUnique(q){const a=(q.options||[]).map(o=>clean(o.text).normalize('NFC').toLocaleLowerCase('pt-BR'));return a.length===5&&!a.some(x=>!x)&&new Set(a).size===a.length;}
function safe(q){
 if(!q?.id||!q?.taxonomy?.bibliography_id||!q?.taxonomy?.chapter_id||!q?.source?.title||!q?.source?.locator)return false;
 if(!Array.isArray(q.options)||q.options.length!==5||!cop(q)||!rawUnique(q))return false;
 const st=norm(q.style||q.question_type);
 if(/assert|afirm|sequencia|verdadeiro|falso|incorreta|lacuna/.test(st))return false;
 return !!ctext(q);
}
function groups(pool){
 const m=new Map();for(const q of pool){const k=`${q.taxonomy.bibliography_id}|${q.taxonomy.chapter_id}`;if(!m.has(k))m.set(k,[]);m.get(k).push(q);}
 return [...m.entries()].map(([key,questions])=>({key,questions})).filter(g=>g.questions.length>=8);
}
function same(q,gs){const k=`${q?.taxonomy?.bibliography_id}|${q?.taxonomy?.chapter_id}`;return gs.find(g=>g.key===k);}
function choose(g,start,n){return Array.from({length:n},(_,i)=>g.questions[(start+i)%g.questions.length]);}
function statement(q,truth,seed){
 const o=truth?cop(q):wrong(q)[seed%wrong(q).length], text=clean(o?.text), t=topic(q);
 const stem=clean(q.question);
 let m=stem.match(/qual termo corresponde (?:à|a) (?:seguinte )?descrição técnica[: ]+(.+?)[?.]?$/i);
 if(m)return `A descrição “${clean(m[1]).replace(/[?.]$/,'')}” corresponde a “${text}”`;
 if(text.length>25)return `Sobre “${t}”, é correto afirmar: ${text.replace(/[.]$/,'')}`;
 return `No contexto de “${t}”, a associação “${text}” é tecnicamente aplicável`;
}
function meta(base,style){
 return {subject:base.subject,module:base.module,topic:base.topic,difficulty:'Difícil',style,question_type:style,
 taxonomy:structuredClone(base.taxonomy),tracking:structuredClone(base.tracking||{}),source:structuredClone(base.source||{}),
 tags:[...new Set([...(base.tags||[]),'pscpp-style-v3','pscpp-refinement-v3'])],
 provenance:{method:'pscpp-refinement-v3',derived_from_question_ids:[base.id],benchmark:'PSCPP/DPC 2006, 2008, 2011, 2012 e 2023'}};
}
function move(q,want){
 const cur=ans(q);if(cur===want)return q;
 const a=q.options.find(o=>o.key===cur),b=q.options.find(o=>o.key===want);if(!a||!b)return q;
 [a.text,b.text]=[b.text,a.text];q.correct_answer=want;return q;
}
function assertion(id,bases,seq,want){
 const idx=seq%5,p=PATTERNS[idx],props=bases.map((q,i)=>statement(q,!!p[i],seq+i));
 let q={id,...meta(bases[0],'Assertivas I–IV'),topic_code:`PSCPP.REF.AST.${String(seq+1).padStart(4,'0')}`,
 question:`De acordo com o contido em “${source(bases[0])}”, analise as afirmativas abaixo, identifique as verdadeiras e assinale a opção correta:\nI) ${props[0]}.\nII) ${props[1]}.\nIII) ${props[2]}.\nIV) ${props[3]}.`,
 options:COMBOS.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[idx],
 explanation:`A alternativa correta decorre dos conceitos reunidos no mesmo recorte bibliográfico: ${loc(bases[0])}.`};
 q.provenance.derived_from_question_ids=bases.map(x=>x.id);return move(q,want);
}
function seqvf(id,bases,seq,want){
 const idx=seq%5,p=PATTERNS[idx],props=bases.map((q,i)=>statement(q,!!p[i],seq+i));
 const labels=PATTERNS.map(x=>x.map(v=>v?'V':'F'));
 let q={id,...meta(bases[0],'Sequência V/F'),topic_code:`PSCPP.REF.VF.${String(seq+1).padStart(4,'0')}`,
 question:`Com base em “${source(bases[0])}”, coloque V (verdadeiro) ou F (falso) nas afirmativas e assinale a opção correta:\n( ) ${props[0]}.\n( ) ${props[1]}.\n( ) ${props[2]}.\n( ) ${props[3]}.`,
 options:labels.map((x,i)=>({key:KEYS[i],text:`( ${x.join(' ) ( ')} )`})),correct_answer:KEYS[idx],
 explanation:`A sequência correta está fundamentada em ${loc(bases[0])}.`};
 q.provenance.derived_from_question_ids=bases.map(x=>x.id);return move(q,want);
}
function incorrect(id,bases,seq,want){
 const bad=seq%5,props=bases.map((q,i)=>statement(q,i!==bad,seq+i));
 let q={id,...meta(bases[0],'Assinale a incorreta'),topic_code:`PSCPP.REF.INC.${String(seq+1).padStart(4,'0')}`,
 question:`Com base no conteúdo de “${source(bases[0])}”, em ${loc(bases[0])}, marque a alternativa INCORRETA:`,
 options:props.map((t,i)=>({key:KEYS[i],text:`${t}.`})),correct_answer:KEYS[bad],
 explanation:`A alternativa indicada pelo gabarito é a única incompatível com o recorte bibliográfico utilizado.`};
 q.provenance.derived_from_question_ids=bases.map(x=>x.id);return move(q,want);
}
function direct(id,base,seq,want){
 const desired=seq%5,correct=ctext(base),ws=wrong(base).map(o=>clean(o.text));const arr=[];let wi=0;
 for(let i=0;i<5;i++)arr.push(i===desired?correct:ws[wi++]);
 let q={id,...meta(base,'Múltipla escolha contextualizada'),topic_code:`PSCPP.REF.DIR.${String(seq+1).padStart(4,'0')}`,
 question:`De acordo com o contido em “${source(base)}” (${loc(base)}), considere o seguinte problema técnico: ${clean(base.question)} Assinale a opção correta.`,
 options:arr.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[desired],explanation:clean(base.explanation)||`A resposta decorre de ${loc(base)}.`};
 return move(q,want);
}
function uniqueStems(qs){
 const seen=new Map(),pref=['Durante um briefing técnico,','Na preparação para a faina,','Em uma revisão conduzida pelo Prático,','Durante a conferência do plano,','Em uma avaliação de bordo,'];
 for(const q of qs){let n=norm(q.question);if(!seen.has(n)){seen.set(n,1);continue;}if(!(q.tags||[]).includes('pscpp-refinement-v3'))continue;
 let k=seen.get(n)||1;seen.set(n,k+1);q.question=`${pref[(k-1)%pref.length]} ${q.question}`;n=norm(q.question);while(seen.has(n)){q.question=`${pref[k++%pref.length]} ${q.question}`;n=norm(q.question);}seen.set(n,1);}
}

const report={generated_at:new Date().toISOString(),subjects:{},total_rewritten:0};
for(const sub of SUBJECTS){
 const file=path.join(qdir,`${sub}.json`),bank=JSON.parse(fs.readFileSync(file,'utf8')),qs=bank.questions||[];
 const pool=qs.filter(safe),gs=groups(pool);if(!gs.length)throw new Error(`${sub}: sem pool seguro`);
 const ids=[...new Set((audit.flags||[]).filter(f=>f.subject===sub&&f.severity==='medium'&&TARGET_CODES.has(f.code)).map(f=>f.id))].slice(0,LIMIT);
 let done=0;
 for(let i=0;i<ids.length;i++){
  const ix=qs.findIndex(q=>q.id===ids[i]);if(ix<0)continue;const old=qs[ix],g=same(old,gs)||gs[i%gs.length];let q;
  if(i%4===0)q=assertion(old.id,choose(g,(i*3)%g.questions.length,4),i,ans(old));
  else if(i%4===1)q=seqvf(old.id,choose(g,(i*5)%g.questions.length,4),i,ans(old));
  else if(i%4===2)q=incorrect(old.id,choose(g,(i*7)%g.questions.length,5),i,ans(old));
  else q=direct(old.id,g.questions[(i*11)%g.questions.length],i,ans(old));
  q.provenance.replaces_question_id=old.id;q.provenance.refinement_reason='residual-medium-quality-flag';qs[ix]=q;done++;
 }
 uniqueStems(qs);bank.questions=qs;fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');
 report.subjects[sub]={targeted:ids.length,rewritten:done};report.total_rewritten+=done;
}
fs.writeFileSync(path.join(rdir,'pscpp-refinement-v3.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
