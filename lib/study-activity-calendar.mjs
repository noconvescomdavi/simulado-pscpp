// Utilitários puros do painel de constância. Datas em YYYY-MM-DD no fuso America/Sao_Paulo.
const ISO_DATE=/^\d{4}-\d{2}-\d{2}$/;
export const MIN_STUDY_SECONDS=15*60;

export function isoDateUTC(date){return date.toISOString().slice(0,10);}
export function nextISO(iso,offset=1){
  if(!ISO_DATE.test(iso))throw new Error("Data ISO inválida");
  const [year,month,day]=iso.split("-").map(Number);
  const date=new Date(Date.UTC(year,month-1,day+offset,12));
  return isoDateUTC(date);
}
export function weekdayISO(iso){
  const [year,month,day]=iso.split("-").map(Number);
  const dayOfWeek=new Date(Date.UTC(year,month-1,day,12)).getUTCDay();
  return dayOfWeek===0?7:dayOfWeek;
}
export function dateRange(start,end){
  const result=[];
  for(let date=start;date<=end;date=nextISO(date))result.push(date);
  return result;
}

export function buildStudyActivityCalendar({today,sessions=[],activities=[],unavailability=[],studyWeekdays=null}){
  if(!ISO_DATE.test(today))throw new Error("Dia atual inválido");
  const year=Number(today.slice(0,4));
  const start=(year-1)+"-01-01";
  const end=year+"-12-31";
  // Sem agenda configurada, não presumimos folgas.
  const scheduled=Array.isArray(studyWeekdays)&&studyWeekdays.length
    ?new Set(studyWeekdays.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=7))
    :new Set([1,2,3,4,5,6,7]);
  const times=new Map();
  for(const row of sessions){
    const day=String(row.day||"").slice(0,10);
    if(!ISO_DATE.test(day))continue;
    const prev=times.get(day)||{seconds:0,sessions:0};
    prev.seconds+=Math.max(0,Number(row.seconds)||0);
    prev.sessions+=Math.max(0,Number(row.session_count)||0);
    times.set(day,prev);
  }
  const counts=new Map();
  for(const row of activities){
    const day=String(row.day||"").slice(0,10);
    if(ISO_DATE.test(day))counts.set(day,(counts.get(day)||0)+Math.max(0,Number(row.activity_count)||0));
  }
  const daysOff=new Set(unavailability.map(row=>String(row.day||"").slice(0,10)).filter(day=>ISO_DATE.test(day)));
  const days={};
  let totalSeconds=0, qualifiedDays=0, activityDays=0;
  const qualified=new Set();
  for(const iso of dateRange(start,end)){
    const session=times.get(iso)||{seconds:0,sessions:0};
    const seconds=Math.round(session.seconds);
    const activityCount=counts.get(iso)||0;
    const rest=daysOff.has(iso)||!scheduled.has(weekdayISO(iso));
    const future=iso>today;
    let state="none";
    if(future)state="future";
    else if(seconds>=MIN_STUDY_SECONDS){state=seconds>=7200?"very-high":seconds>=3600?"high":"qualified";qualified.add(iso);qualifiedDays++;}
    else if(seconds>0)state="short";
    else if(activityCount>0)state="unmeasured";
    else if(rest)state="rest";
    days[iso]={seconds,sessions:session.sessions,activity_count:activityCount,rest,future,state};
    if(!future){
      totalSeconds+=seconds;
      if(seconds>0||activityCount>0)activityDays++;
    }
  }
  // Folgas previstas não quebram sequência, mas também não contam como dias estudados.
  // Hoje ainda não concluído não faz a sequência anterior desaparecer.
  let streak=0, started=false;
  for(let iso=today;iso>=start;iso=nextISO(iso,-1)){
    const day=days[iso];
    if(qualified.has(iso)){streak++;started=true;continue;}
    if(day?.rest)continue;
    if(iso===today&&!started)continue;
    break;
  }
  let longest=0, count=0;
  for(let iso=start;iso<=today;iso=nextISO(iso)){
    if(qualified.has(iso)){count++;longest=Math.max(longest,count);}
    else if(!days[iso]?.rest)count=0;
  }
  return {
    today,years:[year-1,year],days,streak,longest,
    total_seconds:totalSeconds,qualified_days:qualifiedDays,activity_days:activityDays,
    min_study_seconds:MIN_STUDY_SECONDS,
    // Exposição da agenda apenas para explicar folgas, sem alterar dados históricos.
    scheduled_weekdays:[...scheduled].sort((a,b)=>a-b)
  };
}
