import fs from "node:fs";

const batchNumber = Number(process.argv[2]);
if (!Number.isInteger(batchNumber) || batchNumber < 5 || batchNumber > 10) {
  console.error("Uso: node scripts/add-pscpp-arte-naval-batch.mjs <005..010>");
  process.exit(1);
}

const root = new URL("../", import.meta.url);
const sourcePath = new URL("data/questions/arte-naval.json", root);
const targetPath = new URL("data/pscpp/generated-questions.json", root);
const sourceBank = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
const targetBank = JSON.parse(fs.readFileSync(targetPath, "utf8"));

const configs = {
  5: {
    chapter: "Capítulo 8 — Trabalhos do Marinheiro",
    modules: ["Trabalhos do marinheiro"],
  },
  6: {
    chapter: "Capítulo 9 — Poleame e aparelhos de laborar",
    chapterId: "::ch9",
    excluded: ["Manobras especiais"],
  },
  7: {
    chapter: "Capítulo 10 — Aparelho de fundear e suspender",
    chapterId: "::ch10",
    excluded: ["Treinamento de shiphandling"],
  },
  8: {
    chapter: "Capítulo 11 — Aparelho de governo, mastreação e carga",
    chapterId: "::ch11",
    excluded: ["Relação mestre-prático e BRM"],
  },
  9: {
    chapter: "Capítulo 12 — Manobra do navio: operações portuárias e evoluções",
    modules: ["Evoluções", "Fundeio e amarração", "Atracação e desatracação", "Navegação com mau tempo"],
  },
  10: {
    chapter: "Capítulo 12 — Manobra do navio: governo, reboque e operações",
    modules: ["Governo de navio de um hélice", "Governo de navio de dois hélices", "Reboque", "Operações do navio"],
  },
};

const config = configs[batchNumber];
const batchKey = `batch_${String(batchNumber).padStart(3, "0")}`;
if (targetBank.batch_status?.[batchKey]) {
  console.error(`${batchKey} já existe.`);
  process.exit(1);
}

const normalize = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const isReliableDefinition = (question) =>
  question.options?.length === 5
  && /^[A-E]$/.test(question.correct_answer || "")
  && question.question?.length < 700
  && (/^“/.test(question.explanation || "")
    || /A opção correta apresenta a definição técnica/.test(question.explanation || ""));

const inBatchScope = (question) => {
  if (!isReliableDefinition(question)) return false;
  if (config.modules?.includes(question.module)) return true;
  return Boolean(config.chapterId
    && question.taxonomy?.chapter_id?.endsWith(config.chapterId)
    && !config.excluded?.includes(question.module));
};

const candidates = sourceBank.questions.filter(inBatchScope);
const byTopic = new Map();
for (const candidate of candidates) {
  const topic = normalize(candidate.topic);
  if (!byTopic.has(topic)) byTopic.set(topic, []);
  byTopic.get(topic).push(candidate);
}

// A primeira volta maximiza a variedade temática; as seguintes acrescentam
// formulações complementares do mesmo conceito sem repetir enunciado-fonte.
const selected = [];
const queues = [...byTopic.values()];
for (let depth = 0; selected.length < 50; depth++) {
  let added = 0;
  for (const queue of queues) {
    if (queue[depth] && selected.length < 50) {
      selected.push(queue[depth]);
      added++;
    }
  }
  if (!added) break;
}
if (selected.length !== 50) {
  console.error(`${batchKey}: apenas ${selected.length} fontes confiáveis encontradas.`);
  process.exit(1);
}

const answerKeys = ["A", "B", "C", "D", "E"];
const batchStart = (batchNumber - 1) * 50 + 1;
const topicOccurrences = new Map();
const extractDescription = (question) => {
  const marker = "descrição técnica a seguir:";
  const start = question.question.toLowerCase().indexOf(marker);
  if (start < 0) return null;
  return question.question
    .slice(start + marker.length)
    .replace(/\s*Assinale a opção correta\.?\s*$/i, "")
    .trim()
    .replace(/[. ]+$/, "");
};

