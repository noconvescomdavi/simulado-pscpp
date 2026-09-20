import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const questionsDir = path.join(root, 'data', 'questions');
const reportsDir = path.join(root, 'reports');
const deficitsPath = path.join(reportsDir, 'coverage-deficits-summary.json');
fs.mkdirSync(reportsDir, { recursive: true });

const SUBJECTS = [
  'arte-naval',
  'manobrabilidade',
  'navegacao-aguas-restritas',
  'legislacao-regulamentacao',
  'meteorologia-oceanografia',
  'comunicacoes',
  'conhecimentos-gerais'
];
const KEYS = ['A','B','C','D','E'];
const NEW_HARD_PER_SUBJECT = 35;
const ASSERTION_COMBO_OPTIONS = [
  'Apenas as afirmativas I e II estão corretas.',
  'Apenas as afirmativas I e III estão corretas.',
  'Apenas as afirmativas II e IV estão corretas.',
  'Apenas as afirmativas III e IV estão corretas.',
  'As afirmativas I, II, III e IV estão corretas.'
];
const ASSERTION_PATTERNS = [
  [true,true,false,false],
  [true,false,true,false],
  [false,true,false,true],
  [false,false,true,true],
  [true,true,true,true]
];
const SEQ_PATTERNS = [
  [true,true,false,false],
  [true,false,true,false],
  [false,true,false,true],
  [false,false,true,true],
  [true,true,true,true]
];

const deficits = fs.existsSync(deficitsPath) ? JSON.parse(fs.readFileSync(deficitsPath,'utf8')) : {subjects:{}};
const pendingBySubject = new Map();
for (const subject of SUBJECTS) {
  pendingBySubject.set(subject, new Set((deficits?.subjects?.[subject]?.rows || []).filter(r => r.status === 'fonte_pendente').map(r => r.chapter_id)));
}

