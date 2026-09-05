import { getSession } from "../../../../../lib/auth";
import { getAdmin } from "../../../../../lib/admin";
import { query } from "../../../../../lib/db";
import { addMessage, getTicket } from "../../../../../lib/support";

export const dynamic = "force-dynamic";

async function authorizeAdmin() {
  const session = await getSession();
  if (!session || !(await getAdmin())) return null;
  return session;
}

export async function GET(_request, { params }) {
  const session = await authorizeAdmin();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 403 });

  const { id } = await params;
  const data = await getTicket(id);
  if (!data) return Response.json({ error: "Não encontrado" }, { status: 404 });

  await query("update support_tickets set admin_unread=0 where id=$1", [id]);
  return Response.json(data);
}

export async function POST(request, { params }) {
  const session = await authorizeAdmin();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 403 });

  const { id } = await params;
  const data = await getTicket(id);
  if (!data) return Response.json({ error: "Não encontrado" }, { status: 404 });
  if (data.ticket.status === "closed") {
    return Response.json({ error: "Chamado fechado." }, { status: 409 });
  }

  const body = await request.json().catch(() => ({}));
  const message = String(body.body || "").trim().slice(0, 5000);
  if (!message) return Response.json({ error: "Mensagem vazia." }, { status: 400 });

  await addMessage(id, session.id, "admin", message);
  return Response.json({ ok: true });
}

export async function PATCH(request, { params }) {
  const session = await authorizeAdmin();
  if (!session) return Response.json({ error: "Não autorizado" }, { status: 403 });

  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const allowed = ["open", "in_progress", "waiting_student", "resolved", "closed"];

  if (!allowed.includes(body.status)) {
    return Response.json({ error: "Status inválido" }, { status: 400 });
  }

  await query(
    "update support_tickets set status=$2,updated_at=now() where id=$1",
    [id, body.status]
  );

  return Response.json({ ok: true });
}
