import { getSession } from "./auth";
import { query } from "./db";

export async function getAdmin() {
  const session = await getSession();
  if (!session?.id) return null;

  const result = await query(
    `SELECT id, email, role, status
       FROM users
      WHERE id = $1
      LIMIT 1`,
    [session.id]
  );

  const user = result.rows[0];
  if (!user || user.role !== "admin" || user.status !== "active") return null;
  return user;
}

export function isUuid(value) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
}
