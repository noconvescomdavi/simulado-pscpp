import { getPaymentConfig, mercadoPagoRequest, normalizedPaymentStatus, paymentAmountInCents, validateMercadoPagoSignature } from "../../../../../lib/payments";
import { withTransaction } from "../../../../../lib/db";
import { ACCESS_DURATION_DAYS, PRODUCT_CODE, accessDateFromPayment } from "../../../../../lib/access";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const config = getPaymentConfig();
    if (!config.webhookSecret || !config.accessToken) {
      console.error("Webhook Mercado Pago recebido sem credenciais configuradas.");
      return Response.json({ error: "Integração indisponível." }, { status: 503 });
    }

    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const dataId = url.searchParams.get("data.id") || url.searchParams.get("data_id") || body?.data?.id;
    const type = url.searchParams.get("type") || body?.type;
    if (type && type !== "payment") return Response.json({ ok: true, ignored: true });
    if (!dataId) return Response.json({ error: "Data ID ausente." }, { status: 400 });

    const valid = validateMercadoPagoSignature({
      xSignature: request.headers.get("x-signature"),
      xRequestId: request.headers.get("x-request-id"),
      dataId,
      secret: config.webhookSecret,
    });
    if (!valid) return Response.json({ error: "Assinatura inválida." }, { status: 401 });

    const payment = await mercadoPagoRequest(`/v1/payments/${encodeURIComponent(dataId)}`);
    const externalReference = String(payment?.external_reference || "");
    const providerPaymentId = String(payment?.id || dataId || "");
    const status = normalizedPaymentStatus(payment);
    const amountCents = paymentAmountInCents(payment);
    const currency = String(payment?.currency_id || "");

    if (!externalReference) return Response.json({ ok: true, ignored: true, reason: "missing_external_reference" });

    const result = await withTransaction(async (client) => {
      const locked = await client.query(
        "select * from payment_orders where id::text=$1 limit 1 for update",
        [externalReference]
      );
      const order = locked.rows[0];
      if (!order) return { ignored: true, reason: "unknown_order" };

      if (amountCents !== Number(order.amount_cents) || currency !== order.currency) {
        await client.query(
          "update payment_orders set status='review',provider_payment_id=$2,raw_status=$3,updated_at=now() where id=$1",
          [order.id, providerPaymentId, "amount_or_currency_mismatch"]
        );
        return { ignored: true, reason: "amount_or_currency_mismatch" };
      }

      const alreadyApproved = order.status === "approved";
      const finalStatus = alreadyApproved && !["refunded", "charged_back"].includes(status)
        ? "approved"
        : status;

      await client.query(
        `update payment_orders
            set provider_payment_id=$2,status=$3,raw_status=$4,
                approved_at=case when $3='approved' then coalesce(approved_at,$5) else approved_at end,
                updated_at=now()
          where id=$1`,
        [order.id, providerPaymentId, finalStatus, String(payment?.status_detail || payment?.status || ""), payment?.date_approved || null]
      );

      if (status === "approved" && !alreadyApproved) {
        const approvedAt = accessDateFromPayment(payment?.date_approved);
        await client.query(
          `insert into user_access
           (user_id,product_code,status,lifetime,payment_provider,payment_id,activated_at,expires_at,revoked_at,updated_at)
           values($1,$2,'active',false,'mercado_pago',$3,$4::timestamptz,$4::timestamptz + ($5::int * interval '1 day'),null,now())
           on conflict(user_id,product_code) do update set
             status='active',lifetime=false,payment_provider='mercado_pago',payment_id=excluded.payment_id,
             activated_at=excluded.activated_at,expires_at=excluded.expires_at,revoked_at=null,updated_at=now()`,
          [order.user_id, PRODUCT_CODE, providerPaymentId, approvedAt, ACCESS_DURATION_DAYS]
        );
        await client.query(
          "insert into audit_log(user_id,event_type) values($1,$2)",
          [order.user_id, `payment_approved:${providerPaymentId}`]
        );
      }

      if (["refunded", "charged_back"].includes(status)) {
        await client.query(
          `update user_access
              set status=$3,revoked_at=now(),updated_at=now()
            where user_id=$1 and product_code=$2 and payment_provider='mercado_pago' and payment_id=$4`,
          [order.user_id, PRODUCT_CODE, status === "refunded" ? "refunded" : "revoked", providerPaymentId]
        );
      }

      return { ignored: false };
    });

    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("Erro no webhook Mercado Pago:", error);
    return Response.json({ error: "Falha temporária." }, { status: 500 });
  }
}
