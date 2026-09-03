import { assertSameOrigin, requireEditorAuth, routeError } from '../../../../lib/site-editor/server';
import { saveUpload } from '../../../../lib/site-editor/design-server';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await assertSameOrigin();
    await requireEditorAuth();
    const form = await request.formData();
    const file = form.get('file');
    const result = await saveUpload(file);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return routeError(error);
  }
}
