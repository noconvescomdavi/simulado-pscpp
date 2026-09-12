import {getSession} from "../../../../../lib/auth";
import {getGoogleAccessToken,googleDriveConfigured} from "../../../../../lib/google-drive-library";
export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  if(!googleDriveConfigured())return Response.json({error:"Integração Google Drive ainda não configurada."},{status:503});
  try{
    const accessToken=await getGoogleAccessToken(session.id);
    return Response.json({accessToken,apiKey:process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY,appId:process.env.NEXT_PUBLIC_GOOGLE_DRIVE_APP_ID},{headers:{"Cache-Control":"no-store, private"}});
  }catch(error){return Response.json({error:error.message||"Não foi possível abrir o seletor do Google Drive."},{status:401})}
}
