import { getSession } from "../../../../lib/auth";
import { query } from "../../../../lib/db";

const text=(value,max)=>String(value||"").trim().slice(0,max);
const validDate=(value)=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||""));

export async function POST(req){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const body=await req.json().catch(()=>({}));
    const action=["start","heartbeat","stop"].includes(body.action)?body.action:"heartbeat";

    if(action==="start"){
      const taskKey=text(body.task_key,220)||null;
      const subject=text(body.subject_slug,120)||null;
      const type=text(body.session_type,40)||"study";
      const planDate=validDate(body.plan_date)?String(body.plan_date):null;
      const metadata=body.metadata&&typeof body.metadata==="object"?body.metadata:{};
      const r=await query(
        `insert into student_study_sessions(
          user_id,session_type,subject_slug,task_key,plan_date,started_at,last_heartbeat_at,duration_seconds,metadata
        ) values($1,$2,$3,$4,$5::date,now(),now(),0,$6::jsonb)
        returning id,started_at,last_heartbeat_at`,
        [session.id,type,subject,taskKey,planDate,JSON.stringify(metadata)]
      );
      await query(
        "insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,'STUDY_SESSION_STARTED',$2,$3::date,$4,$5::jsonb)",
        [session.id,taskKey,planDate,subject,JSON.stringify({session_id:r.rows[0]?.id||null,session_type:type})]
      ).catch(()=>{});
      return Response.json({ok:true,session:r.rows[0]||null});
    }

    const id=Number(body.session_id||0);
    if(!Number.isInteger(id)||id<=0)return Response.json({error:"Sessão inválida."},{status:400});
    const ending=action==="stop";
    const r=await query(
      `update student_study_sessions
          set duration_seconds=duration_seconds+
                greatest(0,least(120,floor(extract(epoch from (now()-coalesce(last_heartbeat_at,started_at))))::int)),
              last_heartbeat_at=now(),
              ended_at=case when $3::boolean then now() else ended_at end
        where id=$1 and user_id=$2 and ended_at is null
        returning id,duration_seconds,started_at,last_heartbeat_at,ended_at`,
      [id,session.id,ending]
    );
    if(!r.rows[0])return Response.json({error:"Sessão não encontrada ou encerrada."},{status:404});
    if(ending){
      await query(
        "insert into student_plan_events(user_id,event_type,metadata) values($1,'STUDY_SESSION_ENDED',$2::jsonb)",
        [session.id,JSON.stringify({session_id:id,duration_seconds:r.rows[0].duration_seconds})]
      ).catch(()=>{});
    }
    return Response.json({ok:true,session:r.rows[0]});
  }catch(error){
    console.error("Erro na sessão de estudo:",error);
    return Response.json({error:"Não foi possível atualizar a sessão de estudo."},{status:500});
  }
}
