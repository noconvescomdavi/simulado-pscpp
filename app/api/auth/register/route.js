import argon2 from "argon2";
import { query, withTransaction } from "../../../../lib/db";
import { createSession } from "../../../../lib/auth";
import {
  clientIpHash,
  consumeRateLimit,
  identityHash,
  rateLimitResponse,
} from "../../../../lib/security";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const normalized = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    const [ipLimit, emailLimit] = await Promise.all([
      clientIpHash().then((keyHash) =>
        consumeRateLimit({ action: "register_ip", keyHash, limit: 10, windowSeconds: 3600 })
      ),
      consumeRateLimit({
        action: "register_email",
        keyHash: identityHash(normalized),
        limit: 4,
        windowSeconds: 3600,
      }),
    ]);

    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);
    if (!emailLimit.allowed) return rateLimitResponse(emailLimit);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return Response.json({ error: "E-mail inválido." }, { status: 400 });
    }
    if (password.length < 10) {
      return Response.json({ error: "A senha precisa ter ao menos 10 caracteres." }, { status: 400 });
    }

    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await withTransaction(async (client) => {
      const exists = await client.query("select id from users where lower(email)=lower($1)", [normalized]);
      if (exists.rowCount) return null;

      const inserted = await client.query(
        "insert into users(email,password_hash) values($1,$2) returning id,email,role,status",
        [normalized, hash]
      );
      const created = inserted.rows[0];

      await client.query(
        "insert into user_access(user_id,product_code,status,lifetime) values($1,'pscpp-vitalicio','pending',false) on conflict do nothing",
        [created.id]
      );
      return created;
    });

    if (!user) {
      return Response.json({ error: "Já existe uma conta com este e-mail." }, { status: 409 });
    }

    await createSession(user);
    return Response.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("Erro de cadastro:", error);
    return Response.json({ error: "Não foi possível criar a conta." }, { status: 500 });
  }
}
