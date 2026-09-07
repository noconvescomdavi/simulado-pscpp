import { NextResponse } from "next/server";
import { getAdmin, isUuid } from "../../../../../../lib/admin";
import { query } from "../../../../../../lib/db";
import { assertSameOrigin } from "../../../../../../lib/security";

const MAIN_PRODUCT_CODE = "pscpp-vitalicio";
const TUTOR_PRODUCT_CODE = "tutor-ia-mensal";

function safeDuration(value, fallback=30){
  const n=Number.parseInt(String(value||""),10);
  return Number.isInteger(n)&&n>=1&&n<=3650?n:fallback;
}

export async function POST(req, { params }) {
  try {
    await assertSameOrigin();
    const admin = await getAdmin();
    if (!admin) return Response.json({ error: "Acesso negado." }, { status: 403 });

    const { id } = await params;
    if (!isUuid(id)) return Response.json({ error: "Usuário inválido." }, { status: 400 });

    const formData = await req.formData();
    const action = String(formData.get("action") || "");
    const product = String(formData.get("product") || "pscpp");
    const isTutor = product === "contramestre";
    const productCode = isTutor ? TUTOR_PRODUCT_CODE : MAIN_PRODUCT_CODE;
    const durationDays = isTutor ? safeDuration(formData.get("duration_days"),30) : 365;

    if (!["active","pending","revoked"].includes(action)) {
      return Response.json({ error: "Ação inválida." }, { status: 400 });
    }

    if (action === "active") {
      await query(
        `
        INSERT INTO user_access (
          user_id,product_code,status,lifetime,activated_at,expires_at,revoked_at,updated_at
        )
        VALUES (
          $1,$2,'active',false,NOW(),NOW()+($3::text || ' days')::interval,NULL,NOW()
        )
        ON CONFLICT (user_id, product_code)
        DO UPDATE SET
          status='active',
          lifetime=false,
          activated_at=NOW(),
          expires_at=NOW()+($3::text || ' days')::interval,
          revoked_at=NULL,
          updated_at=NOW()
        `,
        [id,productCode,durationDays]
      );
    }

    if (action === "pending") {
      await query(
        `
        INSERT INTO user_access (
          user_id,product_code,status,lifetime,activated_at,expires_at,revoked_at,updated_at
        )
        VALUES ($1,$2,'pending',false,NULL,NULL,NULL,NOW())
        ON CONFLICT (user_id, product_code)
        DO UPDATE SET
          status='pending',lifetime=false,activated_at=NULL,expires_at=NULL,revoked_at=NULL,updated_at=NOW()
        `,
        [id,productCode]
      );
    }

    if (action === "revoked") {
      await query(
        `
        INSERT INTO user_access (
          user_id,product_code,status,lifetime,activated_at,expires_at,revoked_at,updated_at
        )
        VALUES ($1,$2,'revoked',false,NULL,NULL,NOW(),NOW())
        ON CONFLICT (user_id, product_code)
        DO UPDATE SET
          status='revoked',lifetime=false,expires_at=NOW(),revoked_at=NOW(),updated_at=NOW()
        `,
        [id,productCode]
      );
    }

    await query(
      `INSERT INTO admin_audit_log(actor_user_id,action,entity_type,entity_key,after_data)
       VALUES($1,$2,'user_access',$3,$4::jsonb)`,
      [
        admin.id,
        `${isTutor?"contramestre":"access"}_${action}`,
        id,
        JSON.stringify({
          status:action,
          product_code:productCode,
          ...(action==="active"?{duration_days:durationDays}:{})
        })
      ]
    ).catch(()=>{});

    const url = new URL("/admin/usuarios", req.url);
    const label = isTutor ? "CONTRAMESTRE" : "Acesso";
    url.searchParams.set(
      "msg",
      action==="active"
        ? `${label} ativado por ${durationDays} dias.`
        : action==="revoked"
          ? `${label} revogado.`
          : `${label} alterado para pendente.`
    );

    return NextResponse.redirect(url,{status:303});
  } catch (error) {
    console.error("ERRO AO ALTERAR ACESSO DO USUÁRIO:",error);
    return Response.json(
      {
        error:"Erro interno ao alterar acesso do usuário.",
        detail:process.env.NODE_ENV==="development"?String(error?.message||error):undefined
      },
      {status:500}
    );
  }
}
