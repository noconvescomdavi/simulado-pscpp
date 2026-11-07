import fs from 'node:fs';
const input = JSON.parse(fs.readFileSync('data/questions/runtime-active-banks.json', 'utf8'));
const out = [];
let count = 0;
out.push('BANCO PSCPP — QUESTÕES ATIVAS (EXPORTAÇÃO INTEGRAL)');
out.push('Origem: data/questions/runtime-active-banks.json, gerado pelo pipeline da plataforma');
out.push('Observação: transcrição dos registros, sem homologação editorial.\n');
for (const [subject, bank] of Object.entries(input.banks)) {
  out.push('\n' + '='.repeat(85));
  out.push('MATÉRIA: ' + subject.toUpperCase() + ' — ' + bank.questions.length + ' QUESTÕES');
  out.push('='.repeat(85));
  for (const q of bank.questions) {
    count++;
    out.push('\n' + '-'.repeat(70));
    out.push('QUESTÃO ' + count + ' | ID: ' + String(q.id ?? '') + ' | MATÉRIA: ' + subject);
    out.push('ENUNCIADO: ' + String(q.question ?? ''));
    const options = Array.isArray(q.options) ? q.options : Object.entries(q.options || {}).map(([key,text]) => ({key,text}));
    for (const o of options) out.push(String(o.key ?? '') + ') ' + String(o.text ?? ''));
    out.push('GABARITO: ' + String(q.correct_answer ?? ''));
    out.push('JUSTIFICATIVA: ' + String(q.explanation ?? ''));
    out.push('FONTE: ' + String(q.source?.title ?? ''));
    out.push('REFERÊNCIA: ' + String(q.source?.locator ?? ''));
  }
}
out.splice(1, 0, 'TOTAL: ' + count + ' questões');
fs.mkdirSync('audit-output', {recursive:true});
fs.writeFileSync('audit-output/PSCPP_12102_questoes_completas.txt', out.join('\n'), 'utf8');
console.log('TXT integral gerado:', count, 'questões');
if (count !== 12102) throw new Error('Contagem diferente de 12102: ' + count);
