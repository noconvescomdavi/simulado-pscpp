import fs from "node:fs";
import path from "node:path";
import { canonicalizeQuestionTaxonomy, validateQuestionTaxonomy } from "../lib/question-taxonomy.js";

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

// Mathematical alternatives must retain their operators for duplicate checks.
// Expressions F/m and F·m, for example, are not equivalent.
const optionIdentity = (value) => {
  const raw=String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  return /[=+/*√·^]/.test(raw) ? raw.replace(/\s+/g,"") : normalize(raw);
};

if (questions.length < BASELINE_TOTAL) {
  errors.push(`baseline incompleto: esperadas ao menos ${BASELINE_TOTAL} questões; encontradas ${questions.length}`);
}

const baseline = questions.slice(0, BASELINE_TOTAL);
const expansion = questions.slice(BASELINE_TOTAL);
const ids = new Set();
const stems = new Set();
const baselineAnswers = { A: 0, B: 0, C: 0, D: 0, E: 0 };
const baselineChapterCounts = new Map();
let lastSequentialAnvId = 0;
let validatedChapterExpansion = 0;
let legacyDriveChapterRepairs = 0;

for (const [index, original] of questions.entries()) {
  const question = canonicalizeQuestionTaxonomy(original);
  if (question !== original) legacyDriveChapterRepairs += 1;
  const isSequencedAnv = /^ANV-\d{4}$/.test(question.id || "");
  const isChapterExpansion = /^AN-C(?:09|10|11|12)-[A-Za-z0-9-]+-M[123]$/.test(question.id || "");
  if (isSequencedAnv) {
    lastSequentialAnvId += 1;
    const expectedId = `ANV-${String(lastSequentialAnvId).padStart(4, "0")}`;
    if (question.id !== expectedId) errors.push(`${question.id}: ID sequencial esperado ${expectedId}`);
  } else if (index < BASELINE_TOTAL || !isChapterExpansion) {
    errors.push(`${question.id || `posição ${index + 1}`}: ID não pertence a namespace conhecido`);
  } else {
    validatedChapterExpansion += 1;
  }
  const taxonomy = validateQuestionTaxonomy(question, "arte-naval");
  if (taxonomy.errors.length) errors.push(`${question.id}: taxonomia ${taxonomy.errors.join("; ")}`);
  if (ids.has(question.id)) errors.push(`${question.id}: ID repetido`);
  ids.add(question.id);

  const inactive=question.active===false||["inactive","deactivated","quarantined"].includes(String(question.status||"").toLowerCase());
  const stem = normalize(question.question);
  if (!stem) errors.push(`${question.id}: enunciado vazio`);
  if (stems.has(stem) && !inactive) errors.push(`${question.id}: enunciado repetido`);
  if(!inactive) stems.add(stem);

  const nestedWork = Boolean(question.tracking?.work?.id && question.tracking?.work?.title);
  const flatWork = isChapterExpansion && question.tracking?.work_id === question.taxonomy?.bibliography_id
    && Boolean(question.tracking?.work_title && question.source?.drive_file_id);
  const nestedTopic = Boolean(question.tracking?.topic?.id && question.tracking?.topic?.title);
  const flatTopic = isChapterExpansion && Boolean(question.tracking?.topic_id && question.tracking?.topic_title)
    && question.tracking.topic_id === question.taxonomy?.topic_id;
  if (!nestedWork && !flatWork) errors.push(`${question.id}: rastreio de obra incompleto`);
  if (!nestedTopic && !flatTopic) errors.push(`${question.id}: rastreio de assunto incompleto`);
  if (!question.source?.title || !question.source?.locator) {
    errors.push(`${question.id}: referência bibliográfica incompleta`);
  }

  const options = Array.isArray(question.options) ? question.options : [];
  const isExpansion = index >= BASELINE_TOTAL;
  const isTrueFalse = question.style === "Verdadeiro/Falso" || question.question_type === "Verdadeiro/Falso";
  const expectedOptionCount = isExpansion && isTrueFalse ? 2 : 5;
  if (options.length !== expectedOptionCount) {
    errors.push(`${question.id}: esperadas ${expectedOptionCount} alternativas para o formato ${question.style || question.question_type || "padrão"}`);
  } else if (new Set(options.map((option) => optionIdentity(option.text))).size !== options.length) {
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
    const generatorTrace = Boolean(question.question_type && question.provenance?.method);
    const primaryDocumentTrace = isChapterExpansion && Boolean(
      question.pscpp_format && question.source?.drive_file_id && question.source?.locator
      && question.validation?.source_verified === true && question.validation?.key_verified === true
      && question.validation?.duplicate_checked === true
    );
    if (!generatorTrace && !primaryDocumentTrace) {
      errors.push(`${question.id}: expansão sem rastreio verificável de geração ou fonte primária`);
    }
  }
}



const legacyMixedVolumeCatalog = [];
const catalog = bank.bibliography_coverage;
if (!catalog?.works?.length) {
  errors.push("catálogo de cobertura bibliográfica ausente");
} else {
  for (const work of catalog.works) {
    for (const chapter of work.chapters || []) {
      const baselineReal = baselineChapterCounts.get(chapter.id) || 0;
      const catalogCount = Number(chapter.question_count || 0);
      // The historical cap. 10 catalog count includes the later Volume-2
      // chapter expansion; other entries reflect only the 1,150-item baseline.
      const chapterNumber = /^fonseca-arte-v1::ch(\d+)$/.exec(chapter.id)?.[1];
      const v2Expansion = chapterNumber ? expansion.filter(q => {
        const effective = canonicalizeQuestionTaxonomy(q);
        return effective.taxonomy?.bibliography_id === "fonseca-arte-v2"
          && effective.taxonomy?.chapter_id === `fonseca-arte-v2::ch${chapterNumber}`;
      }).length : 0;
      if (baselineReal !== catalogCount && baselineReal + v2Expansion !== catalogCount) {
        errors.push(`${chapter.id}: catálogo=${catalogCount}; baseline=${baselineReal}; expansão v2=${v2Expansion}`);
      } else if (baselineReal !== catalogCount) {
        legacyMixedVolumeCatalog.push({chapter_id:chapter.id,baseline:baselineReal,volume_2_expansion:v2Expansion,catalog:catalogCount});
      }
      if (work.source_available && baselineReal < 25) {
        errors.push(`${chapter.id}: fonte disponível, mas somente ${baselineReal} questões no baseline`);
      }
    }
  }
}

if (legacyMixedVolumeCatalog.length) console.warn("CATÁLOGO LEGADO MISTURA VOLUMES:", JSON.stringify(legacyMixedVolumeCatalog));

if (errors.length) {
  console.error("VALIDAÇÃO DE RASTREIO REPROVADA");
  for (const error of errors.slice(0, 100)) console.error(`- ${error}`);
  if (errors.length > 100) console.error(`- ... e mais ${errors.length - 100} falhas`);
  process.exit(1);
}

console.log("VALIDAÇÃO DE RASTREIO APROVADA");
console.log(`Baseline Arte Naval: ${baseline.length} questões preservadas e validadas`);
console.log(`Expansão: ${expansion.length} questões adicionais validadas; ${validatedChapterExpansion} no namespace AN-C; ${legacyDriveChapterRepairs} fontes Drive normalizadas`);
console.log("Distribuição real do baseline:", JSON.stringify(baselineAnswers));
console.log(`Catálogo baseline: ${catalog.summary.listed_chapters} capítulos; ${catalog.summary.chapters_at_target} cobertos; ${catalog.summary.chapters_pending_source} aguardando fonte`);
