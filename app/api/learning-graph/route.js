import {getSession} from "../../../lib/auth";
import {getLearningGraph} from "../../../lib/learning-graph";

export const dynamic="force-dynamic";

export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const graph=await getLearningGraph(session.id);
    return Response.json(graph,{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    console.error("Erro ao montar grafo de aprendizagem:",error);
    return Response.json({error:"Não foi possível montar o grafo de aprendizagem."},{status:500});
  }
}
