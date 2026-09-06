import fs from "node:fs";
import path from "node:path";

const file = path.join(process.cwd(), "data", "questions", "arte-naval.json");
const bank = JSON.parse(fs.readFileSync(file, "utf8"));
const questions = Array.isArray(bank.questions) ? bank.questions : [];
const errors = [];
const BASELINE_TOTAL = 1150;

const normalize = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

if (questions.length < BASELINE_TOTAL) {
  errors.push(`baseline incompleto: esperadas ao menos ${BASELINE_TOTAL} questões; encontradas ${questions.length}`);
}

const baseline = questions.slice(0, BASELINE_TOTAL);
const expansion = questions.slice(BASELINE_TOTAL);
const ids = new Set();
const stems = new Set();
const baselineAnswers = { A: 0, B: 0, C: 0, D: 0, E: 0 };
const baselineChapterCounts = new Map();

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

  const options = Array.isArray(question.options) ? question.options : [];
  const isExpansion = index >= BASELINE_TOTAL;
  const isTrueFalse = question.style === "Verdadeiro/Falso" || question.question_type === "Verdadeiro/Falso";
  const expectedOptionCount = isExpansion && isTrueFalse ? 2 : 5;
  if (options.length !== expectedOptionCount) {
    errors.push(`${question.id}: esperadas ${expectedOptionCount} alternativas para o formato ${question.style || question.question_type || "padrão"}`);
  } else if (new Set(options.map((option) => normalize(option.text))).size !== options.length) {
    errors.push(`${question.id}: alternativas repetidas`);
  }

  const keys = new Set(options.map((option) => String(option?.key || "").toUpperCase()));
  const answer = String(question.correct_answer || "").toUpperCase();
  if (!answer || !keys.has(answer)) errors.push(`${question.id}: gabarito inválido`);

  if (!isExpansion) {
    if (question.tracking?.chapter?.id) {
      const chapterId = question.tracking.chapter.id;
      baselineChapterCounts.set(chapterId, (baselineChapterCounts.get(chapterId) || 0) + 1);
    }
    if (!(answer in baselineAnswers)) errors.push(`${question.id}: gabarito baseline fora de A–E`);
    else baselineAnswers[answer] += 1;
  } else {
    if (!question.question_type || !question.provenance?.method) {
      errors.push(`${question.id}: expansão sem question_type/provenance`);
    }
  }
}

if (baseline.length === BASELINE_TOTAL) {
  for (const [letter, count] of Object.entries(baselineAnswers)) {
    if (count !== 230) errors.push(`baseline gabarito ${letter}: esperado 230; encontrado ${count}`);
  }
}

const catalog = bank.bibliography_coverage;
if (!catalog?.works?.length) {
  errors.push("catálogo de cobertura bibliográfica ausente");
} else {
  for (const work of catalog.works) {
    for (const chapter of work.chapters || []) {
      const baselineReal = baselineChapterCounts.get(chapter.id) || 0;
      if (baselineReal !== Number(chapter.question_count || 0)) {
        errors.push(`${chapter.id}: catálogo baseline=${chapter.question_count}; real baseline=${baselineReal}`);
      }
      if (work.source_available && baselineReal < 25) {
        errors.push(`${chapter.id}: fonte disponível, mas somente ${baselineReal} questões no baseline`);
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
console.log(`Baseline Arte Naval: ${baseline.length} questões preservadas e validadas`);
console.log(`Expansão: ${expansion.length} questões adicionais validadas`);
console.log("Baseline de gabaritos: A=230, B=230, C=230, D=230, E=230");
console.log(`Catálogo baseline: ${catalog.summary.listed_chapters} capítulos; ${catalog.summary.chapters_at_target} cobertos; ${catalog.summary.chapters_pending_source} aguardando fonte`);
