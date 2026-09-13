import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const qdir=path.join(root,'data','questions');
const rdir=path.join(root,'reports');
fs.mkdirSync(rdir,{recursive:true});

const SUBJECTS=['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const KEYS=['A','B','C','D','E'];
const MAX_REWRITE_PER_SUBJECT=140;
const NEW_PER_SUBJECT=50;
const auditPath=path.join(rdir,'question-quality-audit-v2.json');
const audit=fs.existsSync(auditPath)?JSON.parse(fs.readFileSync(auditPath,'utf8')):{flags:[]};

function clean(v){return String(v??'').replace(/\s+/g,' ').trim();}
function norm(v){return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function key(q){return String(q.correct_answer||q.answer||'').toUpperCase();}
function copt(q){return (q.options||[]).find(o=>String(o?.key||'').toUpperCase()===key(q));}
function ctext(q){return clean(copt(q)?.text);}
function wopts(q){return (q.options||[]).filter(o=>String(o?.key||'').toUpperCase()!==key(q));}
function sourceTitle(q){return clean(q?.source?.title||q?.tracking?.work?.title||'publicação indicada');}
function sourceLocator(q){return clean(q?.source?.locator||q?.tracking?.section||q?.taxonomy?.chapter_id||'trecho indicado');}
function topic(q){return clean(q?.topic||q?.tracking?.topic?.title||q?.taxonomy?.topic_id||'conteúdo técnico');}
function chapter(q){return clean(q?.tracking?.chapter?.title||q?.tracking?.chapter?.label||q?.taxonomy?.chapter_id||sourceLocator(q));}
function exact(v){return clean(v).toLocaleLowerCase('pt-BR');}
function optionMeta(q){return (q.options||[]).some(o=>/apenas as afirm|verdadeir|falso|\(v\)|\(f\)/i.test(clean(o?.text)));}
function safe(q){
 if(!q?.id||!q?.taxonomy?.bibliography_id||!q?.taxonomy?.chapter_id||!q?.source?.title||!q?.source?.locator) return false;
 if(!Array.isArray(q.options)||q.options.length!==5||!copt(q)) return false;
 const opts=q.options.map(o=>exact(o?.text)); if(opts.some(x=>!x)||new Set(opts).size!==5) return false;
 if(optionMeta(q)) return false;
 const st=norm(q.style||q.question_type); if(/assert|afirm|sequencia|verdadeiro|falso|incorreta|lacuna/.test(st)) return false;
 return ctext(q).length>0;
}
function group(pool){
 const m=new Map();
 for(const q of pool){const k=`${q.taxonomy.bibliography_id}|${q.taxonomy.chapter_id}`;if(!m.has(k))m.set(k,[]);m.get(k).push(q);}
 return [...m.entries()].map(([key,questions])=>({key,questions})).filter(x=>x.questions.length>=8).sort((a,b)=>a.key.localeCompare(b.key));
}
function sameGroup(q,groups){
 const k=`${q?.taxonomy?.bibliography_id}|${q?.taxonomy?.chapter_id}`;
 return groups.find(g=>g.key===k);
}
function choose(g,start,n){return Array.from({length:n},(_,i)=>g.questions[(start+i)%g.questions.length]);}
function statement(q,truth,seed=0){
 const opt=truth?copt(q):wopts(q)[seed%Math.max(1,wopts(q).length)];
 const text=clean(opt?.text), stem=clean(q.question), tp=topic(q);
 let m=stem.match(/qual termo corresponde (?:à|a) (?:seguinte )?descrição técnica[: ]+(.+?)[?.]?$/i);
 if(m)return `A descrição técnica “${clean(m[1]).replace(/[?.]$/,'')}” corresponde a “${text}”`;
 m=stem.match(/qual (?:é|e) (?:a |o )?(.+?)\??$/i);
 if(m&&text.length<100)return `Em relação a ${clean(m[1])}, é correto associar “${text}”`;
 if(text.length>=24)return `Sobre “${tp}”, é tecnicamente correto afirmar: ${text.replace(/[.]$/,'')}`;
 return `No contexto de “${tp}”, a associação “${text}” está correta`;
}
function meta(base,style,difficulty,tag,derived){
 return {
  subject:base.subject,module:base.module,topic:base.topic,difficulty,style,question_type:style,
  taxonomy:structuredClone(base.taxonomy),tracking:structuredClone(base.tracking||{}),source:structuredClone(base.source||{}),
  tags:[...new Set([...(base.tags||[]),'pscpp-style-v3',tag].filter(Boolean))],
  provenance:{method:'pscpp-style-upgrade-v3',derived_from_question_ids:derived||[base.id],benchmark:'PSCPP/DPC 2006, 2008, 2011, 2012 e 2023'}
 };
}
const comboLabels=[
 'Apenas as afirmativas I e II são verdadeiras.',
 'Apenas as afirmativas I e III são verdadeiras.',
 'Apenas as afirmativas II e IV são verdadeiras.',
 'Apenas as afirmativas III e IV são verdadeiras.',
 'As afirmativas I, II, III e IV são verdadeiras.'
];
const pats=[[1,1,0,0],[1,0,1,0],[0,1,0,1],[0,0,1,1],[1,1,1,1]];
function assertions(id,bases,seq){
 const idx=seq%5,p=pats[idx],props=bases.map((q,i)=>statement(q,!!p[i],seq+i));
 const src=sourceTitle(bases[0]);
 return {id,...meta(bases[0],'Assertivas I–IV','Difícil','formato-pscpp-assertivas',bases.map(q=>q.id)),
  topic_code:`PSCPP.AST.${String(seq+1).padStart(4,'0')}`,
  question:`De acordo com o contido em “${src}”, analise as afirmativas abaixo, identifique as verdadeiras e assinale a opção correta:\nI) ${props[0]}.\nII) ${props[1]}.\nIII) ${props[2]}.\nIV) ${props[3]}.`,
  options:comboLabels.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[idx],
  explanation:`São verdadeiras as proposições correspondentes à alternativa ${KEYS[idx]}. A questão foi composta com conceitos do mesmo recorte bibliográfico: ${sourceLocator(bases[0])}.`};
}
function seqvf(id,bases,seq){
 const idx=seq%5,p=pats[idx],props=bases.map((q,i)=>statement(q,!!p[i],seq+i));
 const labels=pats.map(x=>x.map(v=>v?'V':'F').join(' – '));
 return {id,...meta(bases[0],'Sequência V/F','Difícil','formato-pscpp-vf',bases.map(q=>q.id)),
  topic_code:`PSCPP.VF.${String(seq+1).padStart(4,'0')}`,
  question:`Com base em “${sourceTitle(bases[0])}”, coloque V (verdadeiro) ou F (falso) nas afirmativas e assinale a sequência correta:\n( ) ${props[0]}.\n( ) ${props[1]}.\n( ) ${props[2]}.\n( ) ${props[3]}.`,
  options:labels.map((t,i)=>({key:KEYS[i],text:`( ${t.split(' – ').join(' ) ( ')} )`})),correct_answer:KEYS[idx],
  explanation:`A sequência correta é ${labels[idx]}. As quatro proposições derivam de itens do mesmo capítulo/trecho bibliográfico.`};
}
function incorrect(id,bases,seq){
 const bad=seq%5,props=bases.map((q,i)=>statement(q,i!==bad,seq+i));
 return {id,...meta(bases[0],'Assinale a incorreta','Difícil','formato-pscpp-incorreta',bases.map(q=>q.id)),
  topic_code:`PSCPP.INC.${String(seq+1).padStart(4,'0')}`,
  question:`Com base no conteúdo de “${sourceTitle(bases[0])}”, em ${sourceLocator(bases[0])}, marque a alternativa INCORRETA:`,
  options:props.map((t,i)=>({key:KEYS[i],text:`${t}.`})),correct_answer:KEYS[bad],
  explanation:`A alternativa ${KEYS[bad]} é a incorreta. O conceito correto para o ponto cobrado encontra-se no mesmo recorte bibliográfico indicado.`};
}
function direct(id,base,seq){
 const desired=seq%5; const correct=ctext(base); const wrong=wopts(base).map(o=>clean(o.text));
 const texts=[];let wi=0;for(let i=0;i<5;i++)texts.push(i===desired?correct:wrong[wi++]);
 const original=clean(base.question);
 return {id,...meta(base,'Múltipla escolha contextualizada',seq%3===0?'Difícil':'Médio','formato-pscpp-direta',[base.id]),
  topic_code:`PSCPP.DIR.${String(seq+1).padStart(4,'0')}`,
  question:`De acordo com o contido em “${sourceTitle(base)}” (${sourceLocator(base)}), considere a situação/conceito a seguir: ${original} Assinale a opção correta.`,
  options:texts.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[desired],
  explanation:clean(base.explanation)||`A alternativa correta decorre do conteúdo indicado em ${sourceLocator(base)}.`};
}
function scenario(id,base,seq){
 const desired=(seq*2+1)%5; const correct=ctext(base); const wrong=wopts(base).map(o=>clean(o.text));
 const texts=[];let wi=0;for(let i=0;i<5;i++)texts.push(i===desired?correct:wrong[wi++]);
 const names=['Ari','Sacramento','Mariza','Sebastião','Aroldo','Roberto','Claudionor','Lúcia','Carlos'];
 const role=/comunic|gmdss|vhf|smcp/i.test(`${base.module} ${base.topic}`)?'Oficial de Radiocomunicações':'Prático';
 const person=names[seq%names.length];
 return {id,...meta(base,'Estudo de caso PSCPP','Difícil','formato-pscpp-caso',[base.id]),
  topic_code:`PSCPP.CASO.${String(seq+1).padStart(4,'0')}`,
  question:`${role} ${person}, durante a preparação ou execução de uma faina relacionada a “${topic(base)}”, precisa aplicar corretamente o conteúdo de “${sourceTitle(base)}”. Considere o seguinte problema técnico: ${clean(base.question)} Assinale a alternativa tecnicamente adequada.`,
  options:texts.map((t,i)=>({key:KEYS[i],text:t})),correct_answer:KEYS[desired],
  explanation:clean(base.explanation)||`A alternativa correta está de acordo com ${sourceLocator(base)}.`};
}
function nextIdFactory(qs,subject){
 const matches=qs.map(q=>String(q.id||'').match(/^([A-Za-z]+)-(\d+)$/)).filter(Boolean);
 const pref=matches[0]?.[1]||subject.replace(/[^a-z]/gi,'').slice(0,4).toUpperCase();
 let max=0,w=4;for(const m of matches){if(m[1].toUpperCase()===pref.toUpperCase()){max=Math.max(max,+m[2]);w=Math.max(w,m[2].length);}}
 return ()=>`${pref}-${String(++max).padStart(w,'0')}`;
}
function flaggedIds(subject){
 const flags=Array.isArray(audit?.flags)?audit.flags:(Array.isArray(audit?.issues)?audit.issues:[]);
 const rows=flags.filter(x=>(x.subject||x.materia)===subject && ['high','medium'].includes(String(x.severity||x.gravidade||'').toLowerCase()));
 const preferred=rows.filter(x=>/DUPLICATE_STEM|DUPLICATE_OPTION_SET|GENERIC_TEMPLATE_LANGUAGE|WEAK_DISTRACTOR|SHORT_DISTRACTOR/i.test(String(x.code||x.codigo||'')));
 return [...new Set(preferred.map(x=>x.id).filter(Boolean))];
}

const report={generated_at:new Date().toISOString(),benchmark_files:['PSCPP 2006','PSCPP 2008','PSCPP 2011','PSCPP 2012','DPC 2023'],subjects:{},totals:{before:0,after:0,rewritten:0,added:0}};
for(const subject of SUBJECTS){
 const file=path.join(qdir,`${subject}.json`); const bank=JSON.parse(fs.readFileSync(file,'utf8')); const qs=bank.questions||[];
 const before=qs.length;report.totals.before+=before;
 const pool=qs.filter(safe);const groups=group(pool);if(!groups.length)throw new Error(`${subject}: sem grupos seguros`);
 const ids=flaggedIds(subject).slice(0,MAX_REWRITE_PER_SUBJECT);let rewritten=0;
 for(let i=0;i<ids.length;i++){
  const idx=qs.findIndex(q=>q.id===ids[i]);if(idx<0)continue;
  const old=qs[idx],g=sameGroup(old,groups)||groups[i%groups.length];
  let q;
  if(i%4===0) q=assertions(old.id,choose(g,(i*3)%g.questions.length,4),i);
  else if(i%4===1) q=seqvf(old.id,choose(g,(i*5)%g.questions.length,4),i);
  else if(i%4===2) q=incorrect(old.id,choose(g,(i*7)%g.questions.length,5),i);
  else q=direct(old.id,g.questions[(i*11)%g.questions.length],i);
  q.provenance.replaces_question_id=old.id;q.provenance.rewrite_reason='quality-audit-v2';qs[idx]=q;rewritten++;
 }
 const nextId=nextIdFactory(qs,subject);const added=[];
 for(let i=0;i<NEW_PER_SUBJECT;i++){
  const g=groups[(i*7)%groups.length];let q;
  if(i<20)q=assertions(nextId(),choose(g,(i*3)%g.questions.length,4),i+1000);
  else if(i<30)q=seqvf(nextId(),choose(g,(i*5)%g.questions.length,4),i+1000);
  else if(i<40)q=incorrect(nextId(),choose(g,(i*7)%g.questions.length,5),i+1000);
  else if(i<45)q=scenario(nextId(),g.questions[(i*9)%g.questions.length],i+1000);
  else q=direct(nextId(),g.questions[(i*11)%g.questions.length],i+1000);
  added.push(q);
 }
 qs.push(...added);bank.questions=qs;
 if('total_questions'in bank)bank.total_questions=qs.length;
 if(bank.validation&&typeof bank.validation==='object')bank.validation.total=qs.length;
 if(bank.metadata&&typeof bank.metadata==='object'&&'total_questions'in bank.metadata)bank.metadata.total_questions=qs.length;
 fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');
 report.subjects[subject]={before,after:qs.length,rewritten,added:added.length,safe_pool:pool.length,groups:groups.length};
 report.totals.rewritten+=rewritten;report.totals.added+=added.length;report.totals.after+=qs.length;
}
fs.writeFileSync(path.join(rdir,'pscpp-style-upgrade-v3.json'),JSON.stringify(report,null,2)+'\n');
const md=['# Auditoria e adequação ao padrão PSCPP — V3','',`Gerado em: ${report.generated_at}`,'',`Questões antes: **${report.totals.before}**`,`Questões depois: **${report.totals.after}**`,`Questões reformuladas por flags de qualidade: **${report.totals.rewritten}**`,`Questões novas em padrão PSCPP: **${report.totals.added}**`,'','## Critérios de benchmark','','- Provas PSCPP/DPC de 2006, 2008, 2011, 2012 e 2023 usadas como benchmark de formulação, dificuldade e formato.','- Conteúdo e gabaritos derivados apenas de questões já rastreadas à mesma obra/capítulo do banco; as provas históricas são referência de estilo, não fonte normativa.','- Prioridade para assertivas I–IV, sequências V/F, alternativa INCORRETA, múltipla escolha contextualizada e estudos de caso.','- Reformulação concentrada em itens previamente sinalizados por duplicidade, template genérico ou distratores fracos.','','| Matéria | Antes | Depois | Reformuladas | Novas | Pool seguro | Grupos obra/capítulo |','|---|---:|---:|---:|---:|---:|---:|'];
for(const s of SUBJECTS){const x=report.subjects[s];md.push(`| ${s} | ${x.before} | ${x.after} | ${x.rewritten} | ${x.added} | ${x.safe_pool} | ${x.groups} |`);}
fs.writeFileSync(path.join(rdir,'pscpp-style-upgrade-v3.md'),md.join('\n')+'\n');
console.log(JSON.stringify(report,null,2));
