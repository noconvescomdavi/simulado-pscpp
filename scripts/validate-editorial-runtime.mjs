import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {isPscppEditoriallyEligible} from "../lib/pscpp-exam-selection.js";

const notebook=JSON.parse(await readFile(new URL("../data/questions/runtime-active-banks.json",import.meta.url),"utf8"));
const pscpp=JSON.parse(await readFile(new URL("../data/pscpp/runtime-active-questions.json",import.meta.url),"utf8"));
const questions=[...Object.values(notebook.banks).flatMap(bank=>bank.questions),...pscpp.questions];
const broken=/cacacarga|gragragrande|popopor|guru pés|\beuum\b|\bentre entre\b|Considere A definição técnica “|A descrição inclui ainda esta característica:/i;
const findings=questions.filter(q=>[q.question,q.explanation,...(q.options||[]).map(o=>typeof o==="string"?o:o?.text)].some(v=>broken.test(String(v||""))));
assert.equal(findings.length,0,`Artefatos editoriais conhecidos em ${findings.map(q=>q.id).slice(0,12).join(", ")}`);
const locatorAsObject=/qual disposição (?:pertence|está expressamente associada) a\\s+(?:art\\.?|item|anexo|cap[ií]tulo|se[cç][aã]o)|o que se afirma corretamente em\\s+(?:art\\.?|item|anexo|cap[ií]tulo|se[cç][aã]o)|recorre a\\s+(?:art\\.?|item|anexo|cap[ií]tulo|se[cç][aã]o).+qual regra deve observar|requisitos estabelecidos em\\s+(?:art\\.?|item|anexo|cap[ií]tulo|se[cç][aã]o)/i;
const locatorFindings=questions.filter(q=>locatorAsObject.test(String(q.question||"")));
assert.equal(locatorFindings.length,0,`Enunciado dependente de localizador bibliográfico em ${locatorFindings.map(q=>q.id).slice(0,20).join(", ")}`);
assert.equal(pscpp.questions.filter(q=>!isPscppEditoriallyEligible(q)).length,11);
console.log(`Auditoria determinística: ${questions.length} itens, 0 artefatos conhecidos, 0 enunciados dependentes de localizador, 11 itens tabulares retidos de novos sorteios`);
