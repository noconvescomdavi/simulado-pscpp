import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { auditQuestion } from "../lib/question-quality.js";

const runtime = JSON.parse(await readFile(new URL("../data/questions/runtime-active-banks.json", import.meta.url), "utf8"));
let total = 0;
for (const [subject, bank] of Object.entries(runtime.banks)) {
  const ids = new Set();
  assert.ok(bank.questions.length > 0, `${subject}: banco vazio`);
  for (const question of bank.questions) {
    const id = String(question.id);
    assert.ok(!ids.has(id), `${subject}: ID repetido ${id}`);
    ids.add(id);
    const critical = auditQuestion(question).issues.filter((issue) => issue.severity === "critical");
    assert.equal(critical.length, 0, `${subject}/${id}: ${critical.map((issue) => issue.code).join(", ")}`);
    assert.ok(Array.isArray(question.options) && question.options.length >= 2 && question.options.every((option) => String(typeof option === "string" ? option : option?.text || "").trim()), `${subject}/${id}: alternativas ausentes`);
    total++;
  }
}
console.log(`Bancos ativos de cadernos: ${total} questões verificadas`);
