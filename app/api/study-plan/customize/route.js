import { ACCESS_FEATURES,canUseFeature,getEntitlement } from "../../../../lib/entitlement";
import { getSession } from "../../../../lib/auth";
import { getIntegratedStudyPlan } from "../../../../lib/integrated-study-plan";
import { persistStudyPlanSnapshot } from "../../../../lib/study-plan-snapshot";
import { withTransaction } from "../../../../lib/db";
import { SUBJECTS } from "../../../../lib/subjects";

export const dynamic="force-dynamic";
const isoDate=value=>value instanceof Date?value.toISOString().slice(0,10):String(value||"").slice(0,10);
const isDate=value=>/^\d{4}-\d{2}-\d{2}$/.test(String(value||""))&&!Number.isNaN(new Date(value+"T12:00:00Z").getTime());
const safe=(value,max=220)=>String(value||"").trim().slice(0,max);
const weekOffset=value=>Math.max(-8,Math.min(80,Math.trunc(Number(value)||0)));
const today=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
const bad=(error,status=400)=>Response.json({error},{status,headers:{"Cache-Control":"no-store"}});

function makeTask(input,subject,unit,old){
  const type=input.task_type;
  const identity={source_plan_date:old.payload?.source_plan_date||isoDate(old.plan_date),edited_manually:true};
  const estimate=Math.max(10,Math.min(360,Number(input.estimate_minutes)||Number(old.payload?.estimate_minutes)||45));
  if(type==="reading"){
    if(!unit)throw new Error("Selecione uma seção existente na bibliografia oficial.");
    const start=unit.page_start==null?null:Number(unit.page_start),end=unit.page_end==null?null:Number(unit.page_end);
    const from=input.page_from==null||input.page_from===""?start:Number(input.page_from);
    const to=input.page_to==null||input.page_to===""?end:Number(input.page_to);
    if((start!=null||end!=null)&&(!Number.isInteger(from)||!Number.isInteger(to)||from<start||to>end||to<from||to-from>11)){
      throw new Error("Selecione um intervalo válido de até 12 páginas da seção.");
    }
    return {...identity,type,subject:unit.subject_slug,title:unit.publication_title,chapter:unit.chapter_label||unit.section_label,
      description:(unit.chapter_label||unit.section_label)+(from!=null?" · páginas "+from+"–"+to:""),
      bibliography_key:unit.bibliography_key,section_key:unit.section_key,
      page_from:from,page_to:to,pages:from!=null?to-from+1:null,
      href:"/plano-de-estudos",estimate_minutes:estimate};
  }
  if(!subject)throw new Error("Selecione uma disciplina válida.");
  if(type==="questions"){
    const quantity=Math.max(10,Math.min(300,Math.trunc(Number(input.target_questions)||20)));
    return {...identity,type,subject:subject.slug,title:"Questões de fixação — "+subject.label,
      description:quantity+" questões · selecionadas manualmente pelo aluno.",target_questions:quantity,
      href:"/conteudos/banco-de-questoes?materia="+encodeURIComponent(subject.slug),estimate_minutes:estimate};
  }
  if(type==="review")return {...identity,type,subject:subject.slug,title:"Revisão — "+subject.label,
    description:"Revisão manual da disciplina escolhida, com foco nos erros.",
    href:"/conteudos/caderno-de-erros?modo=revisao",estimate_minutes:estimate};
  if(type==="simulado")return {...identity,type,subject:subject.slug,title:"Simulado PSCPP",
    description:"Simulado completo de 100 questões da matriz oficial.",
    href:"/simulado?novo=1",estimate_minutes:240};
  throw new Error("Tipo de tarefa não permitido.");
}


async function syncFixation(client,userId,snapshotId,planDate,reading){
  if(reading?.type!=="reading")return;
  const result=await client.query("select id,task_key,payload from student_plan_snapshot_tasks where snapshot_id=$1 and plan_date=$2::date and task_type='questions' order by position limit 1 for update",[snapshotId,planDate]);
  const row=result.rows[0];
  if(!row)return;
  const original=row.payload?.source_plan_date||planDate;
  const progress=await client.query("select status from student_plan_task_progress where user_id=$1 and task_key=$2 and plan_date=$3::date",[userId,row.task_key,original]);
  if(progress.rows[0]?.status==="done")return;
  const fixation={bibliography_key:reading.bibliography_key,section_key:reading.section_key,
    publication:reading.title,chapter:reading.chapter,page_from:reading.page_from,page_to:reading.page_to};
  const params=new URLSearchParams({materia:reading.subject,bibliografia:reading.bibliography_key,secao:reading.section_key,
    capitulo:reading.chapter||"",publicacao:reading.title||"",plan_date:original,task_key:row.task_key});
  const payload={...row.payload,subject:reading.subject,
    title:"Questões de fixação — "+(reading.chapter||reading.title),
    description:"Questões relacionadas à leitura programada: "+reading.title+" — "+reading.description+".",
    target_questions:null,fixation,href:"/conteudos/fixacao?"+params.toString()};
  await client.query("update student_plan_snapshot_tasks set subject_slug=$2,payload=$3::jsonb where id=$1",[row.id,reading.subject,JSON.stringify(payload)]);
}

