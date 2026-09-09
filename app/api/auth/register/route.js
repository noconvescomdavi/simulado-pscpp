import argon2 from "argon2";
import { query, withTransaction } from "../../../../lib/db";
import { createEmailVerificationToken, sendVerificationEmail } from "../../../../lib/email-verification";
import { TERMS_VERSION, PRIVACY_VERSION } from "../../../../lib/legal";
import { passwordPolicyError } from "../../../../lib/password-policy";
import {
  clientIpHash,
  consumeRateLimit,
  identityHash,
  rateLimitResponse,
  assertSameOrigin,
} from "../../../../lib/security";

export async function POST(req) {
  try {
    await assertSameOrigin();
    const body = await req.json().catch(() => ({}));
    const normalized = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const acceptedTerms = body.accept_terms === true;

    const ipHash = await clientIpHash();
    const [ipLimit, emailLimit] = await Promise.all([
      consumeRateLimit({ action: "register_ip", keyHash: ipHash, limit: 10, windowSeconds: 3600 }),
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
    if (!acceptedTerms) {
      return Response.json({ error: "É necessário aceitar os Termos de Uso e a Política de Privacidade." }, { status: 400 });
    }
    const passwordError = passwordPolicyError(password, normalized);
    if (passwordError) return Response.json({ error: passwordError }, { status: 400 });

    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const user = await withTransaction(async (client) => {
      const exists = await client.query("select id from users where lower(email)=lower($1)", [normalized]);
      if (exists.rowCount) return null;

      const inserted = await client.query(
        "insert into users(email,password_hash,email_verified,email_verification_required_at) values($1,$2,false,now()) returning id,email,role,status,session_version",
        [normalized, hash]
      );
      const created = inserted.rows[0];

      await client.query(
        "insert into user_access(user_id,product_code,status,lifetime) values($1,'pscpp-vitalicio','pending',false) on conflict do nothing",
        [created.id]
      );
      await client.query(
        "insert into user_consents(user_id,terms_version,privacy_version,source,ip_hash) values($1,$2,$3,'registration',$4)",
        [created.id, TERMS_VERSION, PRIVACY_VERSION, ipHash]
      );
      return created;
    });

    if (!user) {
      return Response.json({ error: "Já existe uma conta com este e-mail." }, { status: 409 });
    }

    const verification = await createEmailVerificationToken(user.id);
    let deliveryFailed = false;
    try {
      await sendVerificationEmail({ to: user.email, verifyUrl: verification.url });
    } catch (emailError) {
      deliveryFailed = true;
      console.error("Falha ao enviar verificação de e-mail:", emailError);
    }
    return Response.json({ ok: true, verificationRequired: true, email: user.email, deliveryFailed });
  } catch (error) {
    console.error("Erro de cadastro:", error);
    return Response.json({ error: "Não foi possível criar a conta." }, { status: 500 });
  }
}
