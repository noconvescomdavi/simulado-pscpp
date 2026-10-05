import fs from "node:fs";

const path = "data/questions/legislacao-regulamentacao.json";
const bank = JSON.parse(fs.readFileSync(path, "utf8"));
const questions = Array.isArray(bank) ? bank : (bank.questions || bank.questoes || bank.items);
if (!Array.isArray(questions)) throw new Error("Array de questões não encontrado.");

const targets = questions.filter(q =>
  /^LEG-N112-/.test(String(q.id || "")) &&
  /-(M1|M3)$/.test(String(q.id || ""))
);

if (targets.length !== 94) throw new Error(`Esperadas 94 questões M1/M3; encontradas ${targets.length}.`);

let converted = 0;
for (const q of targets) {
  if (!Array.isArray(q.options) || q.options.length !== 5) {
    throw new Error(`Alternativas inválidas em ${q.id}`);
  }
  q.options = q.options.map(opt => {
    const key = opt.key || opt.letter;
    if (!key || !["A","B","C","D","E"].includes(key)) {
      throw new Error(`Chave inválida em ${q.id}`);
    }
    converted++;
    return { key, text: opt.text };
  });

  const keys = new Set(q.options.map(o => o.key));
  if (keys.size !== 5 || !keys.has(q.correct_answer)) {
    throw new Error(`Gabarito sem alternativa correspondente em ${q.id}`);
  }
}

const n112 = questions.filter(q => /^LEG-N112-/.test(String(q.id || "")));
const bad = n112.filter(q =>
  !Array.isArray(q.options) ||
  !q.options.some(o => o.key === q.correct_answer)
);
if (bad.length) throw new Error(`NORMAM-112 ainda possui ${bad.length} gabaritos incompatíveis com options.key`);

fs.writeFileSync(path, JSON.stringify(bank, null, 2) + "\n");
console.log(JSON.stringify({
  questions_normalized: targets.length,
  option_objects_normalized: converted,
  normam112_questions: n112.length,
  invalid_normam112_gabaritos: bad.length
}, null, 2));
