import { query } from "./db";
import { getUserMetrics } from "./metrics";
import { SUBJECTS } from "./subjects";
import { BIBLIOGRAPHY, EXAM_DATE } from "../data/study/bibliography";

const DAY = 86400000;
const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number(v)||0));
const isoDate=(d)=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(d);

function mondayOf(date=new Date()){
  const d=new Date(date);
  const dow=d.getDay();
  const shift=dow===0?-6:1-dow;
  return new Date(d.getTime()+shift*DAY);
}
function phaseFor(daysLeft){
  if(daysLeft<=30)return{key:"final",label:"Reta final",readingShare:.10,questionsShare:.65};
  if(daysLeft<=120)return{key:"consolidation",label:"Consolidação",readingShare:.20,questionsShare:.55};
  if(daysLeft<=300)return{key:"development",label:"Desenvolvimento",readingShare:.35,questionsShare:.45};
  return{key:"foundation",label:"Construção de base",readingShare:.50,questionsShare:.30};
}
function flattenBibliography(slug){
  return (BIBLIOGRAPHY[slug]||[]).flatMap(entry=>entry.sections.map(section=>({
    bibliography_key:entry.key,publication:entry.title,source:entry.source,
    section_key:section.key,section:section.label,subject_slug:slug
  })));
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
  const r=await query("select user_id,experience_level,started_before,months_studying,daily_minutes,study_days,studied_subjects,confidence_by_subject,notes,completed_at from student_onboarding where user_id=$1 limit 1",[userId]);
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

  const r=await query(
    "insert into student_onboarding(user_id,experience_level,started_before,months_studying,daily_minutes,study_days,studied_subjects,confidence_by_subject,notes,completed_at,updated_at) values($1,$2,$3,$4,$5,$6::smallint[],$7::jsonb,$8::jsonb,$9,now(),now()) on conflict(user_id) do update set experience_level=excluded.experience_level,started_before=excluded.started_before,months_studying=excluded.months_studying,daily_minutes=excluded.daily_minutes,study_days=excluded.study_days,studied_subjects=excluded.studied_subjects,confidence_by_subject=excluded.confidence_by_subject,notes=excluded.notes,completed_at=coalesce(student_onboarding.completed_at,now()),updated_at=now() returning *",
    [userId,experience,input.started_before===true,months,dailyMinutes,safeDays,JSON.stringify(studied),JSON.stringify(confidence),String(input.notes||"").slice(0,2000)||null]
  );
  await query(
    "insert into student_study_goals(user_id,daily_minutes,weekly_questions,target_exam_date,study_days,updated_at) values($1,$2,$3,date '2027-11-01',$4::smallint[],now()) on conflict(user_id) do update set daily_minutes=excluded.daily_minutes,weekly_questions=excluded.weekly_questions,target_exam_date=date '2027-11-01',study_days=excluded.study_days,updated_at=now()",
    [userId,dailyMinutes,Math.max(35,Math.round((dailyMinutes/60)*120)),safeDays]
  );
  return r.rows[0];
}

