import {query} from "./db";

export const DEFAULT_PREFERENCES={
  session_minutes:45,
  study_mode:"balanced",
  dashboard_density:"standard",
  smart_nudges:true,
  prioritize_due_reviews:true
};

export async function getStudentPreferences(userId){
  const r=await query("select session_minutes,study_mode,dashboard_density,smart_nudges,prioritize_due_reviews from student_preferences where user_id=$1 limit 1",[userId]).catch(()=>({rows:[]}));
  return {...DEFAULT_PREFERENCES,...(r.rows[0]||{})};
}

export async function saveStudentPreferences(userId,input={}){
  const sessionMinutes=Math.max(15,Math.min(180,Number(input.session_minutes)||45));
  const studyMode=["balanced","questions","reading","review"].includes(input.study_mode)?input.study_mode:"balanced";
  const density=["compact","standard","detailed"].includes(input.dashboard_density)?input.dashboard_density:"standard";
  const nudges=input.smart_nudges!==false;
  const due=input.prioritize_due_reviews!==false;
  const r=await query(`insert into student_preferences(user_id,session_minutes,study_mode,dashboard_density,smart_nudges,prioritize_due_reviews,updated_at)
    values($1,$2,$3,$4,$5,$6,now())
    on conflict(user_id) do update set session_minutes=excluded.session_minutes,study_mode=excluded.study_mode,
    dashboard_density=excluded.dashboard_density,smart_nudges=excluded.smart_nudges,
    prioritize_due_reviews=excluded.prioritize_due_reviews,updated_at=now()
    returning session_minutes,study_mode,dashboard_density,smart_nudges,prioritize_due_reviews`,
    [userId,sessionMinutes,studyMode,density,nudges,due]);
  return r.rows[0];
}
