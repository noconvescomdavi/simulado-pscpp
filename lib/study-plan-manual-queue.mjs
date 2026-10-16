// Pure, timezone-stable rules shared by the manual study queue and its regression tests.
export const isoDay = value => value instanceof Date ? value.toISOString().slice(0,10) : String(value||"").slice(0,10);

export function lastEligibleStudyDate({taskType,fromDate,examDate,firstPassDeadline,studyDays=[]}){
  const end = taskType==="reading" ? (firstPassDeadline<examDate?firstPassDeadline:examDate) : examDate;
  const days = new Set([...studyDays.map(Number),7]);
  const cursor=new Date(end+"T12:00:00Z");
  if(Number.isNaN(cursor.getTime())||!/^\d{4}-\d{2}-\d{2}$/.test(fromDate))return null;
  // The examination day is not an ordinary study day.
  if(isoDay(cursor)>=examDate)cursor.setUTCDate(cursor.getUTCDate()-1);
  while(isoDay(cursor)>=fromDate){
    const isoWeekday=cursor.getUTCDay()===0?7:cursor.getUTCDay();
    if(days.has(isoWeekday)&&(taskType!=="simulado"||isoWeekday===7))return isoDay(cursor);
    cursor.setUTCDate(cursor.getUTCDate()-1);
  }
  return null;
}

export const sourceDate = task => isoDay(task?.source_plan_date||task?.original_plan_date||task?.plan_date);

export function earliestNextPending(items,current,{isDone=()=>false}={}){
  const ordered=[...items].sort((a,b)=>String(a.date).localeCompare(String(b.date))||(a.position||0)-(b.position||0));
  const index=ordered.findIndex(item=>item.id===current.id);
  if(index<0)return null;
  return ordered.slice(index+1).find(item=>item.type===current.type&&!isDone(item))||null;
}

export function classifyDeferred({originalDate,targetDate,currentDate,status}){
  if(status==="done")return "completed";
  if(targetDate>=currentDate)return "scheduled";
  return originalDate<currentDate?"overdue":"scheduled";
}
