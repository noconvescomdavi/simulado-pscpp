import { ACCESS_FEATURES,canUseFeature,getEntitlement } from "../../../../lib/entitlement";
import { getSession } from "../../../../lib/auth";
import { getIntegratedStudyPlan } from "../../../../lib/integrated-study-plan";
import { persistStudyPlanSnapshot } from "../../../../lib/study-plan-snapshot";
import { withTransaction } from "../../../../lib/db";
import { SUBJECTS } from "../../../../lib/subjects";
import { bibliographyUnits } from "../../../../data/study/bibliography";
import { lastEligibleStudyDate,distributeDeferredTail } from "../../../../lib/study-plan-manual-queue.mjs";
import { randomUUID } from "node:crypto";

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

async function clearOrphanFixation(client,userId,snapshotId,planDate){
  const r=await client.query("select id,task_key,subject_slug,payload from student_plan_snapshot_tasks where snapshot_id=$1 and plan_date=$2::date and task_type='questions' order by position limit 1 for update",[snapshotId,planDate]);
  const row=r.rows[0];if(!row)return;
  const original=row.payload?.source_plan_date||planDate;
  const progress=await client.query("select status from student_plan_task_progress where user_id=$1 and task_key=$2 and plan_date=$3::date",[userId,row.task_key,original]);
  if(progress.rows[0]?.status==="done")return;
  const subject=row.subject_slug||row.payload?.subject||"";
  const payload={...row.payload,fixation:null,title:"Questões de fixação — conteúdo complementar",
    description:"A leitura deste dia foi remanejada. Escolha uma nova leitura em Editar Plano para vincular as questões automaticamente, ou utilize o banco de questões desta disciplina.",
    target_questions:Math.max(10,Number(row.payload?.target_questions)||20),
    href:"/conteudos/banco-de-questoes?materia="+encodeURIComponent(subject)};
  await client.query("update student_plan_snapshot_tasks set payload=$2::jsonb where id=$1",[row.id,JSON.stringify(payload)]);
}

