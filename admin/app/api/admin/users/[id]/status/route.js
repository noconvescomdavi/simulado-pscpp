import { NextResponse } from "next/server";
import { getAdmin, isUuid } from "../../../../../../lib/admin";
import { query } from "../../../../../../lib/db";

export async function POST(req, context) {
  const admin = await getAdmin();
  if (!admin) return Response.json({ error: "Acesso negado." }, { status: 403 });

  const { id } = await context.params;
  if (!isUuid(id)) return Response.json({ error: "Usuário inválido." }, { status: 400 });
  if (id === admin.id) return Response.json({ error: "Você não pode bloquear sua própria conta." }, { status: 400 });

  const form = await req.formData();
  const status = String(form.get("status") || "");
  if (!["active", "blocked"].includes(status)) {
    return Response.json({ error: "Status inválido." }, { status: 400 });
  }

  const target = await query("SELECT id, role FROM users WHERE id=$1", [id]);
  if (!target.rowCount) return Response.json({ error: "Usuário não encontrado." }, { status: 404 });
  if (target.rows[0].role === "admin") {
    return Response.json({ error: "O bloqueio de outro administrador não é permitido por este painel." }, { status: 400 });
  }

  await query("UPDATE users SET status=$2, updated_at=NOW() WHERE id=$1", [id, status]);
  await query(
    `INSERT INTO audit_log(user_id, event_type) VALUES($1, $2)`,
    [admin.id, `admin_account_${status}:${id}`]
  );

  const url = new URL("/admin", req.url);
  url.searchParams.set("msg", status === "active" ? "Conta desbloqueada." : "Conta bloqueada.");
  return NextResponse.redirect(url, { status: 303 });
}
