import { query } from "./db";

export const DEFAULT_SUBSCRIPTION_PRICE_CENTS = 259900;
export const DEFAULT_CONTRAMESTRE_PRICE_CENTS = 10000;

function positiveCents(value, fallback) {
  const n = Number.parseInt(String(value ?? ""), 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
}

export async function getPlatformPricing(executor = query) {
  const result = await executor(
    `select setting_key,setting_value,updated_at
       from platform_settings
      where setting_key in ('subscription_price_cents','contramestre_price_cents')`
  ).catch(() => ({ rows: [] }));

  const map = new Map(result.rows.map((row) => [row.setting_key, row]));
  const subscription = map.get("subscription_price_cents");
  const contramestre = map.get("contramestre_price_cents");

  return {
    subscriptionPriceCents: positiveCents(subscription?.setting_value, DEFAULT_SUBSCRIPTION_PRICE_CENTS),
    contramestrePriceCents: positiveCents(contramestre?.setting_value, DEFAULT_CONTRAMESTRE_PRICE_CENTS),
    subscriptionUpdatedAt: subscription?.updated_at || null,
    contramestreUpdatedAt: contramestre?.updated_at || null,
  };
}

export async function updatePlatformPricing({
  subscriptionPriceCents,
  contramestrePriceCents,
  actorUserId = null,
  executor = query,
}) {
  const subscription = positiveCents(subscriptionPriceCents, null);
  const contramestre = positiveCents(contramestrePriceCents, null);

  if (!subscription || !contramestre) {
    const error = new Error("Os preços devem ser maiores que zero.");
    error.status = 400;
    throw error;
  }

  if (subscription > 99999999 || contramestre > 99999999) {
    const error = new Error("Valor acima do limite permitido.");
    error.status = 400;
    throw error;
  }

  await executor(
    `insert into platform_settings(setting_key,setting_value,updated_by,updated_at)
     values
       ('subscription_price_cents',$1,$3,now()),
       ('contramestre_price_cents',$2,$3,now())
     on conflict(setting_key) do update set
       setting_value=excluded.setting_value,
       updated_by=excluded.updated_by,
       updated_at=now()`,
    [String(subscription), String(contramestre), actorUserId]
  );

  return getPlatformPricing(executor);
}
