import crypto from "node:crypto";

function appUrl(){return String(process.env.NEXT_PUBLIC_APP_URL||"https://simulado-pscpp.vercel.app").replace(/\/$/,"")}
function clientId(){return String(process.env.GOOGLE_AUTH_CLIENT_ID||"").trim()}
function clientSecret(){return String(process.env.GOOGLE_AUTH_CLIENT_SECRET||"").trim()}
export function googleAuthConfigured(){return Boolean(clientId()&&clientSecret())}
export function googleAuthState(){return crypto.randomBytes(24).toString("base64url")}
export function googleAuthUrl(state){
  if(!googleAuthConfigured())throw new Error("Google Login não configurado.");
  const u=new URL("https://accounts.google.com/o/oauth2/v2/auth");
  u.searchParams.set("client_id",clientId());u.searchParams.set("redirect_uri",appUrl()+"/api/auth/google/callback");
  u.searchParams.set("response_type","code");u.searchParams.set("scope","openid email profile");
  u.searchParams.set("state",state);u.searchParams.set("prompt","select_account");
  return u.toString();
}
export async function exchangeGoogleAuthCode(code){
  const r=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({code:String(code),client_id:clientId(),client_secret:clientSecret(),redirect_uri:appUrl()+"/api/auth/google/callback",grant_type:"authorization_code"})});
  const j=await r.json().catch(()=>({}));if(!r.ok||!j.access_token)throw new Error("Falha ao validar login Google.");
  const u=await fetch("https://openidconnect.googleapis.com/v1/userinfo",{headers:{Authorization:"Bearer "+j.access_token}});
  const profile=await u.json().catch(()=>({}));if(!u.ok||!profile.sub||!profile.email||profile.email_verified!==true)throw new Error("Conta Google sem e-mail verificado.");
  return profile;
}