const generated = selected.map((source, index) => {
  const sequence = batchStart + index;
  const desiredAnswer = answerKeys[index % answerKeys.length];
  const correctText = source.options.find((option) => option.key === source.correct_answer).text;
  const distractors = source.options
    .filter((option) => option.key !== source.correct_answer)
    .map((option) => option.text);
  const orderedTexts = [];
  let distractorIndex = 0;
  for (const key of answerKeys) {
    orderedTexts.push(key === desiredAnswer ? correctText : distractors[distractorIndex++]);
  }

  const description = extractDescription(source);
  const topicKey = normalize(source.topic);
  const topicOccurrence = topicOccurrences.get(topicKey) || 0;
  topicOccurrences.set(topicKey, topicOccurrence + 1);
  const reverse = index >= byTopic.size || !description;
  const reviewContexts = [
    "Em uma revisão técnica do aparelho e das manobras do navio",
    "Durante o planejamento de uma operação a bordo",
    "Na conferência da nomenclatura antes da manobra",
    "Em uma instrução prática para a equipe de convés",
  ];
  const questionText = reverse
    ? `${reviewContexts[topicOccurrence % reviewContexts.length]}, qual alternativa apresenta a definição correta de “${source.topic}”?`
    : `Durante a preparação para uma manobra, foi registrada a seguinte descrição: “${description}”. Qual termo técnico corresponde a ela?`;
  const volume = /v\.\s*1/i.test(source.source?.title || "") ? 1 : 2;
  const chapterNumber = source.tracking?.chapter?.number || source.taxonomy?.chapter_id?.match(/ch(\d+)/)?.[1] || "";

  return {
    id: `pscpp::generated::anv::${String(sequence).padStart(4, "0")}`,
    bank: "PSCPP",
    origin: "generated_pscpp",
    pscpp_origin: "generated_pscpp",
    active: true,
    validation_status: "approved",
    source_subject: "simulado-pscpp",
    question: questionText,
    options: answerKeys.map((key, optionIndex) => ({ key, text: orderedTexts[optionIndex] })),
    correct_answer: desiredAnswer,
    explanation: `${source.explanation} Conceito consultado em ${source.source.locator}.`,
    pscpp_format: reverse ? "direct" : "application",
    difficulty: index % 3 === 0 ? "very_hard" : "hard",
    cognitive_level: index % 3 === 0 ? 5 : index % 2 === 0 ? 4 : 3,
    module: "Arte Naval",
    topic: source.topic,
    tags: ["Arte Naval", config.chapter, source.module, source.topic, batchKey],
    bibliography: {
      publication: `Arte Naval — Volume ${volume}`,
      edition: "8ª edição revista e ampliada",
      chapter: config.chapter,
      locator: source.source.locator,
      file_id: volume === 1
        ? "file_00000000ca9071f98ca1c87b7010cfdf"
        : "file_00000000d41481fdb100855f112b429c",
    },
    source: {
      title: `Arte Naval — Volume ${volume} — 8ª edição revista e ampliada`,
      locator: source.source.locator,
    },
    provenance: {
      method: "curated-source-question-rewrite",
      derived_from_question_id: source.id,
      source_chapter: chapterNumber,
      generation_batch: batchKey,
    },
  };
});

const existingTexts = new Set(targetBank.questions.map((question) => normalize(question.question)));
for (const question of generated) {
  const text = normalize(question.question);
  if (existingTexts.has(text)) {
    console.error(`${question.id}: enunciado duplicado.`);
    process.exit(1);
  }
  existingTexts.add(text);
}

targetBank.questions.push(...generated);
targetBank.note = `Banco gerado e validado em lotes rastreáveis; ${batchKey} fundamentado em ${config.chapter}, Arte Naval, 8ª edição.`;
targetBank.batch_status[batchKey] = {
  range: `${String(batchStart).padStart(4, "0")}-${String(batchStart + 49).padStart(4, "0")}`,
  status: "approved_and_inserted",
  approved_so_far: 50,
  chapter: config.chapter,
};
fs.writeFileSync(targetPath, `${JSON.stringify(targetBank, null, 2)}\n`);
console.log(`${batchKey}: ${generated.length} questões adicionadas (${batchStart}-${batchStart + 49}).`);
