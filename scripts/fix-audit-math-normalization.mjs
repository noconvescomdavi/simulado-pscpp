import fs from 'node:fs';

const file='scripts/audit-question-quality-v2.mjs';
let s=fs.readFileSync(file,'utf8');
s=s.replace(
  "function optionSignature(q) {\n  return (q.options || []).map(o => norm(o?.text)).sort().join('|');\n}",
  "function optionTextNorm(v) { return clean(v).normalize('NFC').toLocaleLowerCase('pt-BR'); }\nfunction optionSignature(q) {\n  return (q.options || []).map(o => optionTextNorm(o?.text)).sort().join('|');\n}"
);
s=s.replace(
  "const normalizedOpts = opts.map(o => norm(o?.text));",
  "const normalizedOpts = opts.map(o => optionTextNorm(o?.text));"
);
fs.writeFileSync(file,s);
console.log('Normalização de alternativas matemáticas corrigida.');
