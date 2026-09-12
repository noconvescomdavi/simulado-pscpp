import { getSession } from "../../../../lib/auth";
import { getEntitlement } from "../../../../lib/entitlement";
import { getQuestionBank, publicQuestion } from "../../../../lib/question-banks";
import { normalizeSubject } from "../../../../lib/subjects";
import {clientIpHash,consumeRateLimit,rateLimitResponse} from "../../../../lib/security";

function offlineQuestion(question, subject) {
  const safe = publicQuestion(question);
  return {
    ...safe,
    subject: normalizeSubject(subject || safe.subject),
    id: String(question.id),
    correct_answer: String(question.correct_answer || question.answer || "").trim().toUpperCase(),
    explanation: question.explanation || null,
    source: question.source || null,
  };
}

export async function GET(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });

  const entitlement = await getEntitlement(session.id);
  if (!entitlement.active) {
    return Response.json({ error: "Modo offline disponível para alunos com acesso ativo." }, { status: 403 });
  }

  const limit=await clientIpHash().then(keyHash=>consumeRateLimit({action:"offline_chunk",keyHash,limit:240,windowSeconds:3600}));
  if(!limit.allowed)return rateLimitResponse(limit);

  const url = new URL(request.url);
  const subject=normalizeSubject(url.searchParams.get("subject"));
  const offset=Math.max(0,Math.trunc(Number(url.searchParams.get("offset"))||0));
  const requestedLimit=Math.trunc(Number(url.searchParams.get("limit"))||500);
  const take=Math.max(1,Math.min(500,requestedLimit));
  if(!subject)return Response.json({error:"Matéria obrigatória."},{status:400});

  const bank=getQuestionBank(subject);
  if(!bank)return Response.json({error:"Banco de questões não encontrado."},{status:404});
  const all=bank.questions||[];
  const questions=all.slice(offset,offset+take).map(question=>offlineQuestion(question,subject));
  const version=process.env.VERCEL_GIT_COMMIT_SHA||process.env.NEXT_PUBLIC_APP_VERSION||"dev";

  return Response.json({
    version,
    generated_at:new Date().toISOString(),
    subject,
    title:bank.title||subject,
    offset,
    limit:take,
    total_questions:all.length,
    next_offset:offset+questions.length<all.length?offset+questions.length:null,
    questions
  },{headers:{"Cache-Control":"private, no-store, max-age=0"}});
}
