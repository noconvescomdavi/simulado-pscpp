import { NextResponse } from "next/server";
import { getSession } from "../../../../../lib/auth";
import { getUserAccess } from "../../../../../lib/access";
import { query } from "../../../../../lib/db";
import { buildPreference, getPaymentConfig, mercadoPagoRequest } from "../../../../../lib/payments";

export async function POST(request) {
  const session = await getSession();
  if (!session) return NextResponse.redirect(new URL("/login?next=/comprar", request.url), 303);

  const [access, profile] = await Promise.all([
    getUserAccess(session.id),
    query("select full_name,cpf,phone from user_profiles where user_id=$1 limit 1", [session.id]),
  ]);
  if (access?.active) return NextResponse.redirect(new URL("/comprar", request.url), 303);
  if (!profile.rows[0]?.full_name || !profile.rows[0]?.cpf || !profile.rows[0]?.phone) {
    return NextResponse.redirect(new URL("/perfil?erro=Complete%20nome%2C%20CPF%20e%20telefone%20antes%20do%20pagamento.", request.url), 303);
  }

  const config = getPaymentConfig();
  if (!config.ready) {
    return NextResponse.redirect(new URL("/comprar?erro=configuracao", request.url), 303);
  }

  let orderId = null;
  try {
    const order = await query(
      `insert into payment_orders
       (user_id,provider,status,amount_cents,currency,description)
       values($1,'mercado_pago','pending',$2,'BRL',$3)
       returning id`,
      [session.id, config.priceCents, config.title]
    );
    orderId = order.rows[0].id;

    const preference = await mercadoPagoRequest("/checkout/preferences", {
      method: "POST",
      idempotencyKey: orderId,
      body: buildPreference({ orderId, email: session.email }),
    });
    if (!preference?.id || !preference?.init_point) throw new Error("Preferência sem URL de checkout.");

    await query(
      `update payment_orders
          set provider_preference_id=$2,updated_at=now()
        where id=$1`,
      [orderId, String(preference.id)]
    );
    return NextResponse.redirect(preference.init_point, 303);
  } catch (error) {
    console.error("Erro ao criar checkout Mercado Pago:", error);
    if (orderId) {
      await query(
        "update payment_orders set status='failed',raw_status=$2,updated_at=now() where id=$1",
        [orderId, String(error?.message || "checkout_error").slice(0, 240)]
      ).catch(() => {});
    }
    return NextResponse.redirect(new URL("/comprar?erro=checkout", request.url), 303);
  }
}
