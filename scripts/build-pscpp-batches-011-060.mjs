import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(root, "data/pscpp/generated-batches");
const legacy = JSON.parse(fs.readFileSync(path.join(root, "data/pscpp/generated-questions.json"), "utf8"));
const official = JSON.parse(fs.readFileSync(path.join(root, "data/pscpp/official-exams.json"), "utf8"));

const plans = [
  { first: 11, last: 40, slug: "manobrabilidade", file: "manobrabilidade.json", code: "man", total: 1500 },
  { first: 41, last: 44, slug: "navegacao-aguas-restritas", file: "navegacao-aguas-restritas.json", code: "nar", total: 200 },
  { first: 45, last: 59, slug: "arte-naval", file: "arte-naval.json", code: "anv", total: 750 },
];

const sourceRules = [
  {
    test: /(?:LEWIS — )?Principles of Naval Architecture, Volume III/i,
    publication: "Principles of Naval Architecture — Volume III",
    edition: "Second Revision",
    file_id: "file_00000000cc94820e96e089a66666040b",
  },
  {
    test: /(?:LEWIS — )?Principles of Naval Architecture, Volume II(?!I)/i,
    publication: "Principles of Naval Architecture — Volume II: Resistance, Propulsion and Vibration",
    edition: "Second Revision",
    file_id: "file_00000000ef94820e8f9ae0718efd9071",
  },
  {
    test: /Shiphandling for the Mariner/i,
    publication: "Shiphandling for the Mariner",
    edition: "4th edition",
    file_id: "file_00000000fad081fd9e28cdcc2bcdbc11",
  },
  {
    test: /Bridge Team Management/i,
    publication: "Bridge Team Management",
    edition: "2nd edition",
    file_id: "libfile_96f6fdbb154481918c172aed9c9da2f6",
  },
  {
    test: /Arte Naval, v\. 1/i,
    publication: "Arte Naval — Volume 1",
    edition: "8ª edição revista e ampliada",
    file_id: "file_00000000ca9071f98ca1c87b7010cfdf",
  },
  {
    test: /Arte Naval, v\. 2/i,
    publication: "Arte Naval — Volume 2",
    edition: "8ª edição revista e ampliada",
    file_id: "file_00000000d41481fdb100855f112b429c",
  },
];

