import { getSession } from "../../../../../lib/auth";
import { finishExam } from "../../../../../lib/exams";

export async function POST(request, { params }) {
  try {
    const session = await getSession();
    if (!session) return Response.json({ error: "Não autenticado." }, { status: 401 });
    const { subject } = await params;
    const body = await request.json();
    const reason = ["manual", "timeout", "completed"].includes(body.reason) ? body.reason : "manual";
    const result = await finishExam(session.id, subject, String(body.session_id || ""), reason);
    return Response.json(result, { status: result.status || 200 });
  } catch (error) {
    console.error("Erro ao finalizar simulado:", error);
    return Response.json({ error: "Não foi possível finalizar o simulado." }, { status: 500 });
  }
}
