import { getAccessContext, accessDeniedResponse } from "../../../../../lib/access";
import { listSyllabusTopics } from "../../../../../lib/library";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const { session, access, active } = await getAccessContext();

  if (!session) {
    return Response.json({ error: "Não autenticado." }, { status: 401 });
  }

  if (!active) {
    return accessDeniedResponse(access);
  }

  const { subject } = await params;
  const url = new URL(request.url);

  const topics = await listSyllabusTopics(
    decodeURIComponent(subject),
    url.searchParams.get("limit") || 2000
  );

  return Response.json(
    { topics },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
