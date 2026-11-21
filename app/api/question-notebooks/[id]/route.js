import {getSession} from "../../../../lib/auth";
import {getEntitlement} from "../../../../lib/entitlement";
import {assertSameOrigin} from "../../../../lib/security";
import {editPendingNotebook,deletePendingNotebook} from "../../../../lib/notebook-management";

export const dynamic="force-dynamic";

async function authorizeMutation(){
  try{await assertSameOrigin();return null;}
  catch{return Response.json({error:"Origem inválida."},{status:403});}
}
export async function PATCH(request,{params}){
  const s=await getSession();
  if(!s)return Response.json({error:"Não autenticado."},{status:401});
  const origin=await authorizeMutation();
  if(origin)return origin;
  const entitlement=await getEntitlement(s.id);
  if(!entitlement.active&&!entitlement.trial)return Response.json({error:"Acesso inativo."},{status:403});
  const {id}=await params;
  const body=await request.json().catch(()=>null);
  if(!body||typeof body!=="object"||Array.isArray(body)){
    return Response.json({error:"Dados de edição inválidos."},{status:400});
  }
  try{
    const result=await editPendingNotebook(s.id,id,body,{trial:entitlement.trial});
    return Response.json(result,{status:result.status||200,headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    console.error("[cadernos] Erro ao editar caderno",error);
    return Response.json({error:"Não foi possível atualizar o caderno."},{status:500});
  }
}
export async function DELETE(request,{params}){
  const s=await getSession();
  if(!s)return Response.json({error:"Não autenticado."},{status:401});
  const origin=await authorizeMutation();
  if(origin)return origin;
  const {id}=await params;
  try{
    const result=await deletePendingNotebook(s.id,id);
    return Response.json(result,{status:result.status||200,headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    console.error("[cadernos] Erro ao excluir caderno",error);
    return Response.json({error:"Não foi possível excluir o caderno."},{status:500});
  }
}
