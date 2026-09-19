import {getSession} from "../../../../lib/auth";
import {query} from "../../../../lib/db";
import {githubLibraryConfigured,uploadLibraryPdf} from "../../../../lib/github-library";

export const runtime="nodejs";
export const maxDuration=60;

export async function GET(){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const result=await query("select id,name,mime_type,size_bytes,last_page,progress_percent,last_opened_at,created_at,updated_at from student_library_files where user_id=$1 order by coalesce(last_opened_at,updated_at,created_at) desc",[session.id]);
    return Response.json({configured:githubLibraryConfigured(),files:result.rows});
  }catch(error){return Response.json({error:error.message||"Não foi possível carregar sua biblioteca."},{status:500})}
}
export async function POST(request){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  try{
    const form=await request.formData();
    const file=form.get("file");
    if(!(file instanceof File))return Response.json({error:"Selecione um arquivo PDF."},{status:400});
    const saved=await uploadLibraryPdf(session.id,file);
    return Response.json({ok:true,file:saved});
  }catch(error){
    const msg=error.message||"Não foi possível enviar o PDF.";
    return Response.json({error:msg},{status:/95 MB|Somente|vazio/.test(msg)?400:500});
  }
}
