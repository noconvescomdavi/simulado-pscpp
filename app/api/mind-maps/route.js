import {getSession} from "../../../lib/auth";
import {createMindMap,listMindMaps} from "../../../lib/mind-maps";
import {assertSameOrigin} from "../../../lib/security";

export const dynamic="force-dynamic";

export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  return Response.json({maps:await listMindMaps(session.id)},{headers:{"Cache-Control":"private, no-store"}});
}

export async function POST(request) {
  try { await assertSameOrigin(); } catch (error) { return Response.json({error:"Origem inválida."},{status:Number(error?.status)||403}); }
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  const body=await request.json().catch(()=>({}));
  const map=await createMindMap(session.id,body);
  return Response.json({ok:true,map},{status:201});
}
