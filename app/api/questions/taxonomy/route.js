import {getSession} from "../../../../lib/auth";
import {taxonomyCatalog} from "../../../../lib/question-taxonomy";
export const dynamic="force-dynamic";
export async function GET(){
 const s=await getSession();if(!s)return Response.json({error:"Não autenticado"},{status:401});
 return Response.json(taxonomyCatalog(),{headers:{"Cache-Control":"private, max-age=300"}});
}
