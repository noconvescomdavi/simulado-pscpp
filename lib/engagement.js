import { query } from "./db";
import { getQuestion } from "./question-banks";
import { normalizeSubject, subjectLabel } from "./subjects";
import { getTopicMastery } from "./learning-engine";

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
  const [analytics,masteryRows]=await Promise.all([
    getTopicAnalytics(userId),
    getTopicMastery(userId,{sync:true})
  ]);
  const masteryMap=new Map(masteryRows.map(x=>[x.key,x]));
  const weak=analytics.filter(x=>x.errors>0).slice(0,100);

  for(const x of weak){
    const sourceKey=`${x.subject}|${x.topic_code}|${x.topic}`;
    await query(
      `insert into student_review_queue(user_id,subject_slug,topic_code,source_type,source_key,state,due_at)
       values($1,$2,$3,'topic',$4,'new',now())
       on conflict(user_id,source_type,source_key) do nothing`,
      [userId,x.subject,x.topic_code||null,sourceKey]
    ).catch(()=>{});
  }

  const scheduled=await query(
    `select source_key,state,difficulty,stability,review_count,lapse_count,last_reviewed_at,due_at
       from student_review_queue
      where user_id=$1 and source_type='topic' and state<>'suspended'
      order by due_at asc
      limit $2`,
    [userId,Math.max(1,Math.min(100,limit))]
  ).catch(()=>({rows:[]}));

  const byKey=new Map(weak.map(x=>[`${x.subject}|${x.topic_code}|${x.topic}`,x]));
  return scheduled.rows.map((row,i)=>{
    const x=byKey.get(String(row.source_key));
    if(!x)return null;
    const mastery=masteryMap.get(String(row.source_key));
    const masteryScore=Number(mastery?.mastery_score??x.accuracy);
    const priority=Math.round(
      Math.max(0,100-masteryScore)*1.25+
      Math.min(55,x.errors*5)+
      Math.min(25,n(row.lapse_count)*5)+
      (new Date(row.due_at).getTime()<=Date.now()?20:0)
    );
    return {
      ...x,
      source_key:row.source_key,
      mastery_score:masteryScore,
      confidence_score:Number(mastery?.confidence_score||0),
      priority,
      stage:row.state==="new"?(masteryScore<50?"reaprendizagem":"revisão"):row.state,
      suggested_questions:masteryScore<45?24:masteryScore<65?16:masteryScore<80?10:6,
      due_at:row.due_at,
      is_due:new Date(row.due_at).getTime()<=Date.now(),
      review_count:n(row.review_count),
      lapse_count:n(row.lapse_count),
      reason:masteryScore<50?"Domínio crítico: reforço imediato recomendado":n(row.lapse_count)>1?"Reincidência de lapsos: intervalo reduzido":"Revisão programada conforme estabilidade e desempenho",
      due_order:i+1,
      href:`/conteudos/banco-de-questoes?subject=${encodeURIComponent(x.subject)}`
    };
  }).filter(Boolean);
}

export async function completeReview(userId,sourceKey,quality="good"){
  const key=String(sourceKey||"").slice(0,500);
  const current=await query(
    `select difficulty,stability,review_count,lapse_count from student_review_queue
      where user_id=$1 and source_type='topic' and source_key=$2 limit 1`,
    [userId,key]
  );
  if(!current.rows[0])return null;
  const row=current.rows[0];
  const stability=Math.max(1,n(row.stability)||1);
  const lapse=quality==="again";
  const multipliers={again:0,hard:1.25,good:2.4,easy:4.2};
  const minimums={again:1,hard:2,good:5,easy:10};
  const maximums={again:1,hard:21,good:60,easy:120};
  const raw=lapse?1:Math.round(stability*(multipliers[quality]||2.4));
  const days=Math.max(minimums[quality]||5,Math.min(maximums[quality]||60,raw));
  const stabilityDelta=quality==="easy"?Math.max(3,stability*.35):quality==="good"?Math.max(2,stability*.18):quality==="hard"?0.5:-Math.max(1,stability*.35);
  const difficultyDelta=quality==="easy"?-0.7:quality==="hard"?0.5:lapse?1:quality==="good"?-0.15:0;

  const result=await query(
    `update student_review_queue
        set state=$4,
            review_count=review_count+1,
            lapse_count=lapse_count+$5,
            difficulty=greatest(1,least(10,difficulty+$6)),
            stability=greatest(1,stability+$7),
            last_reviewed_at=now(),
            due_at=now()+($3::int * interval '1 day'),
            updated_at=now()
      where user_id=$1 and source_type='topic' and source_key=$2
      returning source_key,state,review_count,lapse_count,difficulty,stability,due_at`,
    [userId,key,days,lapse?"relearning":"review",lapse?1:0,difficultyDelta,stabilityDelta]
  );
  await query(
    "insert into student_plan_events(user_id,event_type,metadata) values($1,'REVIEW_COMPLETED',$2::jsonb)",
    [userId,JSON.stringify({source_key:key,quality,interval_days:days,previous_stability:stability,new_stability:result.rows[0]?.stability||null})]
  ).catch(()=>{});
  await getTopicMastery(userId,{sync:true}).catch(()=>{});
  return result.rows[0]||null;
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
