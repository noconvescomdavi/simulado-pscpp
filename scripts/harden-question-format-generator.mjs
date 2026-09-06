import fs from 'node:fs';

const file = 'scripts/expand-question-formats-v1.mjs';
let s = fs.readFileSync(file, 'utf8');

const replaceOnce = (oldText, newText, label, allowAlready = null) => {
  if (s.includes(oldText)) s = s.replace(oldText, newText);
  else if (!(allowAlready && s.includes(allowAlready))) throw new Error(`${label}: trecho esperado não localizado`);
};

replaceOnce(
  "question: `Considerando ${chapterLabel(bases[0])}, assinale a alternativa INCORRETA.`,",
  "question: `Considerando ${chapterLabel(bases[0])} e o problema-base “${clean(bases[0].question)}”, assinale a alternativa INCORRETA entre as cinco afirmações apresentadas.`,",
  'prompt incorreta',
  'problema-base “${clean(bases[0].question)}”'
);

const oldValidation = `  const existingPrompts = new Set(originalQuestions.map(q => norm(q.question)));
  for (const q of added) {
    if (existingIds.has(String(q.id)) || newIds.has(String(q.id))) throw new Error(\`${'${subjectSlug}'}: ID duplicado ${'${q.id}'}\`);
    newIds.add(String(q.id));
    const sig = norm(q.question);
    if (!sig || existingPrompts.has(sig)) throw new Error(\`${'${subjectSlug}'}: enunciado duplicado ${'${q.id}'}\`);
    existingPrompts.add(sig);
  }
`;
const newValidation = `  const existingSignatures = new Set(originalQuestions.map(q => norm(\`${'${q.question}'}|${'${(q.options || []).map(o => o.text).join("|")}'}\`)));
  for (const q of added) {
    if (existingIds.has(String(q.id)) || newIds.has(String(q.id))) throw new Error(\`${'${subjectSlug}'}: ID duplicado ${'${q.id}'}\`);
    newIds.add(String(q.id));
    const texts = (q.options || []).map(o => norm(o.text));
    if (texts.some(t => !t) || new Set(texts).size !== texts.length) throw new Error(\`${'${subjectSlug}'}: alternativas repetidas/vazias em ${'${q.id}'}\`);
    const sig = norm(\`${'${q.question}'}|${'${(q.options || []).map(o => o.text).join("|")}'}\`);
    if (!sig || existingSignatures.has(sig)) throw new Error(\`${'${subjectSlug}'}: item duplicado ${'${q.id}'}\`);
    existingSignatures.add(sig);
  }
`;
if (s.includes(oldValidation)) s = s.replace(oldValidation, newValidation);
else if (s.includes('const existingSignatures')) {
  s = s.replace(
    `    const sig = norm(\`${'${q.question}'}|${'${(q.options || []).map(o => o.text).join("|")}'}\`);\n`,
    `    const texts = (q.options || []).map(o => norm(o.text));\n    if (texts.some(t => !t) || new Set(texts).size !== texts.length) throw new Error(\`${'${subjectSlug}'}: alternativas repetidas/vazias em ${'${q.id}'}\`);\n    const sig = norm(\`${'${q.question}'}|${'${(q.options || []).map(o => o.text).join("|")}'}\`);\n`
  );
} else throw new Error('bloco de validação não localizado');

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

replaceOnce(
  `  if (!correctText(q) || wrongTexts(q).length < 1) return false;\n`,
  `  if (!correctText(q) || wrongTexts(q).length < 4) return false;\n  const optionTexts = q.options.map(o => norm(o?.text));\n  if (optionTexts.some(t => !t) || new Set(optionTexts).size !== optionTexts.length) return false;\n`,
  'filtro de alternativas',
  'wrongTexts(q).length < 4'
);

replaceOnce(
  `  while (wrong.length < 4) wrong.push(\`Distrator técnico ${'${wrong.length + 1}'}\`);\n`,
  `  if (wrong.length < 4) throw new Error('Questão-base sem quatro distratores distintos');\n`,
  'placeholder de distratores',
  "Questão-base sem quatro distratores distintos"
);

