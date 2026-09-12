import {getSession} from "../../../../lib/auth";
import {query} from "../../../../lib/db";
import {assertSameOrigin} from "../../../../lib/security";

export async function POST(req){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida"},{status:403});}
  const s=await getSession();
  const b=await req.json().catch(()=>({}));
  const event=String(b.event||"").replace(/[^a-z0-9_:-]/gi,"").slice(0,80);
  if(!event)return Response.json({error:"Evento inválido"},{status:400});
  const meta=b.metadata&&typeof b.metadata==="object"?b.metadata:{};
  await query("insert into product_events(user_id,event_name,metadata) values($1,$2,$3::jsonb)",[s?.id||null,event,JSON.stringify(meta)]).catch(()=>{});
  return Response.json({ok:true});
}
