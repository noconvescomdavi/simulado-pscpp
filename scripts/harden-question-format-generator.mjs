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

fs.writeFileSync(file, s);
console.log('Gerador endurecido com sucesso.');
