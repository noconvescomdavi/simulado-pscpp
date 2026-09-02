import { NextResponse } from "next/server";
import { getAdmin, isUuid } from "../../../../../../lib/admin";
import { query } from "../../../../../../lib/db";

export async function POST(req, context) {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return Response.json(
        { error: "Acesso negado." },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!isUuid(id)) {
      return Response.json(
        { error: "Usuário inválido." },
        { status: 400 }
      );
    }

    const form = await req.formData();
    const action = String(form.get("action") || "");

    if (!["active", "pending", "revoked"].includes(action)) {
      return Response.json(
        { error: "Ação inválida." },
        { status: 400 }
      );
    }

    await query(
      `
      INSERT INTO user_access (
        user_id,
        product_code,
        status,
        lifetime,
        activated_at,
        revoked_at
      )
      VALUES (
        $1::uuid,
        'pscpp-vitalicio',
        $2::varchar,
        TRUE,
        CASE
          WHEN $2::varchar = 'active'
          THEN NOW()
          ELSE NULL
        END,
        CASE
          WHEN $2::varchar = 'revoked'
          THEN NOW()
          ELSE NULL
        END
      )

      ON CONFLICT (user_id, product_code)

      DO UPDATE SET
        status = EXCLUDED.status,
        lifetime = TRUE,

        activated_at = CASE
          WHEN EXCLUDED.status = 'active'
          THEN COALESCE(user_access.activated_at, NOW())
          ELSE user_access.activated_at
        END,

        revoked_at = CASE
          WHEN EXCLUDED.status = 'revoked'
          THEN NOW()

          WHEN EXCLUDED.status = 'active'
          THEN NULL

          ELSE user_access.revoked_at
        END
      `,
      [id, action]
    );

    await query(
      `
      INSERT INTO audit_log (
        user_id,
        event_type
      )
      VALUES (
        $1::uuid,
        $2::text
      )
      `,
      [
        admin.id,
        `admin_access_${action}:${id}`
      ]
    );

    const label =
      action === "active"
        ? "Licença ativada."
        : action === "revoked"
        ? "Licença revogada."
        : "Licença marcada como pendente.";

    const url = new URL("/admin", req.url);
    url.searchParams.set("msg", label);

    return NextResponse.redirect(url, {
      status: 303
    });

  } catch (error) {
    console.error("Erro ao alterar licença:", error);

    const url = new URL("/admin", req.url);

    url.searchParams.set(
      "error",
      "Não foi possível alterar a licença."
    );

    return NextResponse.redirect(url, {
      status: 303
    });
  }
}