import { withTransaction } from "./db";

const text=(value,max)=>String(value||"").trim().slice(0,max);
const int=(value)=>Number.isFinite(Number(value))?Math.trunc(Number(value)):0;
function mergePageRanges(ranges=[]){
  const clean=(Array.isArray(ranges)?ranges:[])
    .map(r=>({from:int(r?.from),to:int(r?.to)}))
    .filter(r=>r.from>0&&r.to>=r.from)
    .sort((a,b)=>a.from-b.from||a.to-b.to);
  const merged=[];
  for(const r of clean){
    const last=merged[merged.length-1];
    if(!last||r.from>last.to+1)merged.push({...r});
    else last.to=Math.max(last.to,r.to);
  }
  return merged;
}
function coveredPages(ranges=[]){
  return mergePageRanges(ranges).reduce((sum,r)=>sum+(r.to-r.from+1),0);
}

async function syncStudyProgress(client,userId,subjectSlug){
  if(!subjectSlug)return null;
  const r=await client.query(`
    select
      count(*)::int as total,
      count(*) filter(where bp.status='done')::int as completed,
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'bibliography_key',c.bibliography_key,
            'section_key',c.section_key
          ) order by c.display_order,c.id
        ) filter(where bp.status='done'),
        '[]'::jsonb
      ) as studied_items
    from study_bibliography_catalog c
    left join student_bibliography_progress bp
      on bp.user_id=$1
     and bp.bibliography_key=c.bibliography_key
     and bp.section_key=c.section_key
    where c.subject_slug=$2 and c.required=true
  `,[userId,subjectSlug]);
  const total=Number(r.rows[0]?.total||0);
  if(!total)return null;
  const completed=Number(r.rows[0]?.completed||0);
  const percent=Math.max(0,Math.min(100,Math.round(completed/total*100)));
  const saved=await client.query(`
    insert into study_progress(user_id,subject,percent,completed_items,total_items,studied_items,updated_at)
    values($1,$2,$3,$4,$5,$6::jsonb,now())
    on conflict(user_id,subject) do update set
      percent=excluded.percent,
      completed_items=excluded.completed_items,
      total_items=excluded.total_items,
      studied_items=excluded.studied_items,
      updated_at=now()
    returning subject,percent,completed_items,total_items,studied_items,updated_at
  `,[userId,subjectSlug,percent,completed,total,JSON.stringify(r.rows[0]?.studied_items||[])]);
  return saved.rows[0]||null;
}

async function recordPlanEvent(client,userId,eventType,{taskKey=null,planDate=null,subjectSlug=null,metadata={}}={}){
  await client.query(
    "insert into student_plan_events(user_id,event_type,task_key,plan_date,subject_slug,metadata) values($1,$2,$3,case when $4::text is null then null else $4::date end,$5,$6::jsonb)",
    [userId,text(eventType,60),taskKey?text(taskKey,220):null,planDate?text(planDate,10):null,subjectSlug?text(subjectSlug,120):null,JSON.stringify(metadata||{})]
  ).catch(()=>{});
}

async function recordStudyActivity(client,userId,{eventName,subjectSlug,metadata={}}){
  await client.query(`
    insert into study_days(user_id,study_date,activity_count)
    values($1,(now() at time zone 'America/Sao_Paulo')::date,1)
    on conflict(user_id,study_date) do update set
      activity_count=study_days.activity_count+1
  `,[userId]);

  await client.query(
    "insert into product_events(user_id,event_name,metadata) values($1,$2,$3::jsonb)",
    [userId,text(eventName,80),JSON.stringify(metadata||{})]
  );

}

async function catalogUnit(client,bibliographyKey,sectionKey){
  const r=await client.query(`
    select subject_slug,bibliography_key,section_key,page_start,page_end
    from study_bibliography_catalog
    where bibliography_key=$1 and section_key=$2
    limit 1
  `,[bibliographyKey,sectionKey]);
  return r.rows[0]||null;
}

