import {getSession} from "../../../lib/auth";
import {getStudentPreferences,saveStudentPreferences} from "../../../lib/student-preferences";
import {assertSameOrigin} from "../../../lib/security";
export const dynamic="force-dynamic";
export async function GET(){const s=await getSession();if(!s)return Response.json({error:"Não autenticado"},{status:401});return Response.json({preferences:await getStudentPreferences(s.id)},{headers:{"Cache-Control":"private, no-store"}});}
export async function POST(req){try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida"},{status:403});}const s=await getSession();if(!s)return Response.json({error:"Não autenticado"},{status:401});const b=await req.json().catch(()=>({}));return Response.json({ok:true,preferences:await saveStudentPreferences(s.id,b)});}
