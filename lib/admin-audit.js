import {query} from "./db";
import {clientIpHash} from "./security";

export async function logAdminAction({admin,action,entityType,entityKey,beforeData=null,afterData=null}){
  if(!admin?.id)return;
  const ipHash=await clientIpHash().catch(()=>null);
  await query(
    "insert into admin_audit_log(actor_user_id,action,entity_type,entity_key,before_data,after_data,ip_hash) values($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7)",
    [admin.id,String(action||"unknown"),entityType||null,entityKey?String(entityKey):null,beforeData?JSON.stringify(beforeData):null,afterData?JSON.stringify(afterData):null,ipHash]
  ).catch(()=>{});
}