async function applyReadingChunk(client,userId,input){
  const bibliographyKey=text(input.bibliography_key,180);
  const sectionKey=text(input.section_key,180);
  const subjectSlug=text(input.subject_slug,120);
  if(!bibliographyKey||!sectionKey||!subjectSlug)return null;

  const unit=await catalogUnit(client,bibliographyKey,sectionKey);
  const pageFrom=int(input.page_from)||null;
  const pageTo=int(input.page_to)||null;
  const pages=pageFrom&&pageTo&&pageTo>=pageFrom?pageTo-pageFrom+1:0;

  const currentResult=await client.query(`
    select status,completed_ranges,current_page,pages_completed
    from student_bibliography_progress
    where user_id=$1 and bibliography_key=$2 and section_key=$3
    for update
  `,[userId,bibliographyKey,sectionKey]);
  const current=currentResult.rows[0]||null;

  const totalPages=Number.isInteger(unit?.page_start)&&Number.isInteger(unit?.page_end)&&unit.page_end>=unit.page_start
    ? Number(unit.page_end)-Number(unit.page_start)+1
    : 0;

  let addedPages=0;
  if(pages>0){
    const inserted=await client.query(`
      insert into student_reading_log(
        user_id,bibliography_key,subject_slug,section_key,page_from,page_to,pages_completed
      ) values($1,$2,$3,$4,$5,$6,$7)
      on conflict(user_id,bibliography_key,section_key,page_from,page_to) do nothing
      returning id
    `,[userId,bibliographyKey,subjectSlug,sectionKey,pageFrom,pageTo,pages]);
    if(inserted.rowCount)addedPages=pages;
  }

  const ranges=Array.isArray(current?.completed_ranges)?current.completed_ranges:[];
  const nextRanges=mergePageRanges(addedPages?[...ranges,{from:pageFrom,to:pageTo}]:ranges);
  let pagesCompleted=coveredPages(nextRanges);
  if(totalPages)pagesCompleted=Math.min(totalPages,pagesCompleted);
  const requiredStart=Number(unit?.page_start||0),requiredEnd=Number(unit?.page_end||0);
  const fullyCovered=totalPages>0&&nextRanges.some(r=>r.from<=requiredStart&&r.to>=requiredEnd);
  const done=totalPages?fullyCovered:pages===0;
  const status=done?"done":"reading";
  const currentPage=pageTo||current?.current_page||null;

  const saved=await client.query(`
    insert into student_bibliography_progress(
      user_id,bibliography_key,subject_slug,section_key,status,completed_at,
      completed_ranges,current_page,pages_completed,updated_at
    ) values(
      $1,$2,$3,$4,$5,case when $5='done' then now() else null end,
      $6::jsonb,$7,$8,now()
    )
    on conflict(user_id,bibliography_key,section_key) do update set
      subject_slug=excluded.subject_slug,
      status=excluded.status,
      completed_at=case when excluded.status='done' then coalesce(student_bibliography_progress.completed_at,now()) else student_bibliography_progress.completed_at end,
      completed_ranges=excluded.completed_ranges,
      current_page=excluded.current_page,
      pages_completed=excluded.pages_completed,
      updated_at=now()
    returning *
  `,[userId,bibliographyKey,subjectSlug,sectionKey,status,JSON.stringify(nextRanges),currentPage,pagesCompleted]);

  const studyProgress=await syncStudyProgress(client,userId,subjectSlug);
  return {progress:saved.rows[0]||null,study_progress:studyProgress};
}

