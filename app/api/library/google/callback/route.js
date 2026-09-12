import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getSession} from "../../../../../lib/auth";
import {exchangeGoogleCode,saveGoogleConnection} from "../../../../../lib/google-drive-library";

export async function GET(request){
  const session=await getSession();
  const base=process.env.NEXT_PUBLIC_APP_URL||request.nextUrl.origin;
  if(!session)return NextResponse.redirect(new URL("/login?next=/minha-biblioteca",base));

  const code=request.nextUrl.searchParams.get("code");
  const state=request.nextUrl.searchParams.get("state");
  const error=request.nextUrl.searchParams.get("error");
  const jar=await cookies();
  const expected=jar.get("estibordo_drive_oauth_state")?.value;

  if(error)return NextResponse.redirect(new URL("/minha-biblioteca?erro="+encodeURIComponent("Autorização do Google Drive cancelada."),base));
  if(!code||!state||!expected||state!==expected){
    return NextResponse.redirect(new URL("/minha-biblioteca?erro="+encodeURIComponent("Não foi possível validar a autorização do Google Drive."),base));
  }

  try{
    const tokens=await exchangeGoogleCode(code);
    await saveGoogleConnection(session.id,tokens);
    const response=NextResponse.redirect(new URL("/minha-biblioteca?conectado=1",base));
    response.cookies.set("estibordo_drive_oauth_state","",{path:"/",maxAge:0});
    return response;
  }catch(err){
    return NextResponse.redirect(new URL("/minha-biblioteca?erro="+encodeURIComponent(err.message||"Falha ao conectar Google Drive."),base));
  }
}
