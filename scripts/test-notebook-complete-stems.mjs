import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire, Module } from "node:module";
import { fileURLToPath } from "node:url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { classifyQuestionStructure, structuredPublicQuestion } from "../lib/question-structure.js";
import { publicQuestion as notebookPublicQuestion } from "../lib/question-banks.js";
import { createHash } from "node:crypto";
import { completeNotebookStemEdits } from "../lib/notebook-stem-restorations.js";

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

const cap45Review = JSON.parse(fs.readFileSync(new URL("../data/question-restorations/miguens-cap45-reviewed.json", import.meta.url)));
const pack = JSON.parse(fs.readFileSync(new URL("../data/question-restorations/notebook-complete-stems.json", import.meta.url)));
const banks = JSON.parse(fs.readFileSync(new URL("../data/questions/runtime-active-banks.json", import.meta.url))).banks;
const digest = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const report = JSON.parse(fs.readFileSync(new URL("../reports/notebook-incomplete-stems.json", import.meta.url)));
// Primary-source audit revisions supersede the frozen stem-only explanation.
// Require the exact full effective hash and primary restoration, never a blanket exemption.
const primaryCorrections = JSON.parse(fs.readFileSync(new URL("../docs/auditoria-pscpp/CORRECOES_RUNTIME.json", import.meta.url))).corrections;
const primaryRestorations = JSON.parse(fs.readFileSync(new URL("../data/question-restorations/arte-naval.json", import.meta.url))).questions;
const primaryMainBank = JSON.parse(fs.readFileSync(new URL("../data/questions/arte-naval.json", import.meta.url))).questions;
const stable = value => Array.isArray(value) ? value.map(stable) : value && typeof value === "object"
  ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])])) : value;
