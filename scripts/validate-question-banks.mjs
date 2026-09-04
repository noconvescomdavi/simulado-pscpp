import fs from "node:fs";
import path from "node:path";

const root = path.join(process.cwd(), "data", "questions");
const files = fs.readdirSync(root).filter((name) => name.endsWith(".json"));

let errors = 0;
let total = 0;

for (const file of files) {
  const full = path.join(root, file);
  const bank = JSON.parse(fs.readFileSync(full, "utf8"));
  const questions = Array.isArray(bank.questions) ? bank.questions : [];
  const ids = new Set();

  for (const [index, q] of questions.entries()) {
    total += 1;
    const prefix = `${file} #${index + 1}`;

    if (!q.id) {
      console.error(`${prefix}: id ausente`);
      errors += 1;
    } else if (ids.has(String(q.id))) {
      console.error(`${prefix}: id duplicado ${q.id}`);
      errors += 1;
    } else {
      ids.add(String(q.id));
    }

    if (!String(q.question || "").trim()) {
      console.error(`${prefix}: enunciado vazio`);
      errors += 1;
    }

    const options = Array.isArray(q.options) ? q.options : [];
    const keys = options.map((o) => String(o?.key || "").trim().toUpperCase()).filter(Boolean);

    if (options.length < 2) {
      console.error(`${prefix}: menos de 2 alternativas`);
      errors += 1;
    }

    if (new Set(keys).size !== keys.length) {
      console.error(`${prefix}: alternativas com chaves duplicadas`);
      errors += 1;
    }

    const answer = String(q.correct_answer || q.answer || "").trim().toUpperCase();
    if (!answer || !keys.includes(answer)) {
      console.error(`${prefix}: gabarito inválido (${answer || "vazio"})`);
      errors += 1;
    }

    if (!String(q.explanation || "").trim()) {
      console.warn(`${prefix}: aviso — sem explicação`);
    }
  }

  if (bank.validation?.total != null && Number(bank.validation.total) !== questions.length) {
    console.error(`${file}: validation.total=${bank.validation.total}, real=${questions.length}`);
    errors += 1;
  }

  console.log(`${file}: ${questions.length} questões`);
}

console.log(`\nTotal validado: ${total} questões`);
if (errors) {
  console.error(`Falhas: ${errors}`);
  process.exit(1);
}
console.log("Validação concluída sem erros estruturais.");
