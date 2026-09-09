import {query} from "../../../../lib/db";
import {clientIpHash,consumeRateLimit} from "../../../../lib/security";

const ALLOWED=new Set(["CLS","FCP","INP","LCP","TTFB"]);

export async function POST(request){
  const key=await clientIpHash();
  const limit=await consumeRateLimit({action:"web_vitals",keyHash:key,limit:120,windowSeconds:3600});
  if(!limit.allowed)return new Response(null,{status:204});
  const body=await request.json().catch(()=>({}));
  const name=String(body.name||"").toUpperCase();
  const value=Number(body.value);
  if(!ALLOWED.has(name)||!Number.isFinite(value))return Response.json({error:"Métrica inválida."},{status:400});
  await query(
    "insert into app_performance_events(metric_name,metric_value,rating,route,navigation_type,metadata) values($1,$2,$3,$4,$5,$6::jsonb)",
    [name,value,String(body.rating||"").slice(0,24),String(body.route||"").slice(0,500),String(body.navigationType||"").slice(0,50),JSON.stringify({})]
  ).catch(()=>{});
  return new Response(null,{status:204});
}
