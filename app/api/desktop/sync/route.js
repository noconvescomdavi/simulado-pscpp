import {getSession} from "../../../../lib/auth";
import {desktopLocal,isDesktopRuntime} from "../../../../lib/desktop-local";

export const dynamic="force-dynamic";
export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  if(!isDesktopRuntime())return Response.json({error:"Disponível somente no aplicativo desktop."},{status:404});
  const payload=await desktopLocal("/v1/status");
  return Response.json(payload,{headers:{"Cache-Control":"no-store"}});
}
export async function POST(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  if(!isDesktopRuntime())return Response.json({error:"Disponível somente no aplicativo desktop."},{status:404});
  const payload=await desktopLocal("/v1/sync",{method:"POST",body:{}});
  return Response.json(payload,{status:payload.ok===false?503:200,headers:{"Cache-Control":"no-store"}});
}