async function markWholeBibliographyUnit(client,userId,input){
  const bibliographyKey=text(input.bibliography_key,180);
  const sectionKey=text(input.section_key,180);
  const subjectSlug=text(input.subject_slug,120);
  if(!bibliographyKey||!sectionKey||!subjectSlug)throw new Error("Unidade bibliográfica inválida.");

  const unit=await catalogUnit(client,bibliographyKey,sectionKey);
  const currentResult=await client.query(`
    select status,completed_ranges,current_page,pages_completed
    from student_bibliography_progress
    where user_id=$1 and bibliography_key=$2 and section_key=$3
    for update
  `,[userId,bibliographyKey,sectionKey]);
  const current=currentResult.rows[0]||null;
  const wasDone=current?.status==="done";

  const totalPages=Number.isInteger(unit?.page_start)&&Number.isInteger(unit?.page_end)&&unit.page_end>=unit.page_start
    ? Number(unit.page_end)-Number(unit.page_start)+1
    : 0;

  if(totalPages){
    await client.query(`
      insert into student_reading_log(
        user_id,bibliography_key,subject_slug,section_key,page_from,page_to,pages_completed
      ) values($1,$2,$3,$4,$5,$6,$7)
      on conflict(user_id,bibliography_key,section_key,page_from,page_to) do nothing
    `,[userId,bibliographyKey,subjectSlug,sectionKey,unit.page_start,unit.page_end,totalPages]);
  }

  const ranges=totalPages?[{from:Number(unit.page_start),to:Number(unit.page_end)}]:(Array.isArray(current?.completed_ranges)?current.completed_ranges:[]);
  const saved=await client.query(`
    insert into student_bibliography_progress(
      user_id,bibliography_key,subject_slug,section_key,status,completed_at,
      completed_ranges,current_page,pages_completed,updated_at
    ) values($1,$2,$3,$4,'done',now(),$5::jsonb,$6,$7,now())
    on conflict(user_id,bibliography_key,section_key) do update set
      subject_slug=excluded.subject_slug,
      status='done',
      completed_at=coalesce(student_bibliography_progress.completed_at,now()),
      completed_ranges=excluded.completed_ranges,
      current_page=coalesce(excluded.current_page,student_bibliography_progress.current_page),
      pages_completed=greatest(student_bibliography_progress.pages_completed,excluded.pages_completed),
      updated_at=now()
    returning *
  `,[userId,bibliographyKey,subjectSlug,sectionKey,JSON.stringify(ranges),unit?.page_end||current?.current_page||null,totalPages||Number(current?.pages_completed||0)]);

  if(!wasDone){
    await recordPlanEvent(client,userId,"BIBLIOGRAPHY_UNIT_COMPLETED",{
      subjectSlug,
      metadata:{bibliography_key:bibliographyKey,section_key:sectionKey}
    });
    await recordStudyActivity(client,userId,{
      eventName:"bibliography_unit_completed",
      subjectSlug,
      metadata:{bibliography_key:bibliographyKey,section_key:sectionKey,source:"bibliography_panel"}
    });
  }
  const studyProgress=await syncStudyProgress(client,userId,subjectSlug);
  return {progress:saved.rows[0]||null,study_progress:studyProgress};
}

