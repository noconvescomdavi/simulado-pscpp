import {query} from "./db";

export async function recordAppError(route,error,metadata={}){
  const message=String(error?.message||error||"Erro desconhecido").slice(0,2000);
  const code=String(error?.code||error?.name||"UNHANDLED").slice(0,120);
  await query(
    "insert into app_error_events(route,error_code,message,metadata) values($1,$2,$3,$4::jsonb)",
    [String(route||"").slice(0,500),code,message,JSON.stringify(metadata||{})]
  ).catch(()=>{});
}
