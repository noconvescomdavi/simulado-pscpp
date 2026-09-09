import {recordAppError} from "../../../../lib/observability";
import {clientIpHash,consumeRateLimit} from "../../../../lib/security";

export async function POST(request){
  const key=await clientIpHash();
  const limit=await consumeRateLimit({action:"client_error",keyHash:key,limit:30,windowSeconds:3600});
  if(!limit.allowed)return new Response(null,{status:204});
  const body=await request.json().catch(()=>({}));
  await recordAppError(String(body.route||"client").slice(0,500),new Error(String(body.message||"Erro do cliente").slice(0,1200)),{
    digest:String(body.digest||"").slice(0,200),
    source:"client"
  });
  return new Response(null,{status:204});
}
