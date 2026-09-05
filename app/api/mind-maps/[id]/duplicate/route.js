import {getSession} from "../../../../../lib/auth";
import {duplicateMindMap} from "../../../../../lib/mind-maps";

export async function POST(_request,{params}){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  const {id}=await params;
  const map=await duplicateMindMap(session.id,id);
  if(!map)return Response.json({error:"Mapa não encontrado"},{status:404});
  return Response.json({ok:true,map},{status:201});
}
