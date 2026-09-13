import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {query,withTransaction} from "../../../../../lib/db";
import {exchangeGoogleAuthCode} from "../../../../../lib/google-auth";
import {createSession} from "../../../../../lib/auth";
import {beginStudentMfaChallenge} from "../../../../../lib/student-mfa";
import {TERMS_VERSION,PRIVACY_VERSION} from "../../../../../lib/legal";
import {clientIpHash} from "../../../../../lib/security";

export async function GET(request){
  const base=process.env.NEXT_PUBLIC_APP_URL||request.nextUrl.origin;
  const jar=await cookies();
  const code=request.nextUrl.searchParams.get("code"),state=request.nextUrl.searchParams.get("state"),error=request.nextUrl.searchParams.get("error");
  const expected=jar.get("estibordo_google_oauth_state")?.value;
  const rawIntent=jar.get("estibordo_google_oauth_intent")?.value||"login|0";
  const [intent,termsFlag]=rawIntent.split("|");
  const clear=(response)=>{response.cookies.set("estibordo_google_oauth_state","",{path:"/",maxAge:0});response.cookies.set("estibordo_google_oauth_intent","",{path:"/",maxAge:0});return response};
  if(error||!code||!state||!expected||state!==expected)return clear(NextResponse.redirect(new URL("/login?erro="+encodeURIComponent("Não foi possível validar o login com Google."),base)));
  try{
    const profile=await exchangeGoogleAuthCode(code);
    const email=String(profile.email).trim().toLowerCase();
    const ipHash=await clientIpHash();
    let createdNow=false;
    let user=await withTransaction(async client=>{
      const identity=await client.query("select u.* from oauth_identities oi join users u on u.id=oi.user_id where oi.provider='google' and oi.provider_subject=$1 limit 1",[profile.sub]);
      if(identity.rowCount)return identity.rows[0];
      const existing=await client.query("select * from users where lower(email)=lower($1) limit 1",[email]);
      if(existing.rowCount){
        const u=existing.rows[0];
        await client.query("insert into oauth_identities(user_id,provider,provider_subject,provider_email) values($1,'google',$2,$3) on conflict(provider,provider_subject) do nothing",[u.id,profile.sub,email]);
        if(profile.name)await client.query("insert into user_profiles(user_id,full_name) values($1,$2) on conflict(user_id) do update set full_name=case when user_profiles.full_name='' then excluded.full_name else user_profiles.full_name end,updated_at=now()",[u.id,String(profile.name).slice(0,180)]);
        return u;
      }
      if(intent!=="signup"||termsFlag!=="1")return null;
      const ins=await client.query("insert into users(email,password_hash,email_verified,email_verified_at,email_verification_required_at,auth_provider) values($1,null,true,now(),null,'google') returning *",[email]);
      createdNow=true;
      const u=ins.rows[0];
      await client.query("insert into oauth_identities(user_id,provider,provider_subject,provider_email) values($1,'google',$2,$3)",[u.id,profile.sub,email]);
      await client.query("insert into user_profiles(user_id,full_name) values($1,$2)",[u.id,String(profile.name||"Aluno ESTIBORDO").slice(0,180)]);
      await client.query("insert into user_access(user_id,product_code,status,lifetime) values($1,'pscpp-vitalicio','pending',false) on conflict do nothing",[u.id]);
      await client.query("insert into user_consents(user_id,terms_version,privacy_version,source,ip_hash) values($1,$2,$3,'google_registration',$4)",[u.id,TERMS_VERSION,PRIVACY_VERSION,ipHash]);
      return u;
    });
    if(!user)return clear(NextResponse.redirect(new URL("/cadastro?erro="+encodeURIComponent("Não existe conta com este Google. Use Criar conta com Google."),base)));
    if(user.status!=="active")return clear(NextResponse.redirect(new URL("/login?erro="+encodeURIComponent("Conta indisponível."),base)));
    if(user.student_mfa_enabled){await beginStudentMfaChallenge(user);return clear(NextResponse.redirect(new URL("/mfa",base)))}
    await query("update users set last_login_at=now(),updated_at=now() where id=$1",[user.id]);
    await createSession(user);
    const target=createdNow?"/completar-cadastro":(intent==="signup"?"/area-do-aluno?novo=1":"/area-do-aluno");
    return clear(NextResponse.redirect(new URL(target,base)));
  }catch(err){console.error("Google auth error",err);return clear(NextResponse.redirect(new URL("/login?erro="+encodeURIComponent("Login com Google indisponível no momento."),base)))}
}