// These later technical corrections change the explanation after the stem-only audit.
const revisedExplanationHashes = {
  "manobrabilidade/MAN-B011-13": "7a4e410564de63020959a4fcfa42fb4760936482e7504456e5d810012bd21ee4",
  "manobrabilidade/MAN-B010-13": "0c76f7ffeba915e800077eda3335db2745eb3a050749ab3c9350b5d1168417ee",
  "manobrabilidade/MAN-B007-13": "8afd3021e2b9de67cc59c89f072b10c721fe11d647dcbbdd841abf6f888eaae6",
  "manobrabilidade/MAN-B004-13": "ebb99b712815fd5255a6c11a988bc6f1249eb01711117101be089d4f7f310f9d",
  "manobrabilidade/MAN-B003-13": "3e242be6c259edb773c055383eaf0c1370a1a169c7e63386441d8f260a707e89",
  "manobrabilidade/MAN-B026-13": "4555aca2f3e687cbd3c05093b0035f02675efbff332ea40341def3a27fcfa663",
  "manobrabilidade/MAN-B025-13": "2c15a24deb3759e3250c04f04ff61a76bf62f047f16445701a59d41a7ac83e7a",
  "manobrabilidade/MAN-B024-13": "c1d7034e3892b3855138490250b2a712cb8cfe45ef2b07c34d49c4a81fce9063",
  "manobrabilidade/MAN-B023-13": "73b342e7db885e5e48412a3e04f9879180ee3e6d49d85858625d6ef67e250db9",
  "manobrabilidade/MAN-B022-13": "4473258c8abf9a25a21cdd2d120108f69e4738163fe36b288c03549554770648",
  "manobrabilidade/MAN-B021-13": "7cf348ef2e4a5a92e9f65c1228362084f3e99d59273b026c4f779424918d9844",
  "manobrabilidade/MAN-B020-13": "b4913ddf197f9475b29129dd0108e305ed7e24d0e36d89a7a802dee647d5006f",
  "manobrabilidade/MAN-B019-13": "ea0a4baee61ede3e462de35ee01d2554c065b5b1a5aec1e62ccee65254c457d5",
  "manobrabilidade/MAN-B018-13": "a4f97bc41c1967f489ea82cd90853603b393140801d80bcf3d836294b7a49a00",
  "manobrabilidade/MAN-B017-13": "f29c8c3f0bef4da518509e9568dd342e590fcff1e5bbecc220e0a2be83423c84",
  "manobrabilidade/MAN-B016-13": "f0e427935ec95b70de02b3bebe09ec56dae501246a4d38c832396fe7d3d187af",
  "manobrabilidade/MAN-B015-13": "201c6c1ca9707e2d73f741cc089ff1d97c2b7313251f99b75b7b75223956c314",
  "manobrabilidade/MAN-B014-13": "e7a7d7089b675f250ba3caa7d0b83974c684b7382e58d1905a3fdced091f0c44",
  "manobrabilidade/MAN-B013-13": "7005434d6915854257431a4a9ff2fedaee3cbdbb8a12c2aa42f96f4ef5db35e4",
  "manobrabilidade/MAN-B012-13": "faebdcb2e2523b0f439ba0852a00fecfec51ed0cf7914b40a7a6e56d51d3d894",
  "manobrabilidade/MAN-B009-13": "be6200af19aeeafa0bc8846bedb1cc720e7fde72ad4fb5555209da8f6ef63ab0",
  "manobrabilidade/MAN-3909": "dcfb052f041824d58a21f638b9be24c0edd7dc0614893ab179244a3df9f844a8",
  "manobrabilidade/MAN-B006-13": "2e2ff068b63471d814f579edc67a463eea4df5e4d9e7c12d0745731b2d31adf6",
};
// These primary-source reviews also replace incomplete alternatives.
const revisedOptionsHashes = {
  "manobrabilidade/MAN-B011-13": "62cd02340f1a2c6388c436cc18bf5e33f311616eb115b3445fdccf95e814a371",
  "manobrabilidade/MAN-B010-13": "2a2325d3e4b94f2124a5ca1f0c1a6740128b2f86d18da412ed20fae24ca8ddd2",
  "manobrabilidade/MAN-B007-13": "937bd566f0e58253d0353a2b76782c93ee7cabe9dfe69c524b7179b793fed95f",
  "manobrabilidade/MAN-B026-13": "71d62ced2e2434746bb1f458059c3d0ad6b4d87b031e6c15a57dbd70cc5b2b08",
  "manobrabilidade/MAN-B025-13": "8501121a0efa8078bfb8f91b2d32d8760f9395d51cdf670e9d5bb11b8002c1fd",
  "manobrabilidade/MAN-B024-13": "7381b95a92534778e1d1db7bfbc357fc89962d7ad82767d6333fb607cdf7b960",
  "manobrabilidade/MAN-B023-13": "8742a76dd829a56cfb630d50f0bfff98587f659a9d297a221258d243097e3bf7",
  "manobrabilidade/MAN-B022-13": "682754e9f15b2e9ae73145be013590eb15448efd54c4e8e700c4d981b052d909",
  "manobrabilidade/MAN-B021-13": "0e5cb1071e1809bd636cbdef904f069f54383e83afb24d05aafb5bcf2abcd66f",
};
const byBank = {};
const reasons = {};
for (const edit of completeNotebookStemEdits) {
  const question = banks[edit.bank].questions.find(q => q.id === edit.id);
  assert.ok(question, `Inactive or missing corrected question: ${edit.bank}/${edit.id}`);
  const replacement = cap45Review.edits.find(e => e.pool === "Cadernos" && e.id === edit.id);
  if (replacement) {
    assert.equal(question.question, replacement.question.question);
    assert.deepEqual(question.assertions, replacement.question.assertions);
    assert.equal(question.correct_answer, replacement.question.correct_answer);
    const html = renderToStaticMarkup(React.createElement(StructuredQuestion, { question: notebookPublicQuestion(question) }));
    assert.ok(html.includes("assertion"), `Reviewed propositions must render: ${edit.id}`);
    byBank[edit.bank] = (byBank[edit.bank] || 0) + 1;
    for (const reason of edit.reasons) reasons[reason] = (reasons[reason] || 0) + 1;
    continue;
  }
  assert.equal(question.question, edit.question);
  const structure = classifyQuestionStructure(question);
  const html = renderToStaticMarkup(React.createElement(StructuredQuestion, { question: notebookPublicQuestion(question) }));
  const escaped = text => renderToStaticMarkup(React.createElement("span", null, text)).slice(6, -7);
  const before = report.questions.find(q => q.bank === edit.bank && q.id === edit.id);
  if (before) {
    assert.equal(question.correct_answer, before.correct_answer, `Answer letter changed: ${edit.id}`);
  } else {
    assert.ok(edit.source_file, `New restoration without source_file: ${edit.id}`);
    assert.equal(edit.options, undefined, `New stem-only restoration must not replace options: ${edit.id}`);
    assert.equal(edit.explanation, undefined, `New stem-only restoration must not replace explanation: ${edit.id}`);
  }
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
    if (before) {
      const expectedOptions = revisedOptionsHashes[`${edit.bank}/${edit.id}`] ?? before.options_sha256;
      assert.equal(digest(question.options), expectedOptions, `Options changed: ${edit.id}`);
      const correction = edit.bank === "arte-naval" && primaryCorrections.find(row => row.id === edit.id);
      if (correction) {
        // Lot 068: this documented stem overlay follows a corrected main-bank object.
        // Keep exact effective hash and source-content assertions for both origins.
        if (edit.id === "ANV-0185") assert.equal(edit.source_file, "data/questions/arte-naval.json");
        const primary = (edit.id === "ANV-0185" ? primaryMainBank : primaryRestorations).find(row => row.id === edit.id);
        assert.ok(primary, `Primary restoration missing: ${edit.id}`);
        assert.equal(digest(stable(question)), correction.after_hash, `Primary effective hash changed: ${edit.id}`);
        assert.equal(question.question, primary.question, `Primary stem overwritten: ${edit.id}`);
        assert.equal(question.explanation, primary.explanation, `Primary explanation overwritten: ${edit.id}`);
      } else {
        const expected = revisedExplanationHashes[`${edit.bank}/${edit.id}`] ?? before.explanation_sha256;
        assert.equal(digest(question.explanation), expected, `Explanation changed: ${edit.id}`);
      }
    }
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
const activeFragoso = (banks["arte-naval"]?.questions || []).filter(
  question => question?.taxonomy?.bibliography_id === "fragoso"
);
if (activeFragoso.length !== 144) {
  const arteSource = JSON.parse(fs.readFileSync(new URL("../data/questions/arte-naval.json", import.meta.url), "utf8"));
  const [{ applyQuestionRestorations, applyContentEditorialRestoration }, { reformulateLeakingStem }, { normalizeEditorialStem }, { restoreCompleteNotebookStem }, { questionQualityState }] = await Promise.all([
    import("../lib/question-restorations.js"),
    import("../lib/question-quality.js"),
    import("../lib/question-editorial-normalization.js"),
    import("../lib/notebook-stem-restorations.js"),
    import("../lib/question-quality-policy.js"),
  ]);
  const restored = applyQuestionRestorations("arte-naval", arteSource);
  const activeIds = new Set(activeFragoso.map(question => String(question.id)));
  const diagnostics = (restored.questions || [])
    .filter(question => question?.taxonomy?.bibliography_id === "fragoso")
    .map(question => applyContentEditorialRestoration("arte-naval", question))
    .map(reformulateLeakingStem)
    .map(normalizeEditorialStem)
    .map(question => restoreCompleteNotebookStem("arte-naval", question))
    .filter(question => !activeIds.has(String(question.id)))
    .map(question => ({ id: question.id, reason: questionQualityState(question).reason, question: question.question, correct_answer: question.correct_answer }));
  console.error("FRAGOSO_INACTIVE_DIAGNOSTICS", JSON.stringify(diagnostics, null, 2));
}
assert.equal(activeFragoso.length, 144, "As 144 questões de Rebocadores Portuários devem permanecer ativas no banco de cadernos");
// O tamanho do runtime evolui com lotes homologados e quarentenas editoriais.
// Conferir a presença do lote novo e auditar cada enunciado, sem fixar total histórico.
const santosIds=new Set((banks["manobrabilidade"]?.questions||[])
  .filter(q=>/^MSN21-REV-\d{3}$/.test(String(q.id))).map(q=>String(q.id)));
const expectedSantosIds=Array.from({length:150},(_,i)=>"MSN21-REV-"+String(i+1).padStart(3,"0"));
const missingSantosIds=expectedSantosIds.filter(id=>!santosIds.has(id));
assert.deepEqual(missingSantosIds,[],"Faltam questões do lote Santos no runtime dos Cadernos");
assert.ok(audited >= 10000,"Regressão inesperada no tamanho do corpus ativo de cadernos");
assert.equal(pack.edits.length, 506);
assert.equal(Object.keys(byBank).length, 7);
assert.deepEqual(reasons, {inline_assertions_removed: 365, fill_sentence_removed: 10, association_columns_missing: 45, empty_fill_context: 72, incomplete_association_command: 1, source_stem_replaced_by_runtime_normalization: 13});
console.log(JSON.stringify({verified:pack.edits.length,by_bank:byBank,reasons,component_html_verified:true},null,2));
