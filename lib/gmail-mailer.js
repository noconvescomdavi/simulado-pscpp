function requiredEnv(name) {
  const value = String(process.env[name] || "").trim();
  if (!value) throw new Error(name + " não configurada.");
  return value;
}

function sanitizeHeader(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function encodedWord(value) {
  return "=?UTF-8?B?" + Buffer.from(String(value), "utf8").toString("base64") + "?=";
}

function base64Url(value) {
  return Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function gmailAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: requiredEnv("GMAIL_OAUTH_CLIENT_ID"),
      client_secret: requiredEnv("GMAIL_OAUTH_CLIENT_SECRET"),
      refresh_token: requiredEnv("GMAIL_OAUTH_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok || !payload.access_token) {
    throw new Error(
      "Falha ao renovar acesso à Gmail API: " +
        response.status +
        " " +
        String(payload.error_description || payload.error || "").slice(0, 240)
    );
  }

  return payload.access_token;
}

export async function sendGmailMessage({ to, subject, html }) {
  const senderEmail = sanitizeHeader(requiredEnv("GMAIL_SENDER_EMAIL"));
  const senderName = sanitizeHeader(
    process.env.GMAIL_SENDER_NAME || "ESTIBORDO | Plataforma de Estudos"
  );
  const recipient = sanitizeHeader(to);
  const safeSubject = sanitizeHeader(subject);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    throw new Error("Destinatário de e-mail inválido.");
  }

  const mime = [
    "From: " + encodedWord(senderName) + " <" + senderEmail + ">",
    "To: " + recipient,
    "Subject: " + encodedWord(safeSubject),
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: 8bit",
    "",
    String(html || ""),
  ].join("\r\n");

  const accessToken = await gmailAccessToken();
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: base64Url(mime) }),
    }
  );

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail =
      payload?.error?.message ||
      payload?.error_description ||
      JSON.stringify(payload).slice(0, 240);
    throw new Error(
      "Falha ao enviar e-mail pela Gmail API: " + response.status + " " + detail
    );
  }

  return payload;
}
