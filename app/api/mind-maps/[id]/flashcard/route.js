import {getSession} from "../../../../../lib/auth";
import {upsertMapFlashcard} from "../../../../../lib/mind-maps";
import {assertSameOrigin} from "../../../../../lib/security";

export async function POST(request,{params}) {
  try { await assertSameOrigin(); } catch (error) { return Response.json({error:"Origem inválida."},{status:Number(error?.status)||403}); }
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  const {id}=await params;
  const body=await request.json().catch(()=>({}));
  const card=await upsertMapFlashcard(session.id,id,body);
  if(!card)return Response.json({error:"Mapa ou nó não encontrado"},{status:404});
  if(card.error)return Response.json({error:card.error},{status:400});
  return Response.json({ok:true,card});
}