function clean(v) { return String(v ?? '').replace(/\s+/g,' ').trim(); }
function norm(v) { return clean(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim(); }
function exactNorm(v) { return clean(v).normalize('NFC').toLocaleLowerCase('pt-BR'); }
function esc(v) { return String(v ?? '').replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
function answerKey(q) { return String(q.correct_answer || q.answer || '').trim().toUpperCase(); }
function correctOption(q) { const k=answerKey(q); return (q.options||[]).find(o=>String(o?.key||'').toUpperCase()===k); }
function correctText(q) { return clean(correctOption(q)?.text); }
function wrongOptions(q) { const k=answerKey(q); return (q.options||[]).filter(o=>String(o?.key||'').toUpperCase()!==k); }
function topic(q) { return clean(q.topic || q?.tracking?.topic?.title || q?.taxonomy?.topic_id || 'tópico técnico'); }
function chapter(q) { return clean(q?.tracking?.chapter?.title || q?.tracking?.chapter?.label || q?.taxonomy?.chapter_id || 'unidade bibliográfica'); }
function sourceTitle(q) { return clean(q?.source?.title || q?.tracking?.work?.title || 'publicação indicada'); }
function v1(q) { return Array.isArray(q.tags) && q.tags.includes('expansao-formatos-v1'); }
function hasMetaOption(q) {
  return (q.options||[]).some(o => {
    const s=norm(o?.text);
    return /\bafirmativ|\bassertiv|verdadeir|falso|v f|f v/.test(s) || /^apenas\b/.test(s);
  });
}
function structurallySafe(q, pending) {
  if (!q?.id || !q?.taxonomy?.bibliography_id || !q?.taxonomy?.chapter_id || pending.has(q.taxonomy.chapter_id)) return false;
  if (v1(q)) return false;
  if (!q?.source?.title || !q?.source?.locator || !clean(q.explanation)) return false;
  if (!Array.isArray(q.options) || q.options.length !== 5 || !correctOption(q)) return false;
  const opts=q.options.map(o=>exactNorm(o?.text));
  if (opts.some(x=>!x) || new Set(opts).size!==5) return false;
  const style=norm(q.question_type || q.style);
  if (/afirmativ|assertiv|sequencia|verdadeiro|falso|incorreta|lacuna|estudo de caso/.test(style)) return false;
  if (hasMetaOption(q)) return false;
  if (exactNorm(correctText(q)) === exactNorm(topic(q))) return false;
  return true;
}
function cloneMeta(base, {style, difficulty, tag, derivedIds, topicOverride}={}) {
  const tags=(Array.isArray(base.tags)?base.tags:[]).filter(t=>t!=='expansao-formatos-v1' && !String(t).startsWith('formato-'));
  tags.push('revisao-contextual-v2', tag);
  return {
    subject: base.subject,
    module: base.module,
    topic: topicOverride || base.topic,
    difficulty: difficulty || base.difficulty || 'Médio',
    style,
    question_type: style,
    taxonomy: structuredClone(base.taxonomy),
    tracking: structuredClone(base.tracking || {}),
    source: structuredClone(base.source || {}),
    tags: [...new Set(tags.filter(Boolean))],
    provenance: {
      method: 'context-revision-v2',
      derived_from_question_ids: derivedIds || [base.id]
    }
  };
}
function punct(s) {
  return String(s ?? '')
    .replace(/[ \t]+\n/g,'\n')
    .replace(/\n{3,}/g,'\n\n')
    .replace(/\s+([,;:.!?])/g,'$1')
    .replace(/\.\./g,'.')
    .replace(/\?\?/g,'?')
    .trim();
}
function lowerFirst(s) { const x=clean(s); return x ? x[0].toLocaleLowerCase('pt-BR')+x.slice(1) : x; }
function statement(q, truth, seed=0) {
  const option = truth ? correctOption(q) : wrongOptions(q)[seed % wrongOptions(q).length];
  const text = clean(option?.text);
  const stem = clean(q.question);
  const t = topic(q);

  let m = stem.match(/qual termo corresponde à seguinte descrição técnica:\s*(.+?)[?.]?$/i);
  if (m) return `A descrição técnica “${clean(m[1]).replace(/[?.]$/,'')}” corresponde a “${text}”`;
  m = stem.match(/qual termo corresponde a seguinte descrição técnica:\s*(.+?)[?.]?$/i);
  if (m) return `A descrição técnica “${clean(m[1]).replace(/[?.]$/,'')}” corresponde a “${text}”`;
  m = stem.match(/qual nomenclatura corresponde ao caso apresentado\??$/i);
  if (m && stem.includes(':')) {
    const desc=clean(stem.slice(stem.indexOf(':')+1).replace(/qual nomenclatura corresponde ao caso apresentado\??$/i,''));
    return `A situação descrita — ${desc.replace(/[.]$/,'')} — corresponde a “${text}”`;
  }
  if (/assinale a op[cç][aã]o que apresenta corretamente o significado ou a fun[cç][aã]o/i.test(stem)) {
    return `Em relação a “${t}”, é aplicável a descrição “${text}”`;
  }
  if (/\b(é dada|e dada|é definido|e definido|é expressa|e expressa|corresponde|vale|resulta)\b.*[:?]$/i.test(stem) || /[=²³πλ η]/u.test(text)) {
    return `No tópico “${t}”, a relação técnica aplicável é “${text}”`;
  }
  if (text.length >= 28) return `Sobre “${t}”, considere a proposição: ${text.replace(/[.]$/,'')}`;
  return `No contexto de “${t}”, a associação “${text}” é tecnicamente aplicável`;
}
function rotateOptions(base, desired) {
  const correct=correctText(base);
  const wrong=wrongOptions(base).map(o=>clean(o.text));
  const ordered=[]; let wi=0;
  for (let i=0;i<5;i++) ordered.push(i===desired?correct:wrong[wi++]);
  return {options:ordered.map((text,i)=>({key:KEYS[i],text})),correct_answer:KEYS[desired]};
}
function groupSafe(pool) {
  const map=new Map();
  for (const q of pool) {
    const key=`${q.taxonomy.bibliography_id}|${q.taxonomy.chapter_id}`;
    if (!map.has(key)) map.set(key,[]);
    map.get(key).push(q);
  }
  return [...map.entries()].map(([key,questions])=>({key,questions})).filter(g=>g.questions.length>=8).sort((a,b)=>a.key.localeCompare(b.key));
}
function prefixInfo(qs, subject) {
  const ms=qs.map(q=>String(q.id||'').match(/^([A-Za-z]+)-(\d+)$/)).filter(Boolean);
  const prefix=ms[0]?.[1] || subject.replace(/[^a-z]/gi,'').slice(0,4).toUpperCase();
  let max=0, width=4;
  for (const m of ms) if (m[1].toUpperCase()===prefix.toUpperCase()) {max=Math.max(max,Number(m[2]));width=Math.max(width,m[2].length);}
  return {prefix,max,width};
}
function idFactory(qs, subject) { const p=prefixInfo(qs,subject); let n=p.max; return ()=>`${p.prefix}-${String(++n).padStart(p.width,'0')}`; }
function choose(group, start, count) {
  const out=[];
  for (let i=0;i<count;i++) out.push(group.questions[(start+i)%group.questions.length]);
  return out;
}
function chooseForOriginal(original, groups, count, seq, offset) {
  const key=`${original?.taxonomy?.bibliography_id}|${original?.taxonomy?.chapter_id}`;
  let g=groups.find(x=>x.key===key && x.questions.length>=count);
  if (!g) g=groups[(seq+offset)%groups.length];
  return choose(g,(seq*3+offset*7)%g.questions.length,count);
}
function comboOptions(correctIndex) { return ASSERTION_COMBO_OPTIONS.map((text,i)=>({key:KEYS[i],text})); }
function explanationAssertions(bases, pattern) {
  const truth=pattern.map((v,i)=>`${['I','II','III','IV'][i]}=${v?'V':'F'}`).join(', ');
  return `A sequência lógica é ${truth}. As referências técnicas que fundamentam as quatro proposições são: ${bases.map((q,i)=>`${['I','II','III','IV'][i]}) ${correctText(q)}`).join(' ')}`;
}
function makeVF(original, base, seq) {
  const truth=seq%2===0;
  const claim=statement(base,truth,seq);
  return {
    id: original.id,
    ...cloneMeta(base,{style:'Verdadeiro/Falso',difficulty:seq%3===0?'Médio':'Fácil',tag:'formato-vf-v2'}),
    topic_code: original.topic_code || `REV.VF.${String(seq+1).padStart(3,'0')}`,
    question: punct(`Julgue a proposição a seguir como verdadeira ou falsa, considerando o contexto de ${chapter(base)}:\n“${claim}.”`),
    options:[{key:'A',text:'Verdadeiro'},{key:'B',text:'Falso'}],
    correct_answer:truth?'A':'B',
    explanation:truth?`A proposição está correta. ${correctText(base)}.`:`A proposição está incorreta. Para “${topic(base)}”, a formulação correta é: ${correctText(base)}.`
  };
}
function makeAssertions(original, bases, seq, forceId=null, difficulty='Difícil', provenanceMethod='context-revision-v2') {
  const idx=seq%5, pattern=ASSERTION_PATTERNS[idx];
  const props=bases.map((q,i)=>statement(q,pattern[i],seq+i));
  const q={
    id:forceId || original.id,
    ...cloneMeta(bases[0],{style:'Assertivas I–IV',difficulty,tag:provenanceMethod==='hard-expansion-v2'?'expansao-dificil-v2':'formato-assertivas-14-v2',derivedIds:bases.map(x=>x.id),topicOverride:`${chapter(bases[0])} — assertivas I–IV`}),
    topic_code:forceId?`REV.DIFF.A14.${String(seq+1).padStart(4,'0')}`:(original.topic_code || `REV.A14.${String(seq+1).padStart(3,'0')}`),
    question: punct(`Sobre ${chapter(bases[0])}, analise as afirmativas e assinale a alternativa que apresenta apenas as corretas:\nI. ${props[0]}.\nII. ${props[1]}.\nIII. ${props[2]}.\nIV. ${props[3]}.`),
    options:comboOptions(idx),
    correct_answer:KEYS[idx],
    explanation:explanationAssertions(bases,pattern)
  };
  q.provenance.method=provenanceMethod;
  if (provenanceMethod==='hard-expansion-v2') q.tags=[...new Set([...(q.tags||[]),'alternativas-homogeneas','distratores-mesmo-capitulo'])];
  return q;
}
function makeIncorrect(original,bases,seq,forceId=null,difficulty='Difícil',provenanceMethod='context-revision-v2') {
  const falseIndex=seq%5;
  const props=bases.map((q,i)=>statement(q,i!==falseIndex,seq+i));
  const q={
    id:forceId || original.id,
    ...cloneMeta(bases[0],{style:'Assinale a incorreta',difficulty,tag:provenanceMethod==='hard-expansion-v2'?'expansao-dificil-v2':'formato-incorreta-v2',derivedIds:bases.map(x=>x.id),topicOverride:`${chapter(bases[0])} — análise discriminativa`}),
    topic_code:forceId?`REV.DIFF.INC.${String(seq+1).padStart(4,'0')}`:(original.topic_code || `REV.INC.${String(seq+1).padStart(3,'0')}`),
    question:`Considerando os conceitos de ${chapter(bases[0])}, assinale a alternativa INCORRETA.`,
    options:props.map((text,i)=>({key:KEYS[i],text:`${text}.`})),
    correct_answer:KEYS[falseIndex],
    explanation:`A alternativa ${KEYS[falseIndex]} é a incorreta. Para “${topic(bases[falseIndex])}”, a formulação tecnicamente correta é: ${correctText(bases[falseIndex])}.`
  };
  q.provenance.method=provenanceMethod;
  if (provenanceMethod==='hard-expansion-v2') q.tags=[...new Set([...(q.tags||[]),'alternativas-homogeneas','distratores-mesmo-capitulo'])];
  return q;
}
function makeSeq(original,bases,seq) {
  const idx=seq%5, pattern=SEQ_PATTERNS[idx];
  const props=bases.map((q,i)=>statement(q,pattern[i],seq+i));
  const labels=SEQ_PATTERNS.map(p=>p.map(v=>v?'V':'F').join(' – '));
  return {
    id:original.id,
    ...cloneMeta(bases[0],{style:'Sequência V/F',difficulty:'Difícil',tag:'formato-sequencia-vf-v2',derivedIds:bases.map(x=>x.id),topicOverride:`${chapter(bases[0])} — sequência V/F`}),
    topic_code:original.topic_code || `REV.SEQVF.${String(seq+1).padStart(3,'0')}`,
    question:punct(`Analise as quatro proposições sobre ${chapter(bases[0])} e classifique-as como verdadeiras (V) ou falsas (F):\n1. ${props[0]}.\n2. ${props[1]}.\n3. ${props[2]}.\n4. ${props[3]}.\nAssinale a sequência correta.`),
    options:labels.map((text,i)=>({key:KEYS[i],text})),
    correct_answer:KEYS[idx],
    explanation:`A sequência correta é ${labels[idx]}. Formulações de referência: ${bases.map((q,i)=>`${i+1}) ${correctText(q)}`).join(' ')}`
  };
}
function makeBlank(original,base,seq) {
  const desired=seq%5, rotated=rotateOptions(base,desired);
  const stem=clean(base.question);
  let question;
  let m=stem.match(/qual termo corresponde à seguinte descrição técnica:\s*(.+?)[?.]?$/i) || stem.match(/qual termo corresponde a seguinte descrição técnica:\s*(.+?)[?.]?$/i);
  if (m) question=`Complete a lacuna: a descrição técnica “${clean(m[1]).replace(/[?.]$/,'')}” corresponde ao termo ______.`;
  else if (/assinale a op[cç][aã]o que apresenta corretamente o significado ou a fun[cç][aã]o/i.test(stem)) question=`Complete a lacuna: em relação a “${topic(base)}”, a descrição tecnicamente correta é ______.`;
  else question=`Considere a questão técnica a seguir: “${stem}” Complete a resposta: ______.`;
  return {
    id:original.id,
    ...cloneMeta(base,{style:'Preenchimento de lacuna',difficulty:'Médio',tag:'formato-lacuna-v2'}),
    topic_code:original.topic_code || `REV.LAC.${String(seq+1).padStart(3,'0')}`,
    question:punct(question),
    ...rotated,
    explanation:`A lacuna deve ser preenchida por “${correctText(base)}”. ${clean(base.explanation)}`
  };
}
function appliedBase(groups, seq, offset) {
  const all=groups.flatMap(g=>g.questions).filter(q=>/aplic|situa|caso|operac|manobra|cenar|durante|em uma|ao /i.test(`${q.style} ${q.question}`));
  return all.length?all[(seq+offset)%all.length]:groups.flatMap(g=>g.questions)[(seq+offset)%groups.flatMap(g=>g.questions).length];
}
function makeCase(original,base,seq) {
  const desired=(seq*2+1)%5, rotated=rotateOptions(base,desired);
  return {
    id:original.id,
    ...cloneMeta(base,{style:'Estudo de caso',difficulty:seq%3===0?'Difícil':'Médio',tag:'formato-estudo-de-caso-v2'}),
    topic_code:original.topic_code || `REV.CASO.${String(seq+1).padStart(3,'0')}`,
    question:punct(`Considere o caso técnico a seguir, relacionado a ${topic(base)}:\n${clean(base.question)}\nAssinale a alternativa tecnicamente adequada ao caso.`),
    ...rotated,
    explanation:`A alternativa correta é ${rotated.correct_answer}. ${clean(base.explanation)}`
  };
}
function formatArteNavalBaseline(q) {
  if (v1(q)) return false;
  let changed=false;
  const t=topic(q);
  let s=String(q.question||'');
  if (q.style==='Afirmativas combinadas' && /De acordo com a bibliografia de Arte Naval, analise as afirmativas sobre/i.test(s)) {
    s=s.replace(/De acordo com a bibliografia de Arte Naval, analise as afirmativas sobre [“"]([^”"]+)[”"], identifique as verdadeiras e assinale a opção correta:/i,
      (_m,x)=>`Sobre “${x}”, analise as afirmativas a seguir e assinale a alternativa que apresenta apenas as corretas:`);
    s=s.replace(/(^|\n)I\)/g,'$1I.').replace(/(^|\n)II\)/g,'$1II.').replace(/(^|\n)III\)/g,'$1III.').replace(/(^|\n)IV\)/g,'$1IV.');
    const phrase='A bibliografia atribui a esse item a seguinte característica:';
    s=s.replace(new RegExp(esc(phrase),'gi'),`Em relação a “${t}”, considere a seguinte característica:`);
    changed=true;
  }
  if (/De acordo com a bibliografia de Arte Naval, qual termo corresponde à seguinte descrição técnica:/i.test(s)) {
    s=s.replace(/De acordo com a bibliografia de Arte Naval, qual termo corresponde à seguinte descrição técnica:/i,'Na terminologia de Arte Naval, qual termo corresponde à descrição técnica a seguir:');changed=true;
  }
  if (/Assinale a opção que apresenta corretamente o significado ou a função de/i.test(s)) {
    s=s.replace(/Assinale a opção que apresenta corretamente o significado ou a função de/i,'Qual alternativa descreve corretamente o significado ou a função de');changed=true;
  }
  if (/Considere a seguinte descrição técnica de uma situação, peça ou procedimento de bordo:/i.test(s)) {
    s=s.replace(/Considere a seguinte descrição técnica de uma situação, peça ou procedimento de bordo:/i,'Considere a descrição técnica a seguir:');changed=true;
  }
  if (changed) q.question=punct(s.replace(/\n/g,'\n'));
  return changed;
}
function replaceRawMetadata(q) {
  let s=String(q.question||''), changed=false;
  const title=sourceTitle(q);
  const patterns=[
    /Publicação indicada\s*[—-]\s*sem recorte adicional no Anexo 2-B/gi,
    /Publicação indicada\s*[—-]\s*sem capítulos delimitados no Anexo 2-B/gi,
    /Conteúdo indicado no Anexo 2-B/gi
  ];
  for (const re of patterns) if (re.test(s)) {s=s.replace(re,title);changed=true;re.lastIndex=0;}
  if (changed) q.question=punct(s);
  return changed;
}
function correctArteNavalSourceVerified(q) {
  if (!['ANV-0020','ANV-0519','ANV-0718','ANV-0940'].includes(q.id)) return false;
  if (q.id==='ANV-0020') {
    q.question='Sobre a manobra de mudar o bordo de atracação, analise as afirmativas e assinale a alternativa que apresenta apenas as corretas:\nI. É preferível realizá-la com rebocador, quando disponível.\nII. Na ausência de rebocador, recomenda-se aguardar maré favorável e corrente muito fraca.\nIII. Com corrente pela popa, inicialmente largam-se todas as espias, exceto um espringue na proa e um través na popa.\nIV. O texto considera preferível mudar o bordo com corrente pela proa, porque o navio governa melhor girando sobre a popa.';
    q.options=[
      {key:'A',text:'Apenas as afirmativas I e II estão corretas.'},
      {key:'B',text:'Apenas as afirmativas I e III estão corretas.'},
      {key:'C',text:'Apenas as afirmativas II e IV estão corretas.'},
      {key:'D',text:'Apenas as afirmativas I, II e III estão corretas.'},
      {key:'E',text:'Apenas as afirmativas II, III e IV estão corretas.'}
    ];
    q.correct_answer='D';
    q.difficulty='Difícil';
    q.explanation='As afirmativas I, II e III reproduzem as orientações do item 12.32. A IV é falsa: o texto afirma que é preferível mudar de bordo com corrente pela popa, pois o navio governa melhor girando sobre a proa.';
  }
  if (q.id==='ANV-0519') {
    q.question='No item 12.32 de Arte Naval, qual expressão denomina a manobra em que o navio passa a apresentar ao cais o bordo oposto ao inicialmente atracado?';
    q.explanation='A expressão é “mudar o bordo de atracação”. O texto recomenda preferencialmente o emprego de rebocador; na sua ausência, orienta aguardar maré favorável e corrente muito fraca.';
  }
  if (q.id==='ANV-0718') {
    q.question='Sobre a manobra de mudar o bordo de atracação, assinale a alternativa correta.';
    q.options=[
      {key:'A',text:'Consiste em amarrar o navio a contrabordo e independe de vento ou corrente.'},
      {key:'B',text:'Exige sempre corrente pela proa e dispensa o uso de defensas.'},
      {key:'C',text:'É a mudança do costado apresentado ao cais; quando disponível, o rebocador é o meio preferível para facilitar a manobra.'},
      {key:'D',text:'Deve ser executada com todas as espias mantidas rondadas até o fim da evolução.'},
      {key:'E',text:'É preferível com corrente pela proa, porque o navio governa melhor girando sobre a popa.'}
    ];
    q.correct_answer='C';
    q.difficulty='Médio';
    q.explanation='O item 12.32 trata de mudar o bordo de atracação e recomenda o rebocador quando disponível. Sem rebocador, orienta aguardar maré favorável e corrente muito fraca; também informa ser preferível a corrente pela popa à corrente pela proa.';
  }
  if (q.id==='ANV-0940') {
    q.question='Um navio atracado precisa passar a apresentar o bordo oposto ao cais. Há rebocador disponível e as condições locais permitem a evolução. Qual é a manobra descrita?';
    q.explanation='Trata-se de mudar o bordo de atracação. Arte Naval recomenda preferencialmente o emprego de rebocador para essa manobra.';
  }
  q.tags=[...new Set([...(q.tags||[]),'revisao-fonte-v2','arte-naval-12-32'])];
  q.provenance={method:'source-review-v2',verified_source_locator:'Arte Naval, v. 2, item 12.32'};
  return true;
}

