import { NextResponse } from "next/server";
import { getAdmin, isUuid } from "../../../../../../lib/admin";
import { query, withTransaction } from "../../../../../../lib/db";

export async function POST(req, context) {
  const admin = await getAdmin();
  if (!admin) return Response.json({ error: "Acesso negado." }, { status: 403 });

  const { id } = await context.params;
  if (!isUuid(id)) return Response.json({ error: "Usuário inválido." }, { status: 400 });
  if (id === admin.id) return Response.json({ error: "Você não pode alterar sua própria conta por este painel." }, { status: 400 });

  const form = await req.formData();
  const status = String(form.get("status") || "");
  if (!["active","suspended","blocked","deleted"].includes(status)) {
    return Response.json({ error: "Status inválido." }, { status: 400 });
  }

  const target = await query("SELECT id,email,role,status FROM users WHERE id=$1", [id]);
  if (!target.rowCount) return Response.json({ error: "Usuário não encontrado." }, { status: 404 });
  if (target.rows[0].role === "admin") {
    return Response.json({ error: "Alterar outra conta de administrador não é permitido por este painel." }, { status: 400 });
  }

  await withTransaction(async (client) => {
    await client.query("UPDATE users SET status=$2, updated_at=NOW() WHERE id=$1", [id, status]);

    if (status === "deleted") {
      await client.query(
        "UPDATE user_access SET status='revoked', expires_at=NOW(), revoked_at=NOW(), updated_at=NOW() WHERE user_id=$1",
        [id]
      );
      await client.query(
        "UPDATE password_reset_tokens SET used_at=NOW() WHERE user_id=$1 AND used_at IS NULL",
        [id]
      ).catch(()=>{});
    }

    await client.query(
      `INSERT INTO admin_audit_log(actor_user_id,action,entity_type,entity_key,after_data)
       VALUES($1,$2,'user',$3,$4::jsonb)`,
      [admin.id, `user_${status}`, id, JSON.stringify({status,previous_status:target.rows[0].status,email:target.rows[0].email})]
    ).catch(()=>{});
  });

  const url = new URL("/admin/usuarios", req.url);
  const labels = {
    active:"Conta reativada.",
    suspended:"Conta suspensa.",
    blocked:"Conta bloqueada.",
    deleted:"Conta excluída e assinaturas revogadas."
  };
  url.searchParams.set("msg", labels[status] || "Conta atualizada.");
  return NextResponse.redirect(url, { status: 303 });
}
