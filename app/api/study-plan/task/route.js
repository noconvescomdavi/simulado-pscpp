import { getSession } from "../../../../lib/auth";
import {
  setBibliographyStatusAndMetrics,
  setPlanTaskStatusAndMetrics,
} from "../../../../lib/study-plan-progress";

export async function POST(req){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const body=await req.json();
    if(body.kind==="bibliography"){
      const result=await setBibliographyStatusAndMetrics(session.id,body);
      return Response.json({ok:true,...result});
    }
    const result=await setPlanTaskStatusAndMetrics(session.id,body);
    return Response.json({ok:true,...result});
  }catch(error){
    console.error("Erro ao atualizar plano:",error);
    return Response.json({error:"Não foi possível atualizar a tarefa."},{status:500});
  }
}
