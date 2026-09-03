import { assertSameOrigin, setEditorCookie, validatePassword } from '../../../../lib/site-editor/server';

export async function POST(request) {
  try {
    await assertSameOrigin();
    const { password } = await request.json();
    if (!validatePassword(password || '')) {
      return Response.json({ ok: false, error: 'Senha incorreta.' }, { status: 401 });
    }
    await setEditorCookie();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: 'Não foi possível autenticar.' }, { status: 400 });
  }
}
