import {NextResponse} from "next/server";
import {getSession} from "../../../../../lib/auth";
import {getAiTutorAccess,AI_TUTOR_PRODUCT_CODE} from "../../../../../lib/ai-tutor";
import {query} from "../../../../../lib/db";
import {buildTutorPreference,getTutorPaymentConfig,mercadoPagoRequest} from "../../../../../lib/payments";

export async function POST(request){
 const session=await getSession();if(!session)return NextResponse.redirect(new URL("/login?next=/tutor-ia",request.url),303);
 const access=await getAiTutorAccess(session.id);if(access?.active)return NextResponse.redirect(new URL("/tutor-ia",request.url),303);
 const profile=await query("select full_name,cpf,phone from user_profiles where user_id=$1 limit 1",[session.id]);
 if(!profile.rows[0]?.full_name||!profile.rows[0]?.cpf||!profile.rows[0]?.phone)return NextResponse.redirect(new URL("/perfil?erro=Complete%20nome%2C%20CPF%20e%20telefone%20antes%20do%20pagamento.",request.url),303);
 const config=getTutorPaymentConfig();if(!config.ready)return NextResponse.redirect(new URL("/tutor-ia?erro=configuracao",request.url),303);
 let orderId=null;
 try{
  const order=await query(`insert into payment_orders(user_id,provider,status,amount_cents,currency,description,product_code)
   values($1,'mercado_pago','pending',$2,'BRL',$3,$4) returning id`,[session.id,config.priceCents,config.title,AI_TUTOR_PRODUCT_CODE]);
  orderId=order.rows[0].id;
  const pref=await mercadoPagoRequest("/checkout/preferences",{method:"POST",idempotencyKey:orderId,body:buildTutorPreference({orderId,email:session.email})});
  if(!pref?.id||!pref?.init_point)throw new Error("Preferência sem URL.");
  await query("update payment_orders set provider_preference_id=$2,updated_at=now() where id=$1",[orderId,String(pref.id)]);
  return NextResponse.redirect(pref.init_point,303);
 }catch(error){
  console.error("Erro checkout CONTRAMESTRE",error);
  if(orderId)await query("update payment_orders set status='failed',raw_status=$2,updated_at=now() where id=$1",[orderId,String(error?.message||"checkout_error").slice(0,240)]).catch(()=>{});
  return NextResponse.redirect(new URL("/tutor-ia?erro=checkout",request.url),303);
 }
}