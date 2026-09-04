import { NextResponse } from "next/server";
import { getAdmin, isUuid } from "../../../../../../lib/admin";
import { query } from "../../../../../../lib/db";

export async function POST(req, { params }) {
  try {
    const admin = await getAdmin();

    if (!admin) {
      return Response.json(
        { error: "Acesso negado." },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!isUuid(id)) {
      return Response.json(
        { error: "Usuário inválido." },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const action = String(formData.get("action") || "");

    if (!["active", "pending", "revoked"].includes(action)) {
      return Response.json(
        { error: "Ação inválida." },
        { status: 400 }
      );
    }

    if (action === "active") {
      await query(
        `
        INSERT INTO user_access (
          user_id,
          product_code,
          status,
          lifetime,
          activated_at,
          expires_at,
          revoked_at,
          updated_at
        )
        VALUES (
          $1,
          'pscpp-vitalicio',
          'active',
          false,
          NOW(),
          NOW() + INTERVAL '365 days',
          NULL,
          NOW()
        )
        ON CONFLICT (user_id, product_code)
        DO UPDATE SET
          status = 'active',
          lifetime = false,
          activated_at = NOW(),
          expires_at = NOW() + INTERVAL '365 days',
          revoked_at = NULL,
          updated_at = NOW()
        `,
        [id]
      );
    }

    if (action === "pending") {
      await query(
        `
        INSERT INTO user_access (
          user_id,
          product_code,
          status,
          lifetime,
          activated_at,
          expires_at,
          revoked_at,
          updated_at
        )
        VALUES (
          $1,
          'pscpp-vitalicio',
          'pending',
          false,
          NULL,
          NULL,
          NULL,
          NOW()
        )
        ON CONFLICT (user_id, product_code)
        DO UPDATE SET
          status = 'pending',
          lifetime = false,
          revoked_at = NULL,
          updated_at = NOW()
        `,
        [id]
      );
    }

    if (action === "revoked") {
      await query(
        `
        INSERT INTO user_access (
          user_id,
          product_code,
          status,
          lifetime,
          activated_at,
          expires_at,
          revoked_at,
          updated_at
        )
        VALUES (
          $1,
          'pscpp-vitalicio',
          'revoked',
          false,
          NULL,
          NULL,
          NOW(),
          NOW()
        )
        ON CONFLICT (user_id, product_code)
        DO UPDATE SET
          status = 'revoked',
          lifetime = false,
          revoked_at = NOW(),
          updated_at = NOW()
        `,
        [id]
      );
    }

    const url = new URL("/admin/usuarios", req.url);
    url.searchParams.set(
      "msg",
      action === "active"
        ? "Acesso ativado por 365 dias."
        : action === "revoked"
          ? "Acesso revogado."
          : "Acesso alterado para pendente."
    );

    return NextResponse.redirect(url, { status: 303 });
  } catch (error) {
    console.error("ERRO AO ALTERAR ACESSO DO USUÁRIO:", error);

    return Response.json(
      {
        error: "Erro interno ao alterar acesso do usuário.",
        detail:
          process.env.NODE_ENV === "development"
            ? String(error?.message || error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
