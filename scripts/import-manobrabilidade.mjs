import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, "..");
const defaultSource = join(
  homedir(),
  "Downloads",
  "banco_300_questoes_manobrabilidade.json"
);
const sourcePath = resolve(process.argv[2] || defaultSource);
const destinationPath = join(
  projectRoot,
  "data",
  "questions",
  "manobrabilidade.json"
);

function fail(message) {
  console.error(`\nERRO: ${message}\n`);
  process.exit(1);
}

try {
  await access(sourcePath, constants.R_OK);
} catch {
  fail(
    `Arquivo não encontrado em "${sourcePath}". ` +
      "Informe o caminho do JSON depois de --."
  );
}

let bank;
try {
  bank = JSON.parse(await readFile(sourcePath, "utf8"));
} catch (error) {
  fail(`O arquivo ${basename(sourcePath)} não contém JSON válido: ${error.message}`);
}

if (!Array.isArray(bank.questions)) {
  fail('O JSON precisa possuir o campo "questions" como uma lista.');
}

if (bank.questions.length !== 300) {
  fail(`Esperadas 300 questões; encontradas ${bank.questions.length}.`);
}

const ids = new Set();
const allowedAnswers = new Set(["A", "B", "C", "D", "E"]);

for (const [index, question] of bank.questions.entries()) {
  const label = question?.id || `posição ${index + 1}`;

  if (typeof question?.id !== "string" || !/^MAN-\d{3}$/.test(question.id)) {
    fail(`ID inválido em ${label}. O formato esperado é MAN-001.`);
  }
  if (ids.has(question.id)) fail(`ID duplicado: ${question.id}.`);
  ids.add(question.id);

  if (typeof question.question !== "string" || !question.question.trim()) {
    fail(`Enunciado ausente em ${label}.`);
  }
  if (!Array.isArray(question.options) || question.options.length !== 5) {
    fail(`${label} precisa ter exatamente cinco alternativas.`);
  }

  const optionKeys = new Set(question.options.map((option) => option?.key));
  if (["A", "B", "C", "D", "E"].some((key) => !optionKeys.has(key))) {
    fail(`${label} precisa conter as alternativas A, B, C, D e E.`);
  }
  if (question.options.some((option) => typeof option?.text !== "string" || !option.text.trim())) {
    fail(`${label} possui alternativa sem texto.`);
  }
  if (!allowedAnswers.has(question.correct_answer)) {
    fail(`${label} possui gabarito inválido.`);
  }
  if (typeof question.explanation !== "string" || !question.explanation.trim()) {
    fail(`${label} não possui justificativa.`);
  }
  if (!question.source?.title || !question.source?.locator) {
    fail(`${label} não possui fonte bibliográfica completa.`);
  }
}

const normalizedBank = {
  ...bank,
  imported_at: new Date().toISOString(),
  questions: [...bank.questions].sort((a, b) => a.id.localeCompare(b.id)),
};

await mkdir(dirname(destinationPath), { recursive: true });
await writeFile(destinationPath, `${JSON.stringify(normalizedBank, null, 2)}\n`, "utf8");

console.log("\nIMPORTAÇÃO CONCLUÍDA");
console.log(`Origem:  ${sourcePath}`);
console.log(`Destino: ${destinationPath}`);
console.log(`Total:   ${normalizedBank.questions.length} questões`);
console.log("\nAgora execute: npm run build\n");
