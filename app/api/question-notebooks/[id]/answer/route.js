import {getSession} from "../../../../../lib/auth";
import {getEntitlement} from "../../../../../lib/entitlement";
import {answerNotebook} from "../../../../../lib/notebooks";
import {refreshTopicMasteryForQuestion} from "../../../../../lib/learning-engine";
import {normalizeSubject} from "../../../../../lib/subjects";
import {setPlanTaskStatusAndMetrics} from "../../../../../lib/study-plan-progress";

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

  if(x?.ok){
    await refreshTopicMasteryForQuestion(s.id,normalizeSubject(b.subject),String(b.question_id||"")).catch(()=>{});

    // Sincroniza a tarefa no servidor no mesmo fluxo da última resposta.
    // Assim a conclusão não depende de useEffect, navegação, refresh ou
    // do card estar reprogramado para outro dia.
    if(x?.result?.completed&&b?.plan_task?.plan_date&&b?.plan_task?.task_key){
      try{
        const planResult=await setPlanTaskStatusAndMetrics(s.id,{
          plan_date:String(b.plan_task.plan_date),
          task_key:String(b.plan_task.task_key),
          task_type:String(b.plan_task.task_type||"questions"),
          subject_slug:String(b.plan_task.subject_slug||normalizeSubject(b.subject)||""),
          status:"done",
          metadata:{
            source:"automatic_notebook_completion_server",
            notebook_id:String(id),
            completed_from_answer:true
          }
        });
        x.plan_task={ok:true,item:planResult?.item||null,newly_done:Boolean(planResult?.newly_done)};
      }catch(error){
        console.error("Falha ao concluir tarefa do plano a partir do caderno:",error);
        x.plan_task={ok:false,error:"A questão foi salva, mas a tarefa do plano não pôde ser sincronizada."};
      }
    }
  }
  return Response.json(x,{status:x.status||200});
}
