import { withTransaction } from "./db";

const iso=(value)=>value instanceof Date?value.toISOString().slice(0,10):String(value||"").slice(0,10);

export async function persistStudyPlanSnapshot(userId,plan){
  if(!plan?.week?.start||!plan?.week?.end||!Array.isArray(plan.week.days))throw new Error("Plano semanal inválido.");
  const weekStart=iso(plan.week.start),weekEnd=iso(plan.week.end);

  return withTransaction(async(client)=>{
    const existing=await client.query(
      "select id,week_start,week_end,algorithm_version,created_at,frozen_at from student_plan_snapshots where user_id=$1 and week_start=$2::date limit 1",
      [userId,weekStart]
    );
    if(existing.rows[0])return {snapshot:existing.rows[0],created:false};

    const snapshot=await client.query(
      "insert into student_plan_snapshots(user_id,week_start,week_end,algorithm_version,source,metadata) values($1,$2::date,$3::date,'v3','weekly_plan',$4::jsonb) returning *",
      [userId,weekStart,weekEnd,JSON.stringify({phase:plan.phase?.key||null,days_left:plan.days_left??null})]
    );
    const snapshotId=snapshot.rows[0].id;

    for(const day of plan.week.days){
      for(let position=0;position<(day.tasks||[]).length;position++){
        const task=day.tasks[position];
        if(task.reprogrammed){
          const original=iso(task.source_plan_date);
          await client.query(
            "insert into student_plan_reschedules(user_id,task_key,original_plan_date,target_plan_date,reason,status,metadata) values($1,$2,$3::date,$4::date,'adaptive_backlog','active',$5::jsonb) on conflict(user_id,task_key,original_plan_date,target_plan_date) do nothing",
            [userId,task.key,original,iso(day.iso),JSON.stringify({estimate_minutes:task.estimate_minutes||null,title:task.title||null})]
          );
          await client.query(
            "insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,'TASK_RESCHEDULED',$2,$3::date,$4,$5::jsonb)",
            [userId,task.key,original,task.subject||null,JSON.stringify({target_plan_date:iso(day.iso),reason:"adaptive_backlog"})]
          );
          continue;
        }
        const payload={
          key:task.key,type:task.type,subject:task.subject||null,title:task.title||"",
          description:task.description||"",href:task.href||null,chapter:task.chapter||null,
          page_from:task.page_from||null,page_to:task.page_to||null,pages:task.pages||null,
          bibliography_key:task.bibliography_key||null,section_key:task.section_key||null,
          target_questions:task.target_questions||null,fixation:task.fixation||null,
          estimate_minutes:task.estimate_minutes||null
        };
        await client.query(
          "insert into student_plan_snapshot_tasks(snapshot_id,user_id,plan_date,task_key,task_type,subject_slug,position,payload) values($1,$2,$3::date,$4,$5,$6,$7,$8::jsonb)",
          [snapshotId,userId,iso(day.iso),task.key,task.type,task.subject||null,position,JSON.stringify(payload)]
        );
        await client.query(
          "insert into student_plan_task_progress(user_id,task_key,plan_date,task_type,subject_slug,status,completed_at,metadata,updated_at) values($1,$2,$3::date,$4,$5,'pending',null,$6::jsonb,now()) on conflict(user_id,task_key,plan_date) do nothing",
          [userId,task.key,iso(day.iso),task.type,task.subject||null,JSON.stringify(payload)]
        );
        await client.query(
          "insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,'TASK_PLANNED',$2,$3::date,$4,$5::jsonb)",
          [userId,task.key,iso(day.iso),task.subject||null,JSON.stringify({snapshot_id:snapshotId,position})]
        );
      }
    }
    return {snapshot:snapshot.rows[0],created:true};
  });
}

export async function loadStudyPlanSnapshot(userId,weekStart){
  const start=iso(weekStart);
  const r=await withTransaction(async(client)=>{
    const snap=await client.query(
      "select id,user_id,week_start,week_end,algorithm_version,source,created_at,frozen_at,metadata from student_plan_snapshots where user_id=$1 and week_start=$2::date limit 1",
      [userId,start]
    );
    const snapshot=snap.rows[0];
    if(!snapshot)return null;
    const tasks=await client.query(
      "select plan_date,task_key,task_type,subject_slug,position,payload from student_plan_snapshot_tasks where snapshot_id=$1 order by plan_date,position,id",
      [snapshot.id]
    );
    return {snapshot,tasks:tasks.rows};
  });
  return r;
}
