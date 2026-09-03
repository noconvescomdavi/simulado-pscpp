import { clearSession } from "../../../../lib/auth";

function logoutRedirect(request) {
  const url = new URL("/logout", request.url);
  return Response.redirect(url, 303);
}

export async function POST(request) {
  await clearSession();
  return logoutRedirect(request);
}

export async function GET(request) {
  await clearSession();
  return logoutRedirect(request);
}
