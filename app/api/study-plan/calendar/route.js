import { ACCESS_FEATURES,canUseFeature,getEntitlement } from "../../../../lib/entitlement";
import { getSession } from "../../../../lib/auth";
import { getIntegratedStudyPlan } from "../../../../lib/integrated-study-plan";
export const dynamic="force-dynamic";
const utc=date=>new Date(date+"T12:00:00Z");
const iso=date=>date.toISOString().slice(0,10);
const monday=date=>{const d=new Date(date);d.setUTCDate(d.getUTCDate()-((d.getUTCDay()+6)%7));return d};
const today=()=>new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date());
export async function GET(request){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  if(!canUseFeature(await getEntitlement(session.id),ACCESS_FEATURES.STUDY_PLAN))return Response.json({error:"Acesso ao plano de estudos não autorizado."},{status:403});
  const month=new URL(request.url).searchParams.get("month");
  if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(month||""))
    return Response.json({error:"Mês inválido."},{status:400});
  const first=monday(utc(month+"-01")),last=utc(month+"-01");
  last.setUTCMonth(last.getUTCMonth()+1);last.setUTCDate(last.getUTCDate()-1);
  const end=monday(last),base=monday(utc(today()));
  const offsets=[];
  for(let date=new Date(first);date<=end;date.setUTCDate(date.getUTCDate()+7)){
    const offset=Math.round((date.getTime()-base.getTime())/(7*86400000));
    if(offset>=-8&&offset<=80)offsets.push(offset);
  }
  try{
    const plans=await Promise.all(offsets.map(offset=>getIntegratedStudyPlan(session.id,offset)));
    if(plans.some(plan=>plan.needs_onboarding))return Response.json({error:"Questionário inicial pendente."},{status:409});
    const days=plans.flatMap(plan=>plan.week.days.map(day=>({
      date:day.iso,offset:plan.week.offset,active:day.active,unavailable:Boolean(day.unavailable),
      total:day.tasks.length,done:day.tasks.filter(task=>task.status==="done").length,
      postponed:day.tasks.filter(task=>task.postponed_manually).length,
      tasks:day.tasks.map(task=>({key:task.key,type:task.type,title:task.title,status:task.status,
        source_plan_date:task.source_plan_date||day.iso,postponed:task.postponed_manually===true}))
    })));
    return Response.json({ok:true,month,days},{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    console.error("[study-plan-calendar]",error);
    return Response.json({error:"Não foi possível carregar o calendário."},{status:500});
  }
}