export async function POST(request){
  const session=await getSession();
  if(!session)return bad("Não autenticado.",401);
  if(!canUseFeature(await getEntitlement(session.id),ACCESS_FEATURES.STUDY_PLAN))return Response.json({error:"Acesso ao plano de estudos não autorizado."},{status:403});
  try{
    const body=await request.json().catch(()=>({}));
    const action=safe(body.action,16);
    if(!["postpone","edit","add"].includes(action))return bad("Ação inválida.");
    const planDate=safe(body.plan_date,10),taskKey=safe(body.task_key,220),offset=weekOffset(body.week);
    if(!isDate(planDate)||(action!=="add"&&!taskKey)||planDate<today())return bad("Selecione uma data válida de hoje ou do futuro.");
    const plan=await getIntegratedStudyPlan(session.id,offset);
    if(plan.needs_onboarding)return bad("Conclua o questionário inicial.",409);
    const day=plan.week.days.find(item=>item.iso===planDate);
    if(!day||!day.active)return bad("Data indisponível neste plano.",409);
    const sourceParam=safe(body.source_plan_date,10);
    const task=action==="add"?null:day.tasks.find(item=>item.key===taskKey&&(!sourceParam||(item.source_plan_date||day.iso)===sourceParam));
    if(action!=="add"&&(!task||task.status==="done"||(action==="edit"&&task.reprogrammed)))
      return bad("Selecione uma tarefa pendente válida.",409);
    const sourcePlanDate=task?.source_plan_date||planDate;
    const terminal=action==="postpone"?lastEligibleStudyDate({
      taskType:task.type,fromDate:planDate,examDate:plan.exam_date,firstPassDeadline:plan.first_pass_deadline,
      studyDays:plan.onboarding?.study_days||[]
    }):null;
    if(action==="postpone"&&(!terminal||terminal<=planDate))
      return bad("Não existe um dia posterior elegível antes do prazo final desta atividade.",409);
    // A semana é congelada antes da mudança. O snapshot passa a armazenar a
    // personalização e a identidade da tarefa original fica no payload.
    await persistStudyPlanSnapshot(session.id,plan);
    if(action==="postpone"&&!task.reprogrammed&&offset<80){
      const following=await getIntegratedStudyPlan(session.id,offset+1);
      if(!following.needs_onboarding)await persistStudyPlanSnapshot(session.id,following);
    }
    let result;
    try{
      result=await withTransaction(async(client)=>{
        await client.query("select pg_advisory_xact_lock(hashtext($1),hashtext($2))",[String(session.id),"customize|global"]);
        const snapshot=await client.query("select id,week_start from student_plan_snapshots where user_id=$1 and week_start >=$2::date order by week_start asc for update",[session.id,plan.week.start]);
        const id=snapshot.rows.find(row=>isoDate(row.week_start)===plan.week.start)?.id;
        if(!id)throw new Error("Planejamento semanal não encontrado.");
        const all=await client.query("select id,snapshot_id,plan_date,task_key,task_type,subject_slug,position,payload from student_plan_snapshot_tasks where snapshot_id=any($1::bigint[]) order by plan_date,position,id for update",[snapshot.rows.map(row=>row.id)]);
        const current=action==="add"?null:all.rows.find(row=>row.snapshot_id===id&&isoDate(row.plan_date)===planDate&&row.task_key===taskKey);
        if(action!=="add"&&!current&&!task.reprogrammed)throw new Error("A tarefa foi alterada. Atualize a página.");
        if(action==="edit"&&!current)throw new Error("Não é possível editar esta pendência pelo calendário; primeiro escolha uma tarefa da semana.");
        const originalDate=current?.payload?.source_plan_date||sourcePlanDate;
        if(action!=="add"){
          await client.query("select pg_advisory_xact_lock(hashtext($1),hashtext($2))",[String(session.id),taskKey+"|"+originalDate]);
          const done=await client.query("select status from student_plan_task_progress where user_id=$1 and task_key=$2 and plan_date=$3::date for update",[session.id,taskKey,originalDate]);
          if(done.rows[0]?.status==="done")throw new Error("Tarefa já concluída.");
        }
        if(action==="edit"||action==="add"){
          let unit=null;
          if(body.task_type==="reading"){
            const selected=await client.query("select subject_slug,bibliography_key,section_key,publication_title,section_label,chapter_label,page_start,page_end from study_bibliography_catalog where bibliography_key=$1 and section_key=$2 and required=true limit 1",[safe(body.bibliography_key,180),safe(body.section_key,180)]);
            unit=selected.rows[0]||null;
            if(!unit){
              const fallback=bibliographyUnits().find(item=>item.bibliography_key===safe(body.bibliography_key,180)&&item.section_key===safe(body.section_key,180));
              if(fallback)unit={...fallback,publication_title:fallback.publication,section_label:fallback.section,chapter_label:fallback.chapter};
            }
          }
          const subject=SUBJECTS.find(item=>item.slug===safe(body.subject_slug,120));
          // Um domingo deve manter exatamente um Simulado PSCPP.
          if(action==="edit"&&((current.task_type==="simulado")!==(body.task_type==="simulado")))
            throw new Error("O Simulado PSCPP de domingo é obrigatório e não pode ser substituído ou duplicado.");
          if(action==="add"&&body.task_type==="simulado")
            throw new Error("O Simulado PSCPP já é programado automaticamente para todos os domingos.");
          if(body.task_type==="simulado"&&new Date(planDate+"T12:00:00").getDay()!==0)throw new Error("O Simulado PSCPP obrigatório está reservado ao domingo.");
          const payload=makeTask(body,subject,unit,current||{payload:{},plan_date:planDate});
          if(action==="add"){
            const newKey="manual|"+planDate+"|"+randomUUID();
            const assigned=all.rows.filter(row=>isoDate(row.plan_date)===planDate);
            const position=Math.min(32000,Math.max(-1,...assigned.map(row=>Number(row.position)||0))+1);
            await client.query(
              "insert into student_plan_snapshot_tasks(snapshot_id,user_id,plan_date,task_key,task_type,subject_slug,position,payload) values($1,$2,$3::date,$4,$5,$6,$7,$8::jsonb)",
              [id,session.id,planDate,newKey,payload.type,payload.subject,position,JSON.stringify(payload)]
            );
            await client.query(
              "insert into student_plan_task_progress(user_id,task_key,plan_date,task_type,subject_slug,status,metadata) values($1,$2,$3::date,$4,$5,'pending',$6::jsonb)",
              [session.id,newKey,planDate,payload.type,payload.subject,JSON.stringify(payload)]
            );
            // Se a tarefa nova preencher uma vaga de leitura, a fixação
            // existente precisa seguir a obra/seção recém-escolhida.
            if(payload.type==="reading"&&!all.rows.some(row=>isoDate(row.plan_date)===planDate&&row.task_type==="reading"))
              await syncFixation(client,session.id,id,planDate,payload);
            await client.query("insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,'TASK_ADDED_MANUALLY',$2,$3::date,$4,$5::jsonb)",
              [session.id,newKey,planDate,payload.subject,JSON.stringify({task:payload})]);
            return {action,affected:1,task_key:newKey};
          }
          await client.query("update student_plan_snapshot_tasks set task_type=$2,subject_slug=$3,payload=$4::jsonb where id=$1",
            [current.id,payload.type,payload.subject,JSON.stringify(payload)]);
          if(payload.type==="reading")await syncFixation(client,session.id,id,planDate,payload);
          await client.query("insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,'TASK_EDITED_MANUALLY',$2,$3::date,$4,$5::jsonb)",
            [session.id,current.task_key,planDate,payload.subject,JSON.stringify({before:current.payload,after:payload})]);
          return {action,affected:1};
        }
        // Guarda a tarefa no final do horizonte elegível, sem congelar dezenas
        // de semanas e sem deslocar tarefas já concluídas.
        const originalPayload=current?.payload||task;
        const deferredPayload={...originalPayload,key:taskKey,type:task.type,subject:task.subject,
          title:task.title,description:task.description,href:task.href,source_plan_date:originalDate,
          estimate_minutes:task.estimate_minutes||originalPayload.estimate_minutes||null,
          postponed_manually:true};
        const queue=await client.query(
          "select id,task_key,original_plan_date,target_plan_date,metadata,created_at from student_plan_reschedules where user_id=$1 and reason='manual_queue_tail' and status='active' and target_plan_date >= $2::date and metadata->>'type'=$3 order by created_at,id for update",
          [session.id,planDate,task.type]
        );
        const oldTail=queue.rows.filter(row=>!(row.task_key===taskKey&&isoDate(row.original_plan_date)===originalDate));
        // Uma nova postergação substitui qualquer agendamento ativo anterior
        // da mesma tarefa, inclusive aquele cuja data já ficou para trás.
        await client.query(
          "update student_plan_reschedules set status='cancelled' where user_id=$1 and task_key=$2 and original_plan_date=$3::date and reason='manual_queue_tail' and status='active'",
          [session.id,taskKey,originalDate]
        );
        const nextDate=new Date(planDate+"T12:00:00Z");
        nextDate.setUTCDate(nextDate.getUTCDate()+1);
        const allocated=distributeDeferredTail({
          taskType:task.type,count:oldTail.length+1,fromDate:nextDate.toISOString().slice(0,10),
          examDate:plan.exam_date,firstPassDeadline:plan.first_pass_deadline,
          studyDays:plan.onboarding?.study_days||[],
          unavailableDates:(plan.tracking?.unavailable_days||[]).map(item=>item.plan_date)
        });
        if(!allocated)throw new Error("Não existem dias de estudo suficientes antes do prazo para postergar todas as atividades desta categoria.");
        const destination=allocated[allocated.length-1];
        if(queue.rows.length)await client.query(
          "update student_plan_reschedules set status='cancelled' where id=any($1::bigint[])",
          [queue.rows.map(row=>row.id)]
        );
        const shifts=[];
        for(let i=0;i<oldTail.length;i++){
          const old=oldTail[i],next=allocated[i],origin=isoDate(old.original_plan_date);
          await client.query(
            "insert into student_plan_reschedules(user_id,task_key,original_plan_date,target_plan_date,reason,status,metadata,created_at) values($1,$2,$3::date,$4::date,'manual_queue_tail','active',$5::jsonb,$6::timestamptz) on conflict(user_id,task_key,original_plan_date,target_plan_date) do update set status='active',completed_at=null,metadata=excluded.metadata,created_at=excluded.created_at",
            [session.id,old.task_key,origin,next,JSON.stringify(old.metadata||{}),old.created_at]
          );
          const before=isoDate(old.target_plan_date);
          if(before!==next)shifts.push({task_key:old.task_key,from:before,to:next});
        }
        await client.query(
          "insert into student_plan_reschedules(user_id,task_key,original_plan_date,target_plan_date,reason,status,metadata,created_at) values($1,$2,$3::date,$4::date,'manual_queue_tail','active',$5::jsonb,now()) on conflict(user_id,task_key,original_plan_date,target_plan_date) do update set status='active',completed_at=null,metadata=excluded.metadata,created_at=excluded.created_at",
          [session.id,taskKey,originalDate,destination,JSON.stringify(deferredPayload)]
        );
        if(shifts.length)await client.query(
          "insert into student_plan_events(user_id,event_type,plan_date,metadata) values($1,'TASK_TAIL_QUEUE_REBALANCED',$2::date,$3::jsonb)",
          [session.id,planDate,JSON.stringify({category:task.type,changes:shifts})]
        );
        // O backlog adaptativo não está nos snapshots: nesse caso removê-lo
        // da recuperação automática e reservá-lo ao final já é suficiente.
        if(!current){
          await client.query("insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,'TASK_POSTPONED_MANUALLY',$2,$3::date,$4,$5::jsonb)",
            [session.id,taskKey,originalDate,task.subject||null,JSON.stringify({source_plan_date:originalDate,target_plan_date:destination,scope:"global_tail",from_backlog:true})]);
          return {action,affected:1,new_date:destination,backlog:true};
        }
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
        // Nunca deixamos a atividade de hoje sem substituta: se não existir
        // próxima tarefa elegível, é necessário editar o dia manualmente.
        if(index===pending.length-1)
          throw new Error("Não existe outra atividade pendente desta categoria para antecipar. Use Editar Plano.");
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
        const rotated=values.slice(1).map(v=>({...v,payload:{...v.payload,postponed_manually:false}}));
        for(let i=0;i<rotated.length;i++){
          const slot=slots[i],next=rotated[i];
          await client.query("insert into student_plan_snapshot_tasks(snapshot_id,user_id,plan_date,task_key,task_type,subject_slug,position,payload) values($1,$2,$3::date,$4,$5,$6,$7,$8::jsonb)",
            [slot.snapshot_id,session.id,isoDate(slot.plan_date),next.key,next.type,next.subject,slot.position,JSON.stringify(next.payload)]);
        }
        if(current.task_type==="reading"){
          for(let i=0;i<rotated.length;i++)
            await syncFixation(client,session.id,slots[i].snapshot_id,isoDate(slots[i].plan_date),rotated[i].payload);
          const finalSlot=slots[slots.length-1];
          await clearOrphanFixation(client,session.id,finalSlot.snapshot_id,isoDate(finalSlot.plan_date));
        }
        await client.query("insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,'TASK_POSTPONED_MANUALLY',$2,$3::date,$4,$5::jsonb)",
          [session.id,taskKey,planDate,current.subject_slug,JSON.stringify({source_plan_date:originalDate,target_plan_date:destination,scope:"global_tail",moved:slots.length,promoted:rotated.length})]);
        return {action,affected:slots.length,new_date:destination,promoted:rotated.length};
      });
    }catch(error){
      if(/Não existe outra atividade/.test(String(error.message)))return bad(error.message,409);
      throw error;
    }
    return Response.json({ok:true,...result},{headers:{"Cache-Control":"no-store"}});
  }catch(error){
    console.error("[study-plan-customize]",error);
    return bad(error.message||"Não foi possível alterar o plano.",400);
  }
}
