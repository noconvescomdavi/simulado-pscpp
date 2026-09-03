import { getSession } from "./auth";
import { query } from "./db";

// Mantido para compatibilidade com as licenças já existentes no banco.
export const PRODUCT_CODE = "pscpp-vitalicio";
export const ACCESS_DURATION_DAYS = 365;

export async function getUserAccess(userId, executor = query) {
  const result = await executor(
    `select id,user_id,product_code,status,lifetime,payment_provider,payment_id,
            activated_at,expires_at,revoked_at,created_at,updated_at,
            (status='active' and expires_at is not null and expires_at > now()) as active,
            case
              when status='active' and (expires_at is null or expires_at <= now()) then 'expired'
              else status
            end as effective_status
       from user_access
      where user_id=$1 and product_code=$2
      limit 1`,
    [userId, PRODUCT_CODE]
  );

  const access = result.rows[0] || null;
  return access ? { ...access, active: access.active === true } : null;
}

export async function getAccessContext() {
  const session = await getSession();
  if (!session?.id) return { session: null, access: null, active: false };
  const access = await getUserAccess(session.id);
  return { session, access, active: access?.active === true };
}

export function accessDeniedResponse(access) {
  const expired = access?.effective_status === "expired";
  return Response.json(
    {
      error: expired ? "Seu acesso de 365 dias expirou." : "Acesso não ativado.",
      code: expired ? "ACCESS_EXPIRED" : "ACCESS_INACTIVE",
      access,
    },
    { status: 403 }
  );
}

export function accessDateFromPayment(dateValue) {
  const approvedAt = dateValue ? new Date(dateValue) : new Date();
  return Number.isNaN(approvedAt.getTime()) ? new Date() : approvedAt;
}
