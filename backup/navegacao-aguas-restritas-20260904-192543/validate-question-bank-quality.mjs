import { readFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const target = path.resolve(process.argv[2] || path.join(root, "data/questions/navegacao-aguas-restritas.json"));
const expectedSubject = "III — Navegação em Águas Restritas";
const keys = ["A", "B", "C", "D", "E"];
const difficulties = new Set(["Fácil", "Médio", "Difícil"]);
const styles = new Set(["Conceitual", "Aplicada", "Cálculo", "Normativa", "Situacional", "Sequencial"]);
const approvedTitles = new Set([
  "Bridge Team Management: a practical guide",
  "Bridge Procedures Guide",
  "Theory and Practices of Marine Pilotage",
  "Convention on the International Regulations for Preventing Collisions at Sea (COLREG/RIPEAM)",
  "Revised performance standards for radar equipment — Resolution MSC.192(79)",
  "Revised guidelines for the onboard operational use of shipborne AIS — Resolution A.1106(29)",
  "Performance standards for ECDIS — Resolution MSC.530(106)/Rev.1",
  "SOLAS — Chapter V: Safety of Navigation",
  "NORMAM-601/DHN — Auxílios à Navegação",
  "NORMAM-602/DHN — Serviço de Tráfego de Embarcações (VTS)",
  "Guidelines for vessels and units with dynamic positioning systems — MSC.1/Circ.1580",
  "Guidelines for dynamic positioning system operator training — MSC/Circ.738/Rev.1",
]);

const errors = [];
const warnings = [];
const add = (where, message) => errors.push(`${where}: ${message}`);
const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const tokens = (value) => normalize(value).split(/\s+/).filter((word) => word.length > 2);
const trigrams = (value) => {
  const words = tokens(value);
  if (words.length < 3) return new Set([words.join(" ")]);
  return new Set(words.slice(0, -2).map((_, i) => words.slice(i, i + 3).join(" ")));
};
const jaccard = (a, b) => {
  const small = a.size <= b.size ? a : b;
  const large = a.size <= b.size ? b : a;
  let intersection = 0;
  for (const item of small) if (large.has(item)) intersection++;
  return intersection / (a.size + b.size - intersection || 1);
};
const countBy = (items, select) => {
  const out = {};
  for (const item of items) out[select(item)] = (out[select(item)] || 0) + 1;
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b, "pt-BR")));
};
const ordered = (object) => Object.fromEntries(Object.entries(object || {}).sort(([a], [b]) => a.localeCompare(b, "pt-BR")));
const same = (a, b) => JSON.stringify(ordered(a)) === JSON.stringify(ordered(b));

let raw;
let bank;
try {
  raw = await readFile(target, "utf8");
  if (raw.includes("\uFFFD")) throw new Error("contém U+FFFD");
  bank = JSON.parse(raw);
} catch (error) {
  console.error(`FALHA: ${target}: ${error.message}`);
  process.exit(1);
}

if (bank.schema_version !== "1.0") add("metadata", "schema_version deve ser 1.0");
if (bank.bank_id !== "pscpp-navegacao-aguas-restritas-1000-v1") add("metadata", "bank_id inesperado");
if (bank.language !== "pt-BR") add("metadata", "language deve ser pt-BR");
if (bank.question_type !== "multiple_choice_single_answer") add("metadata", "question_type inválido");
if (!Array.isArray(bank.questions)) add("metadata", "questions deve ser array");
const questions = Array.isArray(bank.questions) ? bank.questions : [];
if (questions.length < 1000) add("metadata", `mínimo 1000; encontrado ${questions.length}`);
if (bank.validation?.total !== questions.length) add("metadata", "validation.total diverge do total real");

const ids = new Set();
const statements = new Map();
const topicStyles = new Set();
let previous = null;
let run = 0;
let maxRun = 0;
const transitions = Object.fromEntries(keys.map((key) => [key, new Set()]));

