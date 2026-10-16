import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isQuestionActive } from "../lib/question-quality-policy.js";
import { validateQuestionTaxonomy } from "../lib/question-taxonomy.js";
const bank=JSON.parse(readFileSync(new URL("../data/questions/conhecimentos-gerais.json",import.meta.url),"utf8"));
const items=bank.questions.filter(q=>q.id.startsWith("CGE-PIANC121-C1-"));
assert.equal(bank.questions.length,1231);
assert.equal(items.length,46);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,1231);
for(const q of items){
  assert.equal(q.active,true,q.id);
  assert.equal(q.status,"approved",q.id);
  assert.equal(isQuestionActive(q),true,q.id);
  assert.deepEqual(validateQuestionTaxonomy(q,"conhecimentos-gerais").errors,[],q.id);
  assert.deepEqual(new Set(q.options.map(x=>x.key)),new Set(["A","B","C","D","E"]),q.id);
  assert.ok(q.options.some(x=>x.key===q.correct_answer),q.id);
}
console.log("PASS: all 46 PIANC Chapter 1 questions active with canonical taxonomy");
