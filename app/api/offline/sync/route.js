import { getSession } from "../../../../lib/auth";
import { getEntitlement } from "../../../../lib/entitlement";
import { query, withTransaction } from "../../../../lib/db";
import { getQuestion } from "../../../../lib/question-banks";
import { normalizeSubject } from "../../../../lib/subjects";
import { answerNotebook } from "../../../../lib/notebooks";
import { setPlanTaskStatusAndMetrics, setBibliographyStatusAndMetrics } from "../../../../lib/study-plan-progress";
import { subjectLabel } from "../../../../lib/subjects";
import { assertSameOrigin } from "../../../../lib/security";

const ANSWERS = new Set(["A","B","C","D","E"]);
const MAX_EVENTS = 500;

function cleanId(value,max=180){ return String(value||"").trim().slice(0,max); }
function parseDate(value,fallback){ const d=new Date(value||fallback||Date.now()); return Number.isNaN(d.getTime())?new Date(fallback||Date.now()):d; }
function asArray(value){ return Array.isArray(value)?value:[]; }
function score(correct,answered){ return answered?Math.round(correct/answered*10000)/100:0; }

async function ensureSyncTable(){
  await query(`create table if not exists offline_sync_events(
    user_id uuid not null references users(id) on delete cascade,
    event_id varchar(180) not null,
    event_type varchar(60) not null,
    device_id varchar(180),
    processed_at timestamptz not null default now(),
    primary key(user_id,event_id)
  )`);
}
async function alreadyProcessed(userId,eventId){
  const r=await query("select 1 from offline_sync_events where user_id=$1 and event_id=$2 limit 1",[userId,eventId]);
  return Boolean(r.rowCount);
}
async function markProcessed(userId,event){
  await query(
    "insert into offline_sync_events(user_id,event_id,event_type,device_id) values($1,$2,$3,$4) on conflict(user_id,event_id) do nothing",
    [userId,cleanId(event.id),cleanId(event.type,60),cleanId(event.device_id)||null]
  );
}

async function createNotebook(userId,payload){
  const id=cleanId(payload.id);
  const refs=asArray(payload.question_refs).slice(0,100).map(ref=>({
    subject: normalizeSubject(ref?.subject),
    id: cleanId(ref?.id,120),
  })).filter(ref=>ref.subject&&ref.id&&getQuestion(ref.subject,ref.id));
  if(!id||!refs.length)throw new Error("Caderno offline inválido.");
  const subjects=[...new Set(refs.map(ref=>ref.subject))];
  await query(
    `insert into question_notebooks(id,user_id,title,subjects,question_refs,total_questions)
     values($1,$2,$3,$4::jsonb,$5::jsonb,$6)
     on conflict(id) do nothing`,
    [id,userId,cleanId(payload.title,180)||`Caderno offline · ${refs.length} questões`,JSON.stringify(subjects),JSON.stringify(refs),refs.length]
  );
  const owner=await query("select user_id from question_notebooks where id=$1",[id]);
  if(String(owner.rows[0]?.user_id)!==String(userId))throw new Error("Caderno offline pertence a outro usuário.");
  return {notebook_id:id};
}

