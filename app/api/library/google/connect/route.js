import crypto from "node:crypto";
import {NextResponse} from "next/server";
import {getSession} from "../../../../../lib/auth";
import {googleDriveAuthorizationUrl} from "../../../../../lib/google-drive-library";

export async function GET(request){
  const session=await getSession();
  const base=process.env.NEXT_PUBLIC_APP_URL||request.nextUrl.origin;
  if(!session)return NextResponse.redirect(new URL("/login?next=/minha-biblioteca",base));
  try{
    const state=crypto.randomBytes(24).toString("base64url");
    const response=NextResponse.redirect(googleDriveAuthorizationUrl(state));
    response.cookies.set("estibordo_drive_oauth_state",state,{
      httpOnly:true,
      secure:process.env.NODE_ENV==="production",
      sameSite:"lax",
      path:"/",
      maxAge:600
    });
    return response;
  }catch(error){
    return NextResponse.redirect(new URL("/minha-biblioteca?erro="+encodeURIComponent(error.message||"Google Drive indisponível."),base));
  }
}
