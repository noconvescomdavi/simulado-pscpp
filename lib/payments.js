import { createHmac, timingSafeEqual } from "node:crypto";

const API_BASE = "https://api.mercadopago.com";
const ANNUAL_PRICE_CENTS = 259900;
const TUTOR_PRICE_CENTS = 10000;

function positiveInteger(value, fallback = null) {
  const number = Number.parseInt(String(value || ""), 10);
  return Number.isInteger(number) && number > 0 ? number : fallback;
}

function list(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function getPaymentConfig() {
  const accessToken = String(process.env.MERCADO_PAGO_ACCESS_TOKEN || "").trim();
  const webhookSecret = String(process.env.MERCADO_PAGO_WEBHOOK_SECRET || "").trim();
  const appUrl = String(process.env.NEXT_PUBLIC_APP_URL || "").trim().replace(/\/$/, "");
  const maxInstallments = positiveInteger(process.env.MERCADO_PAGO_MAX_INSTALLMENTS, 12);
  const excludedPaymentTypes = list(process.env.MERCADO_PAGO_EXCLUDED_PAYMENT_TYPES);

  return {
    accessToken,
    webhookSecret,
    appUrl,
    priceCents: ANNUAL_PRICE_CENTS,
    maxInstallments,
    excludedPaymentTypes,
    title: String(process.env.PSCPP_ANNUAL_PRODUCT_TITLE || "ESTIBORDO — acesso por 365 dias").slice(0, 120),
    statementDescriptor: String(process.env.MERCADO_PAGO_STATEMENT_DESCRIPTOR || "ESTIBORDO").slice(0, 22),
    ready: Boolean(accessToken && webhookSecret && appUrl),
  };
}

export function formatCurrencyFromCents(cents) {
  if (!Number.isInteger(cents)) return "Valor a configurar";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

export async function mercadoPagoRequest(path, { method = "GET", body, idempotencyKey } = {}) {
  const { accessToken } = getPaymentConfig();
  if (!accessToken) throw new Error("MERCADO_PAGO_ACCESS_TOKEN não configurado.");

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(idempotencyKey ? { "X-Idempotency-Key": idempotencyKey } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = payload?.message || payload?.error || `HTTP ${response.status}`;
    throw new Error(`Mercado Pago: ${detail}`);
  }
  return payload;
}

export function buildPreference({ orderId, email }) {
  const config = getPaymentConfig();
  const paymentMethods = { installments: config.maxInstallments };
  if (config.excludedPaymentTypes.length) {
    paymentMethods.excluded_payment_types = config.excludedPaymentTypes.map((id) => ({ id }));
  }

  return {
    items: [
      {
        id: "estibordo-pscpp-365",
        title: config.title,
        description: "Acesso à plataforma de estudos ESTIBORDO por 365 dias.",
        quantity: 1,
        currency_id: "BRL",
        unit_price: config.priceCents / 100,
      },
    ],
    payer: { email },
    external_reference: orderId,
    statement_descriptor: config.statementDescriptor,
    payment_methods: paymentMethods,
    back_urls: {
      success: `${config.appUrl}/comprar?retorno=sucesso`,
      pending: `${config.appUrl}/comprar?retorno=pendente`,
      failure: `${config.appUrl}/comprar?retorno=falha`,
    },
    auto_return: "approved",
    notification_url: `${config.appUrl}/api/payments/mercado-pago/webhook`,
  };
}

export function validateMercadoPagoSignature({ xSignature, xRequestId, dataId, secret }) {
  if (!xSignature || !xRequestId || !dataId || !secret) return false;
  const parts = Object.fromEntries(
    String(xSignature)
      .split(",")
      .map((part) => part.trim().split("=", 2))
      .filter(([key, value]) => key && value)
  );
  if (!parts.ts || !parts.v1) return false;

  const normalizedDataId = String(dataId).toLowerCase();
  const manifest = `id:${normalizedDataId};request-id:${xRequestId};ts:${parts.ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  const receivedBuffer = Buffer.from(String(parts.v1), "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
}

export function paymentAmountInCents(payment) {
  const value = Number(payment?.transaction_amount);
  return Number.isFinite(value) ? Math.round(value * 100) : null;
}

export function normalizedPaymentStatus(payment) {
  const status = String(payment?.status || "").toLowerCase();
  if (status === "approved") return "approved";
  if (status === "refunded") return "refunded";
  if (status === "charged_back") return "charged_back";
  if (["cancelled", "rejected"].includes(status)) return status;
  return "pending";
}

export function getTutorPaymentConfig() {
  const base = getPaymentConfig();
  return {...base, priceCents:TUTOR_PRICE_CENTS, title:"ESTIBORDO — Tutor IA — 30 dias"};
}

export function buildTutorPreference({orderId,email}) {
  const config=getTutorPaymentConfig();
  return {
    items:[{id:"estibordo-tutor-ia-30",title:config.title,description:"Pacote adicional Tutor IA ESTIBORDO por 30 dias.",quantity:1,currency_id:"BRL",unit_price:config.priceCents/100}],
    payer:{email},external_reference:orderId,statement_descriptor:config.statementDescriptor,
    payment_methods:{installments:1},
    back_urls:{success:`${config.appUrl}/tutor-ia?retorno=sucesso`,pending:`${config.appUrl}/tutor-ia?retorno=pendente`,failure:`${config.appUrl}/tutor-ia?retorno=falha`},
    auto_return:"approved",notification_url:`${config.appUrl}/api/payments/mercado-pago/webhook`
  };
}
