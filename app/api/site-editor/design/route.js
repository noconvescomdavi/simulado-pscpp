import { assertSameOrigin, requireEditorAuth, routeError } from '../../../../lib/site-editor/server';
import { readDesign } from '../../../../lib/site-editor/design-server';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireEditorAuth();
    const data = await readDesign();
    return Response.json({ ok: true, ...data });
  } catch (error) {
    return routeError(error);
  }
}
