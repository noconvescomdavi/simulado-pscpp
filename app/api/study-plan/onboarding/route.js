import { getSession } from "../../../../lib/auth";
import { getOnboarding, saveOnboarding } from "../../../../lib/integrated-study-plan";

export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const onboarding=await getOnboarding(session.id);
  return Response.json({onboarding});
}

export async function POST(req){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const body=await req.json();
    const onboarding=await saveOnboarding(session.id,body);
    return Response.json({ok:true,onboarding});
  }catch(error){
    console.error("Erro ao salvar onboarding:",error);
    return Response.json({error:"Não foi possível salvar o questionário."},{status:500});
  }
}