async function syncExamSnapshot(userId,payload){
  const id=cleanId(payload.id);
  const subject=normalizeSubject(payload.subject);
  const ids=[...new Set(asArray(payload.question_ids).slice(0,100).map(x=>cleanId(x,120)).filter(Boolean))];
  if(!id||!subject||!ids.length)throw new Error("Simulado offline inválido.");
  const valid=ids.filter(qid=>Boolean(getQuestion(subject,qid)));
  if(valid.length!==ids.length)throw new Error("O simulado contém questões que não pertencem ao banco atual.");

  return withTransaction(async(client)=>{
    const existing=await client.query("select * from exam_sessions where id=$1 for update",[id]);
    if(existing.rowCount&&String(existing.rows[0].user_id)!==String(userId))throw new Error("Simulado pertence a outro usuário.");

    const started=parseDate(payload.started_at);
    const expires=parseDate(payload.expires_at,new Date(started.getTime()+240*60*1000));
    if(!existing.rowCount){
      await client.query(
        `insert into exam_sessions(id,user_id,subject,status,question_ids,total_questions,current_index,answered_count,correct_count,started_at,expires_at,created_at,updated_at)
         values($1,$2,$3,'in_progress',$4::jsonb,$5,0,0,0,$6,$7,now(),now())`,
        [id,userId,subject,JSON.stringify(ids),ids.length,started.toISOString(),expires.toISOString()]
      );
    }else if(existing.rows[0].subject!==subject){
      throw new Error("Matéria do simulado offline não corresponde à sessão existente.");
    }

    const answers=asArray(payload.answers);
    for(let position=0;position<ids.length;position++){
      const qid=ids[position];
      const incoming=answers.find(a=>String(a?.question_id)===qid);
      if(!incoming)continue;
      const chosen=String(incoming.selected_answer||"").trim().toUpperCase();
      if(!ANSWERS.has(chosen))continue;
      const question=getQuestion(subject,qid);
      const correctAnswer=String(question.correct_answer||question.answer||"").trim().toUpperCase();
      const isCorrect=chosen===correctAnswer;
      const responseMs=Math.max(0,Math.min(14_400_000,Math.trunc(Number(incoming.response_time_ms)||0)));
      const inserted=await client.query(
        `insert into exam_session_answers(session_id,user_id,question_id,position,selected_answer,is_correct,response_time_ms,answered_at)
         values($1,$2,$3,$4,$5,$6,$7,$8)
         on conflict(session_id,question_id) do nothing returning id`,
        [id,userId,qid,position,chosen,isCorrect,responseMs,parseDate(incoming.answered_at).toISOString()]
      );
      if(!inserted.rowCount)continue;

      const metricSubject=normalizeSubject(question?.source_subject||subject);
      const metricId=String(question?.source_id||question?.id||qid);
      await client.query(
        `insert into question_answers(user_id,session_id,question_id,subject,selected_answer,is_correct,response_time_ms,answered_at)
         values($1,$2,$3,$4,$5,$6,$7,$8)
         on conflict do nothing`,
        [userId,id,metricId,metricSubject,chosen,isCorrect,responseMs,parseDate(incoming.answered_at).toISOString()]
      );
      await client.query(
        `insert into question_stats(user_id,question_id,subject,answer_count,correct_count,error_count,last_answered_at)
         values($1,$2,$3,1,$4,$5,$6)
         on conflict(user_id,subject,question_id) do update set
           answer_count=question_stats.answer_count+1,
           correct_count=question_stats.correct_count+excluded.correct_count,
           error_count=question_stats.error_count+excluded.error_count,
           last_answered_at=greatest(question_stats.last_answered_at,excluded.last_answered_at)`,
        [userId,metricId,metricSubject,isCorrect?1:0,isCorrect?0:1,parseDate(incoming.answered_at).toISOString()]
      );
      await client.query(
        `insert into study_days(user_id,study_date,activity_count)
         values($1,($2::timestamptz at time zone 'America/Sao_Paulo')::date,1)
         on conflict(user_id,study_date) do update set activity_count=study_days.activity_count+1`,
        [userId,parseDate(incoming.answered_at).toISOString()]
      );
    }

    const totals=await client.query(
      "select count(*)::int answered,count(*) filter(where is_correct)::int correct from exam_session_answers where session_id=$1 and user_id=$2",
      [id,userId]
    );
    const answered=Number(totals.rows[0]?.answered||0);
    const correct=Number(totals.rows[0]?.correct||0);
    const wantsFinish=["completed","expired","abandoned"].includes(payload.status)||Boolean(payload.finished_at);
    let attemptId=existing.rows[0]?.attempt_id||null;

    if(wantsFinish&&!attemptId){
      const duration=Math.max(0,Math.min(14400,Math.round((parseDate(payload.finished_at).getTime()-started.getTime())/1000)));
      const attempt=await client.query(
        `insert into exam_attempts(user_id,module,subject,score_percent,correct_answers,wrong_answers,total_questions,duration_seconds,created_at)
         values($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id`,
        [userId,`Simulado de ${subjectLabel(subject)} — ${ids.length} questões`,subject,score(correct,answered),correct,Math.max(0,answered-correct),answered,duration,parseDate(payload.finished_at).toISOString()]
      );
      attemptId=attempt.rows[0].id;
      await client.query("update question_answers set attempt_id=$1 where session_id=$2 and attempt_id is null",[attemptId,id]);
    }

    const status=wantsFinish?(payload.status==="expired"?"expired":"completed"):"in_progress";
    await client.query(
      `update exam_sessions set
         status=$2,current_index=$3,answered_count=$3,correct_count=$4,
         finished_at=case when $2='in_progress' then null else coalesce(finished_at,$5::timestamptz,now()) end,
         finish_reason=case when $2='in_progress' then null else coalesce($6,finish_reason,'manual') end,
         attempt_id=coalesce(attempt_id,$7),updated_at=now()
       where id=$1`,
      [id,status,answered,correct,payload.finished_at||null,cleanId(payload.finish_reason,24)||null,attemptId]
    );
    return {session_id:id,answered,correct,status,attempt_id:attemptId};
  });
}

