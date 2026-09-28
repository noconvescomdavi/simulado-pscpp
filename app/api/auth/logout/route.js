import { clearSession } from "../../../../lib/auth";
import { assertSameOrigin } from "../../../../lib/security";
import {desktopLocal,isDesktopRuntime} from "../../../../lib/desktop-local";

function logoutRedirect(request) {
  const url = new URL("/logout", request.url);
  return Response.redirect(url, 303);
}

export async function POST(request) {
  try { await assertSameOrigin(); } catch { return Response.json({ error: "Origem inválida." }, { status: 403 }); }
  await clearSession();
  if(isDesktopRuntime())await desktopLocal("/v1/auth/logout",{method:"POST",body:{}});
  return logoutRedirect(request);
}

export async function GET(request) {
  await clearSession();
  if(isDesktopRuntime())await desktopLocal("/v1/auth/logout",{method:"POST",body:{}});
  return logoutRedirect(request);
}
