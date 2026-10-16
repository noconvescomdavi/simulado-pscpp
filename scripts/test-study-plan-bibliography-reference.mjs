import assert from "node:assert/strict";
import test from "node:test";
import {
  resolveStudyReference,enrichStudyTaskReference,studyTaskDisplay,isGenericSection
} from "../lib/study-plan-bibliography-reference.mjs";

const catalogue=[
  {subject_slug:"legislacao-regulamentacao",bibliography_key:"normam602-leg",section_key:"ch1",
    publication:"NORMAM-602/DHN — Serviço de Tráfego de Embarcações (VTS)",
    chapter:"Capítulo 1 — O Serviço de Tráfego de Embarcações — arts. 1.1–1.5"},
  {subject_slug:"conhecimentos-gerais",bibliography_key:"fatigue",section_key:"integral",
    publication:"IMO MSC.1/Circ.1598 — Guidelines on Fatigue",chapter:"Publicação indicada"},
  {subject_slug:"conhecimentos-gerais",bibliography_key:"pianc-channels",section_key:"ch1",
    publication:"PIANC — Harbour Approach Channels: Design Guidelines",chapter:"Chapter 1"}
];

test("reprogrammed NORMAM-602 recovers official book and chapter from task key",()=>{
  const task=enrichStudyTaskReference({
    key:"read|normam602-leg|ch1|section",type:"reading",subject:"legislacao-regulamentacao",
    title:"Publicação indicada",chapter:"Conteúdo indicado no Anexo 2-B",
    description:"Reprogramada de 20/09/2026 · Conteúdo indicado no Anexo 2-B",
    reprogrammed:true,source_plan_date:"2026-09-20"
  },catalogue);
  const display=studyTaskDisplay(task);
  assert.match(display.title,/Reprogramada de 20\/09\/2026/);
  assert.match(display.title,/NORMAM-602\/DHN/);
  assert.match(display.title,/Capítulo 1/);
  assert.doesNotMatch(display.title,/Conteúdo indicado no Anexo 2-B/);
});
test("generic section shows real publication but does not fabricate a chapter",()=>{
  const task=enrichStudyTaskReference({
    key:"read|fatigue|integral|section",type:"reading",subject:"conhecimentos-gerais",
    title:"IMO MSC.1/Circ.1598 — Guidelines on Fatigue",chapter:"Publicação indicada"
  },catalogue);
  const display=studyTaskDisplay(task);
  assert.match(display.title,/MSC\.1\/Circ\.1598/);
  assert.equal(display.details,"Capítulo não delimitado no Anexo 2-B");
  assert.equal(task.bibliographic_reference.chapter,null);
});
test("fixation recovers publication from existing bibliography keys",()=>{
  const task=enrichStudyTaskReference({
    key:"questions|conhecimentos-gerais|2026-10-16|fatigue|integral",type:"questions",
    subject:"conhecimentos-gerais",title:"Questões de fixação — Publicação indicada",
    fixation:{bibliography_key:"fatigue",section_key:"integral",chapter:"Publicação indicada"}
  },catalogue);
  assert.match(studyTaskDisplay(task).title,/Questões de fixação — IMO MSC\.1\/Circ\.1598/);
});
test("specific chapter overrides outdated generic snapshot metadata",()=>{
  const task=enrichStudyTaskReference({
    key:"read|pianc-channels|ch1|section",type:"reading",subject:"conhecimentos-gerais",
    chapter:"Publicação indicada",description:"Publicação indicada"
  },catalogue);
  assert.match(studyTaskDisplay(task).title,/Chapter 1/);
});
test("unknown keys produce an explicit incomplete-reference message, not a fabricated book",()=>{
  const task=enrichStudyTaskReference({
    key:"read|missing-book|integral|section",type:"reading",title:"Publicação indicada",
    description:"Publicação indicada"
  },catalogue);
  assert.equal(resolveStudyReference(task,catalogue),null);
  assert.equal(studyTaskDisplay(task).title,"Obra não identificada no cadastro bibliográfico");
});
test("review tasks are not assigned bibliographic chapters",()=>{
  const original={key:"review|2026-10-16",type:"review",title:"Revisão"};
  assert.deepEqual(enrichStudyTaskReference(original,catalogue),original);
  assert.equal(isGenericSection("Conteúdo indicado no Anexo 2-B"),true);
});
