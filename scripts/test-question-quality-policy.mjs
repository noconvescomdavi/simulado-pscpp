import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { isQuestionActive, questionQualityState } from "../lib/question-quality-policy.js";

assert.equal(isQuestionActive({ id:"OK-1" }), true);
assert.equal(isQuestionActive({ id:"OFF-1", active:false }), false);
assert.equal(isQuestionActive({ id:"OFF-2", status:"quarantined" }), false);
assert.equal(isQuestionActive({ id:"LEG-1", provenance:{method:"pscpp-style-upgrade-v3"} }), false);
assert.equal(isQuestionActive({ id:"LEG-2", tags:["expansao-formatos-v1"] }), false);
assert.equal(isQuestionActive({ id:"LEG-3", tags:["cobertura-v2"] }), false);
assert.equal(isQuestionActive({ id:"LEG-4", tags:["revisao-contextual-v2"] }), false);
assert.equal(isQuestionActive({ id:"BAD-1", correct_answer:"B", explanation:"A alternativa A é a correta." }), false);
assert.equal(isQuestionActive({ id:"BAD-2", question:"A descrição técnica a seguir corresponde a qual opção?" }), false);
assert.match(questionQualityState({ provenance:{method:"pscpp-bibliographic-v6"} }).reason, /^legacy-generator:/);
const subjects=["arte-naval","comunicacoes","conhecimentos-gerais","legislacao-regulamentacao","manobrabilidade","meteorologia-oceanografia","navegacao-aguas-restritas"];
for (const subject of subjects) {
  const bank=JSON.parse(fs.readFileSync(path.join(process.cwd(),"data","questions",subject+".json"),"utf8"));
  const ids=new Set();
  let active=0;
  for (const q of bank.questions || []) {
    assert.ok(q.id, subject+": questão sem ID");
    assert.equal(ids.has(q.id), false, subject+": ID duplicado "+q.id);
    ids.add(q.id);
    if (isQuestionActive(q)) active++;
  }
  assert.ok(active > 0, subject+": política de qualidade eliminou todo o banco ativo");
  console.log(subject+": "+active+"/"+(bank.questions||[]).length+" ativas");
}
console.log("Question quality policy: OK");
