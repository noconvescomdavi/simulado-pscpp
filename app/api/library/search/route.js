import {getAccessContext,accessDeniedResponse} from "../../../../lib/access";
import {searchLibrary} from "../../../../lib/library";
export const dynamic="force-dynamic";
export async function GET(request){
  const {session,access,active}=await getAccessContext();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  if(!active)return accessDeniedResponse(access);
  const u=new URL(request.url);
  return Response.json({results:await searchLibrary({q:u.searchParams.get("q")||"",subject:u.searchParams.get("subject")||"",limit:u.searchParams.get("limit")||20})},{headers:{"Cache-Control":"private, no-store"}})
}
