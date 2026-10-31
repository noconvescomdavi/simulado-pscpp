import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { buildFixedPscppExam, isPscppEditoriallyEligible, PSCPP_QUOTAS } from "../lib/pscpp-exam-selection.js";
import { historicalSubject } from "../lib/historical-exam-blueprint.js";
import { collectActivePscppQuestions } from "../lib/pscpp-exam-source.js";

const pool = Object.entries(PSCPP_QUOTAS).flatMap(([subject, quota]) =>
  Array.from({ length: quota + 4 }, (_, index) => ({
    id: `${subject}:${index}`,
    source_subject: subject,
    topic: `${subject}:tópico ${index}`,
    question: `${subject}: pergunta ${index}?`,
  }))
);

for (const seed of ["alpha", "bravo", "charlie", "delta"]) {
  const exam = buildFixedPscppExam(pool, seed);
  assert.equal(exam.length, 100);
  assert.equal(new Set(exam.map((q) => q.id)).size, 100);
  for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
    const questions = exam.filter((q) => historicalSubject(q) === subject);
    assert.equal(questions.length, quota, `${seed}: ${subject}`);
    assert.equal(new Set(questions.map((q) => q.topic)).size, quota);
  }
}

const shortage = pool.filter((q) => q.source_subject !== "comunicacoes" || Number(q.id.split(":")[1]) < 9);
assert.throws(() => buildFixedPscppExam(shortage, "shortage"), /comunicacoes: 9\/10/);
assert.throws(() => buildFixedPscppExam(pool.map((q) => q.source_subject === "comunicacoes" ? { ...q, topic: "same concept" } : q), "duplicates"), /comunicacoes: 1\/10/);

const optionLikeAssertion = /^(?:\s*(?:I|II|III|IV|V|VI|VII|VIII|IX|X|[a-e])\s*[).:-]?\s*)?(?:(?:apenas|somente)\s+(?:(?:as\s+)?(?:afirmativas?|assertivas?)\s+)?(?:I|II|III|IV|V|VI|VII|VIII|IX|X)(?:\s*[,;]\s*(?:I|II|III|IV|V|VI|VII|VIII|IX|X))*(?:\s+e\s+(?:I|II|III|IV|V|VI|VII|VIII|IX|X))?\s+(?:s[aã]o|est[aã]o)\s+(?:verdadeiras?|falsas?|corretas?|incorretas?)|(?:todas|nenhuma)\s+(?:as\s+)?(?:afirmativas?|assertivas?)\s+(?:s[aã]o|est[aã]o)\s+(?:verdadeiras?|falsas?|corretas?|incorretas?))/i;
const activePscpp = collectActivePscppQuestions();
const leakingAssertions = activePscpp.filter((q) => {
  const assertions = Array.isArray(q.assertions) ? q.assertions : [];
  const stemLines = String(q.question || "").split(/\r?\n/);
  return assertions.some((a) => optionLikeAssertion.test(String(a || "").trim()))
    || stemLines.some((line) => optionLikeAssertion.test(line.trim()));
});
assert.equal(leakingAssertions.length, 0, `Há alternativas vazando para o enunciado: ${leakingAssertions.map((q) => q.id).join(", ")}`);

const runtime = JSON.parse(await readFile(new URL("../data/pscpp/runtime-active-questions.json", import.meta.url), "utf8")).questions;
assert.ok(runtime.length >= 100);
// Do not freeze the number of ineligible items: earlier structural filters
// may remove malformed records before runtime. Preserve an explicit exclusion
// invariant for every remaining ineligible ID, regardless of pool size.
const excluded=runtime.filter(q=>!isPscppEditoriallyEligible(q));
const excludedIds=new Set(excluded.map(q=>String(q.id)));
assert.equal(excludedIds.size,excluded.length,"IDs duplicados entre os itens inelegíveis");
assert.equal(isPscppEditoriallyEligible({question:"MODO DE REPRESEN TAR VISTA DO AS LINHAS DO NAVIO",options:[]}),false,"Tabela OCR corrompida não pode ser elegível");
assert.equal(isPscppEditoriallyEligible({question:"Analise as afirmativas.",assertions:["Apenas I e II são verdadeiras."],options:[]}),false,"Alternativa vazada em afirmativa não pode ser elegível");
for (const seed of ["alpha", "bravo", "charlie", "delta"]) {
  const exam = buildFixedPscppExam(runtime, seed);
  assert.equal(exam.length, 100);
  assert.ok(exam.every(isPscppEditoriallyEligible));
  assert.ok(exam.every(q=>!excludedIds.has(String(q.id))),`${seed}: item inelegível entrou no sorteio`);
  for (const [subject, quota] of Object.entries(PSCPP_QUOTAS)) {
    assert.equal(exam.filter((q) => historicalSubject(q) === subject).length, quota, `${seed}: banco ativo ${subject}`);
  }
}

console.log(`Matriz fixa PSCPP: OK; ${excluded.length} itens editoriais inelegíveis excluídos de todos os sorteios testados`);