for (const [index, q] of questions.entries()) {
  const id = q?.id || `índice-${index}`;
  const expectedId = `NAR-${String(index + 1).padStart(4, "0")}`;
  if (id !== expectedId) add(id, `ordem/ID esperado: ${expectedId}`);
  if (!/^NAR-\d{4}$/.test(String(id))) add(id, "ID fora do padrão NAR-0001");
  if (ids.has(id)) add(id, "ID duplicado");
  ids.add(id);
  for (const field of ["subject", "module", "topic_code", "topic", "difficulty", "style", "question", "correct_answer", "explanation"]) {
    if (typeof q?.[field] !== "string" || !q[field].trim()) add(id, `${field} vazio ou inválido`);
  }
  if (q.subject !== expectedSubject) add(id, "subject divergente");
  if (!String(q.topic_code).startsWith("NAR.")) add(id, "topic_code não inicia por NAR.");
  if (!difficulties.has(q.difficulty)) add(id, "difficulty inválida");
  if (!styles.has(q.style)) add(id, "style inválido");
  if (!Array.isArray(q.options) || q.options.length !== 5) add(id, "deve haver exatamente cinco alternativas");
  else {
    if (JSON.stringify(q.options.map((o) => o?.key)) !== JSON.stringify(keys)) add(id, "chaves das alternativas devem ser A-E na ordem");
    if (q.options.some((o) => typeof o?.text !== "string" || !o.text.trim())) add(id, "alternativa vazia");
    if (new Set(q.options.map((o) => normalize(o?.text))).size !== 5) add(id, "alternativas duplicadas");
  }
  if (!keys.includes(q.correct_answer)) add(id, "gabarito inválido");
  if (!q.options?.some((o) => o.key === q.correct_answer)) add(id, "gabarito não existe nas alternativas");
  if (!q.source || !["author", "title", "edition", "locator"].every((field) => typeof q.source[field] === "string" && q.source[field].trim())) add(id, "fonte incompleta");
  else {
    if (!approvedTitles.has(q.source.title)) add(id, `fonte não aprovada: ${q.source.title}`);
    if (!/^(Chapter|Capítulo|Regra|Anexo|Appendix|Section|Sections)/.test(q.source.locator)) add(id, `localizador insuficiente: ${q.source.locator}`);
  }
  if (!Array.isArray(q.tags) || q.tags.length < 3) add(id, "tags insuficientes");
  if (/\b(gabarito|resposta correta|fonte bibliográfica)\b/i.test(q.question)) add(id, "enunciado contém pista metalinguística");
  const normalizedStatement = normalize(q.question);
  if (statements.has(normalizedStatement)) add(id, `enunciado idêntico a ${statements.get(normalizedStatement)}`);
  statements.set(normalizedStatement, id);
  const topicStyle = `${normalize(q.topic)}::${q.style}`;
  if (topicStyles.has(topicStyle)) add(id, "repete o mesmo estilo para o mesmo tópico");
  topicStyles.add(topicStyle);
  if (previous) transitions[previous].add(q.correct_answer);
  run = q.correct_answer === previous ? run + 1 : 1;
  maxRun = Math.max(maxRun, run);
  previous = q.correct_answer;
}

const actual = {
  by_module: countBy(questions, (q) => q.module),
  by_difficulty: countBy(questions, (q) => q.difficulty),
  by_style: countBy(questions, (q) => q.style),
  answer_balance: Object.fromEntries(keys.map((key) => [key, questions.filter((q) => q.correct_answer === key).length])),
};
for (const field of Object.keys(actual)) if (!same(bank.validation?.[field], actual[field])) add("metadata", `validation.${field} diverge do real`);
if (!keys.every((key) => actual.answer_balance[key] === 200)) add("gabarito", `equilíbrio inválido: ${JSON.stringify(actual.answer_balance)}`);
if (maxRun > 3) add("gabarito", `sequência de ${maxRun} respostas iguais`);
for (const key of keys) if (transitions[key].size < 4) add("gabarito", `transições após ${key} pouco variadas`);

const coverage = new Set(questions.flatMap((q) => q.tags || []).filter((tag) => /^programa-\d{2}$/.test(tag)).map((tag) => Number(tag.slice(-2))));
for (let item = 1; item <= 39; item++) if (!coverage.has(item)) add("cobertura", `item programático ${item} ausente`);

const topicCounts = countBy(questions, (q) => q.topic);
for (const [topic, total] of Object.entries(topicCounts)) if (total !== 5) add("taxonomia", `${topic} possui ${total} questões; esperado 5`);
if (Object.keys(topicCounts).length !== 200) add("taxonomia", `esperados 200 tópicos; encontrados ${Object.keys(topicCounts).length}`);

const signatures = questions.map((q) => trigrams(`${q.question} ${q.options.find((o) => o.key === q.correct_answer)?.text || ""}`));
let maxSimilarity = { score: 0, a: "", b: "" };
let nearDuplicates = 0;
for (let i = 0; i < questions.length; i++) {
  for (let j = i + 1; j < questions.length; j++) {
    const score = jaccard(signatures[i], signatures[j]);
    if (score > maxSimilarity.score) maxSimilarity = { score, a: questions[i].id, b: questions[j].id };
    if (score >= 0.82) {
      nearDuplicates++;
      add(questions[j].id, `similaridade ${score.toFixed(3)} com ${questions[i].id}`);
    }
  }
}

