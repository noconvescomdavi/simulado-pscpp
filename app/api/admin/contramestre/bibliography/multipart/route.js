import {getAdmin} from "../../../../../../lib/admin";
import {query} from "../../../../../../lib/db";

export const dynamic="force-dynamic";
const MAX_FILE=512*1024*1024;
const MAX_PART=2*1024*1024;

function key(){return String(process.env.OPENAI_API_KEY||"").trim();}
async function openai(path,{method="POST",body,form}={}){
  if(!key())throw new Error("OPENAI_API_KEY não configurada.");
  const r=await fetch("https://api.openai.com/v1"+path,{
    method,headers:{Authorization:`Bearer ${key()}`,...(body?{"Content-Type":"application/json"}:{})},
    body:form|| (body?JSON.stringify(body):undefined),cache:"no-store"
  });
  const p=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(p?.error?.message||`OpenAI HTTP ${r.status}`);
  return p;
}
async function store(){
  const q=await query("select vector_store_id from ai_tutor_settings where id=1");
  if(q.rows[0]?.vector_store_id)return q.rows[0].vector_store_id;
  const v=await openai("/vector_stores",{body:{name:"ESTIBORDO — CONTRAMESTRE — Bibliografia PSCPP"}});
  await query("update ai_tutor_settings set vector_store_id=$1,updated_at=now() where id=1",[v.id]);
  return v.id;
}

export async function POST(request){
  const admin=await getAdmin(); if(!admin)return Response.json({error:"Acesso negado."},{status:403});
  try{
    const input=await request.json();
    const action=String(input.action||"");
    if(action==="init"){
      const bytes=Number(input.bytes||0),filename=String(input.filename||"bibliografia.pdf").slice(0,500);
      if(!filename.toLowerCase().endsWith(".pdf"))throw new Error("Somente PDF é permitido.");
      if(bytes<=0||bytes>MAX_FILE)throw new Error("O PDF deve ter no máximo 512 MB.");
      const upload=await openai("/uploads",{body:{purpose:"user_data",filename,bytes,mime_type:"application/pdf"}});
      return Response.json({upload_id:upload.id,part_size:MAX_PART});
    }
    if(action==="complete"){
      const uploadId=String(input.upload_id||""),partIds=Array.isArray(input.part_ids)?input.part_ids:[];
      if(!uploadId||!partIds.length)throw new Error("Upload incompleto.");
      const completed=await openai(`/uploads/${encodeURIComponent(uploadId)}/complete`,{body:{part_ids:partIds}});
      const fileId=completed.file?.id||completed.file_id||completed.id;
      if(!fileId||!String(fileId).startsWith("file-"))throw new Error("A OpenAI não retornou o File ID final.");
      const vectorStoreId=await store();
      const attached=await openai(`/vector_stores/${encodeURIComponent(vectorStoreId)}/files`,{body:{file_id:fileId,attributes:{filename:String(input.filename||"bibliografia.pdf").slice(0,500),source:"estibordo_pscpp"}}});
      await query(`insert into ai_tutor_library_files(openai_file_id,vector_store_id,filename,bytes,status)
        values($1,$2,$3,$4,$5) on conflict(openai_file_id) do update set status=excluded.status,updated_at=now()`,
        [fileId,vectorStoreId,String(input.filename||"bibliografia.pdf").slice(0,500),Number(input.bytes||0),String(attached.status||"in_progress")]);
      return Response.json({ok:true,file_id:fileId,vector_store_id:vectorStoreId,status:attached.status||"in_progress"});
    }
    throw new Error("Ação inválida.");
  }catch(e){return Response.json({error:String(e?.message||e)},{status:400});}
}

export async function PUT(request){
  const admin=await getAdmin(); if(!admin)return Response.json({error:"Acesso negado."},{status:403});
  try{
    const uploadId=request.headers.get("x-upload-id");
    if(!uploadId)throw new Error("Upload ID ausente.");
    const buffer=await request.arrayBuffer();
    if(!buffer.byteLength||buffer.byteLength>MAX_PART)throw new Error("Parte inválida ou acima de 4 MB.");
    const form=new FormData();
    form.set("data",new Blob([buffer],{type:"application/octet-stream"}),"part.bin");
    const part=await openai(`/uploads/${encodeURIComponent(uploadId)}/parts`,{form});
    return Response.json({part_id:part.id});
  }catch(e){return Response.json({error:String(e?.message||e)},{status:400});}
}
