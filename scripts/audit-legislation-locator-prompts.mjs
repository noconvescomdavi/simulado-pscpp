import fs from "node:fs";
import path from "node:path";

import { hasLocatorOnlyCommand } from "../lib/question-locator-audit.js";

const root = process.cwd();
const banks = JSON.parse(fs.readFileSync(path.join(root, "data/questions/runtime-active-banks.json"), "utf8")).banks;
const questions = banks["legislacao-regulamentacao"].questions;

const numbered = /\b(?:art(?:igo)?\.?|item|itens|anexo|cap[ií]tulo|se[cç][aã]o|par[aá]grafo|inciso|al[ií]nea|regra)\s+(?:\d|[IVXLCDM]+\b)|§\s*\d/i;
const findings = questions.filter((q) => hasLocatorOnlyCommand(q));
const counts = {
  activeLegislation: questions.length,
  locatorOnly: findings.length,
  numberedLocator: findings.filter((q) => numbered.test(q.question)).length,
  otherLocator: findings.filter((q) => !numbered.test(q.question)).length,
};
const csv = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
const lines = [
  ["id", "localizador_numerado", "enunciado_atual", "assunto_metadados", "gabarito", "texto_gabarito", "fonte_localizador"].map(csv).join(","),
  ...findings.map((q) => [q.id, numbered.test(q.question) ? "sim" : "não", q.question, q.topic, q.correct_answer, q.options.find((o) => o.key === q.correct_answer)?.text, q.source?.locator].map(csv).join(",")),
];
if (process.argv.includes("--report")) {
 fs.mkdirSync(path.join(root, "reports"), { recursive: true });
 fs.writeFileSync(path.join(root, "reports/legislacao-enunciados-por-localizador.csv"), lines.join("\n") + "\n");
}
console.log(JSON.stringify(counts));
