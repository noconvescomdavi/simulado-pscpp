import {getAdmin} from "../../../../lib/admin";
import {updatePlatformPricing} from "../../../../lib/pricing";
import {query} from "../../../../lib/db";
import {assertSameOrigin} from "../../../../lib/security";

export async function POST(req){
  try{await assertSameOrigin();}catch(error){
    return Response.json({error:"Origem inválida."},{status:Number(error?.status)||403});
  }

  const admin=await getAdmin("admin.manage");
  if(!admin)return Response.json({error:"Acesso negado."},{status:403});

  try{
    const body=await req.json().catch(()=>({}));
    const before=await query(
      "select setting_key,setting_value from platform_settings where setting_key in ('subscription_price_cents','contramestre_price_cents')"
    ).catch(()=>({rows:[]}));

    const pricing=await updatePlatformPricing({
      subscriptionPriceCents:body.subscriptionPriceCents,
      contramestrePriceCents:body.contramestrePriceCents,
      actorUserId:admin.id
    });

    await query(
      `insert into admin_audit_log(actor_user_id,action,entity_type,entity_key,before_data,after_data)
       values($1,'pricing_update','platform_settings','commercial_pricing',$2::jsonb,$3::jsonb)`,
      [admin.id,JSON.stringify(before.rows),JSON.stringify(pricing)]
    ).catch(()=>{});

    return Response.json({ok:true,pricing});
  }catch(error){
    console.error("Erro ao atualizar preços:",error);
    return Response.json({error:String(error?.message||"Não foi possível atualizar os preços.")},{status:Number(error?.status)||500});
  }
}
