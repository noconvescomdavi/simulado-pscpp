import { getSession } from "../../../lib/auth";
import { getIntegratedStudyPlan } from "../../../lib/integrated-study-plan";
import { setPlanTaskStatusAndMetrics } from "../../../lib/study-plan-progress";
import { withTransaction } from "../../../lib/db";

export const dynamic = "force-dynamic";

const todayIso=()=>new Intl.DateTimeFormat("en-CA",{
  timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"
}).format(new Date());

function dailyPayload(master){
  if(master?.needs_onboarding)return{needs_onboarding:true};
  const date=todayIso();
  const day=master.week?.days?.find(d=>d.iso===date);
  const tasks=(day?.tasks||[]).map(task=>({
    ...task,
    completed:task.status==="done",
    plan_date:task.source_plan_date||day?.iso||date,
    minutes:Number(task.estimate_minutes||30)
  }));
  return{
    source:"integrated",
    date,
    goal:{
      daily_minutes:Number(master.onboarding?.daily_minutes||60),
      weekly_questions:null
    },
    progress:{
      total:tasks.length,
      completed:tasks.filter(t=>t.completed).length,
      percent:tasks.length?Math.round(tasks.filter(t=>t.completed).length/tasks.length*100):0
    },
    tasks,
    tracking:master.tracking,
    phase:master.phase,
    bibliography_progress:master.bibliography_progress
  };
}

export async function GET() {
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  const master=await getIntegratedStudyPlan(session.id,0);
  return Response.json(dailyPayload(master),{headers:{"Cache-Control":"private, no-store"}});
}

export async function POST(request) {
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  try{
    const body=await request.json().catch(()=>({}));
    const master=await getIntegratedStudyPlan(session.id,0);
    if(master.needs_onboarding)return Response.json({error:"Questionário inicial pendente."},{status:409});
    const date=todayIso();
    const day=master.week?.days?.find(d=>d.iso===date);
    const task=(day?.tasks||[]).find(t=>String(t.key)===String(body.task_key||""));
    if(!task)return Response.json({error:"Tarefa não encontrada no plano atual."},{status:404});

    const status=body.completed===false?"pending":"done";
    const item=await setPlanTaskStatusAndMetrics(session.id,{
      task_key:task.key,
      plan_date:task.source_plan_date||date,
      task_type:task.type,
      subject_slug:task.subject,
      status,
      bibliography_key:task.bibliography_key||null,
      section_key:task.section_key||null,
      page_from:task.page_from||null,
      page_to:task.page_to||null,
      complete_bibliography_unit:task.type==="reading",
      metadata:{
        title:task.title,description:task.description,href:task.href||null,
        source:"integrated_study_plan_api"
      }
    });
    const refreshed=await getIntegratedStudyPlan(session.id,0);
    return Response.json({ok:true,item,plan:dailyPayload(refreshed)});
  }catch(error){
    console.error("Erro ao atualizar plano diário:",error);
    return Response.json({error:"Não foi possível atualizar a tarefa."},{status:500});
  }
}

export async function PUT(request) {
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  try{
    const body=await request.json().catch(()=>({}));
    const dailyMinutes=Math.max(15,Math.min(720,Math.trunc(Number(body.daily_minutes)||60)));
    const weeklyQuestions=Math.max(7,Math.min(10000,Math.trunc(Number(body.weekly_questions)||350)));

    await withTransaction(async(client)=>{
      await client.query(
        "update student_onboarding set daily_minutes=$2,updated_at=now() where user_id=$1",
        [session.id,dailyMinutes]
      );
      await client.query(
        `insert into student_study_goals(user_id,daily_minutes,weekly_questions,target_exam_date,updated_at)
         values($1,$2,$3,date '2027-11-01',now())
         on conflict(user_id) do update set
           daily_minutes=excluded.daily_minutes,
           weekly_questions=excluded.weekly_questions,
           target_exam_date=date '2027-11-01',
           updated_at=now()`,
        [session.id,dailyMinutes,weeklyQuestions]
      );
      await client.query(
        "insert into student_plan_events(user_id,event_type,metadata) values($1,'STUDY_CAPACITY_UPDATED',$2::jsonb)",
        [session.id,JSON.stringify({daily_minutes:dailyMinutes,weekly_questions:weeklyQuestions})]
      ).catch(()=>{});
    });

    const master=await getIntegratedStudyPlan(session.id,0);
    return Response.json({ok:true,plan:dailyPayload(master)});
  }catch(error){
    console.error("Erro ao atualizar capacidade de estudo:",error);
    return Response.json({error:"Não foi possível atualizar as metas."},{status:400});
  }
}
