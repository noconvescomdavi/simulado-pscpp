import { getSession } from "./auth";
import { query } from "./db";
import { hasPermission } from "./admin-permissions";

export async function getAdmin(permission=null) {
  const session = await getSession();
  if (!session?.id) return null;

  const result = await query(
    `SELECT u.id,u.email,u.role,u.status,u.admin_mfa_enabled,
            coalesce(ac.is_superadmin,false) is_superadmin,
            coalesce(ac.permissions,'{}'::text[]) permissions
       FROM users u
       LEFT JOIN admin_access_control ac ON ac.user_id=u.id
      WHERE u.id=$1
      LIMIT 1`,
    [session.id]
  );

  const user = result.rows[0];
  if (!user || user.role !== "admin" || user.status !== "active") return null;
  if (user.admin_mfa_enabled && !session.adminMfaVerified) return null;

  const adminUser={...user,permissions:Array.isArray(user.permissions)?user.permissions:[]};
  if(permission && !hasPermission(adminUser,permission))return null;
  return adminUser;
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}
