import {getSession} from "../../../lib/auth";
import {completeReview,getReviewQueue} from "../../../lib/engagement";
import {assertSameOrigin} from "../../../lib/security";

export const dynamic="force-dynamic";

export async function GET(){
  const s=await getSession();
  if(!s)return Response.json({error:"Não autenticado"},{status:401});
  return Response.json({items:await getReviewQueue(s.id,50)},{headers:{"Cache-Control":"private, no-store"}});
}

export async function POST(request) {
  try { await assertSameOrigin(); } catch (error) { return Response.json({error:"Origem inválida."},{status:Number(error?.status)||403}); }
  const s=await getSession();
  if(!s)return Response.json({error:"Não autenticado"},{status:401});
  const body=await request.json().catch(()=>({}));
  const quality=["again","hard","good","easy"].includes(body.quality)?body.quality:"good";
  const item=await completeReview(s.id,body.source_key,quality);
  if(!item)return Response.json({error:"Item de revisão não encontrado."},{status:404});
  return Response.json({ok:true,item});
}
