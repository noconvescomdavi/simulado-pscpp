import {query} from "./db";
import {getQuestion} from "./question-banks";
import {normalizeSubject,subjectLabel,SUBJECTS} from "./subjects";

const n=(v)=>Number(v||0);
const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,Number(v)||0));
const pct=(c,t)=>t?(c/t)*100:0;

function daysSince(value){
  if(!value)return 365;
  return Math.max(0,(Date.now()-new Date(value).getTime())/86400000);
}

function masteryFormula({answers,correct,last_answered_at,stability,review_count,lapse_count}){
  const accuracy=pct(correct,answers);
  const confidence=Math.min(100,Math.sqrt(Math.max(0,answers)/30)*100);
  const recency=Math.max(0,100-daysSince(last_answered_at)*1.2);
  const reviewStrength=Math.min(100,n(stability)*8+n(review_count)*4);
  const lapsePenalty=Math.min(24,n(lapse_count)*4);
  const score=accuracy*.55+confidence*.15+recency*.10+reviewStrength*.20-lapsePenalty;
  return{
    mastery_score:Math.round(clamp(score)*10)/10,
    confidence_score:Math.round(clamp(confidence)*10)/10,
    accuracy:Math.round(clamp(accuracy)*10)/10
  };
}

export async function getTopicMastery(userId,{sync=false}={}){
  const [stats,reviews]=await Promise.all([
    query(`select question_id,subject,answer_count,correct_count,error_count,last_answered_at
      from question_stats where user_id=$1 and answer_count>0`,[userId]),
    query(`select subject_slug,topic_code,source_key,stability,review_count,lapse_count,last_reviewed_at,due_at
      from student_review_queue where user_id=$1 and source_type='topic'`,[userId]).catch(()=>({rows:[]}))
  ]);
  const reviewMap=new Map(reviews.rows.map(r=>[String(r.source_key),r]));
  const groups=new Map();

  for(const row of stats.rows){
    const subject=normalizeSubject(row.subject);
    const q=getQuestion(subject,row.question_id);
    const topic=q?.topic||"Conteúdo geral";
    const topicCode=q?.topic_code||"";
    const key=`${subject}|${topicCode}|${topic}`;
    const x=groups.get(key)||{
      key,subject,subject_label:subjectLabel(subject),topic_code:topicCode,topic,
      answers:0,correct:0,errors:0,last_answered_at:null
    };
    x.answers+=n(row.answer_count);x.correct+=n(row.correct_count);x.errors+=n(row.error_count);
    if(!x.last_answered_at||(row.last_answered_at&&new Date(row.last_answered_at)>new Date(x.last_answered_at)))x.last_answered_at=row.last_answered_at;
    groups.set(key,x);
  }

  const topics=[...groups.values()].map(x=>{
    const review=reviewMap.get(x.key)||{};
    return{
      ...x,
      ...masteryFormula({...x,...review}),
      stability:n(review.stability),
      review_count:n(review.review_count),
      lapse_count:n(review.lapse_count),
      due_at:review.due_at||null,
      last_reviewed_at:review.last_reviewed_at||null
    };
  }).sort((a,b)=>a.mastery_score-b.mastery_score||b.errors-a.errors);

  if(sync&&topics.length){
    for(const x of topics){
      await query(`insert into student_topic_mastery(
        user_id,subject_slug,topic_code,topic_label,mastery_score,confidence_score,accuracy,
        answers,errors,review_count,lapse_count,last_activity_at,updated_at
      ) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,now())
      on conflict(user_id,subject_slug,topic_code,topic_label) do update set
        mastery_score=excluded.mastery_score,confidence_score=excluded.confidence_score,
        accuracy=excluded.accuracy,answers=excluded.answers,errors=excluded.errors,
        review_count=excluded.review_count,lapse_count=excluded.lapse_count,
        last_activity_at=excluded.last_activity_at,updated_at=now()`,[
        userId,x.subject,x.topic_code,x.topic,x.mastery_score,x.confidence_score,x.accuracy,
        x.answers,x.errors,x.review_count,x.lapse_count,x.last_answered_at
      ]).catch(()=>{});
    }
  }
  return topics;
}

export async function getLearningProfile(userId){
  const topics=await getTopicMastery(userId,{sync:false});
  const subjects=SUBJECTS.map(subject=>{
    const rows=topics.filter(x=>x.subject===subject.slug);
    const weight=rows.reduce((sum,x)=>sum+Math.max(1,x.confidence_score),0);
    const mastery=weight?rows.reduce((sum,x)=>sum+x.mastery_score*Math.max(1,x.confidence_score),0)/weight:0;
    return{
      slug:subject.slug,label:subject.label,
      mastery_score:Math.round(mastery*10)/10,
      topics:rows.length,
      critical_topics:rows.filter(x=>x.mastery_score<50).length,
      weakest:rows.slice().sort((a,b)=>a.mastery_score-b.mastery_score).slice(0,3)
    };
  });
  const populated=subjects.filter(x=>x.topics>0);
  const overall=populated.length?Math.round(populated.reduce((s,x)=>s+x.mastery_score,0)/populated.length*10)/10:0;
  return{overall_mastery:overall,subjects,weakest_topics:topics.slice(0,10)};
}

export async function getStudyTimeSummary(userId){
  const r=await query(`select
    coalesce(sum(duration_seconds) filter(where (started_at at time zone 'America/Sao_Paulo')::date=(now() at time zone 'America/Sao_Paulo')::date),0)::int as today_seconds,
    coalesce(sum(duration_seconds) filter(where started_at>=now()-interval '7 days'),0)::int as week_seconds,
    coalesce(sum(duration_seconds) filter(where started_at>=now()-interval '30 days'),0)::int as month_seconds,
    count(*) filter(where started_at>=now()-interval '7 days')::int as week_sessions
    from student_study_sessions where user_id=$1`,[userId]).catch(()=>({rows:[{}]}));
  const x=r.rows[0]||{};
  return{
    today_seconds:n(x.today_seconds),week_seconds:n(x.week_seconds),month_seconds:n(x.month_seconds),
    week_sessions:n(x.week_sessions),
    today_minutes:Math.round(n(x.today_seconds)/60),
    week_minutes:Math.round(n(x.week_seconds)/60),
    month_minutes:Math.round(n(x.month_seconds)/60)
  };
}

export function explainRecommendation({subject,taskType,mastery,accuracy,errors,overdue=false,reprogrammed=false}){
  const reasons=[];
  if(reprogrammed||overdue)reasons.push("pendência anterior que ainda precisa ser recuperada");
  if(Number(mastery)<50)reasons.push("domínio estimado baixo ("+Math.round(Number(mastery)||0)+"%)");
  else if(Number(mastery)<70)reasons.push("domínio estimado ainda instável ("+Math.round(Number(mastery)||0)+"%)");
  if(Number(errors)>=3)reasons.push(Number(errors)+" erros registrados recentemente");
  if(Number(accuracy)>0&&Number(accuracy)<70)reasons.push("acurácia abaixo de 70%");
  if(taskType==="review")reasons.push("revisão necessária para consolidar retenção");
  if(taskType==="reading")reasons.push("avanço necessário na primeira passagem da bibliografia");
  return reasons.length?reasons.join("; "):"equilíbrio entre cobertura, retenção e carga disponível";
}
