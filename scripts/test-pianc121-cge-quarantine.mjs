import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { isQuestionActive } from "../lib/question-quality-policy.js";
import { validateQuestionTaxonomy } from "../lib/question-taxonomy.js";

const read=(path)=>JSON.parse(readFileSync(new URL(path,import.meta.url),"utf8"));
const bank=read("../data/questions/conhecimentos-gerais.json");
const imported=read("../data/questions/imports/pianc121-cap1-quarentena.json");
const set=new Set(imported.questions.map(q=>q.id));
const actual=bank.questions.filter(q=>set.has(q.id));
assert.equal(imported.questions.length,46);
assert.equal(actual.length,46);
assert.equal(bank.validation.total,bank.questions.length);
assert.equal(bank.questions.length,1231);
assert.equal(new Set(bank.questions.map(q=>q.id)).size,bank.questions.length);
for(const q of actual){
  assert.equal(q.active,false,q.id);
  assert.equal(q.status,"quarantined",q.id);
  assert.equal(isQuestionActive(q),false,q.id);
  assert.equal(q.taxonomy.bibliography_id,"pianc-channels",q.id);
  assert.equal(q.taxonomy.chapter_id,"pianc-channels::ch1",q.id);
  assert.deepEqual(validateQuestionTaxonomy(q,"conhecimentos-gerais").errors,[],q.id);
  assert.deepEqual(new Set(q.options.map(a=>a.key)),new Set(["A","B","C","D","E"]),q.id);
  assert.ok(q.options.some(a=>a.key===q.correct_answer),q.id);
}
console.log("PASS: 46 PIANC 121 questions, taxonomy valid, all quarantined and inactive.");
