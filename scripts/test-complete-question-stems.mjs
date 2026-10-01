import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire, Module } from "node:module";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { classifyQuestionStructure, structuredPublicQuestion } from "../lib/question-structure.js";
import { publicQuestion as notebookPublicQuestion } from "../lib/question-banks.js";

const require = createRequire(import.meta.url);
const filename = fileURLToPath(new URL("../app/components/StructuredQuestion.js", import.meta.url));
const babel = require("next/dist/compiled/babel/core");
const { code } = babel.transformSync(fs.readFileSync(filename, "utf8"), {
  filename,
  babelrc: false,
  configFile: false,
  presets: [[require.resolve("next/babel"), { "preset-env": { modules: "commonjs" }, "transform-runtime": { helpers: false, regenerator: false } }]],
});
const compiled = new Module(filename);
compiled.filename = filename;
const componentRequire = createRequire(filename);
compiled.require = (specifier) => specifier.endsWith(".css") ? {}
  : specifier === "../../lib/question-structure" ? { classifyQuestionStructure }
  : componentRequire(specifier);
compiled._compile(code, filename);
const StructuredQuestion = compiled.exports.default;

const banks = JSON.parse(fs.readFileSync(new URL("../data/questions/runtime-active-banks.json", import.meta.url))).banks;
const pscpp = JSON.parse(fs.readFileSync(new URL("../data/pscpp/runtime-active-questions.json", import.meta.url))).questions;
const entries = [
  ...Object.entries(banks).flatMap(([subject, bank]) => bank.questions.map((question) => ({ subject, question }))),
  ...pscpp.map((question) => ({ subject: "simulado-pscpp", question })),
];
const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const statementText = (item) => String(typeof item === "string" ? item : item.text).trim().replace(/^(?:IX|IV|VIII|VII|VI|III|II|I|V|X)[).:\-]\s*/i, "").trim();
const items = (structure) => structure.blocks.flatMap((block) => block.type === "assertions" ? block.items : []);
const report = { version: "complete-assertion-stems-v1", audited: entries.length, affected: 0, by_bank: {}, questions: [] };
let assertionsChecked = 0;
let inlineAlreadyComplete = 0;
for (const { subject, question } of entries) {
  const original = JSON.stringify(question);
  const structure = classifyQuestionStructure(question);
  if (!question.assertions?.length) {
    const combinations = (question.options || []).some((option) => /^(?:apenas\s+)?(?:I|II|III|IV|V)(?:\s*[,e]\s*(?:I|II|III|IV|V))+/i.test(String(typeof option === "string" ? option : option.text)));
    if (combinations && structure.type !== "correlation") assert.ok(items(structure).length >= 2, `No statements in source or screen: ${subject}/${question.id}`);
    continue;
  }
  assertionsChecked++;
  const legacy = classifyQuestionStructure({ ...question, assertions: [] });
  const inlineItems = items(legacy);
  const expected = inlineItems.length === question.assertions.length
    ? inlineItems.map((item) => item.text) : question.assertions.map(statementText);
  assert.deepEqual(items(structure).map((item) => item.text), expected, `Missing, duplicated or changed statement: ${subject}/${question.id}`);
  assert.deepEqual(items(structure).map((item) => item.label), expected.map((_, i) => roman[i]), `Wrong labels: ${question.id}`);
  assert.deepEqual(structure.options, question.options, `Options changed: ${question.id}`);
  assert.equal(JSON.stringify(question), original, `Source changed: ${question.id}`);
  assert.deepEqual(classifyQuestionStructure({ ...question, structure }), structure, `Not idempotent: ${question.id}`);

  const publicData = subject === "simulado-pscpp" ? structuredPublicQuestion(question) : notebookPublicQuestion(question);
  assert.deepEqual(items(publicData.structure), items(structure), `Incomplete public payload: ${question.id}`);
  // Render the actual shared component, including the legacy cached structure case.
  const html = renderToStaticMarkup(React.createElement(StructuredQuestion, { question: { ...publicData, structure: legacy } }));
  const labels = [...html.matchAll(/<b>([IVX]+)\)<\/b>/g)].map((match) => match[1]);
  assert.deepEqual(labels, expected.map((_, i) => roman[i]), `Incomplete screen: ${question.id}`);
  for (const text of expected) {
    const escaped = renderToStaticMarkup(React.createElement("span", null, text)).slice(6, -7);
    assert.ok(html.includes(escaped), `Statement absent from HTML: ${question.id}`);
  }
  const missingBefore = items(legacy).length < expected.length;
  if (!missingBefore) { inlineAlreadyComplete++; continue; }
  report.affected++;
  report.by_bank[subject] = (report.by_bank[subject] || 0) + 1;
  report.questions.push({ bank: subject, id: question.id, topic: question.topic, question: question.question,
    assertions: items(structure), correct_answer: question.correct_answer, source: question.source });
}
assert.ok(report.affected > 0);
assert.equal(assertionsChecked, report.affected + inlineAlreadyComplete);
assert.equal(report.by_bank.comunicacoes, 26);
for (const id of ["COM-B009-04", "COM-B019-04"]) assert.ok(report.questions.some((question) => question.id === id), `Screenshot example absent: ${id}`);

