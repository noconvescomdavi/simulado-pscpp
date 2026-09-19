import { getSession } from "../../../../lib/auth";
import { getEntitlement } from "../../../../lib/entitlement";
import { availableQuestionBanks, getQuestionBank, publicQuestion } from "../../../../lib/question-banks";
import { normalizeSubject } from "../../../../lib/subjects";

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

  const url = new URL(request.url);
  const requested = String(url.searchParams.get("subjects") || "")
    .split(",")
    .map(normalizeSubject)
    .filter(Boolean);

  const available = availableQuestionBanks({ includePscpp: true }).map((item) => item.slug);
  const subjects = [...new Set((requested.length ? requested : available).filter((slug) => available.includes(slug)))];

  const offset = Math.max(0, Math.trunc(Number(url.searchParams.get("offset")) || 0));
  const limit = Math.max(25, Math.min(200, Math.trunc(Number(url.searchParams.get("limit")) || 100)));

  const banks = subjects.map((subject) => {
    const bank = getQuestionBank(subject);
    const allQuestions = bank?.questions || [];
    const questions = allQuestions.slice(offset, offset + limit).map((question) => offlineQuestion(question, subject));
    return {
      subject,
      title: bank?.title || subject,
      questions,
      total_questions: allQuestions.length,
      next_offset: offset + questions.length < allQuestions.length ? offset + questions.length : null,
    };
  });

  return Response.json(
    {
      version: process.env.VERCEL_GIT_COMMIT_SHA || process.env.NEXT_PUBLIC_APP_VERSION || "dev",
      generated_at: new Date().toISOString(),
      banks,
      total_questions: banks.reduce((sum, bank) => sum + bank.questions.length, 0),
    },
    {
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    }
  );
}
