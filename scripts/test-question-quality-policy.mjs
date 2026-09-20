import assert from "node:assert/strict";
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
console.log("Question quality policy: OK");
