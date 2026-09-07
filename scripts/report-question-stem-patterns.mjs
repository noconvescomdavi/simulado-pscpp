import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'data', 'questions');
const subjects = ['arte-naval','manobrabilidade','navegacao-aguas-restritas','legislacao-regulamentacao','meteorologia-oceanografia','comunicacoes','conhecimentos-gerais'];
const phrases = [
  'de acordo com a bibliografia',
  'a bibliografia atribui a esse item',
  'caracterização tecnicamente correta de',
  'problema-base',
  'julgue a afirmativa a seguir, considerando',
  'analise as assertivas sobre',
  'julgue as proposições sobre',
  'complete corretamente a lacuna',
  'durante um exercício de preparação operacional'
];
const norm = v => String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const prefix = q => norm(q).split(' ').slice(0,12).join(' ');
const out = ['# Padrões de enunciados — auditoria',''];

for (const subject of subjects) {
  const bank = JSON.parse(fs.readFileSync(path.join(dir, `${subject}.json`),'utf8'));
  const qs = bank.questions || [];
  out.push(`## ${subject}`,'');
  out.push('| Padrão | Ocorrências |','|---|---:|');
  for (const phrase of phrases) {
    const n = qs.filter(q => norm(q.question).includes(norm(phrase))).length;
    out.push(`| ${phrase} | ${n} |`);
  }
  const prefixes = new Map();
  for (const q of qs) {
    const p = prefix(q.question);
    if (!p) continue;
    prefixes.set(p,(prefixes.get(p)||0)+1);
  }
  const common = [...prefixes.entries()].filter(([,n])=>n>=4).sort((a,b)=>b[1]-a[1]).slice(0,25);
  out.push('','### Prefixos repetidos','', '| Ocorrências | Prefixo |','|---:|---|');
  for (const [p,n] of common) out.push(`| ${n} | ${p.replace(/\|/g,'\\|')} |`);
  out.push('');
}

fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports','question-stem-patterns.md'),out.join('\n')+'\n');
console.log('Relatório gravado em reports/question-stem-patterns.md');
