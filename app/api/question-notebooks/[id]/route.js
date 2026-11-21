import {getSession} from "../../../../lib/auth";
import {assertSameOrigin} from "../../../../lib/security";
import {deleteUserNotebook} from "../../../../lib/notebook-deletion";

export const dynamic="force-dynamic";

export async function DELETE(request,{params}){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});

  try{await assertSameOrigin();}
  catch{return Response.json({error:"Origem inválida."},{status:403});}

  const {id}=await params;
  try{
    const result=await deleteUserNotebook(session.id,id);
    return Response.json(result,{
      status:result.status||200,
      headers:{"Cache-Control":"private, no-store"}
    });
  }catch(error){
    console.error("[cadernos] Falha na exclusão",error);
    return Response.json({error:"Não foi possível excluir o caderno."},{status:500});
  }
}
