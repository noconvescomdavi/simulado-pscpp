import { query } from "./db";
import { getUserMetrics } from "./metrics";
import { SUBJECTS } from "./subjects";
import { BIBLIOGRAPHY, EXAM_DATE, bibliographyUnits } from "../data/study/bibliography";

const DAY = 86400000;
const FIRST_PASS_DEADLINE = "2027-08-01";
const INTERNAL_FIRST_PASS_TARGET = "2027-07-15"; // margem operacional antes do prazo oficial.
const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
const isoDate=(d)=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);

function countStudyDays(start,end,studyDays){
  if(end<start)return 0;
  let count=0;
  const cursor=new Date(start.getFullYear(),start.getMonth(),start.getDate());
  const last=new Date(end.getFullYear(),end.getMonth(),end.getDate());
  while(cursor<=last){
    const js=cursor.getDay(),iso=js===0?7:js;
    if(studyDays.includes(iso))count++;
    cursor.setDate(cursor.getDate()+1);
  }
  return count;
}
function mondayOf(date=new Date()){
  const d=new Date(date);
  const dow=d.getDay();
  const shift=dow===0?-6:1-dow;
  return new Date(d.getTime()+shift*DAY);
}
function phaseFor(daysLeft){
  if(daysLeft<=92)return{key:"heavy_review",label:"Revisão pesada",readingShare:0,questionsShare:.70};
  if(daysLeft<=300)return{key:"development",label:"Leitura + desenvolvimento",readingShare:.55,questionsShare:.30};
  return{key:"foundation",label:"Primeira passagem da bibliografia",readingShare:.65,questionsShare:.25};
}
function flattenBibliography(slug){
  return bibliographyUnits().filter(item=>item.subject_slug===slug);
}
function pageCount(item){
  return Number.isInteger(item.page_start)&&Number.isInteger(item.page_end)&&item.page_end>=item.page_start
    ? item.page_end-item.page_start+1 : null;
}
function densityOf(item){
  const explicit=String(item.reading_density||"").toLowerCase();
  if(["high","medium","low"].includes(explicit))return explicit;
  const t=(item.publication||"").toLowerCase();
  if(/principles of naval architecture|ship resistance and flow|hydrodynamics|hidrodinâmica/.test(t))return "high";
  if(/normam|resolution|circ\.|lei |decreto|solas|colreg|declaração|glossário/.test(t))return "low";
  return "medium";
}
function pagesPerHourFor(density){return density==="high"?8:density==="low"?18:12;}
function readingChunks(item,completedPages=0){
  const total=pageCount(item);
  if(!total)return [{...item,chunk_key:"section",page_from:null,page_to:null,pages:null}];
  const start=item.page_start+Math.max(0,Number(completedPages||0));
  if(start>item.page_end)return [];
  const chunks=[];
  for(let from=start;from<=item.page_end;from+=12){
    const to=Math.min(item.page_end,from+11);
    chunks.push({...item,chunk_key:`p${from}-${to}`,page_from:from,page_to:to,pages:to-from+1});
  }
  return chunks;
}
function subjectWeight(metric,onboarding,studied){
  const questions=Number(metric.questions||0), accuracy=Number(metric.accuracy||0);
  const confidence=Number(onboarding.confidence_by_subject?.[metric.slug]||0);
  const weakness=questions>=10?Math.max(0,82-accuracy):34;
  const coverage=Math.max(0,40-Math.min(40,questions/5));
  const selfAssessment=confidence?Math.max(0,5-confidence)*5:10;
  return Math.max(8,weakness+coverage+selfAssessment+(studied.includes(metric.slug)?-8:8));
}

export async function getOnboarding(userId){
  const r=await query("select user_id,experience_level,started_before,months_studying,daily_minutes,reading_minutes_target,study_days,studied_subjects,confidence_by_subject,notes,completed_at from student_onboarding where user_id=$1 limit 1",[userId]);
  const row=r.rows[0]||null;
  if(!row)return null;
  return{
    ...row,
    studied_subjects:Array.isArray(row.studied_subjects)?row.studied_subjects:[],
    confidence_by_subject:row.confidence_by_subject&&typeof row.confidence_by_subject==="object"?row.confidence_by_subject:{},
    study_days:Array.isArray(row.study_days)?row.study_days.map(Number):[1,2,3,4,5,6]
  };
}

