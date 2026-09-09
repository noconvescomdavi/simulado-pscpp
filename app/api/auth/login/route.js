import argon2 from "argon2";
import { query } from "../../../../lib/db";
import { createSession } from "../../../../lib/auth";
import { beginAdminMfaChallenge } from "../../../../lib/admin-mfa";
import { hasCurrentLegalConsent } from "../../../../lib/legal-consent";
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

    const [ipLimit, accountLimit] = await Promise.all([
      clientIpHash().then((keyHash) =>
        consumeRateLimit({ action: "login_ip", keyHash, limit: 20, windowSeconds: 600 })
      ),
      consumeRateLimit({
        action: "login_account",
        keyHash: identityHash(normalized),
        limit: 8,
        windowSeconds: 900,
      }),
    ]);

    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);
    if (!accountLimit.allowed) return rateLimitResponse(accountLimit);

    const result = await query(
      "select id,email,password_hash,role,status,session_version,email_verified,email_verification_required_at,admin_mfa_enabled from users where lower(email)=lower($1) limit 1",
      [normalized]
    );
    const user = result.rows[0];

    const valid =
      user?.password_hash &&
      (await argon2.verify(user.password_hash, password).catch(() => false));

    if (!user || !valid) {
      return Response.json({ error: "E-mail ou senha inválidos." }, { status: 401 });
    }
    if (user.status !== "active") {
      return Response.json({ error: "Conta indisponível." }, { status: 403 });
    }
    if (user.email_verification_required_at && !user.email_verified) {
      return Response.json({ error: "Confirme seu e-mail para entrar.", code: "EMAIL_NOT_VERIFIED", email: user.email }, { status: 403 });
    }

    if(user.role==="admin" && user.admin_mfa_enabled){
      await beginAdminMfaChallenge(user);
      return Response.json({ok:true,requiresAdminMfa:true});
    }

    await query("update users set last_login_at=now(),updated_at=now() where id=$1", [user.id]);
    await createSession(user);
    const requiresTerms = !(await hasCurrentLegalConsent(user.id));
    return Response.json({ ok: true, requiresTerms });
  } catch (error) {
    console.error("Erro de login:", error);
    return Response.json({ error: "Não foi possível entrar." }, { status: 500 });
  }
}
