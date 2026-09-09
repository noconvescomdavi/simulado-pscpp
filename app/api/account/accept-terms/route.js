import {getSession} from "../../../../lib/auth";
import {query} from "../../../../lib/db";
import {TERMS_VERSION,PRIVACY_VERSION} from "../../../../lib/legal";
import {assertSameOrigin,clientIpHash} from "../../../../lib/security";

export async function POST(request){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403});}
  const session=await getSession();
  if(!session)return Response.redirect(new URL("/login",request.url),303);
  const form=await request.formData();
  if(String(form.get("accept")||"")!=="yes")return Response.redirect(new URL("/aceitar-termos?erro=1",request.url),303);
  const ipHash=await clientIpHash();
  await query(
    "insert into user_consents(user_id,terms_version,privacy_version,source,ip_hash) values($1,$2,$3,'reauth',$4)",
    [session.id,TERMS_VERSION,PRIVACY_VERSION,ipHash]
  );
  return Response.redirect(new URL("/area-do-aluno",request.url),303);
}
