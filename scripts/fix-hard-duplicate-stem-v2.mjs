import fs from 'node:fs';

const file='scripts/revise-question-banks-context-v2.mjs';
let s=fs.readFileSync(file,'utf8');

const oldText=`question:\`Considerando ${'${chapter(bases[0])}'}, com foco comparativo em ${'${[...new Set(bases.map(topic))].slice(0,3).map(x=>`“${x}”`).join(", ")}'}, assinale a alternativa INCORRETA.\`,`;
const newText=`question: provenanceMethod==='hard-expansion-v2'\n      ? \`Em uma análise aprofundada de ${'${chapter(bases[0])}'}, confronte ${'${[...new Set(bases.map(topic))].slice(0,4).map(x=>`“${x}”`).join(", ")}'} e assinale a alternativa INCORRETA.\`\n      : \`Considerando ${'${chapter(bases[0])}'}, com foco comparativo em ${'${[...new Set(bases.map(topic))].slice(0,3).map(x=>`“${x}”`).join(", ")}'}, assinale a alternativa INCORRETA.\`,`;

if (!s.includes(oldText)) throw new Error('Enunciado makeIncorrect esperado não localizado após hardening');
s=s.replace(oldText,newText);
fs.writeFileSync(file,s);
console.log('Enunciados difíceis de INCORRETA diferenciados das substituições V2.');