const separate = { question: "Analise as afirmativas.", assertions: ["I) Primeira.", "II) Segunda."], options: ["Apenas I.", "Apenas II."] };
const parsed = classifyQuestionStructure(separate);
assert.deepEqual(items(parsed), [{ label: "I", text: "Primeira." }, { label: "II", text: "Segunda." }]);
assert.deepEqual(items(classifyQuestionStructure({ ...separate, assertions: [{ label: "I", text: "Primeira." }, { label: "II", text: "Segunda." }] })), items(parsed));
const inline = { ...separate, question: "Analise: I) Primeira. II) Segunda." };
assert.equal(items(classifyQuestionStructure(inline)).length, 2);
const ten = { question: "Analise os dez itens.", assertions: roman.map((label) => `${label}) Afirmativa ${label}.`), options: separate.options };
assert.deepEqual(items(classifyQuestionStructure(ten)).map((item) => item.label), roman);
assert.deepEqual(items(classifyQuestionStructure({ ...ten, question: `Analise: ${ten.assertions.join(" ")}` })).map((item) => item.label), roman);
const partial = { ...separate, structure: { type: "assertions", blocks: [{ type: "stem", text: separate.question }, { type: "assertions", items: [items(parsed)[0]] }] } };
assert.deepEqual(items(classifyQuestionStructure(partial)), items(parsed));
assert.equal(items(classifyQuestionStructure({ ...separate, question: "Primeira. Julgue as afirmativas." })).length, 2);
const vf = classifyQuestionStructure({ ...separate, options: ["V-F", "F-V"] });
assert.equal(vf.type, "true_false");
assert.deepEqual(vf.options, ["V – F", "F – V"]);

if (process.argv.includes("--report")) {
  const affected_ids_by_bank = Object.fromEntries(Object.keys(report.by_bank).map((bank) => [bank, report.questions.filter((question) => question.bank === bank).map((question) => question.id)]));
  fs.writeFileSync(new URL("../reports/complete-question-stems.json", import.meta.url), JSON.stringify({
    version: report.version, audited: report.audited, affected: report.affected, by_bank: report.by_bank,
    assertion_questions_verified: assertionsChecked, already_complete_inline: inlineAlreadyComplete,
    remaining_incomplete: 0, affected_ids_by_bank,
  }, null, 2) + "\n");
}
console.log(JSON.stringify({ audited: report.audited, corrected: report.affected, by_bank: report.by_bank,
  assertion_questions_verified: assertionsChecked, already_complete_inline: inlineAlreadyComplete,
  remaining_incomplete: 0, component_html_verified: true, source_questions_unchanged: true }, null, 2));