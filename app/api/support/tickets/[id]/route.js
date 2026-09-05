import { getSession } from "../../../../../lib/auth";
import { query } from "../../../../../lib/db";
import { addMessage, getTicket } from "../../../../../lib/support";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await params;
  const data = await getTicket(id);

  if (!data || String(data.ticket.user_id) !== String(session.id)) {
    return Response.json({ error: "Chamado não encontrado" }, { status: 404 });
  }

  await query("update support_tickets set student_unread=0 where id=$1", [id]);
  return Response.json(data);
}

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Não autenticado" }, { status: 401 });

  const { id } = await params;
  const data = await getTicket(id);

  if (!data || String(data.ticket.user_id) !== String(session.id)) {
    return Response.json({ error: "Chamado não encontrado" }, { status: 404 });
  }

  if (data.ticket.status === "closed") {
    return Response.json({ error: "Chamado fechado." }, { status: 409 });
  }

  const body = await request.json().catch(() => ({}));
  const message = String(body.body || "").trim().slice(0, 5000);

  if (!message) return Response.json({ error: "Mensagem vazia." }, { status: 400 });

  await addMessage(id, session.id, "student", message);
  return Response.json({ ok: true });
}
