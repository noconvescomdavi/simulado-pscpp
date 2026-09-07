import { getAdmin } from "../../../../lib/admin";
import { clientIpHash, consumeRateLimit, rateLimitResponse } from "../../../../lib/security";
import {
  assertSameOrigin,
  setEditorCookie,
  validatePassword,
} from "../../../../lib/site-editor/server";

export async function POST(request) {
  try {
    await assertSameOrigin();

    const admin = await getAdmin();
    if (!admin) {
      return Response.json(
        { ok: false, error: "Acesso administrativo obrigatório." },
        { status: 403 }
      );
    }

    const limit = await clientIpHash().then((keyHash) =>
      consumeRateLimit({ action: "site_editor_login_ip", keyHash, limit: 8, windowSeconds: 900 })
    );
    if (!limit.allowed) return rateLimitResponse(limit);

    const { password } = await request.json().catch(() => ({}));
    if (!validatePassword(password || "")) {
      return Response.json({ ok: false, error: "Senha incorreta." }, { status: 401 });
    }

    await setEditorCookie();
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { ok: false, error: "Não foi possível autenticar." },
      { status: 400 }
    );
  }
}
