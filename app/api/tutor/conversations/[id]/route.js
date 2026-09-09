import {getSession} from "../../../../../lib/auth";
import {query} from "../../../../../lib/db";
import {assertSameOrigin,consumeRateLimit,identityHash,rateLimitResponse} from "../../../../../lib/security";
export const dynamic="force-dynamic";
export async function DELETE(request,{params}){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403});}
  const session=await getSession(); if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const limit=await consumeRateLimit({action:"delete_tutor_conversation",keyHash:identityHash(session.id),limit:30,windowSeconds:3600});
  if(!limit.allowed)return rateLimitResponse(limit);
  const {id}=await params; if(!/^[0-9a-f-]{36}$/i.test(String(id||"")))return Response.json({error:"Conversa inválida."},{status:400});
  const result=await query("delete from ai_tutor_conversations where id=$1 and user_id=$2 returning id",[id,session.id]);
  if(!result.rows[0])return Response.json({error:"Conversa não encontrada."},{status:404});
  return Response.json({ok:true});
}