import {getSession} from "../../../../../lib/auth";
import {getEntitlement} from "../../../../../lib/entitlement";
import {answerNotebook} from "../../../../../lib/notebooks";

export async function POST(r,{params}){
  const s=await getSession();
  if(!s)return Response.json({error:"Não autenticado."},{status:401});

  const entitlement=await getEntitlement(s.id);
  if(!entitlement.active&&!entitlement.trial){
    return Response.json({error:"Acesso inativo."},{status:403});
  }

  const {id}=await params;
  const b=await r.json().catch(()=>({}));
  const x=await answerNotebook({
    userId:s.id,
    notebookId:id,
    subject:b.subject,
    questionId:b.question_id,
    selectedAnswer:b.selected_answer
  });

  return Response.json(x,{status:x.status||200});
}
