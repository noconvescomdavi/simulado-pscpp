import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "data", "questions", "arte-naval.json");
const bank = JSON.parse(fs.readFileSync(file, "utf8"));
const questions = Array.isArray(bank.questions) ? bank.questions : [];
const errors = [];

const normalize = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

if (questions.length !== 1150) errors.push(`esperadas 1.150 questões; encontradas ${questions.length}`);

const ids = new Set();
const stems = new Set();
const answers = { A: 0, B: 0, C: 0, D: 0, E: 0 };
const chapterCounts = new Map();

for (const [index, question] of questions.entries()) {
  const expectedId = `ANV-${String(index + 1).padStart(4, "0")}`;
  if (question.id !== expectedId) errors.push(`${question.id || `posição ${index + 1}`}: ID esperado ${expectedId}`);
  if (ids.has(question.id)) errors.push(`${question.id}: ID repetido`);
  ids.add(question.id);

  const stem = normalize(question.question);
  if (!stem) errors.push(`${question.id}: enunciado vazio`);
  if (stems.has(stem)) errors.push(`${question.id}: enunciado repetido`);
  stems.add(stem);

  if (!question.tracking?.work?.id || !question.tracking?.work?.title) {
    errors.push(`${question.id}: rastreio de obra incompleto`);
  }
  if (!question.tracking?.topic?.id || !question.tracking?.topic?.title) {
    errors.push(`${question.id}: rastreio de assunto incompleto`);
  }
  if (!question.source?.title || !question.source?.locator) {
    errors.push(`${question.id}: referência bibliográfica incompleta`);
  }

  if (question.tracking?.chapter?.id) {
    const chapterId = question.tracking.chapter.id;
    chapterCounts.set(chapterId, (chapterCounts.get(chapterId) || 0) + 1);
  }

  if (!Array.isArray(question.options) || question.options.length !== 5) {
    errors.push(`${question.id}: deve possuir cinco alternativas`);
  } else if (new Set(question.options.map((option) => normalize(option.text))).size !== 5) {
    errors.push(`${question.id}: alternativas repetidas`);
  }

  const answer = String(question.correct_answer || "").toUpperCase();
  if (!(answer in answers)) errors.push(`${question.id}: gabarito inválido`);
  else answers[answer] += 1;
}

for (const [letter, count] of Object.entries(answers)) {
  if (count !== 230) errors.push(`gabarito ${letter}: esperado 230; encontrado ${count}`);
}

const catalog = bank.bibliography_coverage;
if (!catalog?.works?.length) {
  errors.push("catálogo de cobertura bibliográfica ausente");
} else {
  for (const work of catalog.works) {
    for (const chapter of work.chapters || []) {
      const real = chapterCounts.get(chapter.id) || 0;
      if (real !== Number(chapter.question_count || 0)) {
        errors.push(`${chapter.id}: catálogo=${chapter.question_count}; real=${real}`);
      }
      if (work.source_available && real < 25) {
        errors.push(`${chapter.id}: fonte disponível, mas somente ${real} questões`);
      }
    }
  }
}

if (errors.length) {
  console.error("VALIDAÇÃO DE RASTREIO REPROVADA");
  for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
  if (errors.length > 100) console.error(`- ... e mais ${errors.length - 100} falhas`);
  process.exit(1);
}

console.log("VALIDAÇÃO DE RASTREIO APROVADA");
console.log("Questões: 1.150, todas com obra, assunto e referência");
console.log("Capítulos com fonte disponível: todos com pelo menos 25 questões");
console.log("Gabaritos: A=230, B=230, C=230, D=230, E=230");
console.log(`Catálogo: ${catalog.summary.listed_chapters} capítulos; ${catalog.summary.chapters_at_target} cobertos; ${catalog.summary.chapters_pending_source} aguardando fonte`);
