import {getSession} from "../../../../lib/auth";
import {withTransaction} from "../../../../lib/db";
import {getDesktopBearerSession} from "../../../../lib/desktop-auth-token";

const ALLOWED=new Set(["study_progress","exam_session","question_answer","question_notebook","study_plan_item","student_preferences"]);
const MAX_EVENTS=200;
function safeCursor(v){const n=Number(v);return Number.isSafeInteger(n)&&n>=0?n:0}
function normalizeEvent(raw){
 const id=String(raw?.id||"").slice(0,180),entity_type=String(raw?.entity_type||"").slice(0,80),entity_id=String(raw?.entity_id||"").slice(0,180);
 if(!id||!entity_id||!ALLOWED.has(entity_type))return null;
 return{id,device_id:String(raw.device_id||"").slice(0,180),entity_type,entity_id,operation:raw.operation==="delete"?"delete":"upsert",base_version:Math.max(0,Number(raw.base_version)||0),payload:raw.payload&&typeof raw.payload==="object"?raw.payload:{},created_at:raw.created_at||null};
}
export async function POST(request){
 const session=(await getDesktopBearerSession(request))||(await getSession());if(!session)return Response.json({error:"Não autenticado."},{status:401});
 const body=await request.json().catch(()=>({}));if(Number(body.protocol_version)!==1)return Response.json({error:"Versão de sincronização incompatível.",code:"SYNC_PROTOCOL_VERSION"},{status:409});
 if(session.desktopToken){
  if(body.device_id!==session.deviceId)return Response.json({error:"Dispositivo inválido."},{status:403});
  const {query}=await import("../../../../lib/db");
  const account=await query("select status,session_version,role from users where id=$1 limit 1",[session.id]);
  const user=account.rows[0];
  if(!user||user.status!=="active"||user.role==="admin"||Number(user.session_version||1)!==session.sessionVersion)return Response.json({error:"Sessão revogada."},{status:401});
 }
 const events=(Array.isArray(body.events)?body.events:[]).slice(0,MAX_EVENTS).map(normalizeEvent).filter(Boolean),cursor=safeCursor(body.cursor);
 if(events.some(event=>event.device_id!==body.device_id||event.payload.user_id&&String(event.payload.user_id)!==String(session.id)))
  return Response.json({error:"Evento não pertence à conta ou ao dispositivo."},{status:403});
 try{
  const payload=await withTransaction(async client=>{
   const results=[];
   for(const event of events){
    const duplicate=await client.query("select result from offline_sync_events where user_id=$1 and event_id=$2",[session.id,event.id]);
    if(duplicate.rowCount){results.push({id:event.id,status:"duplicate",...(duplicate.rows[0].result||{})});continue}
    const currentResult=await client.query("select version,payload from sync_entity_versions where user_id=$1 and entity_type=$2 and entity_id=$3 for update",[session.id,event.entity_type,event.entity_id]);
    const current=currentResult.rows[0]||null,currentVersion=Number(current?.version||0);
    if(current&&event.base_version<currentVersion){
      const result={id:event.id,status:"conflict",entity_type:event.entity_type,entity_id:event.entity_id,local_version:event.base_version,remote_version:currentVersion,local_payload:event.payload,remote_payload:current.payload};
      await client.query("insert into offline_sync_events(user_id,event_id,event_type,device_id,result) values($1,$2,$3,$4,$5::jsonb)",[session.id,event.id,event.entity_type,event.device_id,JSON.stringify(result)]);
      results.push(result);continue;
    }
    const next=currentVersion+1;
    const storedPayload=event.operation==="delete"?{}:{...event.payload,user_id:String(session.id),version:next,updated_at:new Date().toISOString()};
    await client.query(`insert into sync_entity_versions(user_id,entity_type,entity_id,version,payload,updated_at) values($1,$2,$3,$4,$5::jsonb,now())
      on conflict(user_id,entity_type,entity_id) do update set version=excluded.version,payload=excluded.payload,updated_at=now()`,[session.id,event.entity_type,event.entity_id,next,JSON.stringify(storedPayload)]);
    const change=await client.query("insert into sync_change_log(user_id,entity_type,entity_id,version,operation,payload) values($1,$2,$3,$4,$5,$6::jsonb) returning seq",[session.id,event.entity_type,event.entity_id,next,event.operation,JSON.stringify(storedPayload)]);
    const result={id:event.id,status:"applied",entity_type:event.entity_type,entity_id:event.entity_id,version:next,seq:Number(change.rows[0].seq)};
    await client.query("insert into offline_sync_events(user_id,event_id,event_type,device_id,result) values($1,$2,$3,$4,$5::jsonb)",[session.id,event.id,event.entity_type,event.device_id,JSON.stringify(result)]);
    results.push(result);
   }
   const changes=await client.query("select seq,entity_type,entity_id,version,operation,payload,changed_at from sync_change_log where user_id=$1 and seq>$2 order by seq asc limit 500",[session.id,cursor]);
   const newCursor=changes.rows.length?Number(changes.rows[changes.rows.length-1].seq):cursor;
   return{protocol_version:1,results,changes:changes.rows,cursor:String(newCursor),has_more:changes.rows.length===500};
  });
  return Response.json(payload,{headers:{"Cache-Control":"no-store"}});
 }catch(error){console.error("Sync v1:",error);return Response.json({error:"Falha ao sincronizar.",code:"SYNC_FAILED"},{status:500})}
}