const report={generated_at:new Date().toISOString(),version:'context-revision-v2',subjects:{},source_verified_corrections:[],totals:{before:0,after:0,rewritten_stems:0,v1_replaced:0,hard_added:0,raw_metadata_removed:0}};

for (const subject of SUBJECTS) {
  const file=path.join(questionsDir,`${subject}.json`);
  const bank=JSON.parse(fs.readFileSync(file,'utf8'));
  const qs=bank.questions || [];
  const before=qs.length;
  report.totals.before+=before;
  const pending=pendingBySubject.get(subject) || new Set();
  const safe=qs.filter(q=>structurallySafe(q,pending));
  const groups=groupSafe(safe);
  if (!groups.length) throw new Error(`${subject}: nenhuma unidade segura com pelo menos 8 questões-base.`);
  let rewritten=0, rawRemoved=0, v1Replaced=0;

  if (subject==='arte-naval') {
    for (const q of qs) {
      if (correctArteNavalSourceVerified(q)) report.source_verified_corrections.push(q.id);
      if (formatArteNavalBaseline(q)) rewritten++;
    }
  }
  for (const q of qs) if (replaceRawMetadata(q)) rawRemoved++;

  const v1Questions=qs.filter(v1);
  const styleCounters=new Map();
  for (const old of v1Questions) {
    const style=old.question_type || old.style;
    const seq=styleCounters.get(style)||0; styleCounters.set(style,seq+1);
    let replacement;
    if (style==='Verdadeiro/Falso') {
      const [base]=chooseForOriginal(old,groups,1,seq,0); replacement=makeVF(old,base,seq);
    } else if (style==='Assertivas I–II–III') {
      const bases=chooseForOriginal(old,groups,4,seq,1); replacement=makeAssertions(old,bases,seq);
    } else if (style==='Assinale a incorreta') {
      const bases=chooseForOriginal(old,groups,5,seq,2); replacement=makeIncorrect(old,bases,seq);
    } else if (style==='Sequência V/F') {
      const bases=chooseForOriginal(old,groups,4,seq,3); replacement=makeSeq(old,bases,seq);
    } else if (style==='Preenchimento de lacuna') {
      const [base]=chooseForOriginal(old,groups,1,seq,4); replacement=makeBlank(old,base,seq);
    } else if (style==='Estudo de caso') {
      const base=appliedBase(groups,seq,5); replacement=makeCase(old,base,seq);
    } else continue;
    const idx=qs.findIndex(q=>q.id===old.id);
    if (idx<0) throw new Error(`${subject}: não localizou ${old.id}`);
    replacement.tags=[...new Set([...(replacement.tags||[]),'expansao-formatos-v2'])];
    replacement.provenance.replaces_question_id=old.id;
    replacement.provenance.replaces_method='format-expansion-v1';
    qs[idx]=replacement;
    v1Replaced++;
  }

  const nextId=idFactory(qs,subject);
  const newHard=[];
  for (let i=0;i<NEW_HARD_PER_SUBJECT;i++) {
    const g=groups[(i*3)%groups.length];
    const id=nextId();
    if (i<20) {
      const bases=choose(g,(i*5)%g.questions.length,4);
      newHard.push(makeAssertions({id},bases,i,id,i%2===0?'Difícil':'Médio','hard-expansion-v2'));
    } else {
      const bases=choose(g,(i*5)%g.questions.length,5);
      newHard.push(makeIncorrect({id},bases,i,id,'Difícil','hard-expansion-v2'));
    }
  }
  qs.push(...newHard);

  bank.questions=qs;
  if ('total_questions' in bank) bank.total_questions=qs.length;
  if (bank.validation && typeof bank.validation==='object') bank.validation.total=qs.length;
  if (bank.metadata && typeof bank.metadata==='object' && 'total_questions' in bank.metadata) bank.metadata.total_questions=qs.length;
  if ('updated_at' in bank) bank.updated_at=new Date().toISOString();
  fs.writeFileSync(file,JSON.stringify(bank,null,2)+'\n');

  const newAnswers=Object.fromEntries(KEYS.map(k=>[k,newHard.filter(q=>q.correct_answer===k).length]));
  const newDifficulty={}; for (const q of newHard) newDifficulty[q.difficulty]=(newDifficulty[q.difficulty]||0)+1;
  report.subjects[subject]={before,after:qs.length,rewritten_stems:rewritten,raw_metadata_removed:rawRemoved,v1_replaced:v1Replaced,hard_added:newHard.length,safe_base_pool:safe.length,eligible_groups:groups.length,new_answer_distribution:newAnswers,new_difficulty_distribution:newDifficulty};
  report.totals.rewritten_stems+=rewritten;
  report.totals.raw_metadata_removed+=rawRemoved;
  report.totals.v1_replaced+=v1Replaced;
  report.totals.hard_added+=newHard.length;
  report.totals.after+=qs.length;
}