export async function saveOnboarding(userId,input={}){
  const experience=["beginner","studying","advanced"].includes(input.experience_level)?input.experience_level:"beginner";
  const days=[...new Set((input.study_days||[]).map(Number).filter(x=>x>=1&&x<=7))];
  const studied=[...new Set((input.studied_subjects||[]).filter(x=>SUBJECTS.some(s=>s.slug===x)))];
  const confidence={};
  for(const s of SUBJECTS)confidence[s.slug]=clamp(input.confidence_by_subject?.[s.slug],1,5)||1;
  const dailyMinutes=clamp(Math.trunc(input.daily_minutes||60),15,720);
  const months=clamp(Math.trunc(input.months_studying||0),0,240);
  const safeDays=days.length?days:[1,2,3,4,5,6];
  const readingMinutesTarget=clamp(Math.trunc(input.reading_minutes_target||120),30,360);

  const r=await query(
    "insert into student_onboarding(user_id,experience_level,started_before,months_studying,daily_minutes,reading_minutes_target,study_days,studied_subjects,confidence_by_subject,notes,completed_at,updated_at) values($1,$2,$3,$4,$5,$6,$7::smallint[],$8::jsonb,$9::jsonb,$10,now(),now()) on conflict(user_id) do update set experience_level=excluded.experience_level,started_before=excluded.started_before,months_studying=excluded.months_studying,daily_minutes=excluded.daily_minutes,reading_minutes_target=excluded.reading_minutes_target,study_days=excluded.study_days,studied_subjects=excluded.studied_subjects,confidence_by_subject=excluded.confidence_by_subject,notes=excluded.notes,completed_at=coalesce(student_onboarding.completed_at,now()),updated_at=now() returning *",
    [userId,experience,input.started_before===true,months,dailyMinutes,readingMinutesTarget,safeDays,JSON.stringify(studied),JSON.stringify(confidence),String(input.notes||"").slice(0,2000)||null]
  );
  await query(
    "insert into student_study_goals(user_id,daily_minutes,reading_minutes_target,weekly_questions,target_exam_date,study_days,updated_at) values($1,$2,$3,$4,date '2027-11-01',$5::smallint[],now()) on conflict(user_id) do update set daily_minutes=excluded.daily_minutes,reading_minutes_target=excluded.reading_minutes_target,weekly_questions=excluded.weekly_questions,target_exam_date=date '2027-11-01',study_days=excluded.study_days,updated_at=now()",
    [userId,dailyMinutes,readingMinutesTarget,Math.max(35,Math.round((dailyMinutes/60)*120)),safeDays]
  );
  return r.rows[0];
}

