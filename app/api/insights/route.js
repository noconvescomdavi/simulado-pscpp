import {getSession} from "../../../lib/auth";
import {getStudentInsights} from "../../../lib/student-insights";
export const dynamic="force-dynamic";
export async function GET(){const s=await getSession();if(!s)return Response.json({error:"Não autenticado"},{status:401});return Response.json(await getStudentInsights(s.id),{headers:{"Cache-Control":"private, no-store"}});}