export async function setPlanTaskStatusAndMetrics(userId,input={}){
  const status=["pending","done","skipped"].includes(input.status)?input.status:"pending";
  const taskKey=text(input.task_key,220);
  const planDate=text(input.plan_date,10);
  const taskType=text(input.task_type,30);
  const subjectSlug=text(input.subject_slug,120)||null;
  if(!taskKey||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(planDate))throw new Error("Tarefa do plano inválida.");

  return withTransaction(async(client)=>{
    // Serializa a transição mesmo quando a linha ainda não existe. SELECT ... FOR UPDATE
    // sozinho não protege dois primeiros cliques concorrentes contra efeitos duplicados.
    await client.query(
      "select pg_advisory_xact_lock(hashtext($1),hashtext($2))",
      [String(userId),taskKey+"|"+planDate]
    );

    const previous=await client.query(`
      select status from student_plan_task_progress
      where user_id=$1 and task_key=$2 and plan_date=$3::date
      for update
    `,[userId,taskKey,planDate]);
    const previousStatus=previous.rows[0]?.status||null;

    const saved=await client.query(`
      insert into student_plan_task_progress(
        user_id,task_key,plan_date,task_type,subject_slug,status,completed_at,metadata,updated_at
      ) values(
        $1,$2,$3::date,$4,$5,$6,case when $6='done' then now() else null end,$7::jsonb,now()
      )
      on conflict(user_id,task_key,plan_date) do update set
        task_type=excluded.task_type,
        subject_slug=excluded.subject_slug,
        status=excluded.status,
        completed_at=case
          when excluded.status='done' then coalesce(student_plan_task_progress.completed_at,now())
          else null
        end,
        metadata=excluded.metadata,
        updated_at=now()
      returning *
    `,[userId,taskKey,planDate,taskType,subjectSlug,status,JSON.stringify(input.metadata||{})]);

    const newlyDone=status==="done"&&previousStatus!=="done";
    const statusChanged=previousStatus!==status;
    if(statusChanged){
      const eventType=status==="done"?"TASK_COMPLETED":status==="skipped"?"TASK_SKIPPED":"TASK_REOPENED";
      await recordPlanEvent(client,userId,eventType,{
        taskKey,planDate,subjectSlug,
        metadata:{task_type:taskType,previous_status:previousStatus,new_status:status}
      });
    }
    // A redistribuição exibida no plano é calculada a partir do backlog em
    // student_plan_task_progress. Não dependa de uma tabela opcional de
    // reschedules para concluir a tarefa: instalações antigas podem não tê-la.
    // Ao salvar o progresso original como "done", a pendência deixa o backlog
    // automaticamente no próximo cálculo do plano.
    if(newlyDone){
      await recordPlanEvent(client,userId,"BACKLOG_ITEM_RESOLVED",{
        taskKey,planDate,subjectSlug,
        metadata:{source:"study_plan",reprogrammed:Boolean(input.metadata?.reprogrammed)}
      });
    }
    let bibliography=null;
    if(status==="done"&&taskType==="reading"&&input.bibliography_key&&input.section_key){
      bibliography=input.complete_bibliography_unit===true
        ? await markWholeBibliographyUnit(client,userId,input)
        : await applyReadingChunk(client,userId,input);
    }

    if(newlyDone){
      // Métricas/telemetria são secundárias. Uma falha nelas jamais deve
      // reverter a conclusão persistida da tarefa principal.
      try{
        await recordStudyActivity(client,userId,{
          eventName:"study_plan_task_completed",
          subjectSlug,
          metadata:{
            task_key:taskKey,
            plan_date:planDate,
            task_type:taskType,
            subject_slug:subjectSlug,
            bibliography_key:input.bibliography_key||null,
            section_key:input.section_key||null,
            page_from:int(input.page_from)||null,
            page_to:int(input.page_to)||null,
            title:text(input.metadata?.title,240)||null
          }
        });
      }catch(error){
        console.error("Falha não bloqueante ao registrar atividade do plano:",error);
      }
    }

    return {item:saved.rows[0]||null,bibliography,newly_done:newlyDone};
  });
}

export async function setBibliographyStatusAndMetrics(userId,input={}){
  const status=["pending","reading","done"].includes(input.status)?input.status:"pending";
  if(status==="done"){
    return withTransaction(client=>markWholeBibliographyUnit(client,userId,input));
  }

  const bibliographyKey=text(input.bibliography_key,180);
  const sectionKey=text(input.section_key,180);
  const subjectSlug=text(input.subject_slug,120);
  if(!bibliographyKey||!sectionKey||!subjectSlug)throw new Error("Unidade bibliográfica inválida.");

  return withTransaction(async(client)=>{
    const saved=await client.query(`
      insert into student_bibliography_progress(
        user_id,bibliography_key,subject_slug,section_key,status,updated_at
      ) values($1,$2,$3,$4,$5,now())
      on conflict(user_id,bibliography_key,section_key) do update set
        subject_slug=excluded.subject_slug,status=excluded.status,updated_at=now()
      returning *
    `,[userId,bibliographyKey,subjectSlug,sectionKey,status]);
    const studyProgress=await syncStudyProgress(client,userId,subjectSlug);
    return {progress:saved.rows[0]||null,study_progress:studyProgress};
  });
}
