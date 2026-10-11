import fs from "node:fs";

const files = [
  "data/questions/arte-naval.json",
  "data/questions/manobrabilidade.json"
];

const expected = {
  "data/questions/arte-naval.json": 219,
  "data/questions/manobrabilidade.json": 162
};

const report = {};

for (const path of files) {
  const bank = JSON.parse(fs.readFileSync(path, "utf8"));
  const questions = Array.isArray(bank) ? bank : (bank.questions || bank.questoes || bank.items);
  if (!Array.isArray(questions)) throw new Error(`Array de questões não encontrado em ${path}`);

  const targets = questions.filter(q => {
    const ans = q.correct_answer || q.answer || q.gabarito;
    return Array.isArray(q.options) &&
      ans &&
      q.options.some(o => o.letter) &&
      !q.options.some(o => o.key === ans);
  });

  if (targets.length !== expected[path]) {
    throw new Error(`${path}: esperadas ${expected[path]} questões; encontradas ${targets.length}`);
  }

  for (const q of targets) {
    q.options = q.options.map(opt => {
      const key = opt.key || opt.letter;
      if (!key || !["A","B","C","D","E"].includes(key)) {
        throw new Error(`${path} / ${q.id}: chave inválida`);
      }
      return { key, text: opt.text };
    });

    const ans = q.correct_answer || q.answer || q.gabarito;
    if (!q.options.some(o => o.key === ans)) {
      throw new Error(`${path} / ${q.id}: gabarito sem alternativa correspondente`);
    }
  }

  const residual = questions.filter(q => {
    const ans = q.correct_answer || q.answer || q.gabarito;
    return Array.isArray(q.options) && ans && !q.options.some(o => o.key === ans);
  });

  if (residual.length) {
    throw new Error(`${path}: ainda há ${residual.length} gabaritos incompatíveis com options.key`);
  }

  fs.writeFileSync(path, JSON.stringify(bank, null, 2) + "\n");
  report[path] = { normalized: targets.length, residual_invalid: residual.length };
}

console.log(JSON.stringify(report, null, 2));
