import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { collectActiveQuestionBanks } from "../lib/question-banks-source.js";

const root = new URL("../", import.meta.url);
const output = new URL("../data/questions/runtime-active-banks.json", import.meta.url);
const directories = ["data/questions", "data/question-extensions", "data/question-restorations"];
const inputs = [
  "lib/question-banks-source.js", "lib/question-restorations.js",
  "lib/question-quality-policy.js", "lib/question-quality.js",
];
for (const directory of directories) {
  for (const file of await readdir(new URL(`${directory}/`, root))) {
    if (file.endsWith(".json") && file !== "runtime-active-banks.json") inputs.push(`${directory}/${file}`);
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
  await writeFile(output, JSON.stringify({ source_hash: sourceHash, banks }));
  console.log(`Bancos de cadernos gerados: ${Object.values(banks).reduce((n, bank) => n + bank.questions.length, 0)} questões`);
}
