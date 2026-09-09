import {query} from "../../../../lib/db";
import {createEmailVerificationToken,sendVerificationEmail} from "../../../../lib/email-verification";
import {assertSameOrigin,clientIpHash,consumeRateLimit,identityHash,rateLimitResponse} from "../../../../lib/security";

const GENERIC="Se a conta precisar de verificação, enviaremos um novo link.";

export async function POST(request){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403});}
  const form=await request.formData();
  const email=String(form.get("email")||"").trim().toLowerCase();
  const ipHash=await clientIpHash();
  const [ipLimit,emailLimit]=await Promise.all([
    consumeRateLimit({action:"verify_email_ip",keyHash:ipHash,limit:8,windowSeconds:3600}),
    consumeRateLimit({action:"verify_email_account",keyHash:identityHash(email),limit:4,windowSeconds:3600})
  ]);
  if(!ipLimit.allowed)return rateLimitResponse(ipLimit);
  if(!emailLimit.allowed)return rateLimitResponse(emailLimit);
  const result=await query("select id,email,email_verified,email_verification_required_at from users where lower(email)=lower($1) and status='active' limit 1",[email]);
  const user=result.rows[0];
  if(user && user.email_verification_required_at && !user.email_verified){
    const token=await createEmailVerificationToken(user.id);
    await sendVerificationEmail({to:user.email,verifyUrl:token.url});
  }
  const url=new URL("/verificar-email",request.url);
  if(email)url.searchParams.set("email",email);
  url.searchParams.set("msg",GENERIC);
  return Response.redirect(url,303);
}
