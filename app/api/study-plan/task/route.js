import { getSession } from "../../../../lib/auth";
import { setPlanTaskStatus, setBibliographyStatus } from "../../../../lib/integrated-study-plan";

export async function POST(req){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const body=await req.json();
    if(body.kind==="bibliography"){
      const item=await setBibliographyStatus(session.id,body);
      return Response.json({ok:true,item});
    }
    const item=await setPlanTaskStatus(session.id,body);
    return Response.json({ok:true,item});
  }catch(error){
    console.error("Erro ao atualizar plano:",error);
    return Response.json({error:"Não foi possível atualizar a tarefa."},{status:500});
  }
}
