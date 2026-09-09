import {consumeEmailVerificationToken} from "../../../../lib/email-verification";
import {assertSameOrigin} from "../../../../lib/security";

export async function POST(request){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403});}
  const form=await request.formData();
  const token=String(form.get("token")||"").trim();
  const destination=new URL("/verificar-email",request.url);
  if(!/^[a-f0-9]{64}$/i.test(token)){
    destination.searchParams.set("erro","Link de verificação inválido ou expirado.");
    return Response.redirect(destination,303);
  }
  const ok=await consumeEmailVerificationToken(token).catch(()=>false);
  if(ok)destination.searchParams.set("ok","1");
  else destination.searchParams.set("erro","Link de verificação inválido, expirado ou já utilizado.");
  return Response.redirect(destination,303);
}
