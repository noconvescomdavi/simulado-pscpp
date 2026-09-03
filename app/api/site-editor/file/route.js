import { readEditorJson, requireEditorAuth, resolveEditorFile, routeError } from '../../../../lib/site-editor/server';
export const runtime = 'nodejs';
export async function GET(request) {
  try {
    await requireEditorAuth();
    const id = new URL(request.url).searchParams.get('id');
    const file = resolveEditorFile(id);
    const data = await readEditorJson(file);
    return Response.json({ ok: true, ...data });
  } catch (error) {
    return routeError(error);
  }
}
