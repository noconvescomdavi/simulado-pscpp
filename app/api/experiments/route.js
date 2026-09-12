import {getSession} from "../../../lib/auth";
import {getExperimentVariant} from "../../../lib/experiments";
export const dynamic="force-dynamic";
export async function GET(req){const s=await getSession();if(!s)return Response.json({error:"Não autenticado"},{status:401});const key=new URL(req.url).searchParams.get("key")||"";const variant=await getExperimentVariant(s.id,key);if(!variant)return Response.json({error:"Experimento inválido"},{status:400});return Response.json({key,variant},{headers:{"Cache-Control":"private, no-store"}});}
