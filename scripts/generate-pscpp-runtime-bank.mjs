import assert from "node:assert/strict";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { collectActivePscppQuestions } from "../lib/pscpp-exam-source.js";
import officialExams from "../data/pscpp/official-exams.json" with { type: "json" };

const root = new URL("../", import.meta.url);
const data = new URL("../data/pscpp/", import.meta.url);
const output = new URL("../data/pscpp/runtime-active-questions.json", import.meta.url);
const inputFiles = [
  ...((await readdir(data)).filter((file) => file.endsWith(".json") && file !== "runtime-active-questions.json").map((file) => `data/pscpp/${file}`)),
  ...((await readdir(new URL("generated-batches/", data))).filter((file) => file.endsWith(".json")).map((file) => `data/pscpp/generated-batches/${file}`)),
  "lib/pscpp-exam-source.js", "lib/generated-pscpp-batches.js", "lib/approved-pscpp-drive-blocks.js",
  "lib/question-quality-policy.js", "lib/question-quality.js", "lib/miguens-cap45-review.js", "data/question-restorations/miguens-cap45-reviewed.json",
];
const digest = createHash("sha256");
for (const path of inputFiles.sort()) {
  digest.update(path);
  digest.update(await readFile(new URL(path, root)));
}
const sourceHash = digest.digest("hex");

const isOfficial = (question) => question?.origin === "official_exam" || question?.pscpp_origin === "official_exam";
const canonicalOfficial = officialExams.questions.filter((question) => question && !question.annulled);
assert.equal(canonicalOfficial.length, 254, "O corpus oficial deve conter exatamente 254 questões não anuladas");
assert.equal(canonicalOfficial.filter((question) => question.active !== false && question.validation_status !== "rejected" && !String(question.validation_status || "").startsWith("quarantined")).length, 254, "As 254 questões oficiais devem permanecer ativas após auditoria");

function assertOfficialFidelity(questions) {
  const runtimeOfficial = questions.filter(isOfficial);
  assert.equal(runtimeOfficial.length, 254, "O runtime PSCPP deve carregar as 254 questões oficiais");
  const byId = new Map(runtimeOfficial.map((question) => [String(question.id), question]));
  for (const source of canonicalOfficial) {
    const runtime = byId.get(String(source.id));
    assert.ok(runtime, `Questão oficial ausente do runtime: ${source.id}`);
    assert.equal(runtime.question, source.question, `Enunciado oficial reescrito em runtime: ${source.id}`);
    assert.deepEqual(runtime.options, source.options, `Alternativas oficiais alteradas em runtime: ${source.id}`);
    assert.equal(runtime.correct_answer, source.correct_answer, `Gabarito oficial alterado em runtime: ${source.id}`);
    assert.ok(!/acerca de\s+Quest[aã]o\s+\d+|disposi[cç][aã]o,\s*requisito\s*ou\s*conceito\s*previsto\s*na\s*publica[cç][aã]o/i.test(String(runtime.question || "")), `Enunciado genérico detectado: ${source.id}`);
    assert.ok(!runtime.provenance?.mass_reformulation, `Questão oficial não pode receber mass_reformulation: ${source.id}`);
  }
}
if (process.argv.includes("--check")) {
  const saved = JSON.parse(await readFile(output, "utf8"));
  assert.equal(saved.source_hash, sourceHash, "Banco PSCPP está desatualizado; execute npm run generate:pscpp-bank");
  assertOfficialFidelity(saved.questions);
  console.log(`Banco PSCPP pronto: ${saved.questions.length} questões, 254 oficiais fiéis às fontes`);
} else {
  const questions = collectActivePscppQuestions();
  assertOfficialFidelity(questions);
  await writeFile(output, JSON.stringify({ source_hash: sourceHash, questions }));
  console.log(`Banco PSCPP gerado: ${questions.length} questões · 254 oficiais fiéis às fontes`);
}
