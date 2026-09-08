import fs from "node:fs";
import assert from "node:assert/strict";

const read=(path)=>fs.readFileSync(path,"utf8");

const integrated=read("lib/integrated-study-plan.js");
const snapshot=read("lib/study-plan-snapshot.js");
const progress=read("lib/study-plan-progress.js");
const migration=read("db/migrations/022_learning_engine_v3.sql")+"\n"+read("db/migrations/023_learning_analytics_v3.sql");
const client=read("app/plano-de-estudos/PlanClient.js");
const unavailable=read("app/api/study-plan/unavailability/route.js");
const sessionApi=read("app/api/study-plan/session/route.js");
const learning=read("lib/learning-engine.js");
const graph=read("lib/learning-graph.js");
const nextConfig=read("next.config.mjs");

const start=integrated.indexOf("export async function getIntegratedStudyPlan");
const end=integrated.indexOf("export async function setPlanTaskStatus",start);
assert.ok(start>=0&&end>start,"getIntegratedStudyPlan não encontrado");
const getter=integrated.slice(start,end);

assert.ok(!/insert\s+into\s+student_plan_task_progress/i.test(getter),
  "getIntegratedStudyPlan voltou a escrever progresso durante render/GET");
assert.match(getter,/loadStudyPlanSnapshot/,"Plano não está consumindo snapshots");
assert.match(snapshot,/student_plan_snapshots/,"Serviço de snapshot ausente");
assert.match(snapshot,/TASK_PLANNED/,"Snapshot não registra TASK_PLANNED");
assert.match(progress,/TASK_COMPLETED/,"Conclusão não está sendo registrada no event log");
assert.match(progress,/student_plan_reschedules/,"Reprogramações não são encerradas na conclusão");

for(const table of [
  "student_plan_snapshots",
  "student_plan_snapshot_tasks",
  "student_plan_events",
  "student_plan_reschedules",
  "student_plan_unavailability",
  "student_study_sessions",
  "student_topic_mastery"
]){
  assert.ok(migration.includes(table),"Migration V3 não contém "+table);
}

assert.match(client,/Não consegui estudar hoje/,"Controle de indisponibilidade sumiu da UI");
assert.match(unavailable,/DAY_UNAVAILABLE/,"Endpoint não registra indisponibilidade");
assert.match(getter,/recoveryCapacity/,"Motor de recuperação não considera capacidade");
assert.match(sessionApi,/heartbeat/,"API de sessão real não possui heartbeat");
assert.match(learning,/calculateMasteryScore/,"Learning Engine perdeu cálculo de mastery");
assert.match(learning,/getStudyTimeSummary/,"Learning Engine perdeu tempo real de estudo");
assert.match(graph,/questionTaxonomy/,"Grafo de aprendizagem não usa taxonomia canônica");
assert.match(nextConfig,/Content-Security-Policy/,"CSP não está configurada");

console.log("Study Plan V3 invariants: OK");