export async function POST(request){
  const session=await getSession();
  if(!session)return bad("Não autenticado.",401);
  if(!canUseFeature(await getEntitlement(session.id),ACCESS_FEATURES.STUDY_PLAN))return Response.json({error:"Acesso ao plano de estudos não autorizado."},{status:403});
  try{
    const body=await request.json().catch(()=>({}));
    const action=safe(body.action,16);
    if(!["postpone","edit"].includes(action))return bad("Ação inválida.");
    const planDate=safe(body.plan_date,10),taskKey=safe(body.task_key,220),offset=weekOffset(body.week);
    if(!isDate(planDate)||!taskKey||planDate<today())return bad("Somente tarefas pendentes de hoje ou de datas futuras podem ser alteradas.");
    const plan=await getIntegratedStudyPlan(session.id,offset);
    if(plan.needs_onboarding)return bad("Conclua o questionário inicial.",409);
    const day=plan.week.days.find(item=>item.iso===planDate);
    if(!day||!day.active)return bad("Data indisponível neste plano.",409);
    const task=day.tasks.find(item=>item.key===taskKey);
    if(!task||task.status==="done"||task.reprogrammed)return bad("Selecione uma tarefa programada e pendente.",409);
    // A semana é congelada antes da mudança. O snapshot passa a armazenar a
    // personalização e a identidade da tarefa original fica no payload.
    await persistStudyPlanSnapshot(session.id,plan);
    if(action==="postpone"&&offset<80){
      const following=await getIntegratedStudyPlan(session.id,offset+1);
      if(!following.needs_onboarding)await persistStudyPlanSnapshot(session.id,following);
    }
    let result;
    try{
      result=await withTransaction(async(client)=>{
        await client.query("select pg_advisory_xact_lock(hashtext($1),hashtext($2))",[String(session.id),"customize|"+plan.week.start]);
        const snapshot=await client.query("select id,week_start from student_plan_snapshots where user_id=$1 and week_start >=$2::date order by week_start asc for update",[session.id,plan.week.start]);
        const id=snapshot.rows.find(row=>isoDate(row.week_start)===plan.week.start)?.id;
        if(!id)throw new Error("Planejamento semanal não encontrado.");
        const all=await client.query("select id,snapshot_id,plan_date,task_key,task_type,subject_slug,position,payload from student_plan_snapshot_tasks where snapshot_id=any($1::bigint[]) order by plan_date,position,id for update",[snapshot.rows.map(row=>row.id)]);
        const current=all.rows.find(row=>row.snapshot_id===id&&isoDate(row.plan_date)===planDate&&row.task_key===taskKey);
        if(!current)throw new Error("A tarefa foi alterada. Atualize a página.");
        const originalDate=current.payload?.source_plan_date||planDate;
        await client.query("select pg_advisory_xact_lock(hashtext($1),hashtext($2))",[String(session.id),taskKey+"|"+originalDate]);
        const done=await client.query("select status from student_plan_task_progress where user_id=$1 and task_key=$2 and plan_date=$3::date for update",[session.id,taskKey,originalDate]);
        if(done.rows[0]?.status==="done")throw new Error("Tarefa já concluída.");
        if(action==="edit"){
          let unit=null;
          if(body.task_type==="reading"){
            const selected=await client.query("select subject_slug,bibliography_key,section_key,publication_title,section_label,chapter_label,page_start,page_end from study_bibliography_catalog where bibliography_key=$1 and section_key=$2 and required=true limit 1",[safe(body.bibliography_key,180),safe(body.section_key,180)]);
            unit=selected.rows[0]||null;
          }
          const subject=SUBJECTS.find(item=>item.slug===safe(body.subject_slug,120));
          if(body.task_type==="simulado"&&new Date(planDate+"T12:00:00").getDay()!==0)throw new Error("O Simulado PSCPP obrigatório está reservado ao domingo.");
          const payload=makeTask(body,subject,unit,current);
          await client.query("update student_plan_snapshot_tasks set task_type=$2,subject_slug=$3,payload=$4::jsonb where id=$1",
            [current.id,payload.type,payload.subject,JSON.stringify(payload)]);
          if(payload.type==="reading")await syncFixation(client,session.id,id,planDate,payload);
          await client.query("insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,'TASK_EDITED_MANUALLY',$2,$3::date,$4,$5::jsonb)",
            [session.id,current.task_key,planDate,payload.subject,JSON.stringify({before:current.payload,after:payload})]);
          return {action,affected:1};
        }
        // Reordena a fila de tarefas PENDENTES deste tipo: a próxima ocupa
        // a vaga liberada e a postergada vai para o final da fila semanal.
        const typeRows=all.rows.filter(row=>row.task_type===current.task_type&&isoDate(row.plan_date)>=planDate);
        const pending=[];
        for(const row of typeRows){
          const origin=row.payload?.source_plan_date||isoDate(row.plan_date);
          if(row.task_key!==taskKey||origin!==originalDate)await client.query("select pg_advisory_xact_lock(hashtext($1),hashtext($2))",[String(session.id),row.task_key+"|"+origin]);
          const progress=await client.query("select status from student_plan_task_progress where user_id=$1 and task_key=$2 and plan_date=$3::date for update",[session.id,row.task_key,origin]);
          if(progress.rows[0]?.status==="done")continue;
          if(row.task_type==="reading"){
            const doneReading=await client.query("select status from student_bibliography_progress where user_id=$1 and bibliography_key=$2 and section_key=$3",[session.id,row.payload?.bibliography_key||"",row.payload?.section_key||""]);
            if(doneReading.rows[0]?.status==="done")continue;
          }
          pending.push(row);
        }
        const index=pending.findIndex(row=>row.id===current.id);
        if(index<0)throw new Error("Tarefa indisponível para postergação.");
        if(index===pending.length-1)throw new Error("Esta é a última atividade pendente deste tipo no cronograma já programado.");
        const slots=pending.slice(index);
        const values=slots.map(row=>({
          key:row.task_key,type:row.task_type,subject:row.subject_slug,
          payload:{...row.payload,source_plan_date:row.payload?.source_plan_date||isoDate(row.plan_date)}
        }));
        // Um temporário exclusivo evita colisões na constraint (snapshot, data, chave)
        // quando há várias atividades do mesmo tipo num mesmo dia.
        for(const row of slots){
          await client.query("delete from student_plan_snapshot_tasks where id=$1",[row.id]);
        }
        const rotated=[...values.slice(1).map(v=>({...v,payload:{...v.payload,postponed_manually:false}})),{...values[0],payload:{...values[0].payload,postponed_manually:true}}];
        for(let i=0;i<slots.length;i++){
          const slot=slots[i],next=rotated[i];
          await client.query("insert into student_plan_snapshot_tasks(snapshot_id,user_id,plan_date,task_key,task_type,subject_slug,position,payload) values($1,$2,$3::date,$4,$5,$6,$7,$8::jsonb)",
            [slot.snapshot_id,session.id,isoDate(slot.plan_date),next.key,next.type,next.subject,slot.position,JSON.stringify(next.payload)]);
        }
        if(current.task_type==="reading")for(let i=0;i<slots.length;i++)await syncFixation(client,session.id,slots[i].snapshot_id,isoDate(slots[i].plan_date),rotated[i].payload);
        await client.query("insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,'TASK_POSTPONED_MANUALLY',$2,$3::date,$4,$5::jsonb)",
          [session.id,taskKey,planDate,current.subject_slug,JSON.stringify({source_plan_date:originalDate,target_plan_date:isoDate(slots[slots.length-1].plan_date),scope:"persisted_future_pending_queue",moved:slots.length})]);
        return {action,affected:slots.length,new_date:isoDate(slots[slots.length-1].plan_date)};
      });
    }catch(error){
      if(/última tarefa/.test(String(error.message)))return bad(error.message,409);
      throw error;
    }
    return Response.json({ok:true,...result},{headers:{"Cache-Control":"no-store"}});
  }catch(error){
    console.error("[study-plan-customize]",error);
    return bad(error.message||"Não foi possível alterar o plano.",400);
  }
}
