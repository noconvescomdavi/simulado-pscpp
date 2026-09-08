import {getAdmin} from "../../../../../../lib/admin";
import {query} from "../../../../../../lib/db";
import {assertSameOrigin} from "../../../../../../lib/security";

export const dynamic="force-dynamic";
const MAX_FILE=512*1024*1024;
const MAX_PART=2*1024*1024;

function key(){return String(process.env.OPENAI_API_KEY||"").trim();}
async function openai(path,{method="POST",body,form}={}){
  if(!key())throw new Error("OPENAI_API_KEY não configurada.");
  const response=await fetch("https://api.openai.com/v1"+path,{
    method,
    headers:{Authorization:`Bearer ${key()}`,...(body?{"Content-Type":"application/json"}:{})},
    body:form||(body?JSON.stringify(body):undefined),
    cache:"no-store"
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(payload?.error?.message||`OpenAI HTTP ${response.status}`);
  return payload;
}
async function store(){
  const current=await query("select vector_store_id from ai_tutor_settings where id=1");
  if(current.rows[0]?.vector_store_id)return current.rows[0].vector_store_id;
  const created=await openai("/vector_stores",{body:{name:"ESTIBORDO — CONTRAMESTRE — Bibliografia PSCPP"}});
  if(!created?.id)throw new Error("A OpenAI não retornou o Vector Store.");
  await query("update ai_tutor_settings set vector_store_id=$1,updated_at=now() where id=1",[created.id]);
  return created.id;
}

export async function POST(request){
  const admin=await getAdmin();if(!admin)return Response.json({error:"Acesso negado."},{status:403});
  try{
    await assertSameOrigin();
    const input=await request.json();
    const action=String(input.action||"");
    if(action==="init"){
      const bytes=Number(input.bytes||0),filename=String(input.filename||"bibliografia.pdf").slice(0,500);
      if(!filename.toLowerCase().endsWith(".pdf"))throw new Error("Somente PDF é permitido.");
      if(bytes<=0||bytes>MAX_FILE)throw new Error("O PDF deve ter no máximo 512 MB.");
      const upload=await openai("/uploads",{body:{purpose:"user_data",filename,bytes,mime_type:"application/pdf"}});
      if(!upload?.id)throw new Error("A OpenAI não retornou o Upload ID.");
      return Response.json({upload_id:upload.id,part_size:MAX_PART});
    }
    if(action==="complete"){
      const uploadId=String(input.upload_id||""),partIds=Array.isArray(input.part_ids)?input.part_ids.filter(Boolean):[];
      if(!uploadId.startsWith("upload_")||!partIds.length)throw new Error("Upload incompleto.");
      const completed=await openai(`/uploads/${encodeURIComponent(uploadId)}/complete`,{body:{part_ids:partIds}});
      const fileId=completed?.file?.id;
      if(!fileId||!String(fileId).startsWith("file-"))throw new Error("A OpenAI não retornou o File ID final.");
      const vectorStoreId=await store();
      const attached=await openai(`/vector_stores/${encodeURIComponent(vectorStoreId)}/files`,{body:{file_id:fileId,attributes:{filename:String(input.filename||"bibliografia.pdf").slice(0,500),source:"estibordo_pscpp"}}});
      await query(`insert into ai_tutor_library_files(openai_file_id,vector_store_id,filename,bytes,status)
        values($1,$2,$3,$4,$5) on conflict(openai_file_id) do update set status=excluded.status,updated_at=now()`,
        [fileId,vectorStoreId,String(input.filename||"bibliografia.pdf").slice(0,500),Number(input.bytes||0),String(attached?.status||"in_progress")]);
      return Response.json({ok:true,file_id:fileId,vector_store_id:vectorStoreId,status:attached?.status||"in_progress"});
    }
    if(action==="cancel"){
      const uploadId=String(input.upload_id||"");
      if(!uploadId.startsWith("upload_"))throw new Error("Upload ID inválido.");
      await openai(`/uploads/${encodeURIComponent(uploadId)}/cancel`);
      return Response.json({ok:true});
    }
    throw new Error("Ação inválida.");
  }catch(error){return Response.json({error:String(error?.message||error)},{status:Number(error?.status)||400})}
}

export async function PUT(request){
  const admin=await getAdmin();if(!admin)return Response.json({error:"Acesso negado."},{status:403});
  try{
    await assertSameOrigin();
    const uploadId=String(request.headers.get("x-upload-id")||"");
    if(!uploadId.startsWith("upload_"))throw new Error("Upload ID ausente ou inválido.");
    const buffer=await request.arrayBuffer();
    if(!buffer.byteLength||buffer.byteLength>MAX_PART)throw new Error("Parte inválida ou acima de 2 MB.");
    const form=new FormData();
    form.set("data",new Blob([buffer],{type:"application/octet-stream"}),"part.bin");
    const part=await openai(`/uploads/${encodeURIComponent(uploadId)}/parts`,{form});
    if(!part?.id)throw new Error("A OpenAI não retornou o Part ID.");
    return Response.json({part_id:part.id});
  }catch(error){return Response.json({error:String(error?.message||error)},{status:Number(error?.status)||400})}
}
