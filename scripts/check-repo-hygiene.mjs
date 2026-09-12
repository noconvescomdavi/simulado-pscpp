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
      rel.startsWith("_backup_") ||
      rel === "backup" || rel.startsWith("backup/") ||
      rel === "backups" || rel.startsWith("backups/") ||
      rel === "lib/site-packages" || rel.startsWith("lib/site-packages/") ||
      rel.startsWith(".estibordo-editor-backups/") ||
      rel.startsWith(".estibordo-update-backups/") ||
      rel.startsWith("public/study-content.desativado-") ||
      /(^|\/)__pycache__(\/|$)/i.test(rel)
    ) {
      violations.push(rel);
      continue;
    }

    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(absolute, rel);
      continue;
    }

    if (
      forbiddenNames.has(entry.name) ||
      /^scripts\/.*\.exe$/i.test(rel) ||
      /\.bak(?:-|$)/i.test(entry.name) ||
      /\.backup(?:-|\.|$)/i.test(entry.name) ||
      /\.old$/i.test(entry.name) ||
      /\.py[cod]$/i.test(entry.name) ||
      /\.tmp$/i.test(entry.name) ||
      /\.patch$/i.test(entry.name) ||
      /\.new\.[a-z0-9]+$/i.test(entry.name) ||
      /(^|[_-])(temp|stop|no_more|delete-me)([_-]|$)/i.test(entry.name)
    ) {
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
