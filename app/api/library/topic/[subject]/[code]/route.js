import {getAccessContext,accessDeniedResponse} from "../../../../../../lib/access";
import {getTopicSources} from "../../../../../../lib/library";
export const dynamic="force-dynamic";
export async function GET(_request,{params}){
  const {session,access,active}=await getAccessContext();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  if(!active)return accessDeniedResponse(access);
  const {subject,code}=await params;
  return Response.json(await getTopicSources(decodeURIComponent(subject),decodeURIComponent(code)),{headers:{"Cache-Control":"private, no-store"}})
}
