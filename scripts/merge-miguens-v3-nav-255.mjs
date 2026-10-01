import fs from "node:fs";

const bankPath = "data/questions/navegacao-aguas-restritas.json";
const stagingPath = "data/questions/staging-miguens-v3-nav-255.json";

const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const additions = JSON.parse(fs.readFileSync(stagingPath, "utf8"));

if (!Array.isArray(bank.questions)) throw new Error("Banco sem array questions");
if (!Array.isArray(additions) || additions.length !== 255) {
  throw new Error(`Staging inválido: ${Array.isArray(additions) ? additions.length : "não-array"}`);
}

const norm = (s) => String(s || "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .toLowerCase().replace(/\s+/g, " ").trim();

const ids = new Set(bank.questions.map((q) => q.id));
const stems = new Set(bank.questions.map((q) => norm(q.question)));

const idCollisions = additions.filter((q) => ids.has(q.id));
const stemCollisions = additions.filter((q) => stems.has(norm(q.question)));

if (idCollisions.length || stemCollisions.length) {
  throw new Error(`Colisões: IDs=${idCollisions.length}; enunciados=${stemCollisions.length}`);
}

bank.questions.push(...additions);

if (bank.questions.length !== 2080) {
  throw new Error(`Total final inesperado: ${bank.questions.length}; esperado 2080`);
}
if (new Set(bank.questions.map((q) => q.id)).size !== bank.questions.length) {
  throw new Error("IDs duplicados após merge");
}

const inserted = bank.questions.filter((q) => /^NAV-MIGV3-C(37|38|40|42)-/.test(q.id));
if (inserted.length !== 255) throw new Error(`Questões Miguens novas: ${inserted.length}; esperado 255`);

const byChapter = {};
for (const q of inserted) {
  const ch = q.tracking?.chapter?.number || "?";
  byChapter[ch] = (byChapter[ch] || 0) + 1;
}
const expected = { ch37: 96, ch38: 60, ch40: 57, ch42: 42 };
for (const [ch, count] of Object.entries(expected)) {
  if (byChapter[ch] !== count) throw new Error(`${ch}: ${byChapter[ch] || 0}; esperado ${count}`);
}

bank.validation = bank.validation || {};
bank.validation.total = bank.questions.length;
bank.validation.last_sync = "2026-10-01T02:50:00.000Z";

fs.writeFileSync(bankPath, JSON.stringify(bank));
console.log(JSON.stringify({ total: bank.questions.length, inserted: inserted.length, byChapter }));
