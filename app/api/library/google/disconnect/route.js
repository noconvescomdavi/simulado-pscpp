import {getSession} from "../../../../../lib/auth";
import {query} from "../../../../../lib/db";
export async function POST(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  await query("delete from google_drive_connections where user_id=$1",[session.id]);
  return Response.json({ok:true});
}
