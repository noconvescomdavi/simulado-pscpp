import {redirect} from "next/navigation";
import {getAdmin} from "../../../lib/admin";
import {ADMIN_PERMISSIONS} from "../../../lib/admin-permissions";
import {query} from "../../../lib/db";
export const dynamic="force-dynamic";

export default async function Page({searchParams}){
  if(!(await getAdmin("admin.manage")))redirect("/admin");
  const q=await searchParams;
  const admins=await query("select u.id,u.email,u.status,coalesce(ac.is_superadmin,false) is_superadmin,coalesce(ac.permissions,'{}'::text[]) permissions from users u left join admin_access_control ac on ac.user_id=u.id where u.role='admin' order by u.email");
  return <main className="wrap admin-wrap"><div className="eyebrow">RBAC</div><h1>Permissões administrativas</h1><p>Conceda somente o acesso necessário a cada função. Superadministradores têm todas as permissões.</p>{q?.msg&&<div className="admin-notice">{q.msg}</div>}<div className="grid">{admins.rows.map(a=><article className="card" key={a.id}><h3>{a.email}</h3><p>{a.status} · {a.is_superadmin?"superadmin":"acesso granular"}</p><form action="/api/admin/permissions" method="post"><input type="hidden" name="user_id" value={a.id}/><label style={{display:"block",marginBottom:10}}><input type="checkbox" name="superadmin" value="1" defaultChecked={a.is_superadmin}/> Superadministrador</label>{ADMIN_PERMISSIONS.map(([key,label])=><label key={key} style={{display:"block",margin:"7px 0"}}><input type="checkbox" name="permission" value={key} defaultChecked={a.permissions?.includes(key)}/> {label}</label>)}<button className="btn primary" style={{marginTop:12}}>Salvar permissões</button></form></article>)}</div></main>;
}
