import {getSession} from "../../../../lib/auth";
import {getEntitlement} from "../../../../lib/entitlement";
import {availableQuestionBanks,getQuestionBank} from "../../../../lib/question-banks";
import {clientIpHash,consumeRateLimit,rateLimitResponse} from "../../../../lib/security";

export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active)return Response.json({error:"Modo offline disponível para alunos com acesso ativo."},{status:403});
  const limit=await clientIpHash().then(keyHash=>consumeRateLimit({action:"offline_manifest",keyHash,limit:60,windowSeconds:3600}));
  if(!limit.allowed)return rateLimitResponse(limit);
  const version=process.env.VERCEL_GIT_COMMIT_SHA||process.env.NEXT_PUBLIC_APP_VERSION||"dev";
  const banks=availableQuestionBanks().map(item=>{
    const bank=getQuestionBank(item.slug);
    return {subject:item.slug,title:bank?.title||item.slug,questions:(bank?.questions||[]).length};
  });
  return Response.json({version,generated_at:new Date().toISOString(),chunk_size:500,banks,total_questions:banks.reduce((n,b)=>n+b.questions,0)},{headers:{"Cache-Control":"private, no-store, max-age=0"}});
}
