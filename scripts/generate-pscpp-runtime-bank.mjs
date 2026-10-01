import assert from "node:assert/strict";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { collectActivePscppQuestions } from "../lib/pscpp-exam-source.js";

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
if (process.argv.includes("--check")) {
  const saved = JSON.parse(await readFile(output, "utf8"));
  assert.equal(saved.source_hash, sourceHash, "Banco PSCPP está desatualizado; execute npm run generate:pscpp-bank");
  assert.equal(saved.questions.length, 2060, "Quantidade de questões ativas mudou; audite a matriz antes de publicar");
  console.log(`Banco PSCPP pronto: ${saved.questions.length} questões, fontes atuais`);
} else {
  const questions = collectActivePscppQuestions();
  await writeFile(output, JSON.stringify({ source_hash: sourceHash, questions }));
  console.log(`Banco PSCPP gerado: ${questions.length} questões`);
}
