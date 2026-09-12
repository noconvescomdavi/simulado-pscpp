import {getSession} from "../../../../../../../lib/auth";
import {query} from "../../../../../../../lib/db";
export async function POST(request,{params}){
  const session=await getSession();
  if(!session)return Response.json({error:"Não autenticado."},{status:401});
  const {id}=await params;
  const body=await request.json().catch(()=>({}));
  const page=Math.max(1,Math.min(100000,Math.trunc(Number(body.page)||1)));
  const progress=Math.max(0,Math.min(100,Number(body.progress_percent)||0));
  const result=await query("update student_drive_files set last_page=$3,progress_percent=greatest(progress_percent,$4),last_opened_at=now(),updated_at=now() where id=$1 and user_id=$2 returning id,last_page,progress_percent,last_opened_at",[id,session.id,page,progress]);
  if(!result.rowCount)return Response.json({error:"Documento não encontrado."},{status:404});
  return Response.json({ok:true,file:result.rows[0]});
}