async function processEvent(userId,event){
  const payload=event?.payload||{};
  switch(event.type){
    case "notebook.create":
      return createNotebook(userId,payload);
    case "notebook.answer": {
      const result=await answerNotebook({
        userId,
        notebookId:cleanId(payload.notebook_id),
        subject:payload.subject,
        questionId:payload.question_id,
        selectedAnswer:payload.selected_answer,
      });
      if(result?.status&&result.status>=400&&!(result.status===409&&result.locked))throw new Error(result.error||"Falha ao sincronizar resposta.");
      return {notebook_id:payload.notebook_id,duplicate:Boolean(result?.locked&&result?.status===409)};
    }
    case "study.task":
      return setPlanTaskStatusAndMetrics(userId,payload);
    case "reading.progress":
      return setBibliographyStatusAndMetrics(userId,payload);
    case "exam.snapshot":
      return syncExamSnapshot(userId,payload);
    case "library.progress": {
      const fileId=cleanId(payload.file_id);
      const page=Math.max(1,Math.min(100000,Math.trunc(Number(payload.page)||1)));
      const progress=Math.max(0,Math.min(100,Number(payload.progress_percent)||0));
      const saved=await query(
        "update student_drive_files set last_page=greatest(last_page,$3),progress_percent=greatest(progress_percent,$4),last_opened_at=now(),updated_at=now() where id=$1 and user_id=$2 returning id,last_page,progress_percent",
        [fileId,userId,page,progress]
      );
      if(!saved.rowCount)throw new Error("Documento da biblioteca não encontrado.");
      return {file:saved.rows[0]};
    }
    default:
      throw new Error("Tipo de evento offline não suportado.");
  }
}

export async function POST(request){
  try{ await assertSameOrigin(); }catch(error){ return Response.json({error:"Origem inválida."},{status:Number(error?.status)||403}); }
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active)return Response.json({error:"Modo offline disponível para alunos com acesso ativo."},{status:403});

  await ensureSyncTable();
  const body=await request.json().catch(()=>({}));
  const events=asArray(body.events).slice(0,MAX_EVENTS);
  const results=[];

  for(const event of events){
    const id=cleanId(event?.id);
    if(!id){results.push({id:null,ok:false,error:"Evento sem identificador."});continue;}
    try{
      if(await alreadyProcessed(session.id,id)){
        results.push({id,ok:true,duplicate:true});
        continue;
      }
      const data=await processEvent(session.id,event);
      await markProcessed(session.id,event);
      results.push({id,ok:true,data});
    }catch(error){
      console.error("Falha ao sincronizar evento offline",event?.type,id,error);
      results.push({id,ok:false,error:error?.message||"Falha ao sincronizar evento."});
    }
  }

  return Response.json({ok:true,results,pending_failures:results.filter(x=>!x.ok).length},{
    headers:{"Cache-Control":"private, no-store, max-age=0"}
  });
}
