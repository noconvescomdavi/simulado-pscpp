import {getSession} from "../../../../../../../lib/auth";
import {query} from "../../../../../../../lib/db";
import {driveApi} from "../../../../../../../lib/google-drive-library";
export async function GET(request,{params}){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const {id}=await params;
  const result=await query("select id,drive_file_id,name,mime_type from student_drive_files where id=$1 and user_id=$2 limit 1",[id,session.id]);
  const file=result.rows[0];
  if(!file)return Response.json({error:"Documento não encontrado."},{status:404});
  try{
    const upstream=await driveApi(session.id,"files/"+encodeURIComponent(file.drive_file_id)+"?alt=media&supportsAllDrives=true");
    if(!upstream.ok){
      const data=await upstream.json().catch(()=>({}));
      return Response.json({error:data.error?.message||"Não foi possível baixar o PDF do Google Drive."},{status:upstream.status});
    }
    return new Response(upstream.body,{status:200,headers:{
      "Content-Type":"application/pdf",
      "Cache-Control":"private, no-store, max-age=0",
      "X-Content-Type-Options":"nosniff"
    }});
  }catch(error){return Response.json({error:error.message||"Não foi possível abrir o PDF."},{status:502})}
}
