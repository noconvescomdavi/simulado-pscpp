import { getAccessContext } from "../../../lib/access";

export const dynamic = "force-dynamic";

export async function GET() {
  const { session, access, active } = await getAccessContext();
  if (!session) return Response.json({ active: false, error: "Não autenticado." }, { status: 401 });
  return Response.json(
    { active, access },
    { headers: { "Cache-Control": "private, no-store" } }
  );
}
