import {NextResponse} from "next/server";
import {googleAuthConfigured,googleAuthState,googleAuthUrl} from "../../../../../lib/google-auth";

export async function GET(request){
  const base=process.env.NEXT_PUBLIC_APP_URL||request.nextUrl.origin;
  if(!googleAuthConfigured())return NextResponse.redirect(new URL("/login?erro="+encodeURIComponent("Login com Google ainda não foi configurado."),base));
  const intent=request.nextUrl.searchParams.get("intent")==="signup"?"signup":"login";
  const terms=request.nextUrl.searchParams.get("terms")==="1";
  if(intent==="signup"&&!terms)return NextResponse.redirect(new URL("/cadastro?erro="+encodeURIComponent("Aceite os Termos e a Política de Privacidade antes de continuar com o Google."),base));
  const state=googleAuthState();
  const response=NextResponse.redirect(googleAuthUrl(state));
  response.cookies.set("estibordo_google_oauth_state",state,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:600});
  response.cookies.set("estibordo_google_oauth_intent",intent+"|"+(terms?"1":"0"),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:600});
  return response;
}