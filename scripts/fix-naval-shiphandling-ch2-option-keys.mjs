import fs from "node:fs";

const targets = [
  { path: "data/questions/manobrabilidade.json", prefix: "MAN-NSH-C02-", expectedQuestions: 162, label: "Naval Shiphandling Chapter 2" },
  { path: "data/questions/arte-naval.json", prefix: "AN-C10-", expectedQuestions: 108, label: "Arte Naval Chapter 10" },
];

let totalQuestions = 0;
let totalKeys = 0;
for (const target of targets) {
  const bank = JSON.parse(fs.readFileSync(target.path, "utf8"));
  let questions = 0;
  let keys = 0;
  for (const q of bank.questions || []) {
    if (!String(q.id || "").startsWith(target.prefix)) continue;
    questions++;
    for (const option of q.options || []) {
      if (!option.key && option.letter) {
        option.key = String(option.letter).trim().toUpperCase();
        keys++;
      }
    }
  }
  if (questions !== target.expectedQuestions) throw new Error(`${target.label}: esperadas ${target.expectedQuestions} questões; encontradas ${questions}`);
  fs.writeFileSync(target.path, JSON.stringify(bank, null, 2) + "\n");
  totalQuestions += questions;
  totalKeys += keys;
  console.log(`${target.label}: ${questions} questões, ${keys} chaves normalizadas.`);
}
console.log(`Total: ${totalQuestions} questões; ${totalKeys} alternativas normalizadas.`);
