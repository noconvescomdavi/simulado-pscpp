import { assertSameOrigin, requireEditorAuth, routeError } from '../../../../../lib/site-editor/server';
import { saveDesign } from '../../../../../lib/site-editor/design-server';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await assertSameOrigin();
    await requireEditorAuth();
    const { content, sha } = await request.json();
    if (!content || typeof content !== 'object') {
      return Response.json({ ok: false, error: 'Design inválido.' }, { status: 400 });
    }
    const result = await saveDesign(content, sha);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    return routeError(error);
  }
}
