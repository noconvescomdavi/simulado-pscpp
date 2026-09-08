import { getSession } from "../../../../lib/auth";
import { getIntegratedStudyPlan } from "../../../../lib/integrated-study-plan";
import { persistStudyPlanSnapshot } from "../../../../lib/study-plan-snapshot";

export async function POST(req){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const body=await req.json().catch(()=>({}));
    const week=Math.max(-8,Math.min(80,Number(body.week||0)));
    const plan=await getIntegratedStudyPlan(session.id,week);
    if(plan.needs_onboarding)return Response.json({error:"Questionário inicial pendente."},{status:409});
    const result=await persistStudyPlanSnapshot(session.id,plan);
    return Response.json({ok:true,created:result.created,snapshot_id:result.snapshot?.id||null});
  }catch(error){
    console.error("Erro ao congelar plano semanal:",error);
    return Response.json({error:"Não foi possível preservar o planejamento semanal."},{status:500});
  }
}
