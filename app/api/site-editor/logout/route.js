import { assertSameOrigin, clearEditorCookie } from '../../../../lib/site-editor/server';
export async function POST() {
  await assertSameOrigin();
  await clearEditorCookie();
  return Response.json({ ok: true });
}