const normalize = (value) => String(value ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const existingTexts = new Set([...official.questions, ...legacy.questions].map((question) => normalize(question.question)));
const previouslyDerived = new Set(legacy.questions.flatMap((question) => [
  question.provenance?.derived_from_question_id,
  ...(question.provenance?.derived_from_question_ids || []),
]).filter(Boolean));

function qualityScore(question) {
  let score = 0;
  const text = question.question || "";
  if (question.explanation?.length >= 120) score += 5;
  if (question.source?.locator) score += 5;
  if (question.taxonomy?.chapter_id) score += 3;
  if (question.tracking?.chapter?.label) score += 2;
  if (/analise|considere|situação|afirmativ|assinale/i.test(text)) score += 2;
  if (/precisa ser interpretado corretamente|qual alternativa permanece válida|qual afirmação deve ser mantida/i.test(text)) score -= 4;
  if (/INCORRETA|EXCETO|NÃO corresponde|não está correta/i.test(text)) score -= 12;
  if (/descrição:\s*(este|esta|esse|essa)\b/i.test(text)) score -= 20;
  if (text.length >= 80 && text.length <= 650) score += 2;
  return score;
}

function candidatesFor(plan) {
  const bank = JSON.parse(fs.readFileSync(path.join(root, "data/questions", plan.file), "utf8"));
  const unique = new Set();
  return bank.questions
    .filter((question) => {
      const rule = sourceRules.find((item) => item.test.test(question.source?.title || ""));
      if (!rule || question.options?.length !== 5 || !/^[A-E]$/.test(question.correct_answer || "")) return false;
      if (!question.question || (question.explanation || "").length < 80 || !question.source?.locator) return false;
      if (previouslyDerived.has(question.id) || /descrição:\s*(este|esta|esse|essa)\b/i.test(question.question)) return false;
      if (/INCORRETA|EXCETO|NÃO corresponde|não está correta/i.test(question.question)) return false;
      const text = normalize(question.question);
      if (!text || existingTexts.has(text) || unique.has(text)) return false;
      unique.add(text);
      return true;
    })
    .sort((left, right) => qualityScore(right) - qualityScore(left)
      || String(left.taxonomy?.chapter_id || "").localeCompare(String(right.taxonomy?.chapter_id || ""), "pt-BR")
      || String(left.id).localeCompare(String(right.id), "pt-BR"));
}

function interleaveByChapter(items, total) {
  const groups = new Map();
  for (const item of items) {
    const key = item.taxonomy?.chapter_id || item.tracking?.chapter?.label || item.module || "geral";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  const queues = [...groups.values()].sort((a, b) => b.length - a.length);
  const selected = [];
  for (let depth = 0; selected.length < total; depth++) {
    let added = 0;
    for (const queue of queues) {
      if (queue[depth] && selected.length < total) {
        selected.push(queue[depth]);
        added++;
      }
    }
    if (!added) break;
  }
  return selected;
}

function admittedQuestion(source, plan, sequence, batchNumber, index) {
  const rule = sourceRules.find((item) => item.test.test(source.source.title));
  const desiredAnswer = "ABCDE"[index % 5];
  const correct = source.options.find((option) => option.key === source.correct_answer);
  const distractors = source.options.filter((option) => option.key !== source.correct_answer);
  let distractorIndex = 0;
  const options = [..."ABCDE"].map((key) => ({
    key,
    text: key === desiredAnswer ? correct.text : distractors[distractorIndex++].text,
  }));
  const chapter = source.tracking?.chapter?.label
    || source.taxonomy?.chapter_id
    || source.module
    || "Escopo indicado na fonte";
  return {
    id: `pscpp::generated::${plan.code}::${String(sequence).padStart(4, "0")}`,
    bank: "PSCPP",
    origin: "generated_pscpp",
    pscpp_origin: "generated_pscpp",
    active: true,
    validation_status: "approved",
    source_subject: plan.slug,
    question: source.question,
    ...(Array.isArray(source.assertions) ? { assertions: source.assertions } : {}),
    options,
    correct_answer: desiredAnswer,
    explanation: source.explanation,
    pscpp_format: /situa|aplicad|operacion/i.test(source.style || source.question) ? "application" : "direct",
    difficulty: index % 3 === 0 ? "very_hard" : "hard",
    cognitive_level: index % 3 === 0 ? 5 : index % 2 === 0 ? 4 : 3,
    module: source.module || plan.slug,
    topic: source.topic || source.topic_code || "Conteúdo bibliográfico",
    tags: [...new Set([...(source.tags || []), plan.slug, `batch_${String(batchNumber).padStart(3, "0")}`])],
    taxonomy: source.taxonomy || null,
    tracking: source.tracking || null,
    bibliography: {
      publication: rule.publication,
      edition: rule.edition,
      chapter,
      locator: source.source.locator,
      file_id: rule.file_id,
    },
    source: {
      title: `${rule.publication}${rule.edition ? ` — ${rule.edition}` : ""}`,
      locator: source.source.locator,
    },
    provenance: {
      method: "curated-admission-from-validated-subject-bank",
      derived_from_question_id: source.id,
      source_bank: plan.file,
      generation_batch: `batch_${String(batchNumber).padStart(3, "0")}`,
    },
  };
}

fs.mkdirSync(outputDir, { recursive: true });
const manifest = { title: "Lotes complementares PSCPP", batch_size: 50, batches: {} };
let sequence = 501;
const selectedIds = new Set();
const candidatePools = new Map();
for (const plan of plans) {
  const candidates = candidatesFor(plan);
  candidatePools.set(plan.slug, candidates);
  const selected = interleaveByChapter(candidates, plan.total);
  if (selected.length !== plan.total) throw new Error(`${plan.slug}: ${selected.length}/${plan.total} candidatos elegíveis`);
  for (let batchNumber = plan.first; batchNumber <= plan.last; batchNumber++) {
    const offset = (batchNumber - plan.first) * 50;
    const sources = selected.slice(offset, offset + 50);
    const questions = sources.map((source, index) => admittedQuestion(source, plan, sequence + index, batchNumber, index));
    for (const source of sources) selectedIds.add(`${plan.slug}:${source.id}`);
    const batchKey = `batch_${String(batchNumber).padStart(3, "0")}`;
    const file = `${batchKey}.json`;
    fs.writeFileSync(path.join(outputDir, file), `${JSON.stringify({
      title: `Questões inéditas PSCPP — ${batchKey}`,
      status: "approved_and_inserted",
      subject: plan.slug,
      questions,
    })}\n`);
    manifest.batches[batchKey] = {
      file,
      range: `${String(sequence).padStart(4, "0")}-${String(sequence + 49).padStart(4, "0")}`,
      subject: plan.slug,
      approved: 50,
      status: "approved_and_inserted",
    };
    sequence += 50;
  }
}

const mixedSources = [
  ...candidatePools.get("manobrabilidade").filter((source) => !selectedIds.has(`manobrabilidade:${source.id}`)).slice(0, 28).map((source) => ({ source, plan: plans[0] })),
  ...candidatePools.get("navegacao-aguas-restritas").filter((source) => !selectedIds.has(`navegacao-aguas-restritas:${source.id}`)).slice(0, 21).map((source) => ({ source, plan: plans[1] })),
  ...candidatePools.get("arte-naval").filter((source) => !selectedIds.has(`arte-naval:${source.id}`)).slice(0, 1).map((source) => ({ source, plan: plans[2] })),
];
if (mixedSources.length !== 50) throw new Error(`batch_060 misto: ${mixedSources.length}/50 candidatos elegíveis`);
const mixedQuestions = mixedSources.map(({ source, plan }, index) => admittedQuestion(source, plan, sequence + index, 60, index));
fs.writeFileSync(path.join(outputDir, "batch_060.json"), `${JSON.stringify({
  title: "Questões inéditas PSCPP — batch_060",
  status: "approved_and_inserted",
  subject: "mixed-verified",
  questions: mixedQuestions,
})}\n`);
manifest.batches.batch_060 = {
  file: "batch_060.json",
  range: `${String(sequence).padStart(4, "0")}-${String(sequence + 49).padStart(4, "0")}`,
  subject: "mixed-verified",
  approved: 50,
  status: "approved_and_inserted",
};
sequence += 50;
fs.writeFileSync(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);

const imports = [...Array(50)].map((_, index) => {
  const number = index + 11;
  return `import batch${number} from "../data/pscpp/generated-batches/batch_${String(number).padStart(3, "0")}.json";`;
});
const references = [...Array(50)].map((_, index) => `batch${index + 11}`).join(", ");
fs.writeFileSync(path.join(root, "lib/generated-pscpp-batches.js"), `${imports.join("\n")}\n\nexport const generatedPscppBatches = [${references}];\nexport const generatedPscppBatchQuestions = generatedPscppBatches.flatMap((batch) => batch.questions || []);\n`);
console.log(`Lotes 011–060 gerados: ${sequence - 501} questões; total PSCPP previsto: ${legacy.questions.length + sequence - 501}.`);
