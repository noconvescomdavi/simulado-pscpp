import argon2 from "argon2";
import { consumePasswordResetToken } from "../../../../lib/password-reset";
import { clientIpHash, consumeRateLimit, rateLimitResponse, assertSameOrigin } from "../../../../lib/security";

export async function POST(req) {
  try {
    await assertSameOrigin();
    const limit = await clientIpHash().then((keyHash) =>
      consumeRateLimit({ action: "password_reset_confirm_ip", keyHash, limit: 10, windowSeconds: 3600 })
    );
    if (!limit.allowed) return rateLimitResponse(limit);

    const body = await req.json().catch(() => ({}));
    const token = String(body.token || "").trim();
    const password = String(body.password || "");

    if (!/^[a-f0-9]{64}$/i.test(token)) {
      return Response.json({ error: "Link de redefinição inválido ou expirado." }, { status: 400 });
    }
    if (password.length < 10) {
      return Response.json({ error: "A nova senha precisa ter ao menos 10 caracteres." }, { status: 400 });
    }

    const hash = await argon2.hash(password, { type: argon2.argon2id });
    const changed = await consumePasswordResetToken(token, hash);

    if (!changed) {
      return Response.json({ error: "Link de redefinição inválido, expirado ou já utilizado." }, { status: 400 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Erro ao redefinir senha:", error);
    return Response.json({ error: "Não foi possível redefinir a senha." }, { status: 500 });
  }
}
