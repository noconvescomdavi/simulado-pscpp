import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const forbiddenNames = new Set([
  "option.text",
  "question.correct_answer",
  "question.difficulty",
  "question.module",
  "question.style",
  "throw",
  "words.slice(index",
  "{",
]);

const violations = [];

function walk(dir, relative = "") {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(relative.replaceAll("\\", "/"), entry.name);
    if (rel === ".git" || rel === "node_modules" || rel === ".next") continue;

    if (
      rel.startsWith(".backup-") ||
      rel.startsWith(".estibordo-editor-backups/") ||
      rel.startsWith(".estibordo-update-backups/") ||
      rel.startsWith("public/study-content.desativado-")
    ) {
      violations.push(rel);
      continue;
    }

    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(absolute, rel);
      continue;
    }

    if (forbiddenNames.has(entry.name) || /^scripts\/.*\.exe$/i.test(rel)) {
      violations.push(rel);
    }
  }
}

walk(root);

if (violations.length) {
  console.error("Artefatos proibidos encontrados:");
  for (const item of violations) console.error(` - ${item}`);
  process.exit(1);
}

console.log("Higiene do repositório: OK");
