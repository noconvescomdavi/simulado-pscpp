import { query } from "../../../lib/db";
import { ensureSupportSchema } from "../../../lib/support";
import AdminSupportClient from "./AdminSupportClient";

export const dynamic = "force-dynamic";

export default async function AdminSupportPage() {
  await ensureSupportSchema();

  const result = await query(
    "select t.*,u.email,p.full_name from support_tickets t join users u on u.id=t.user_id left join user_profiles p on p.user_id=t.user_id order by admin_unread desc,last_message_at desc"
  );

  return <AdminSupportClient initialTickets={result.rows} />;
}
