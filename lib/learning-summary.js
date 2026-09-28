import {query} from "./db";
const n=v=>Number(v||0);
export async function getStudyTimeSummary(userId){
  const r=await query(`select
    coalesce(sum(duration_seconds) filter(where (started_at at time zone 'America/Sao_Paulo')::date=(now() at time zone 'America/Sao_Paulo')::date),0)::int as today_seconds,
    coalesce(sum(duration_seconds) filter(where started_at>=now()-interval '7 days'),0)::int as week_seconds,
    coalesce(sum(duration_seconds) filter(where started_at>=now()-interval '30 days'),0)::int as month_seconds,
    count(*) filter(where started_at>=now()-interval '7 days')::int as week_sessions
    from student_study_sessions where user_id=$1`,[userId]).catch(()=>({rows:[{}]}));
  const x=r.rows[0]||{};
  return{today_seconds:n(x.today_seconds),week_seconds:n(x.week_seconds),month_seconds:n(x.month_seconds),
    week_sessions:n(x.week_sessions),today_minutes:Math.round(n(x.today_seconds)/60),
    week_minutes:Math.round(n(x.week_seconds)/60),month_minutes:Math.round(n(x.month_seconds)/60)};
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
export function readinessFromProfile(profile={}){
  const rows=(profile.subjects||[]).filter(x=>Number(x.topics)>0);
  if(!rows.length)return 0;
  const weighted=rows.reduce((sum,x)=>sum+Number(x.mastery_score||0)*Math.max(1,Number(x.topics||0)),0);
  const weight=rows.reduce((sum,x)=>sum+Math.max(1,Number(x.topics||0)),0);
  return Math.round(Math.max(0,Math.min(100,weighted/weight)));
}
