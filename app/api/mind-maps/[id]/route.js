import {getSession} from "../../../../lib/auth";
import {deleteMindMap,getMindMap,updateMindMap} from "../../../../lib/mind-maps";

export const dynamic="force-dynamic";

export async function GET(_request,{params}){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  const {id}=await params;
  const map=await getMindMap(session.id,id);
  if(!map)return Response.json({error:"Mapa não encontrado"},{status:404});
  return Response.json({map},{headers:{"Cache-Control":"private, no-store"}});
}

export async function PUT(request,{params}){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  const {id}=await params;
  const body=await request.json().catch(()=>({}));
  const map=await updateMindMap(session.id,id,body);
  if(!map)return Response.json({error:"Mapa não encontrado"},{status:404});
  return Response.json({ok:true,map});
}

export async function DELETE(_request,{params}){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  const {id}=await params;
  const ok=await deleteMindMap(session.id,id);
  return Response.json({ok},{status:ok?200:404});
}
