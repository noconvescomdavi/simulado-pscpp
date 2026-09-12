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

  const available = availableQuestionBanks().map((item) => item.slug);
  const subjects = [...new Set((requested.length ? requested : available).filter((slug) => available.includes(slug)))];

  const banks = subjects.map((subject) => {
    const bank = getQuestionBank(subject);
    return {
      subject,
      title: bank?.title || subject,
      questions: (bank?.questions || []).map((question) => offlineQuestion(question, subject)),
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