export async function getIntegratedStudyPlan(userId,weekOffset=0){
  const [onboarding,metrics,bp,readingLog]=await Promise.all([
    getOnboarding(userId),getUserMetrics(userId),
    query("select bibliography_key,subject_slug,section_key,status,completed_at,completed_ranges,current_page,pages_completed from student_bibliography_progress where user_id=$1",[userId]),
    query("select coalesce(sum(pages_completed),0)::int pages,count(distinct (logged_at at time zone 'America/Sao_Paulo')::date)::int reading_days from student_reading_log where user_id=$1",[userId]).catch(()=>({rows:[{pages:0,reading_days:0}]}))
  ]);
  if(!onboarding?.completed_at)return{needs_onboarding:true};

  const today=new Date(), exam=new Date(EXAM_DATE+"T00:00:00-03:00"), firstPassDeadline=new Date(FIRST_PASS_DEADLINE+"T00:00:00-03:00"), internalTarget=new Date(INTERNAL_FIRST_PASS_TARGET+"T00:00:00-03:00");
  const daysLeft=Math.max(0,Math.ceil((exam-today)/DAY)), weeksLeft=Math.max(1,Math.ceil(daysLeft/7));
  const phase=phaseFor(daysLeft), weekStart=new Date(mondayOf(today).getTime()+Number(weekOffset||0)*7*DAY), weekEnd=new Date(weekStart.getTime()+6*DAY);
  const progressMap=new Map(bp.rows.map(r=>[r.bibliography_key+"|"+r.section_key,r]));
  const studied=onboarding.studied_subjects||[];
  const weighted=metrics.subjects.map(m=>({...m,weight:subjectWeight(m,onboarding,studied)})).sort((a,b)=>b.weight-a.weight);

  const catalogRows=await query("select subject_slug,bibliography_key,publication_title as publication,source,section_key,section_label as section,coalesce(chapter_label,section_label) as chapter,page_start,page_end,required,display_order as order,reading_density,pages_verified,page_reference from study_bibliography_catalog where required=true order by subject_slug,display_order,id").catch(()=>({rows:[]}));
  const catalogBySubject=new Map();
  for(const row of catalogRows.rows){if(!catalogBySubject.has(row.subject_slug))catalogBySubject.set(row.subject_slug,[]);catalogBySubject.get(row.subject_slug).push(row);}
  const allReading=weighted.flatMap(s=>(catalogBySubject.get(s.slug)?.length?catalogBySubject.get(s.slug):flattenBibliography(s.slug)).map(item=>({...item,weight:s.weight,progress:progressMap.get(item.bibliography_key+"|"+item.section_key)||null})));
  const pendingSections=allReading.filter(x=>x.progress?.status!=="done");
  const pendingReading=pendingSections.flatMap(x=>readingChunks(x,x.progress?.pages_completed||0));
  const activeStudyDaysPerWeek=Math.max(1,(onboarding.study_days||[1,2,3,4,5,6]).length);
  const studyDays=onboarding.study_days?.length?onboarding.study_days:[1,2,3,4,5,6];
  const readingDaysLeft=Math.max(1,countStudyDays(today,internalTarget,studyDays));
  const knownPagesRemaining=pendingSections.reduce((sum,x)=>{
    const total=pageCount(x); return sum+(total?Math.max(0,total-Number(x.progress?.pages_completed||0)):0);
  },0);
  const pagesPerReadingDay=knownPagesRemaining?Math.max(1,Math.ceil(knownPagesRemaining/readingDaysLeft)):null;
  const totalKnownPages=allReading.reduce((sum,x)=>sum+(pageCount(x)||0),0);
  const completedKnownPages=Math.max(0,totalKnownPages-knownPagesRemaining);
  const unitsWithPagination=allReading.filter(x=>pageCount(x)).length;
  const unitsPendingPagination=allReading.length-unitsWithPagination;
  const actualPages=Number(readingLog.rows[0]?.pages||0), actualReadingDays=Number(readingLog.rows[0]?.reading_days||0);
  const actualPagesPerReadingDay=actualReadingDays?Math.round((actualPages/actualReadingDays)*10)/10:null;
  const estimatedPagesPerHour=allReading.length
    ? allReading.reduce((sum,x)=>sum+pagesPerHourFor(densityOf(x)),0)/allReading.length
    : 12;
  const readingMinutesTarget=Number(onboarding.reading_minutes_target||120);
  const capacityPagesPerReadingDay=Math.round((estimatedPagesPerHour*(readingMinutesTarget/60))*10)/10;
  const effectiveDailyRate=actualPagesPerReadingDay||capacityPagesPerReadingDay;
  const projectedReadingDays=knownPagesRemaining&&effectiveDailyRate?Math.ceil(knownPagesRemaining/effectiveDailyRate):null;
  const projectedCalendarDays=projectedReadingDays?Math.ceil(projectedReadingDays/activeStudyDaysPerWeek*7):null;
  const projectedFinish=projectedCalendarDays?new Date(today.getTime()+projectedCalendarDays*DAY):null;
  const internalMarginDays=projectedFinish?Math.floor((internalTarget-projectedFinish)/DAY):null;
  const officialMarginDays=projectedFinish?Math.floor((firstPassDeadline-projectedFinish)/DAY):null;
  const dailyMinutes=Number(onboarding.daily_minutes||60); // mantido apenas para metas legadas de questões; leitura é distribuída por páginas/capítulos.
  const dayObjects=Array.from({length:7},(_,i)=>{
    const date=new Date(weekStart.getTime()+i*DAY), js=date.getDay(), isoDay=js===0?7:js;
    return{date,iso:isoDate(date),isoDay,active:studyDays.includes(isoDay),tasks:[]};
  });

  let readingIndex=Math.max(0,Number(weekOffset||0)*Math.max(1,Math.round(studyDays.length*phase.readingShare))), subjectIndex=0;
  for(const day of dayObjects){
    if(!day.active||day.date>exam||day.date<new Date(today.getFullYear(),today.getMonth(),today.getDate()))continue;
    const questionMinutes=Math.max(20,Math.round(dailyMinutes*phase.questionsShare));
    const reviewMinutes=Math.max(10,Math.round(dailyMinutes*(1-phase.questionsShare)));

    if(phase.key!=="heavy_review"&&pendingReading.length){
      const item=pendingReading[readingIndex%pendingReading.length];
      day.tasks.push({
        key:"read|"+item.bibliography_key+"|"+item.section_key+"|"+item.chunk_key,type:"reading",subject:item.subject_slug,
        title:item.publication,
        description:item.pages?`${item.chapter} · páginas ${item.page_from}–${item.page_to}`:item.section,
        chapter:item.chapter,page_from:item.page_from,page_to:item.page_to,pages:item.pages,
        bibliography_key:item.bibliography_key,section_key:item.section_key,href:"/plano-de-estudos"
      });
      readingIndex++;
    }

    const readingTask=day.tasks.find(t=>t.type==="reading");
    const subject=readingTask
      ? weighted.find(s=>s.slug===readingTask.subject)||weighted[subjectIndex%weighted.length]
      : weighted[subjectIndex%weighted.length];
    subjectIndex++;
    const targetQuestions=Math.max(10,Math.round(questionMinutes/1.7));
    const fixationParams=readingTask
      ? "?materia="+encodeURIComponent(subject.slug)+"&bibliografia="+encodeURIComponent(readingTask.bibliography_key)+"&secao="+encodeURIComponent(readingTask.section_key)+"&capitulo="+encodeURIComponent(readingTask.chapter||"")+"&publicacao="+encodeURIComponent(readingTask.title||"")
      : "";
    day.tasks.push({
      key:"questions|"+subject.slug+"|"+day.iso+(readingTask?"|"+readingTask.bibliography_key+"|"+readingTask.section_key:""),
      type:"questions",subject:subject.slug,
      title:readingTask?"Questões de fixação — "+(readingTask.chapter||readingTask.title):targetQuestions+" questões — "+subject.label,
      description:readingTask
        ?"Questões relacionadas à leitura de hoje: "+readingTask.title+" — "+readingTask.description+"."
        :(subject.questions?"Aproveitamento atual: "+subject.accuracy+"% em "+subject.questions+" respostas.":"Crie base de desempenho nesta matéria."),
      target_questions:readingTask?null:targetQuestions,
      fixation:readingTask?{bibliography_key:readingTask.bibliography_key,section_key:readingTask.section_key,publication:readingTask.title,chapter:readingTask.chapter,page_from:readingTask.page_from,page_to:readingTask.page_to}:null,
      href:readingTask?"/conteudos/fixacao"+fixationParams:"/conteudos/banco-de-questoes?materia="+subject.slug
    });

    day.tasks.push({
      key:"review|"+day.iso,type:"review",subject:subject.slug,
      title:phase.key==="heavy_review"?"Revisão pesada — "+subject.label:"Revisão inteligente",
      description:phase.key==="heavy_review"
        ?"Prioridade automática para a matéria de menor desempenho: erros, caderno de erros, revisão espaçada e releitura seletiva dos tópicos fracos."
        :"Revise erros e tópicos vencidos antes de avançar.",href:"/revisao-inteligente"
    });
    if(phase.key==="heavy_review"){
      const weakReading=allReading.find(x=>x.subject_slug===subject.slug&&x.progress?.status==="done");
      if(weakReading)day.tasks.unshift({
        key:"reread|"+weakReading.bibliography_key+"|"+weakReading.section_key+"|"+day.iso,
        type:"rereading",subject:subject.slug,title:"Releitura seletiva — "+weakReading.publication,
        description:(weakReading.chapter||weakReading.section)+" · selecionado pelas métricas de menor desempenho.",
        bibliography_key:weakReading.bibliography_key,section_key:weakReading.section_key,href:"/plano-de-estudos"
      });
    }

    if(day.isoDay===studyDays[studyDays.length-1]){
      day.tasks.push({
        key:"weekly-exam|"+day.iso,type:"simulado",subject:weighted[0]?.slug||SUBJECTS[0].slug,
        title:phase.key==="final"?"Simulado PSCPP da semana":"Simulado de consolidação",
        description:"Feche a semana medindo desempenho e recalibrando o próximo ciclo.",
        href:"/simulado"
      });
    }
  }

  const minDate=isoDate(weekStart),maxDate=isoDate(weekEnd);
  const saved=await query("select task_key,plan_date,status,completed_at from student_plan_task_progress where user_id=$1 and plan_date between $2::date and $3::date",[userId,minDate,maxDate]);
  const savedMap=new Map(saved.rows.map(r=>[(r.plan_date instanceof Date?r.plan_date.toISOString().slice(0,10):String(r.plan_date).slice(0,10))+"|"+r.task_key,r]));

  for(const day of dayObjects){
    day.tasks=day.tasks.map(task=>{
      const savedTask=savedMap.get(day.iso+"|"+task.key);
      const bpItem=task.type==="reading"?progressMap.get(task.bibliography_key+"|"+task.section_key):null;
      const readingDone=bpItem?.status==="done";
      return{...task,status:readingDone?"done":savedTask?.status||"pending",completed_at:readingDone?bpItem?.completed_at:savedTask?.completed_at||null};
    });
  }

  const totalAnswered=Number(metrics.overall.questions||0),accuracy=Number(metrics.overall.accuracy||0);
  const volumeScore=Math.min(100,Math.sqrt(totalAnswered/1500)*100);
  const coverageScore=(metrics.subjects.filter(s=>Number(s.questions||0)>=50).length/SUBJECTS.length)*100;
  const bibliographyDone=bp.rows.filter(r=>r.status==="done").length;
  const bibliographyTotal=allReading.length;
  const bibliographyScore=bibliographyTotal?(bibliographyDone/bibliographyTotal)*100:0;
  const readiness=Math.round(clamp(accuracy,0,100)*.45+volumeScore*.25+coverageScore*.15+bibliographyScore*.15);

  return{
    needs_onboarding:false,exam_date:EXAM_DATE,first_pass_deadline:FIRST_PASS_DEADLINE,internal_first_pass_target:INTERNAL_FIRST_PASS_TARGET,days_left:daysLeft,weeks_left:weeksLeft,phase,
    first_pass:{
      deadline:FIRST_PASS_DEADLINE,internal_target:INTERNAL_FIRST_PASS_TARGET,pending_sections:pendingSections.length,
      known_pages_total:totalKnownPages,known_pages_completed:completedKnownPages,known_pages_remaining:knownPagesRemaining,
      units_with_pagination:unitsWithPagination,units_pending_pagination:unitsPendingPagination,
      pages_per_reading_day:pagesPerReadingDay,reading_minutes_target:readingMinutesTarget,
      actual_pages_per_reading_day:actualPagesPerReadingDay,capacity_pages_per_reading_day:capacityPagesPerReadingDay,
      projected_finish:projectedFinish?isoDate(projectedFinish):null,margin_days:internalMarginDays,official_margin_days:officialMarginDays,
      on_track:internalMarginDays===null?today<=internalTarget:internalMarginDays>=0,
      provisional:unitsPendingPagination>0
    },
    week:{start:minDate,end:maxDate,offset:Number(weekOffset||0),days:dayObjects},
    onboarding,metrics,weighted_subjects:weighted,bibliography:allReading,
    bibliography_progress:{done:bibliographyDone,total:bibliographyTotal,percent:bibliographyTotal?Math.round((bibliographyDone/bibliographyTotal)*100):0},
    readiness,
    phases:[
      {label:"Primeira passagem",from:"Cadastro",to:"01/08/2027",focus:"Ler 100% da bibliografia exigida pelo menos uma vez, por capítulos/seções e páginas"},
      {label:"Revisão pesada",from:"02/08/2027",to:"01/11/2027",focus:"Questões, simulados, caderno de erros, revisão espaçada e releitura seletiva dos tópicos de menor pontuação"}
    ]
  };
}

