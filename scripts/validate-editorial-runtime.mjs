import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {hasLocatorOnlyCommand} from "../lib/question-locator-audit.js";
import {buildFixedPscppExam, isPscppEditoriallyEligible, PSCPP_QUOTAS} from "../lib/pscpp-exam-selection.js";
import {historicalSubject} from "../lib/historical-exam-blueprint.js";

const notebook=JSON.parse(await readFile(new URL("../data/questions/runtime-active-banks.json",import.meta.url),"utf8"));
const pscpp=JSON.parse(await readFile(new URL("../data/pscpp/runtime-active-questions.json",import.meta.url),"utf8"));
const questions=[...Object.values(notebook.banks).flatMap(bank=>bank.questions),...pscpp.questions];
const broken=/cacacarga|gragragrande|popopor|guru pés|\beuum\b|\bentre entre\b|Considere A definição técnica “|A descrição inclui ainda esta característica:/i;
const findings=questions.filter(q=>[q.question,q.explanation,...(q.options||[]).map(o=>typeof o==="string"?o:o?.text)].some(v=>broken.test(String(v||""))));
assert.equal(findings.length,0,`Artefatos editoriais conhecidos em ${findings.map(q=>q.id).slice(0,12).join(", ")}`);
// Scope the new complete audit to the requested notebook bank. SimuladoPSCPP
// retains its independent editorial policy and is not changed by this repair.
const locatorFindings=notebook.banks['legislacao-regulamentacao'].questions.filter(hasLocatorOnlyCommand);
assert.equal(locatorFindings.length,0,`Enunciado dependente de localizador no caderno de legislação: ${locatorFindings.map(q=>q.id).join(', ')}`);
// The source/runtime pipeline can legitimately remove malformed records before
// this stage. A frozen count of 11 did not prove editorial safety. Verify the
// actual rejected IDs cannot enter a 100-question exam, with quotas preserved.
const excluded=pscpp.questions.filter(q=>!isPscppEditoriallyEligible(q));
const excludedIds=new Set(excluded.map(q=>String(q.id)));
assert.equal(excludedIds.size,excluded.length,"IDs duplicados entre os itens editoriais inelegíveis");
const exam=buildFixedPscppExam(pscpp.questions,"editorial-runtime-regression");
assert.equal(exam.length,Object.values(PSCPP_QUOTAS).reduce((sum,n)=>sum+n,0),"Simulado PSCPP com cardinalidade incorreta");
assert.ok(exam.every(q=>isPscppEditoriallyEligible(q)&&!excludedIds.has(String(q.id))),"Item editorialmente inelegível selecionado");
for(const [subject,quota] of Object.entries(PSCPP_QUOTAS)){
  assert.equal(exam.filter(q=>historicalSubject(q)===subject).length,quota,`Cota PSCPP incorreta: ${subject}`);
}
console.log(`Auditoria determinística: ${questions.length} itens, 0 artefatos conhecidos, 0 enunciados por localizador no caderno de legislação, ${excluded.length} itens editoriais inelegíveis preservados no histórico e excluídos de sorteios; matriz 100/100 validada`);