// Amostra estratificada determinística de 10%: cobre módulos, dificuldades e estilos.
const sample = [];
const sampleIds = new Set();
for (const dimension of [
  ...Object.keys(actual.by_module).map((value) => ["module", value]),
  ...Object.keys(actual.by_difficulty).map((value) => ["difficulty", value]),
  ...Object.keys(actual.by_style).map((value) => ["style", value]),
]) {
  const [field, value] = dimension;
  const candidates = questions.filter((q) => q[field] === value);
  for (let i = 0; i < Math.min(3, candidates.length); i++) {
    const candidate = candidates[Math.floor((i + 1) * candidates.length / 4)];
    if (!sampleIds.has(candidate.id)) { sample.push(candidate); sampleIds.add(candidate.id); }
  }
}
for (let cursor = 17; sample.length < 100; cursor = (cursor + 37) % questions.length) {
  const candidate = questions[cursor];
  if (!sampleIds.has(candidate.id)) { sample.push(candidate); sampleIds.add(candidate.id); }
}
if (sample.length !== 100 || sampleIds.size !== 100) add("amostra", "não foi possível formar 100 itens únicos");
for (const field of ["module", "difficulty", "style"]) {
  for (const value of Object.keys(countBy(questions, (q) => q[field]))) if (!sample.some((q) => q[field] === value)) add("amostra", `${field}=${value} ausente`);
}
const expectedCalculations = new Map([
  ["Calado e margens verticais", "2,5 m."], ["Folga abaixo da quilha", "2,0 m."], ["Squat", "0,90 m."], ["Calado aéreo", "2,0 m."],
  ["Janela de maré", "11h00."], ["Corrente de maré", "348,5°."], ["Ponto de início de guinada", "6 minutos."], ["Limite transversal de rota", "24 minutos."],
  ["Plano de velocidade", "1 h 30 min."], ["Intervalo de posições", "1 min 30 s."], ["Set e deriva observados", "1,2 kn para leste."],
  ["CPA e TCPA no ARPA", "CPA 0 nm e TCPA 30 min."], ["Escalas de distância", "12 milhas."], ["Aquisição e acompanhamento de alvos", "0,5 milha náutica."],
  ["Escala e overscale", "2 vezes."], ["Odômetros e registros de velocidade", "2 kn a favor."], ["Ecobatímetro", "10,0 m."],
  ["Dados de viagem AIS", "2 horas."], ["Relatórios ao VTS", "2 horas."], ["Limites operacionais DP", "30%."],
]);
const calculations = questions.filter((q) => q.style === "Cálculo");
if (calculations.length !== 20) add("cálculos", `esperados 20; encontrados ${calculations.length}`);
for (const q of calculations) {
  const expected = expectedCalculations.get(q.topic);
  const answerText = q.options.find((o) => o.key === q.correct_answer)?.text;
  if (!expected || answerText !== expected) add(q.id, `resultado numérico divergente: ${answerText}`);
}

// Verificações de integração estática do repositório.
const integrationFiles = {
  banks: await readFile(path.join(root, "lib/question-banks.js"), "utf8"),
  subjects: await readFile(path.join(root, "lib/subjects.js"), "utf8"),
  exams: await readFile(path.join(root, "lib/exams.js"), "utf8"),
  answer: await readFile(path.join(root, "app/api/questions/[subject]/answer/route.js"), "utf8"),
  page: await readFile(path.join(root, "app/simulado/[subject]/page.js"), "utf8"),
  client: await readFile(path.join(root, "app/simulado/[subject]/Client.js"), "utf8"),
};
if (!integrationFiles.banks.includes('"navegacao-aguas-restritas":navegacao')) add("integração", "loader não registra o slug");
if (!integrationFiles.subjects.includes('slug:"navegacao-aguas-restritas"')) add("integração", "matéria ausente em subjects");
const publicProjection = integrationFiles.banks.match(/export function publicQuestion\(q\)\{return\{([^}]*)\}\}/)?.[1] || "";
for (const forbidden of ["correct_answer", "explanation", "source"]) if (new RegExp(`\\b${forbidden}\\s*:`).test(publicProjection)) add("segurança", `${forbidden} exposto antes da resposta`);
for (const returned of ["correct_answer", "explanation", "source"]) if (!integrationFiles.answer.includes(returned) && !integrationFiles.exams.includes(returned)) add("integração", `${returned} não devolvido após correção`);
if (!/(bank|b)\??\.questions/.test(integrationFiles.page) || !integrationFiles.page.includes("ready=")) add("integração", "página não deriva estado ready do banco");
if (!integrationFiles.exams.includes("subject")) add("métricas", "slug/subject não encontrado no fluxo de prova");
if (!/answer\.source|source\.title/.test(integrationFiles.client)) warnings.push("A API devolve source após a resposta, mas Client.js não a renderiza. Ajuste de layout não aplicado sem autorização, conforme o prompt-mestre.");

if (errors.length) {
  console.error(`FALHA: ${errors.length} problema(s)`);
  for (const error of errors.slice(0, 200)) console.error(`- ${error}`);
  if (errors.length > 200) console.error(`- ... ${errors.length - 200} problema(s) adicionais`);
  process.exit(1);
}

console.log("VALIDAÇÃO APROVADA");
console.log(`Arquivo: ${target}`);
console.log(`Questões: ${questions.length}; tópicos: ${Object.keys(topicCounts).length}; itens programáticos: ${coverage.size}/39`);
console.log(`Maior similaridade por trigramas: ${maxSimilarity.score.toFixed(3)} (${maxSimilarity.a} × ${maxSimilarity.b}); pares >= 0,82: ${nearDuplicates}`);
console.log(`Maior sequência de gabaritos iguais: ${maxRun}; equilíbrio: ${JSON.stringify(actual.answer_balance)}`);
console.log(`Amostra estratificada: ${sample.length} itens únicos; cálculos conferidos: ${calculations.length}`);
console.log(`IDs da amostra: ${sample.map((q) => q.id).join(", ")}`);
for (const warning of warnings) console.warn(`AVISO: ${warning}`);
