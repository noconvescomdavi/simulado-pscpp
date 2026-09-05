import { getSession } from "../../../../lib/auth";
import { getAdmin } from "../../../../lib/admin";
import { query } from "../../../../lib/db";
import { ensureSupportSchema } from "../../../../lib/support";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session || !(await getAdmin())) {
    return Response.json({ error: "Não autorizado" }, { status: 403 });
  }

  await ensureSupportSchema();
  const result = await query(
    "select t.*,u.email,p.full_name from support_tickets t join users u on u.id=t.user_id left join user_profiles p on p.user_id=t.user_id order by admin_unread desc,last_message_at desc"
  );

  return Response.json({ tickets: result.rows });
}
