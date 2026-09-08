import assert from "node:assert/strict";
import {calculateMasteryScore,calculateReviewSchedule} from "../lib/learning-algorithms.js";

const now=Date.parse("2026-09-08T12:00:00Z");

const weak=calculateMasteryScore({
  answers:10,correct:4,last_answered_at:"2026-09-08T11:00:00Z",
  stability:1,review_count:0,lapse_count:2
},now);

const strong=calculateMasteryScore({
  answers:60,correct:54,last_answered_at:"2026-09-08T11:00:00Z",
  stability:8,review_count:6,lapse_count:0
},now);

assert.ok(weak.mastery_score>=0&&weak.mastery_score<=100,"Mastery fraco fora da faixa");
assert.ok(strong.mastery_score>=0&&strong.mastery_score<=100,"Mastery forte fora da faixa");
assert.ok(strong.mastery_score>weak.mastery_score,"Mais acertos/estabilidade devem elevar mastery");
assert.equal(strong.confidence_score,100,"60 respostas devem saturar confiança em 100");

const again=calculateReviewSchedule("again",12);
const hard=calculateReviewSchedule("hard",12);
const good=calculateReviewSchedule("good",12);
const easy=calculateReviewSchedule("easy",12);

assert.equal(again.days,1,"Again deve retornar em 1 dia");
assert.ok(hard.days>=2&&hard.days<=21,"Hard fora dos limites");
assert.ok(good.days>=5&&good.days<=60,"Good fora dos limites");
assert.ok(easy.days>=10&&easy.days<=120,"Easy fora dos limites");
assert.ok(easy.days>good.days&&good.days>hard.days&&hard.days>again.days,
  "Qualidade melhor deve produzir intervalo maior");
assert.ok(again.stabilityDelta<0,"Again deve reduzir estabilidade");
assert.ok(easy.stabilityDelta>good.stabilityDelta,"Easy deve fortalecer mais que Good");

const fallback=calculateReviewSchedule("invalid",5);
assert.equal(fallback.quality,"good","Qualidade inválida deve cair para good");

console.log("Learning algorithms: OK");
