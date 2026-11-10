import {query} from "./db";
import {buildStudyActivityCalendar} from "./study-activity-calendar.mjs";

const brasilDate=new Intl.DateTimeFormat("en-US",{
  timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"
});

function todayInBrazil(){
  const values=Object.fromEntries(brasilDate.formatToParts(new Date()).map(x=>[x.type,x.value]));
  return values.year+"-"+values.month+"-"+values.day;
}

export async function getStudyActivityCalendar(userId){
  const today=todayInBrazil();
  const start=(Number(today.slice(0,4))-1)+"-01-01";
  let sessionRows;
  try{
    const result=await query(`select
      to_char(started_at at time zone 'America/Sao_Paulo','YYYY-MM-DD') as day,
      coalesce(sum(greatest(duration_seconds,0)),0)::bigint as seconds,
      count(*)::int as session_count
      from student_study_sessions
      where user_id=$1
        and started_at >= ($2::date at time zone 'America/Sao_Paulo')
      group by 1
      order by 1`,[userId,start]);
    sessionRows=result.rows;
  }catch(error){
    console.error("[study-activity] Não foi possível consultar sessões",error);
    return {available:false,today,years:[Number(today.slice(0,4))-1,Number(today.slice(0,4))],days:{}};
  }
  // A atividade por questões aparece separada do tempo cronometrado:
  // nunca atribuímos minutos artificiais a esses registros.
  const [activityResult,restResult,profileResult]=await Promise.all([
    query("select study_date::text as day, activity_count from study_days where user_id=$1 and study_date >= $2::date order by study_date",[userId,start]).catch(()=>({rows:[]})),
    query("select plan_date::text as day from student_plan_unavailability where user_id=$1 and plan_date >= $2::date",[userId,start]).catch(()=>({rows:[]})),
    query("select study_days from student_onboarding where user_id=$1 limit 1",[userId]).catch(()=>({rows:[]}))
  ]);
  const studyWeekdays=profileResult.rows[0]?.study_days||null;
  return {
    available:true,
    ...buildStudyActivityCalendar({
      today,
      sessions:sessionRows,
      activities:activityResult.rows,
      unavailability:restResult.rows,
      studyWeekdays
    })
  };
}
