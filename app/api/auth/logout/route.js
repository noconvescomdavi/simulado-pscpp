import { clearSession } from "../../../../lib/auth";
import { assertSameOrigin } from "../../../../lib/security";

function logoutRedirect(request) {
  const url = new URL("/logout", request.url);
  return Response.redirect(url, 303);
}

export async function POST(request) {
  try { await assertSameOrigin(); } catch { return Response.json({ error: "Origem inválida." }, { status: 403 }); }
  await clearSession();
  return logoutRedirect(request);
}

