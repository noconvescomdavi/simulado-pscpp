import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'data', 'questions');
const subjects = ['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const wanted = new Set(['MAN-076','MAN-090','MAN-284']);
const out = ['# Amostras para revisão profunda',''];

function render(q) {
  out.push(`## ${q.id} — ${q.subject || ''}`);
  out.push('');
  out.push(`**Formato:** ${q.question_type || q.style || ''}`);
  out.push(`**Tópico:** ${q.topic || q?.tracking?.topic?.title || ''}`);
  out.push(`**Capítulo:** ${q?.tracking?.chapter?.title || q?.tracking?.chapter?.label || q?.taxonomy?.chapter_id || ''}`);
  out.push(`**Fonte:** ${q?.source?.title || ''} — ${q?.source?.locator || ''}`);
  out.push('');
  out.push(String(q.question || '').replace(/\n/g,'  \n'));
  out.push('');
  for (const o of q.options || []) out.push(`- ${o.key}) ${o.text}`);
  out.push(`- **Gabarito:** ${q.correct_answer || q.answer || ''}`);
  out.push(`- **Explicação:** ${q.explanation || ''}`);
  out.push(`- **Tags:** ${(q.tags || []).join(', ')}`);
  out.push(`- **Proveniência:** ${JSON.stringify(q.provenance || {})}`);
  out.push('');
}

for (const subject of subjects) {
  const bank = JSON.parse(fs.readFileSync(path.join(dir, `${subject}.json`), 'utf8'));
  const qs = bank.questions || [];
  out.push(`# ${subject}`,'');
  for (const q of qs.filter(q => wanted.has(q.id))) render(q);
  const v1 = qs.filter(q => Array.isArray(q.tags) && q.tags.includes('expansao-formatos-v1'));
  const byStyle = new Map();
  for (const q of v1) {
    const s = q.question_type || q.style || 'sem-formato';
    if (!byStyle.has(s)) byStyle.set(s, []);
    byStyle.get(s).push(q);
  }
  for (const [style, items] of byStyle) {
    out.push(`## Expansão V1 — ${style}`,'');
    for (const q of items.slice(0, 2)) render(q);
  }
}

fs.mkdirSync(path.join(root,'reports'), {recursive:true});
fs.writeFileSync(path.join(root,'reports','question-quality-samples.md'), out.join('\n')+'\n');
console.log('Amostras gravadas em reports/question-quality-samples.md');
