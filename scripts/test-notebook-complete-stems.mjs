import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire, Module } from "node:module";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { classifyQuestionStructure, structuredPublicQuestion } from "../lib/question-structure.js";
import { publicQuestion as notebookPublicQuestion } from "../lib/question-banks.js";
import { createHash } from "node:crypto";

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

const pack = JSON.parse(fs.readFileSync(new URL("../data/question-restorations/notebook-complete-stems.json", import.meta.url)));
const banks = JSON.parse(fs.readFileSync(new URL("../data/questions/runtime-active-banks.json", import.meta.url))).banks;
const digest = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const report = JSON.parse(fs.readFileSync(new URL("../reports/notebook-incomplete-stems.json", import.meta.url)));
const byBank = {};
const reasons = {};
for (const edit of pack.edits) {
  const question = banks[edit.bank].questions.find(q => q.id === edit.id);
  assert.ok(question, `Inactive or missing corrected question: ${edit.bank}/${edit.id}`);
  assert.equal(question.question, edit.question);
  const structure = classifyQuestionStructure(question);
  const html = renderToStaticMarkup(React.createElement(StructuredQuestion, { question: notebookPublicQuestion(question) }));
  const escaped = text => renderToStaticMarkup(React.createElement("span", null, text)).slice(6, -7);
  const before = report.questions.find(q => q.bank === edit.bank && q.id === edit.id);
  assert.equal(question.correct_answer, before.correct_answer, `Answer letter changed: ${edit.id}`);
  if (edit.association_pairs) {
    assert.equal(structure.type, "correlation");
    assert.ok(html.includes("COLUNA A") && html.includes("COLUNA B"));
    for (const pair of edit.association_pairs) {
      assert.ok(html.includes(escaped(pair.term)), `Missing term: ${edit.id}`);
      assert.ok(html.includes(escaped(pair.definition)), `Missing definition: ${edit.id}`);
    }
    const sequence = edit.association_pairs.map(p => p.letter).join(" – ");
    assert.equal(question.options.filter(o => o.text === sequence).length, 1);
    assert.equal(question.options.find(o => o.text === sequence).key, question.correct_answer);
    assert.equal(new Set(question.options.map(o => o.text)).size, 5);
    for (const option of question.options) {
      assert.equal(option.text.split(" – ").length, edit.association_pairs.length);
      assert.equal(new Set(option.text.split(" – ")).size, edit.association_pairs.length);
    }
  } else {
    assert.equal(digest(question.options), before.options_sha256, `Options changed: ${edit.id}`);
    assert.equal(digest(question.explanation), before.explanation_sha256, `Explanation changed: ${edit.id}`);
    if (edit.reasons.includes("inline_assertions_removed")) {
      const items = structure.blocks.flatMap(b => b.type === "assertions" ? b.items : []);
      assert.ok(items.length >= 2, `Unparsed inline statements: ${edit.id}`);
      assert.equal(new Set(items.map(i => i.label)).size, items.length);
      for (const item of items) assert.ok(html.includes(escaped(item.text)), `Absent statement: ${edit.id}`);
    }
    if (edit.reasons.includes("fill_sentence_removed")) assert.ok(html.includes("______"));
  }
  byBank[edit.bank] = (byBank[edit.bank] || 0) + 1;
  for (const reason of edit.reasons) reasons[reason] = (reasons[reason] || 0) + 1;
}
let audited = 0;
for (const [bank, data] of Object.entries(banks)) {
  if (bank === "situacoes-de-manobra-ripeam") continue;
  for (const q of data.questions) {
    audited++;
    const structure = classifyQuestionStructure(q);
    const optionText = o => typeof o === "string" ? o : o.text;
    const combination = q.options.some(o => /(?:apenas|somente)\s+(?:as?\s+(?:afirmativas|assertivas)\s+)?(?:I|II|III|IV|V)\b/i.test(optionText(o)));
    if (combination) assert.ok(structure.blocks.some(b => b.type === "assertions" || b.type === "items"), `Combination without propositions: ${bank}/${q.id}`);
    assert.ok(!/proposição relativa a .+: _{3}|relação técnica entre .+: _{3}/i.test(q.question), `Empty fill sentence: ${bank}/${q.id}`);
    const missingPairs = q.options.some(o => /^\d e \d trocados/i.test(optionText(o)));
    if (missingPairs) assert.ok(structure.blocks.some(b => b.type === "columns"), `Association without columns: ${bank}/${q.id}`);
  }
}
assert.equal(audited, 9711);
assert.equal(pack.edits.length, 474);
assert.equal(Object.keys(byBank).length, 7);
assert.deepEqual(reasons, {inline_assertions_removed: 346, fill_sentence_removed: 10, association_columns_missing: 45, empty_fill_context: 72, incomplete_association_command: 1});
console.log(JSON.stringify({verified:pack.edits.length,by_bank:byBank,reasons,component_html_verified:true},null,2));
