// Structural and bibliographic guard for the Hensen lot files.
// This is not a substitute for source-level editorial and semantic review.
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "data", "question-extensions");
const files = fs.readdirSync(dir).filter(name => /^hensen-lote-\d{3}\.json$/.test(name)).sort();
const errors = [];
const seen = new Set();
const chapters = new Set([1, 2, 3, 4, 5, 6, 7, 9]);
const clean = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
if (!files.length) errors.push("Nenhum lote HENSEN encontrado.");
let count = 0;
for (const file of files) {
  const lot = file.match(/hensen-lote-(\d{3})\.json$/)[1];
  let data;
  try { data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")); }
  catch (error) { errors.push(`${file}: JSON inválido: ${error.message}`); continue; }
  const qs = data.questions;
  if (!Array.isArray(qs) || qs.length < 1 || qs.length > 40) {
    errors.push(`${file}: lote deve conter de 1 a 40 questões.`);
    continue;
  }
  const keys = new Map("ABCDE".split("").map(letter => [letter, 0]));
  for (const q of qs) {
    count++;
    const id = String(q.id ?? "");
    const match = id.match(/^ANV-HENSEN-C(\d{2})-L(\d{3})-(\d{2})$/);
    if (!match || match[2] !== lot || !chapters.has(Number(match[1]))) errors.push(`${file}: ID ou capítulo inválido: ${id}`);
    if (seen.has(id)) errors.push(`${file}: ID duplicado: ${id}`);
    seen.add(id);
    const options = Array.isArray(q.options) ? q.options : [];
    const letters = options.map(o => o?.key);
    if (options.length !== 5 || letters.join("") !== "ABCDE") errors.push(`${id}: exigidas alternativas A–E em ordem.`);
    if (new Set(options.map(o => clean(o?.text))).size !== 5 || options.some(o => !clean(o?.text))) errors.push(`${id}: alternativas vazias ou duplicadas.`);
    if (!keys.has(q.correct_answer)) errors.push(`${id}: gabarito inválido.`);
    else keys.set(q.correct_answer, keys.get(q.correct_answer) + 1);
    const exp = clean(q.explanation);
    if (exp.length < 30) errors.push(`${id}: explicação ausente ou insuficiente.`);
    if (options.some(o => o.key !== q.correct_answer && clean(o.text) === exp)) errors.push(`${id}: explicação copiada de distrator incorreto.`);
    const loc = String(q.source?.locator ?? "");
    const source = loc.match(/^Chapter (\d+), §(\d+(?:\.\d+)*), p\. (\d+) \(PDF p\. (\d+)\)$/);
    if (!source || !chapters.has(Number(source[1])) || Number(source[1]) !== Number(match?.[1]) || Number(source[4]) - Number(source[3]) !== 13) {
      errors.push(`${id}: localizador HENSEN inválido ou páginas incoerentes: ${loc}`);
    }
    if (q.taxonomy?.subject_slug !== "arte-naval" || q.taxonomy?.bibliography_id !== "hensen-tug") errors.push(`${id}: taxonomia HENSEN inválida.`);
  }
  if (qs.length === 40 && [...keys.values()].some(v => v !== 8)) errors.push(`${file}: gabarito desequilibrado em lote de 40 questões: ${JSON.stringify(Object.fromEntries(keys))}`);
}
console.log(`HENSEN_SOURCE_GUARD: ${files.length} lotes, ${count} questões, ${errors.length} falhas.`);
if (errors.length) {
  for (const error of errors) console.error(`HENSEN_SOURCE_ERROR: ${error}`);
  process.exitCode = 1;
}