export async function setPlanTaskStatus(userId,input={}){
  const status=["pending","done","skipped"].includes(input.status)?input.status:"pending";
  const r=await query(
    "insert into student_plan_task_progress(user_id,task_key,plan_date,task_type,subject_slug,status,completed_at,metadata,updated_at) values($1,$2,$3::date,$4,$5,$6,case when $6='done' then now() else null end,$7::jsonb,now()) on conflict(user_id,task_key,plan_date) do update set status=excluded.status,completed_at=case when excluded.status='done' then now() else null end,metadata=excluded.metadata,updated_at=now() returning *",
    [userId,String(input.task_key||"").slice(0,220),String(input.plan_date||""),String(input.task_type||"").slice(0,30),String(input.subject_slug||"").slice(0,120)||null,status,JSON.stringify(input.metadata||{})]
  );
  return r.rows[0];
}

export async function setBibliographyStatus(userId,input={}){
  const status=["pending","reading","done"].includes(input.status)?input.status:"pending";
  const pageFrom=Number(input.page_from||0)||null,pageTo=Number(input.page_to||0)||null;
  const pages=pageFrom&&pageTo&&pageTo>=pageFrom?pageTo-pageFrom+1:0;
  const range=pages?JSON.stringify([{from:pageFrom,to:pageTo}]):"[]";
  const bibliographyKey=String(input.bibliography_key||"").slice(0,180);
  const subjectSlug=String(input.subject_slug||"").slice(0,120);
  const sectionKey=String(input.section_key||"").slice(0,180);
  const r=await query(
    `insert into student_bibliography_progress(user_id,bibliography_key,subject_slug,section_key,status,completed_at,completed_ranges,current_page,pages_completed,updated_at)
     values($1,$2,$3,$4,$5,case when $5='done' then now() else null end,$6::jsonb,$7,$8,now())
     on conflict(user_id,bibliography_key,section_key) do update set
       subject_slug=excluded.subject_slug,
       status=case when $5='done' then 'done' when $8>0 then 'reading' else excluded.status end,
       completed_at=case when $5='done' then now() else student_bibliography_progress.completed_at end,
       completed_ranges=case when $8>0 then student_bibliography_progress.completed_ranges || $6::jsonb else student_bibliography_progress.completed_ranges end,
       current_page=coalesce($7,student_bibliography_progress.current_page),
       pages_completed=case when $8>0 then student_bibliography_progress.pages_completed+$8 else student_bibliography_progress.pages_completed end,
       updated_at=now() returning *`,
    [userId,bibliographyKey,subjectSlug,sectionKey,status,range,pageTo,pages]
  );
  if(pages>0&&status==="done"){
    await query(
      "insert into student_reading_log(user_id,bibliography_key,subject_slug,section_key,page_from,page_to,pages_completed) values($1,$2,$3,$4,$5,$6,$7) on conflict(user_id,bibliography_key,section_key,page_from,page_to) do nothing",
      [userId,bibliographyKey,subjectSlug,sectionKey,pageFrom,pageTo,pages]
    );
  }
  return r.rows[0];
}
