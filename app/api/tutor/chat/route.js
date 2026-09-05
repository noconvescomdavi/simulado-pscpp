import {getSession} from "../../../../lib/auth";
import {AI_TUTOR_DAILY_LIMIT,ensureConversation,getAiTutorAccess,getTutorConversation,getTutorUsage,saveTutorExchange,tutorSystemPrompt} from "../../../../lib/ai-tutor";

export const dynamic="force-dynamic";

function outputText(payload){
  if(typeof payload?.output_text==="string")return payload.output_text.trim();
  return (payload?.output||[]).flatMap(x=>x?.content||[]).filter(x=>x?.type==="output_text").map(x=>x.text||"").join("\n").trim();
}

function fileSearchSources(payload){
  const found=[];
  for(const item of payload?.output||[]){
    if(item?.type!=="file_search_call")continue;
    for(const result of item?.results||[]){
      const filename=String(result?.filename||result?.file_name||result?.attributes?.filename||"Fonte da bibliografia").trim();
      const fileId=String(result?.file_id||"").trim();
      const score=Number(result?.score||0);
      const key=`${fileId}|${filename}`;
      if(!found.some(x=>x.key===key))found.push({key,file_id:fileId||null,filename,score:Math.round(score*1000)/1000});
    }
  }
  return found.slice(0,8).map(({key,...source})=>source);
}

export async function POST(request){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const access=await getAiTutorAccess(session.id);
  if(!access?.active)return Response.json({error:"O Tutor IA é um pacote adicional de R$ 100/mês.",code:"TUTOR_ADDON_REQUIRED"},{status:403});

  const usage=await getTutorUsage(session.id);
  if(Number(usage.questions)>=AI_TUTOR_DAILY_LIMIT)return Response.json({error:`Limite diário de ${AI_TUTOR_DAILY_LIMIT} perguntas atingido.`,code:"DAILY_LIMIT"},{status:429});

  const body=await request.json().catch(()=>({}));
  const message=String(body.message||"").trim().slice(0,6000);
  if(!message)return Response.json({error:"Escreva uma pergunta."},{status:400});
  const key=String(process.env.OPENAI_API_KEY||"").trim();
  if(!key)return Response.json({error:"Tutor IA ainda não foi ativado pelo administrador."},{status:503});

  const conversationId=await ensureConversation(session.id,body.conversation_id,message);
  const conversation=await getTutorConversation(session.id,conversationId);
  const history=(conversation?.messages||[]).slice(-16).map(m=>({role:m.role,content:m.content}));
  const model=String(process.env.OPENAI_TUTOR_MODEL||"gpt-5.6-luna").trim();
  const vectorStoreId=String(process.env.OPENAI_TUTOR_VECTOR_STORE_ID||"").trim();
  const tools=vectorStoreId?[{type:"file_search",vector_store_ids:[vectorStoreId],max_num_results:8}]:[];

  const response=await fetch("https://api.openai.com/v1/responses",{
    method:"POST",
    headers:{Authorization:`Bearer ${key}`,"Content-Type":"application/json"},
    body:JSON.stringify({
      model,
      instructions:tutorSystemPrompt(),
      input:[...history,{role:"user",content:message}],
      tools,
      include:vectorStoreId?["file_search_call.results"]:undefined,
      max_output_tokens:900,
      store:false
    })
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok){
    console.error("OpenAI Tutor error",response.status,payload?.error?.code||payload?.error?.type||"unknown");
    return Response.json({error:"O Tutor IA está temporariamente indisponível."},{status:502});
  }
  const answer=outputText(payload);
  if(!answer)return Response.json({error:"O Tutor não conseguiu gerar uma resposta."},{status:502});
  const tokenUsage={input_tokens:Number(payload?.usage?.input_tokens||0),output_tokens:Number(payload?.usage?.output_tokens||0)};
  const sources=fileSearchSources(payload);
  await saveTutorExchange(session.id,conversationId,message,answer,tokenUsage,model,sources);
  return Response.json({ok:true,conversation_id:conversationId,answer,sources,remaining:Math.max(0,AI_TUTOR_DAILY_LIMIT-Number(usage.questions)-1)});
}
