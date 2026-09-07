import { query } from "../../../../lib/db";
import { createPasswordResetToken, invalidatePasswordResetToken, sendPasswordResetEmail } from "../../../../lib/password-reset";
import {
  clientIpHash,
  consumeRateLimit,
  identityHash,
  rateLimitResponse,
} from "../../../../lib/security";

const GENERIC_MESSAGE = "Se houver uma conta cadastrada com esse e-mail, enviaremos um link para redefinir a senha. Caso não encontre a mensagem na caixa de entrada, verifique também as pastas Spam, Lixo Eletrônico e Promoções.";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();

    const [ipLimit, emailLimit] = await Promise.all([
      clientIpHash().then((keyHash) =>
        consumeRateLimit({ action: "password_reset_ip", keyHash, limit: 8, windowSeconds: 3600 })
      ),
      consumeRateLimit({
        action: "password_reset_email",
        keyHash: identityHash(email),
        limit: 4,
        windowSeconds: 3600,
      }),
    ]);

    if (!ipLimit.allowed) return rateLimitResponse(ipLimit);
    if (!emailLimit.allowed) return rateLimitResponse(emailLimit);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: true, message: GENERIC_MESSAGE });
    }

    const result = await query(
      "select id,email from users where lower(email)=lower($1) and status='active' limit 1",
      [email]
    );
    const user = result.rows[0];

    if (user) {
      const reset = await createPasswordResetToken(user.id);
      try {
        await sendPasswordResetEmail({ to: user.email, resetUrl: reset.url });
      } catch (error) {
        await invalidatePasswordResetToken(reset.token).catch(() => {});
        throw error;
      }
    }

    return Response.json({ ok: true, message: GENERIC_MESSAGE });
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error);
    return Response.json(
      { error: "O serviço de recuperação de senha está temporariamente indisponível." },
      { status: 503 }
    );
  }
}
