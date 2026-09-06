import fs from 'node:fs';

const file = 'scripts/expand-question-formats-v1.mjs';
let s = fs.readFileSync(file, 'utf8');

const oldPrompt = "question: `Considerando ${chapterLabel(bases[0])}, assinale a alternativa INCORRETA.`,";
const newPrompt = "question: `Considerando ${chapterLabel(bases[0])} e o problema-base “${clean(bases[0].question)}”, assinale a alternativa INCORRETA entre as cinco afirmações apresentadas.`,";
if (s.includes(oldPrompt)) s = s.replace(oldPrompt, newPrompt);

const oldBlock = `  const existingPrompts = new Set(originalQuestions.map(q => norm(q.question)));
  for (const q of added) {
    if (existingIds.has(String(q.id)) || newIds.has(String(q.id))) throw new Error(\`${'${subjectSlug}'}: ID duplicado ${'${q.id}'}\`);
    newIds.add(String(q.id));
    const sig = norm(q.question);
    if (!sig || existingPrompts.has(sig)) throw new Error(\`${'${subjectSlug}'}: enunciado duplicado ${'${q.id}'}\`);
    existingPrompts.add(sig);
  }
`;
const newBlock = `  const existingSignatures = new Set(originalQuestions.map(q => norm(\`${'${q.question}'}|${'${(q.options || []).map(o => o.text).join("|")}'}\`)));
  for (const q of added) {
    if (existingIds.has(String(q.id)) || newIds.has(String(q.id))) throw new Error(\`${'${subjectSlug}'}: ID duplicado ${'${q.id}'}\`);
    newIds.add(String(q.id));
    const sig = norm(\`${'${q.question}'}|${'${(q.options || []).map(o => o.text).join("|")}'}\`);
    if (!sig || existingSignatures.has(sig)) throw new Error(\`${'${subjectSlug}'}: item duplicado ${'${q.id}'}\`);
    existingSignatures.add(sig);
  }
`;
if (s.includes(oldBlock)) s = s.replace(oldBlock, newBlock);
else if (!s.includes('existingSignatures')) throw new Error('Bloco de validação esperado não localizado no gerador');

if (!s.includes('function sourceRef(q)')) {
  const anchor = `function chapterLabel(q) {\n  return clean(q?.tracking?.chapter?.title || q?.tracking?.chapter?.label || q?.tracking?.section || q?.taxonomy?.chapter_id || 'unidade bibliográfica');\n}\n`;
  const insertion = `${anchor}function sourceRef(q) {\n  return clean([q?.source?.title || q?.tracking?.work?.title, q?.source?.locator || q?.tracking?.chapter?.title || q?.tracking?.chapter?.label].filter(Boolean).join(' — ')) || chapterLabel(q);\n}\n`;
  if (!s.includes(anchor)) throw new Error('Âncora chapterLabel não localizada');
  s = s.replace(anchor, insertion);
}

const promptReplacements = [
  [
    "question: `Julgue a afirmativa a seguir, considerando ${chapterLabel(base)}: “${statement}”.`,",
    "question: `Julgue a afirmativa a seguir, considerando ${chapterLabel(base)} e a referência ${sourceRef(base)}: “${statement}”.`,"
  ],
  [
    "question: `Complete corretamente a lacuna: em ${chapterLabel(base)}, a caracterização tecnicamente correta de “${topicLabel(base)}” é ______.`,",
    "question: `Complete corretamente a lacuna, considerando ${chapterLabel(base)} e a referência ${sourceRef(base)}: a caracterização tecnicamente correta de “${topicLabel(base)}” é ______.`,"
  ],
  [
    "question: `Durante um exercício de preparação operacional sobre ${chapterLabel(base)}, a equipe precisa resolver a seguinte situação técnica: “${clean(base.question)}” Considerando a bibliografia indicada para essa unidade, qual alternativa representa a decisão ou interpretação correta?`,",
    "question: `Durante um exercício de preparação operacional sobre ${chapterLabel(base)}, com base em ${sourceRef(base)}, a equipe precisa resolver a seguinte situação técnica: “${clean(base.question)}” Qual alternativa representa a decisão ou interpretação correta?`,"
  ]
];
for (const [oldText, newText] of promptReplacements) if (s.includes(oldText)) s = s.replace(oldText, newText);

const oldBases = `  function basesFor(seq, count, formatOffset) {\n    const g = groups[(seq + formatOffset) % groups.length];\n    const start = (seq * 3 + formatOffset * 5) % g.questions.length;\n    const out = [];\n    for (let i = 0; i < count; i++) out.push(g.questions[(start + i) % g.questions.length]);\n    return out;\n  }\n`;
const newBases = `  const flatPool = groups.flatMap(g => g.questions);\n  function basesFor(seq, count, formatOffset) {\n    if (count === 1) return [flatPool[(seq + formatOffset * PER_FORMAT) % flatPool.length]];\n    const g = groups[(seq + formatOffset) % groups.length];\n    const start = (seq * 3 + formatOffset * 5) % g.questions.length;\n    const out = [];\n    for (let i = 0; i < count; i++) out.push(g.questions[(start + i) % g.questions.length]);\n    return out;\n  }\n`;
if (s.includes(oldBases)) s = s.replace(oldBases, newBases);
else if (!s.includes('const flatPool = groups.flatMap')) throw new Error('Bloco basesFor esperado não localizado');

fs.writeFileSync(file, s);
console.log('Gerador endurecido com sucesso.');
