import {accessDeniedResponse,getAccessContext} from "../../../../lib/access";
import {filterQuestionBank,publicQuestion} from "../../../../lib/question-banks";
import {taxonomyCatalog} from "../../../../lib/question-taxonomy";

export const dynamic="force-dynamic";

export async function GET(request,{params}){
  const {session,access,active}=await getAccessContext();
  if(!session)return Response.json({error:"Não autenticado"},{status:401});
  if(!active)return accessDeniedResponse(access);
  const {subject}=await params;
  const url=new URL(request.url);
  const filters={
    bibliography_id:url.searchParams.get("bibliography_id")||undefined,
    chapter_id:url.searchParams.get("chapter_id")||undefined,
    topic_id:url.searchParams.get("topic_id")||undefined,
    subtopic_id:url.searchParams.get("subtopic_id")||undefined,
    difficulty:url.searchParams.get("difficulty")||undefined,
    style:url.searchParams.get("style")||undefined,
    scenario_only:url.searchParams.get("scenario_only")||undefined
  };
  const bank=filterQuestionBank(subject,filters);
  if(!bank)return Response.json({error:"Matéria sem banco de questões"},{status:404});
  return Response.json({...bank,questions:(bank.questions||[]).map(publicQuestion),filters},{
    headers:{"Cache-Control":"private, no-store"}
  });
}
