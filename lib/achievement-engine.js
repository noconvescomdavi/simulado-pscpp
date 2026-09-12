import {query} from "./db";

async function unlock(userId,code){
  await query(`insert into user_achievements(user_id,achievement_id)
    select $1,id from achievements where code=$2
    on conflict(user_id,achievement_id) do nothing`,[userId,code]).catch(()=>{});
}
export async function evaluateAchievements(userId,{examResult=null}={}){
  const [questions,days,progress]=await Promise.all([
    query("select count(*)::int n from question_answers where user_id=$1",[userId]).catch(()=>({rows:[{n:0}]})),
    query("select count(*)::int n from study_days where user_id=$1",[userId]).catch(()=>({rows:[{n:0}]})),
    query("select count(*) filter(where percent>=100)::int done,count(*)::int total from study_progress where user_id=$1",[userId]).catch(()=>({rows:[{done:0,total:0}]}))
  ]);
  const q=Number(questions.rows[0]?.n||0),d=Number(days.rows[0]?.n||0),p=progress.rows[0]||{};
  if(q>=1000)await unlock(userId,"THOUSAND_QUESTIONS");
  if(d>=7)await unlock(userId,"SEVEN_DAYS");
  if(Number(p.total)>=7&&Number(p.done)>=7)await unlock(userId,"COMPLETE_COURSE");
  if(examResult){
    await unlock(userId,"FIRST_EXAM");
    const score=Number(examResult.score_percent||0);
    if(score>=80)await unlock(userId,"ACCURACY_80");
    if(score>=90)await unlock(userId,"ACCURACY_90");
    if(score>=100)await unlock(userId,"PERFECT_EXAM");
  }
}
