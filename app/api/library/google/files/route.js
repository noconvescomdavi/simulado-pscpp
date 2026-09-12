import {getSession} from "../../../../../lib/auth";
import {query} from "../../../../../lib/db";
import {importDrivePdf} from "../../../../../lib/google-drive-library";
export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const result=await query("select id,drive_file_id,name,mime_type,size_bytes,modified_time,web_view_link,last_page,progress_percent,last_opened_at,created_at,updated_at from student_drive_files where user_id=$1 order by coalesce(last_opened_at,updated_at,created_at) desc",[session.id]);
    return Response.json({files:result.rows});
  }catch{return Response.json({error:"Não foi possível carregar sua biblioteca."},{status:500})}
}
export async function POST(request){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const body=await request.json().catch(()=>({}));
  const ids=[...new Set((Array.isArray(body.file_ids)?body.file_ids:[]).map(x=>String(x||"").trim()).filter(Boolean))].slice(0,100);
  if(!ids.length)return Response.json({error:"Nenhum arquivo foi selecionado."},{status:400});
  const imported=[],errors=[];
  for(const id of ids){try{imported.push(await importDrivePdf(session.id,id))}catch(error){errors.push({id,error:error.message||"Falha ao importar PDF."})}}
  return Response.json({ok:imported.length>0,files:imported,errors},{status:imported.length?200:400});
}
