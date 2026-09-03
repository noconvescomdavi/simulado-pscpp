import { assertSameOrigin, requireEditorAuth, resolveEditorFile, routeError, saveEditorJson, editorMode } from '../../../../lib/site-editor/server';
export const runtime = 'nodejs';
export async function POST(request) {
  try {
    await assertSameOrigin();
    await requireEditorAuth();
    const { id, content, sha, message } = await request.json();
    if (!content || typeof content !== 'object') {
      return Response.json({ ok: false, error: 'Conteúdo inválido.' }, { status: 400 });
    }
    const file = resolveEditorFile(id);
    const result = await saveEditorJson(file, content, sha, message);
    return Response.json({ ok: true, mode: editorMode(), ...result });
  } catch (error) {
    return routeError(error);
  }
}
