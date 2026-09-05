import { query } from "./db";
import { getQuestion } from "./question-banks";
import { normalizeSubject, subjectLabel } from "./subjects";

const n=(v)=>Number(v||0);
const pct=(c,t)=>t?Math.round((c/t)*1000)/10:0;

export async function trackEvent(userId,eventName,metadata={}){
  await query("insert into product_events(user_id,event_name,metadata) values($1,$2,$3::jsonb)",[
    userId||null,String(eventName).slice(0,80),JSON.stringify(metadata||{})
  ]).catch(()=>{});
}

export async function getTopicAnalytics(userId){
  const r=await query(`select question_id,subject,answer_count,correct_count,error_count,last_answered_at
    from question_stats where user_id=$1 and answer_count>0`,[userId]);
  const map=new Map();
  for(const row of r.rows){
    const subject=normalizeSubject(row.subject);
    const q=getQuestion(subject,row.question_id);
    const topic=q?.topic||"Conteúdo geral";
    const code=q?.topic_code||"";
    const key=`${subject}|${code}|${topic}`;
    const x=map.get(key)||{subject,subject_label:subjectLabel(subject),topic_code:code,topic,answers:0,correct:0,errors:0};
    x.answers+=n(row.answer_count);x.correct+=n(row.correct_count);x.errors+=n(row.error_count);
    map.set(key,x);
  }
  return [...map.values()].map(x=>({...x,accuracy:pct(x.correct,x.answers)}))
    .sort((a,b)=>a.accuracy-b.accuracy||b.errors-a.errors);
}

export async function getReviewQueue(userId,limit=30){
  const analytics=await getTopicAnalytics(userId);
  const weak=analytics.filter(x=>x.errors>0).slice(0,Math.max(1,Math.min(100,limit)));
  return weak.map((x,i)=>({
    ...x,
    priority:Math.round((100-x.accuracy)+Math.min(50,x.errors*5)),
    stage:x.accuracy>=80?"consolidando":x.accuracy>=60?"revisão":"reaprendizagem",
    suggested_questions:x.accuracy<60?20:x.accuracy<80?12:8,
    due_order:i+1,
    href:`/conteudos/banco-de-questoes?subject=${encodeURIComponent(x.subject)}`
  }));
}

export async function getConsistency(userId){
  const [days,totals]=await Promise.all([
    query(`select study_date from study_days where user_id=$1 and activity_count>0 order by study_date desc limit 365`,[userId]),
    query(`select count(*)::int questions,count(*) filter(where is_correct)::int correct from question_answers where user_id=$1`,[userId])
  ]);
  const set=new Set(days.rows.map(r=>new Date(r.study_date).toISOString().slice(0,10)));
  const today=new Date(); let streak=0;
  for(let i=0;i<365;i++){const d=new Date(today);d.setUTCDate(d.getUTCDate()-i);const k=d.toISOString().slice(0,10);if(set.has(k))streak++;else if(i>0)break;}
  const q=n(totals.rows[0]?.questions);
  const badges=[
    {label:"Primeiras 100",earned:q>=100},
    {label:"500 questões",earned:q>=500},
    {label:"1.000 questões",earned:q>=1000},
    {label:"7 dias de consistência",earned:streak>=7},
    {label:"30 dias de consistência",earned:streak>=30},
  ];
  return {streak,study_days:set.size,questions:q,badges};
}
