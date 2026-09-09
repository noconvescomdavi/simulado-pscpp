import {NextResponse} from "next/server";
import {getAdmin,isUuid} from "../../../../lib/admin";
import {ADMIN_PERMISSIONS} from "../../../../lib/admin-permissions";
import {query} from "../../../../lib/db";
import {assertSameOrigin} from "../../../../lib/security";
import {logAdminAction} from "../../../../lib/admin-audit";

export async function POST(request){
  try{await assertSameOrigin();}catch{return Response.json({error:"Origem inválida."},{status:403});}
  const admin=await getAdmin("admin.manage");
  if(!admin)return Response.json({error:"Acesso negado."},{status:403});
  const form=await request.formData();
  const userId=String(form.get("user_id")||"");
  if(!isUuid(userId))return Response.json({error:"Usuário inválido."},{status:400});
  const superadmin=form.get("superadmin")==="1";
  const allowed=new Set(ADMIN_PERMISSIONS.map(x=>x[0]));
  const permissions=form.getAll("permission").map(String).filter(x=>allowed.has(x));
  if(userId===admin.id&&!superadmin)return Response.json({error:"Você não pode remover seu próprio acesso de superadministrador."},{status:400});
  const target=(await query("select id,email,role from users where id=$1",[userId])).rows[0];
  if(!target||target.role!=="admin")return Response.json({error:"Conta administrativa não encontrada."},{status:404});
  await query("insert into admin_access_control(user_id,is_superadmin,permissions,updated_at) values($1,$2,$3,now()) on conflict(user_id) do update set is_superadmin=excluded.is_superadmin,permissions=excluded.permissions,updated_at=now()",[userId,superadmin,permissions]);
  await logAdminAction({admin,action:"admin_permissions_update",entityType:"admin",entityKey:userId,afterData:{email:target.email,is_superadmin:superadmin,permissions}});
  const url=new URL("/admin/permissoes",request.url);url.searchParams.set("msg","Permissões atualizadas.");
  return NextResponse.redirect(url,{status:303});
}
