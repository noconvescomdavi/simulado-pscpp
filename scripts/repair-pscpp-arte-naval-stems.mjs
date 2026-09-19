import fs from "node:fs";

const root = new URL("../", import.meta.url);
const sourcePath = new URL("data/questions/arte-naval.json", root);
const targetPath = new URL("data/pscpp/generated-questions.json", root);
const sourceBank = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const targetBank = JSON.parse(fs.readFileSync(targetPath, "utf8"));
const sources = new Map(sourceBank.questions.map((question) => [question.id, question]));
const occurrences = new Map();
const contexts = [
  "Em uma revisão técnica do aparelho e das manobras do navio",
  "Durante o planejamento de uma operação a bordo",
  "Na conferência da nomenclatura antes da manobra",
  "Em uma instrução prática para a equipe de convés",
];
const normalize = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();
const descriptionFrom = (question) => {
  const marker = "descrição técnica a seguir:";
  const start = question.question.toLowerCase().indexOf(marker);
  if (start < 0) return null;
  return question.question
    .slice(start + marker.length)
    .replace(/\s*Assinale a opção correta\.?\s*$/i, "")
    .replace(/\s*Qual nomenclatura corresponde ao caso apresentado\?\s*$/i, "")
    .trim()
    .replace(/[. ]+$/, "");
};

let repaired = 0;
for (const question of targetBank.questions) {
  const number = Number(question.id?.match(/^pscpp::generated::anv::(\d{4})$/)?.[1]);
  if (!number || number < 201 || number > 500) continue;
  const source = sources.get(question.provenance?.derived_from_question_id);
  if (!source) throw new Error(`${question.id}: fonte derivada não encontrada`);
  const topicKey = normalize(source.topic);
  const occurrence = occurrences.get(topicKey) || 0;
  occurrences.set(topicKey, occurrence + 1);
  const context = contexts[occurrence % contexts.length];
  const description = descriptionFrom(source);
  question.question = description
    ? `${context}, foi registrada a seguinte descrição: “${description}”. Qual termo técnico corresponde a ela?`
    : `${context}, qual alternativa apresenta a definição correta de “${source.topic}”?`;
  question.pscpp_format = description ? "application" : "direct";
  repaired++;
}

const seen = new Set();
for (const question of targetBank.questions) {
  const text = normalize(question.question);
  if (seen.has(text)) throw new Error(`${question.id}: enunciado duplicado após reparo`);
  seen.add(text);
}
fs.writeFileSync(targetPath, `${JSON.stringify(targetBank)}\n`);
console.log(`${repaired} enunciados dos lotes 005–010 revisados.`);
