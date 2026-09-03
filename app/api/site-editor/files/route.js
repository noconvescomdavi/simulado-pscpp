import { editorFiles, editorMode, requireEditorAuth, routeError } from '../../../../lib/site-editor/server';
export const runtime = 'nodejs';
export async function GET() {
  try {
    await requireEditorAuth();
    return Response.json({ ok: true, files: editorFiles(), mode: editorMode() });
  } catch (error) {
    return routeError(error);
  }
}
