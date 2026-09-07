import { createHash, randomBytes } from "node:crypto";
import { query } from "./db";

const RESET_TTL_MINUTES = 30;

function tokenHash(token) {
  return createHash("sha256").update(String(token)).digest("hex");
}

function appUrl() {
  return String(process.env.NEXT_PUBLIC_APP_URL || "https://simulado-pscpp.vercel.app").replace(/\/$/, "");
}

export async function createPasswordResetToken(userId) {
  const token = randomBytes(32).toString("hex");
  const hash = tokenHash(token);

  await query(
    "update password_reset_tokens set used_at=now() where user_id=$1 and used_at is null",
    [userId]
  );

  await query(
    `insert into password_reset_tokens(user_id,token_hash,expires_at)
     values($1,$2,now()+($3::text || ' minutes')::interval)`,
    [userId, hash, RESET_TTL_MINUTES]
  );

  return {
    token,
    url: `${appUrl()}/redefinir-senha?token=${encodeURIComponent(token)}`,
  };
}

function parseSender(value) {
  const raw = String(value || "").trim();
  const match = raw.match(/^(.+?)\s*<([^<>\s]+@[^<>\s]+)>$/);
  if (match) {
    return {
      name: match[1].trim().replace(/^["']|["']$/g, "") || "ESTIBORDO",
      email: match[2].trim(),
    };
  }
  return {
    name: "ESTIBORDO | Plataforma de Estudos",
    email: raw || "estibordopscpp@gmail.com",
  };
}

export async function invalidatePasswordResetToken(token) {
  const hash = tokenHash(token);
  await query(
    "update password_reset_tokens set used_at=now() where token_hash=$1 and used_at is null",
    [hash]
  );
}

export async function sendPasswordResetEmail({ to, resetUrl }) {
  const apiKey = String(process.env.BREVO_API_KEY || "").trim();
  const sender = parseSender(
    process.env.PASSWORD_RESET_FROM_EMAIL ||
      "ESTIBORDO | Plataforma de Estudos <estibordopscpp@gmail.com>"
  );

  if (!apiKey) {
    throw new Error("BREVO_API_KEY não configurada.");
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender,
      to: [{ email: String(to).trim() }],
      subject: "Redefinição de senha — ESTIBORDO",
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#0d1b2a">
          <div style="border-bottom:3px solid #c8102e;padding-bottom:14px;margin-bottom:22px">
            <strong style="font-size:20px">ESTIBORDO</strong>
          </div>
          <h2 style="margin:0 0 14px">Redefinição de senha</h2>
          <p>Recebemos uma solicitação para alterar a senha da sua conta ESTIBORDO.</p>
          <p style="margin:24px 0">
            <a href="${resetUrl}" style="display:inline-block;background:#c8102e;color:#fff;text-decoration:none;padding:12px 18px;border-radius:7px;font-weight:700">
              Criar nova senha
            </a>
          </p>
          <p>Este link expira em ${RESET_TTL_MINUTES} minutos e só pode ser usado uma vez.</p>
          <p style="color:#667b8d;font-size:13px">Se você não solicitou a alteração, ignore este e-mail.</p>
        </div>`,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `Falha ao enviar e-mail de recuperação pela Brevo: ${response.status} ${detail.slice(0,240)}`
    );
  }

  return response.json().catch(() => ({ ok: true }));
}

export async function consumePasswordResetToken(token, newPasswordHash) {
  const hash = tokenHash(token);

  const result = await query(
    `with valid_token as (
       select prt.id, prt.user_id
       from password_reset_tokens prt
       join users u on u.id=prt.user_id
       where prt.token_hash=$1
         and prt.used_at is null
         and prt.expires_at > now()
         and u.status='active'
       limit 1
       for update
     ),
     updated_user as (
       update users u
       set password_hash=$2, session_version=coalesce(session_version,1)+1, updated_at=now()
       from valid_token vt
       where u.id=vt.user_id
       returning u.id
     )
     update password_reset_tokens prt
     set used_at=now()
     from valid_token vt, updated_user uu
     where prt.id=vt.id
     returning prt.user_id`,
    [hash, newPasswordHash]
  );

  return result.rowCount > 0;
}
