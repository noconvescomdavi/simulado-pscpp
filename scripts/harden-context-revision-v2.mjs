import fs from 'node:fs';

const file='scripts/revise-question-banks-context-v2.mjs';
let s=fs.readFileSync(file,'utf8');

const oldGroup=`function groupSafe(pool) {
  const map=new Map();
  for (const q of pool) {
    const key=\`${'${q.taxonomy.bibliography_id}'}|${'${q.taxonomy.chapter_id}'}\`;
    if (!map.has(key)) map.set(key,[]);
    map.get(key).push(q);
  }
  return [...map.entries()].map(([key,questions])=>({key,questions})).filter(g=>g.questions.length>=8).sort((a,b)=>a.key.localeCompare(b.key));
}`;
const newGroup=`function groupSafe(pool) {
  const map=new Map();
  const seenByGroup=new Map();
  for (const q of pool) {
    const key=\`${'${q.taxonomy.bibliography_id}'}|${'${q.taxonomy.chapter_id}'}\`;
    if (!map.has(key)) { map.set(key,[]); seenByGroup.set(key,new Set()); }
    const sig=exactNorm(\`${'${topic(q)}'}|${'${correctText(q)}'}|${'${wrongOptions(q).map(o=>clean(o.text)).join("|")}'}\`);
    if (!sig || seenByGroup.get(key).has(sig)) continue;
    seenByGroup.get(key).add(sig);
    map.get(key).push(q);
  }
  return [...map.entries()].map(([key,questions])=>({key,questions})).filter(g=>g.questions.length>=8).sort((a,b)=>a.key.localeCompare(b.key));
}`;
if (s.includes(oldGroup)) s=s.replace(oldGroup,newGroup); else if (!s.includes('seenByGroup')) throw new Error('groupSafe esperado não localizado');

const oldChoose=`function chooseForOriginal(original, groups, count, seq, offset) {
  const key=\`${'${original?.taxonomy?.bibliography_id}'}|${'${original?.taxonomy?.chapter_id}'}\`;
  let g=groups.find(x=>x.key===key && x.questions.length>=count);
  if (!g) g=groups[(seq+offset)%groups.length];
  return choose(g,(seq*3+offset*7)%g.questions.length,count);
}`;
const newChoose=`function chooseForOriginal(original, groups, count, seq, offset) {
  if (count===1) {
    const flat=groups.flatMap(g=>g.questions);
    return [flat[(seq + offset*37) % flat.length]];
  }
  const key=\`${'${original?.taxonomy?.bibliography_id}'}|${'${original?.taxonomy?.chapter_id}'}\`;
  let g=groups.find(x=>x.key===key && x.questions.length>=count);
  if (!g) g=groups[(seq+offset)%groups.length];
  const start=(seq*5 + Math.floor(seq/5)*2 + offset*7)%g.questions.length;
  return choose(g,start,count);
}`;
if (s.includes(oldChoose)) s=s.replace(oldChoose,newChoose); else if (!s.includes('offset*37')) throw new Error('chooseForOriginal esperado não localizado');

if (!s.includes('function distinctProps(')) {
  const anchor=`function comboOptions(correctIndex) { return ASSERTION_COMBO_OPTIONS.map((text,i)=>({key:KEYS[i],text})); }`;
  const insertion=`function distinctProps(props,bases) {
  const seen=new Set();
  return props.map((p,i)=>{
    let out=clean(p);
    let key=exactNorm(out);
    if (!seen.has(key)) { seen.add(key); return out; }
    out=\`${'${out}'}; no contexto específico de “${'${topic(bases[i])}'}”, considere a formulação “${'${clean(bases[i].question)}'}”\`;
    key=exactNorm(out);
    if (seen.has(key)) out += \` [${'${bases[i].id}'}]\`;
    seen.add(exactNorm(out));
    return out;
  });
}
${anchor}`;
  if (!s.includes(anchor)) throw new Error('âncora comboOptions não localizada');
  s=s.replace(anchor,insertion);
}

s=s.replace(
  `const props=bases.map((q,i)=>statement(q,pattern[i],seq+i));\n  const q={`,
  `const props=distinctProps(bases.map((q,i)=>statement(q,pattern[i],seq+i)),bases);\n  const q={`
);
s=s.replace(
  `const props=bases.map((q,i)=>statement(q,i!==falseIndex,seq+i));\n  const q={`,
  `const props=distinctProps(bases.map((q,i)=>statement(q,i!==falseIndex,seq+i)),bases);\n  const q={`
);

s=s.replace(
  `question:\`Considerando os conceitos de ${'${chapter(bases[0])}'}, assinale a alternativa INCORRETA.\`,`,
  `question:\`Considerando ${'${chapter(bases[0])}'}, com foco comparativo em ${'${[...new Set(bases.map(topic))].slice(0,3).map(x=>`“${x}”`).join(", ")}'}, assinale a alternativa INCORRETA.\`,`
);

s=s.replace(
  `{key:'D',text:'Apenas as afirmativas I, II e III estão corretas.'},\n      {key:'E',text:'Apenas as afirmativas II, III e IV estão corretas.'}\n    ];\n    q.correct_answer='D';`,
  `{key:'D',text:'Apenas as afirmativas II, III e IV estão corretas.'},\n      {key:'E',text:'Apenas as afirmativas I, II e III estão corretas.'}\n    ];\n    q.correct_answer='E';`
);

const oldLoop=`    const g=groups[(i*3)%groups.length];
    const id=nextId();
    if (i<20) {
      const bases=choose(g,(i*5)%g.questions.length,4);
      newHard.push(makeAssertions({id},bases,i,id,i%2===0?'Difícil':'Médio','hard-expansion-v2'));
    } else {
      const bases=choose(g,(i*5)%g.questions.length,5);
      newHard.push(makeIncorrect({id},bases,i,id,'Difícil','hard-expansion-v2'));
    }`;
const newLoop=`    const g=groups[i%groups.length];
    const id=nextId();
    const start=(i + Math.floor(i/groups.length)*5) % g.questions.length;
    if (i<20) {
      const bases=choose(g,start,4);
      newHard.push(makeAssertions({id},bases,i,id,i%2===0?'Difícil':'Médio','hard-expansion-v2'));
    } else {
      const bases=choose(g,start,5);
      newHard.push(makeIncorrect({id},bases,i,id,'Difícil','hard-expansion-v2'));
    }`;
if (s.includes(oldLoop)) s=s.replace(oldLoop,newLoop); else if (!s.includes('Math.floor(i/groups.length)*5')) throw new Error('loop hard esperado não localizado');

fs.writeFileSync(file,s);
console.log('Revisão V2 endurecida para unicidade, enunciados comparativos e preservação do baseline.');