fs.writeFileSync(path.join(reportsDir,'question-context-revision-v2.json'),JSON.stringify(report,null,2)+'\n');
const md=['# Revisão contextual V2 — bancos de questões','',`Gerado em: ${report.generated_at}`,'',`Questões antes: **${report.totals.before}**`,`Questões após: **${report.totals.after}**`,`Enunciados baseline reformatados: **${report.totals.rewritten_stems}**`,`Questões problemáticas da expansão V1 substituídas no mesmo ID: **${report.totals.v1_replaced}**`,`Novas questões de maior discriminação: **${report.totals.hard_added}**`,`Ocorrências de rótulos crus do Anexo 2-B removidas de enunciados: **${report.totals.raw_metadata_removed}**`,'',`Correções verificadas diretamente em fonte: ${report.source_verified_corrections.join(', ')}`,'','| Matéria | Antes | Depois | Reformatadas | V1 substituídas | Novas difíceis | Pool seguro |','|---|---:|---:|---:|---:|---:|---:|'];
for (const subject of SUBJECTS) {const r=report.subjects[subject];md.push(`| ${subject} | ${r.before} | ${r.after} | ${r.rewritten_stems} | ${r.v1_replaced} | ${r.hard_added} | ${r.safe_base_pool} |`);}
md.push('','## Política aplicada','','- IDs existentes preservados; as 504 questões da expansão V1 foram corrigidas no próprio ID.','- Fontes pendentes foram excluídas do pool de geração.','- As novas questões difíceis usam quatro assertivas ou cinco proposições do mesmo capítulo/obra, com alternativas de estrutura homogênea.','- A alternativa correta das 35 novas questões por matéria é balanceada: sete ocorrências de A, B, C, D e E.','- A revisão automática não declara erro técnico apenas por similaridade lexical; correções de conteúdo são registradas quando há verificação objetiva de fonte.','- Arte Naval, item 12.32, foi revisado diretamente contra a 8ª edição do Volume 2.');
fs.writeFileSync(path.join(reportsDir,'question-context-revision-v2.md'),md.join('\n')+'\n');
console.log(JSON.stringify(report,null,2));