const oldGroup = `function groupByChapter(pool) {
  const map = new Map();
  for (const q of pool) {
    const id = q.taxonomy.chapter_id;
    if (!map.has(id)) map.set(id, []);
    map.get(id).push(q);
  }
  return [...map.entries()]
    .map(([chapterId, questions]) => ({ chapterId, questions }))
    .filter(g => g.questions.length >= 6)
    .sort((a, b) => a.chapterId.localeCompare(b.chapterId));
}
`;
const newGroup = `function groupByChapter(pool) {
  const map = new Map();
  const seen = new Map();
  for (const q of pool) {
    const id = q.taxonomy.chapter_id;
    if (!map.has(id)) { map.set(id, []); seen.set(id, new Set()); }
    const statementSig = norm(\`${'${topicLabel(q)}'}|${'${correctText(q)}'}\`);
    if (!statementSig || seen.get(id).has(statementSig)) continue;
    seen.get(id).add(statementSig);
    map.get(id).push(q);
  }
  return [...map.entries()]
    .map(([chapterId, questions]) => ({ chapterId, questions }))
    .filter(g => g.questions.length >= 6)
    .sort((a, b) => a.chapterId.localeCompare(b.chapterId));
}
`;
replaceOnce(oldGroup, newGroup, 'agrupamento por capítulo', 'const seen = new Map();');

const oldPool = `  const pool = originalQuestions.filter(q => eligibleQuestion(q, blocked));\n  const groups = groupByChapter(pool);\n`;
const newPool = `  const rawPool = originalQuestions.filter(q => eligibleQuestion(q, blocked));\n  const seenBaseSignatures = new Set();\n  const pool = [];\n  for (const q of rawPool) {\n    const sig = norm(\`${'${q.taxonomy.chapter_id}'}|${'${topicLabel(q)}'}|${'${correctText(q)}'}|${'${wrongTexts(q).join("|")}'}|${'${sourceRef(q)}'}\`);\n    if (!sig || seenBaseSignatures.has(sig)) continue;\n    seenBaseSignatures.add(sig);\n    pool.push(q);\n  }\n  const groups = groupByChapter(pool);\n`;
if (s.includes(oldPool)) s = s.replace(oldPool, newPool);
else if (!s.includes('seenBaseSignatures')) throw new Error('Bloco de pool esperado não localizado');

const oldBases = `  function basesFor(seq, count, formatOffset) {\n    const g = groups[(seq + formatOffset) % groups.length];\n    const start = (seq * 3 + formatOffset * 5) % g.questions.length;\n    const out = [];\n    for (let i = 0; i < count; i++) out.push(g.questions[(start + i) % g.questions.length]);\n    return out;\n  }\n`;
const newBases = `  const flatPool = groups.flatMap(g => g.questions);\n  function basesFor(seq, count, formatOffset) {\n    if (count === 1) return [flatPool[(seq + formatOffset * PER_FORMAT) % flatPool.length]];\n    const g = groups[(seq + formatOffset) % groups.length];\n    const start = (seq * 3 + formatOffset * 5) % g.questions.length;\n    const out = [];\n    for (let i = 0; i < count; i++) out.push(g.questions[(start + i) % g.questions.length]);\n    return out;\n  }\n`;
if (s.includes(oldBases)) s = s.replace(oldBases, newBases);
else if (!s.includes('const flatPool = groups.flatMap')) throw new Error('Bloco basesFor esperado não localizado');

replaceOnce(
  `  const originalQuestions = bank.questions || [];\n`,
  `  const originalQuestions = bank.questions || [];\n  const beforeCount = originalQuestions.length;\n`,
  'beforeCount',
  'const beforeCount = originalQuestions.length;'
);
replaceOnce(
  `    before: originalQuestions.length,\n`,
  `    before: beforeCount,\n`,
  'relatório before',
  'before: beforeCount,'
);

fs.writeFileSync(file, s);
console.log('Gerador endurecido com sucesso.');
