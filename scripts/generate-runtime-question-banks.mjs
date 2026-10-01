import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { collectActiveQuestionBanks } from "../lib/question-banks-source.js";

const root = new URL("../", import.meta.url);
const output = new URL("../data/questions/runtime-active-banks.json", import.meta.url);
const directories = ["data/questions", "data/question-extensions", "data/question-restorations"];
const inputs = [
  "lib/question-banks-source.js", "lib/question-restorations.js",
  "lib/question-quality-policy.js", "lib/question-quality.js", "lib/miguens-cap45-review.js", "lib/question-editorial-normalization.js",
  "lib/notebook-stem-restorations.js",
];
for (const directory of directories) {
  for (const file of await readdir(new URL(`${directory}/`, root))) {
    if (file.endsWith(".json") && !file.startsWith("runtime-")) inputs.push(`${directory}/${file}`);
  }
}
const digest = createHash("sha256");
for (const path of inputs.sort()) {
  digest.update(path);
  digest.update(await readFile(new URL(path, root)));
}
const sourceHash = digest.digest("hex");
if (process.argv.includes("--check")) {
  const saved = JSON.parse(await readFile(output, "utf8"));
  assert.equal(saved.source_hash, sourceHash, "Bancos de cadernos desatualizados; execute npm run generate:question-banks");
  console.log(`Bancos de cadernos prontos: ${Object.values(saved.banks).reduce((n, bank) => n + bank.questions.length, 0)} questões`);
} else {
  const banks = collectActiveQuestionBanks();

  // The audited NORMAM-112 source bank is canonical for legislation. Runtime
  // must expose every canonical question exactly once: no quarantine by generic
  // heuristics and no duplicate legacy extension questions.
  const legislationSource = JSON.parse(await readFile(new URL("data/questions/legislacao-regulamentacao.json", root), "utf8"));
  const isCanonicalNormam112 = (question) =>
    question?.taxonomy?.bibliography_id === "normam112"
    && /^LEG-N112-/i.test(String(question?.id || ""));
  const expectedNormam112 = (legislationSource.questions || []).filter(isCanonicalNormam112).length;
  const runtimeNormam112 = (banks["legislacao-regulamentacao"]?.questions || []).filter(isCanonicalNormam112).length;
  assert.equal(
    runtimeNormam112,
    expectedNormam112,
    `NORMAM-112 incompleta no runtime: esperado ${expectedNormam112}, obtido ${runtimeNormam112}`
  );

  await writeFile(output, JSON.stringify({ source_hash: sourceHash, banks }));
  console.log(`Bancos de cadernos gerados: ${Object.values(banks).reduce((n, bank) => n + bank.questions.length, 0)} questões · NORMAM-112: ${runtimeNormam112}`);
}
