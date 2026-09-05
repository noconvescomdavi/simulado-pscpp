import { getSession } from "../../../../lib/auth";
import { query } from "../../../../lib/db";
import { createTicket, ensureSupportSchema } from "../../../../lib/support";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  await ensureSupportSchema();
  const result = await query(
    "select * from support_tickets where user_id=$1 order by last_message_at desc",
    [session.id]
  );

  return Response.json({ tickets: result.rows });
}

export async function POST(request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const subject = String(body.subject || "").trim().slice(0, 140);
  const message = String(body.message || "").trim().slice(0, 5000);
  const categories = ["technical", "access", "payment", "questions", "study_plan", "suggestion", "other"];
  const priorities = ["low", "normal", "high"];

  if (subject.length < 4 || message.length < 5) {
    return Response.json({ error: "Preencha assunto e mensagem." }, { status: 400 });
  }

  const ticket = await createTicket(session.id, {
    subject,
    message,
    category: categories.includes(body.category) ? body.category : "technical",
    priority: priorities.includes(body.priority) ? body.priority : "normal"
  });

  return Response.json({ ticket }, { status: 201 });
}