export async function getIntegratedStudyPlan(userId,weekOffset=0){
  const [onboarding,metrics,bp]=await Promise.all([
    getOnboarding(userId),getUserMetrics(userId),
    query("select bibliography_key,subject_slug,section_key,status,completed_at from student_bibliography_progress where user_id=$1",[userId])
  ]);
  if(!onboarding?.completed_at)return{needs_onboarding:true};

  const today=new Date(), exam=new Date(EXAM_DATE+"T00:00:00-03:00");
  const daysLeft=Math.max(0,Math.ceil((exam-today)/DAY)), weeksLeft=Math.max(1,Math.ceil(daysLeft/7));
  const phase=phaseFor(daysLeft), weekStart=new Date(mondayOf(today).getTime()+Number(weekOffset||0)*7*DAY), weekEnd=new Date(weekStart.getTime()+6*DAY);
  const progressMap=new Map(bp.rows.map(r=>[r.bibliography_key+"|"+r.section_key,r]));
  const studied=onboarding.studied_subjects||[];
  const weighted=metrics.subjects.map(m=>({...m,weight:subjectWeight(m,onboarding,studied)})).sort((a,b)=>b.weight-a.weight);

  const allReading=weighted.flatMap(s=>flattenBibliography(s.slug).map(item=>({...item,weight:s.weight,progress:progressMap.get(item.bibliography_key+"|"+item.section_key)||null})));
  const pendingReading=allReading.filter(x=>x.progress?.status!=="done");
  const studyDays=onboarding.study_days?.length?onboarding.study_days:[1,2,3,4,5,6];
  const dailyMinutes=Number(onboarding.daily_minutes||60);
  const dayObjects=Array.from({length:7},(_,i)=>{
    const date=new Date(weekStart.getTime()+i*DAY), js=date.getDay(), isoDay=js===0?7:js;
    return{date,iso:isoDate(date),isoDay,active:studyDays.includes(isoDay),tasks:[]};
  });

  let readingIndex=Math.max(0,Number(weekOffset||0)*Math.max(1,Math.round(studyDays.length*phase.readingShare))), subjectIndex=0;
  for(const day of dayObjects){
    if(!day.active||day.date>exam)continue;
    const readingMinutes=Math.max(15,Math.round(dailyMinutes*phase.readingShare));
    const questionMinutes=Math.max(20,Math.round(dailyMinutes*phase.questionsShare));
    const reviewMinutes=Math.max(10,dailyMinutes-readingMinutes-questionMinutes);

    if(pendingReading.length){
      const item=pendingReading[readingIndex%pendingReading.length];
      day.tasks.push({
        key:"read|"+item.bibliography_key+"|"+item.section_key,type:"reading",subject:item.subject_slug,
        title:item.publication,description:item.section,minutes:readingMinutes,
        bibliography_key:item.bibliography_key,section_key:item.section_key,href:"/plano-de-estudos"
      });
      readingIndex++;
    }

    const subject=weighted[subjectIndex%weighted.length]; subjectIndex++;
    const targetQuestions=Math.max(10,Math.round(questionMinutes/1.7));
    day.tasks.push({
      key:"questions|"+subject.slug+"|"+day.iso,type:"questions",subject:subject.slug,
      title:targetQuestions+" questões — "+subject.label,
      description:subject.questions?"Aproveitamento atual: "+subject.accuracy+"% em "+subject.questions+" respostas.":"Crie base de desempenho nesta matéria.",
      minutes:questionMinutes,target_questions:targetQuestions,
      href:"/conteudos/banco-de-questoes?materia="+subject.slug
    });

    day.tasks.push({
      key:"review|"+day.iso,type:"review",subject:subject.slug,title:"Revisão inteligente",
      description:"Revise erros e tópicos vencidos antes de avançar.",minutes:reviewMinutes,href:"/revisao-inteligente"
    });

    if(day.isoDay===studyDays[studyDays.length-1]){
      day.tasks.push({
        key:"weekly-exam|"+day.iso,type:"simulado",subject:weighted[0]?.slug||SUBJECTS[0].slug,
        title:phase.key==="final"?"Simulado PSCPP da semana":"Simulado de consolidação",
        description:"Feche a semana medindo desempenho e recalibrando o próximo ciclo.",
        minutes:Math.max(45,dailyMinutes),href:"/simulado"
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
  const bibliographyTotal=Object.keys(BIBLIOGRAPHY).flatMap(flattenBibliography).length;
  const bibliographyScore=bibliographyTotal?(bibliographyDone/bibliographyTotal)*100:0;
  const readiness=Math.round(clamp(accuracy,0,100)*.45+volumeScore*.25+coverageScore*.15+bibliographyScore*.15);

  return{
    needs_onboarding:false,exam_date:EXAM_DATE,days_left:daysLeft,weeks_left:weeksLeft,phase,
    week:{start:minDate,end:maxDate,offset:Number(weekOffset||0),days:dayObjects},
    onboarding,metrics,weighted_subjects:weighted,bibliography:allReading,
    bibliography_progress:{done:bibliographyDone,total:bibliographyTotal,percent:bibliographyTotal?Math.round((bibliographyDone/bibliographyTotal)*100):0},
    readiness,
    phases:[
      {label:"Construção de base",from:"Cadastro",to:"T-300 dias",focus:"Bibliografia + fundamentos + questões leves"},
      {label:"Desenvolvimento",from:"T-300",to:"T-120 dias",focus:"Cobertura total + questões por matéria + revisão"},
      {label:"Consolidação",from:"T-120",to:"T-30 dias",focus:"Alta carga de questões + simulados + erros"},
      {label:"Reta final",from:"T-30",to:"01/11/2027",focus:"Simulados, revisão espaçada e pontos fracos"}
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
  const r=await query(
    "insert into student_bibliography_progress(user_id,bibliography_key,subject_slug,section_key,status,completed_at,updated_at) values($1,$2,$3,$4,$5,case when $5='done' then now() else null end,now()) on conflict(user_id,bibliography_key,section_key) do update set subject_slug=excluded.subject_slug,status=excluded.status,completed_at=case when excluded.status='done' then now() else null end,updated_at=now() returning *",
    [userId,String(input.bibliography_key||"").slice(0,180),String(input.subject_slug||"").slice(0,120),String(input.section_key||"").slice(0,180),status]
  );
  return r.rows[0];
}
