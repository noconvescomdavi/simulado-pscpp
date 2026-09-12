import fs from "node:fs";
import assert from "node:assert/strict";

const read=(path)=>fs.readFileSync(path,"utf8");

const integrated=read("lib/integrated-study-plan.js");
const snapshot=read("lib/study-plan-snapshot.js");
const progress=read("lib/study-plan-progress.js");
const notebooks=read("lib/notebooks.js");
const migration=read("db/migrations/022_learning_engine_v3.sql")+"\n"+read("db/migrations/023_learning_analytics_v3.sql");
const client=read("app/plano-de-estudos/PlanClient.js");
const unavailable=read("app/api/study-plan/unavailability/route.js");
const sessionApi=read("app/api/study-plan/session/route.js");
const learning=read("lib/learning-engine.js");
const graph=read("lib/learning-graph.js");
const nextConfig=read("next.config.mjs");
const middleware=fs.existsSync("middleware.js")?read("middleware.js"):"";

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
assert.match(progress,/pg_advisory_xact_lock/,"Conclusão concorrente não possui lock transacional de idempotência");
assert.match(progress,/update student_plan_task_progress[\s\S]*if\(!saved\.rowCount\)[\s\S]*insert into student_plan_task_progress/,
  "Conclusão deve usar UPDATE-first/INSERT-if-missing para tolerar drift de constraint");
assert.match(progress,/status=\$6::varchar[\s\S]*when \$6::varchar='done'/,
  "Status da conclusão precisa de cast explícito para evitar SQLSTATE 42P08");

assert.ok(!/on conflict\(user_id,task_key,plan_date\)/i.test(
  progress.slice(progress.indexOf("export async function setPlanTaskStatusAndMetrics"),progress.indexOf("export async function setBibliographyStatusAndMetrics"))
),"Conclusão voltou a depender da constraint composta de student_plan_task_progress");

assert.match(progress,/SAVEPOINT study_plan_aux/,"Gravações auxiliares do plano não estão isoladas por savepoint");
assert.match(progress,/ROLLBACK TO SAVEPOINT study_plan_aux/,"Falha auxiliar pode deixar a transação principal abortada");
assert.ok(!/client\.query\([\s\S]{0,400}student_plan_events[\s\S]{0,200}\.catch\(\(\)=>\{\}\)/.test(progress),
  "Event log voltou a ignorar erro sem recuperar a transação PostgreSQL");

assert.match(progress,/if\(newlyDone\)\{[\s\S]*BACKLOG_ITEM_RESOLVED/,"Evento de resolução do backlog deve ocorrer apenas na primeira conclusão");
assert.ok(!/update\s+student_plan_reschedules[\s\S]*status='completed'/i.test(progress),
  "Conclusão voltou a depender da tabela de reprogramações");
assert.match(client,/source_plan_date:planDate/,"Cliente não preserva a data original da tarefa reprogramada");
assert.match(notebooks,/strictFixationMatch/,"Caderno diário não possui filtro estrito por obra/capítulo");
assert.match(notebooks,/actualWork!==wantedWork/,"Fixação não exige correspondência exata da obra");
assert.ok(!/fixationScore/.test(notebooks),"Fixação voltou a usar pontuação textual aproximada");
assert.match(notebooks,/shuffle\(pool\)\.slice/,"Questões do capítulo não são limitadas somente após o filtro estrito");


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
assert.ok(/Content-Security-Policy/.test(nextConfig)||/Content-Security-Policy/.test(middleware),"CSP não está configurada");
if(middleware){
  assert.match(middleware,/threeCsp/,"CSP específica do runtime 3D ausente");
  assert.match(middleware,/unsafe-eval/,"Runtime 3D não possui compatibilidade CSP necessária");
  const strictBlock=middleware.slice(middleware.indexOf("const strictCsp"),middleware.indexOf("const threeCsp"));
  assert.ok(!strictBlock.includes("unsafe-eval"),"CSP geral não deve liberar unsafe-eval");
}

console.log("Study Plan V3 invariants: OK");
