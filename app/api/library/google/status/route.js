import {getSession} from "../../../../../lib/auth";
import {googleDriveStatus} from "../../../../../lib/google-drive-library";
export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{return Response.json(await googleDriveStatus(session.id))}
  catch(error){return Response.json({error:error.message||"Não foi possível verificar o Google Drive."},{status:500})}
}
