import { query, withTransaction } from "./db";

let schemaReady = false;

export async function ensureSupportSchema() {
  if (schemaReady) return;
  await query("create table if not exists support_tickets (id bigserial primary key, user_id bigint not null references users(id) on delete cascade, subject varchar(140) not null, category varchar(40) not null default 'technical', priority varchar(20) not null default 'normal', status varchar(30) not null default 'open', created_at timestamptz not null default now(), updated_at timestamptz not null default now(), last_message_at timestamptz not null default now(), student_unread integer not null default 0, admin_unread integer not null default 1)");
  await query("create table if not exists support_messages (id bigserial primary key, ticket_id bigint not null references support_tickets(id) on delete cascade, sender_id bigint not null references users(id) on delete cascade, sender_role varchar(20) not null, body text not null, created_at timestamptz not null default now())");
  await query("create index if not exists support_tickets_user_idx on support_tickets(user_id, last_message_at desc)");
  await query("create index if not exists support_tickets_admin_idx on support_tickets(status, admin_unread, last_message_at desc)");
  await query("create index if not exists support_messages_ticket_idx on support_messages(ticket_id, created_at asc)");
  schemaReady = true;
}

export async function createTicket(userId, { subject, category = "technical", priority = "normal", message }) {
  await ensureSupportSchema();
  return withTransaction(async (client) => {
    const t = await client.query("insert into support_tickets(user_id,subject,category,priority) values($1,$2,$3,$4) returning *", [userId, subject, category, priority]);
    const ticket = t.rows[0];
    await client.query("insert into support_messages(ticket_id,sender_id,sender_role,body) values($1,$2,'student',$3)", [ticket.id, userId, message]);
    return ticket;
  });
}

export async function addMessage(ticketId, userId, role, body) {
  await ensureSupportSchema();
  return withTransaction(async (client) => {
    const ticket = await client.query("select * from support_tickets where id=$1 for update", [ticketId]);
    if (!ticket.rows[0]) return null;
    await client.query("insert into support_messages(ticket_id,sender_id,sender_role,body) values($1,$2,$3,$4)", [ticketId, userId, role, body]);
    if (role === "admin") {
      await client.query("update support_tickets set last_message_at=now(),updated_at=now(),student_unread=student_unread+1,status=case when status='open' then 'in_progress' else status end where id=$1", [ticketId]);
    } else {
      await client.query("update support_tickets set last_message_at=now(),updated_at=now(),admin_unread=admin_unread+1,status=case when status='waiting_student' then 'in_progress' else status end where id=$1", [ticketId]);
    }
    return true;
  });
}

export async function getTicket(ticketId) {
  await ensureSupportSchema();
  const [t, m] = await Promise.all([
    query("select t.*,u.email,p.full_name from support_tickets t join users u on u.id=t.user_id left join user_profiles p on p.user_id=t.user_id where t.id=$1 limit 1", [ticketId]),
    query("select m.*,u.email,p.full_name from support_messages m join users u on u.id=m.sender_id left join user_profiles p on p.user_id=m.sender_id where m.ticket_id=$1 order by m.created_at asc", [ticketId])
  ]);
  if (!t.rows[0]) return null;
  return { ticket: t.rows[0], messages: m.rows };
}
