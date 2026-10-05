import fs from "node:fs";

const bankPath = "data/questions/legislacao-regulamentacao.json";
const patchFiles = [1,2,3,4,5,6].map(n => `scripts/tmp/n112patch_0${n}.json`);

const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const questions = Array.isArray(bank) ? bank : (bank.questions || bank.questoes || bank.items);
if (!Array.isArray(questions)) throw new Error("Array de questões não encontrado.");

const patches = {};
for (const file of patchFiles) {
  Object.assign(patches, JSON.parse(fs.readFileSync(file, "utf8")));
}
if (Object.keys(patches).length !== 101) {
  throw new Error(`Esperadas 101 questões no patch; encontradas ${Object.keys(patches).length}.`);
}

const byId = new Map(questions.map((q, i) => [q.id, i]));
const missing = [];
for (const [id, patch] of Object.entries(patches)) {
  const i = byId.get(id);
  if (i === undefined) {
    missing.push(id);
    continue;
  }
  Object.assign(questions[i], patch);
}
if (missing.length) throw new Error(`IDs ausentes: ${missing.join(", ")}`);

const n112 = questions.filter(q => /^LEG-N112-/.test(String(q.id || "")));
const oldParagraphPattern = n112.filter(q => /Sobre o Parágrafo Único do item/i.test(String(q.question || "")));

if (questions.length !== 1398) throw new Error(`Total do banco inesperado: ${questions.length}`);
if (n112.length !== 141) throw new Error(`Total NORMAM-112 inesperado: ${n112.length}`);
if (oldParagraphPattern.length !== 0) throw new Error(`Ainda existem ${oldParagraphPattern.length} enunciados no padrão antigo.`);

for (const [id, patch] of Object.entries(patches)) {
  const q = questions[byId.get(id)];
  for (const [field, expected] of Object.entries(patch)) {
    if (JSON.stringify(q[field]) !== JSON.stringify(expected)) {
      throw new Error(`Falha de validação em ${id} / ${field}`);
    }
  }
}

const dist = n112.reduce((acc, q) => {
  const ans = q.correct_answer || q.answer || q.gabarito || "?";
  acc[ans] = (acc[ans] || 0) + 1;
  return acc;
}, {});

fs.writeFileSync(bankPath, JSON.stringify(bank, null, 2) + "\n", "utf8");
console.log(JSON.stringify({
  total_questions: questions.length,
  normam112_questions: n112.length,
  patched_questions: Object.keys(patches).length,
  old_paragraph_stem_count: oldParagraphPattern.length,
  answer_distribution: dist
}, null, 2));
