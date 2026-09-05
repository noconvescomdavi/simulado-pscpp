import {getAdmin} from "../../../../../lib/admin";
import {query} from "../../../../../lib/db";

export const dynamic="force-dynamic";

function openAiKey(){
  return String(process.env.OPENAI_API_KEY||"").trim();
}

async function openAiJson(path,{method="GET",body}={}){
  const key=openAiKey();
  if(!key)throw new Error("OPENAI_API_KEY não configurada.");
  const response=await fetch("https://api.openai.com/v1"+path,{
    method,
    headers:{Authorization:`Bearer ${key}`,Accept:"application/json",...(body?{"Content-Type":"application/json"}:{})},
    body:body?JSON.stringify(body):undefined,
    cache:"no-store"
  });
  const payload=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(payload?.error?.message||`OpenAI HTTP ${response.status}`);
  return payload;
}

async function ensureVectorStore(){
  const current=await query("select vector_store_id from ai_tutor_settings where id=1");
  if(current.rows[0]?.vector_store_id)return current.rows[0].vector_store_id;
  const created=await openAiJson("/vector_stores",{method:"POST",body:{name:"ESTIBORDO — CONTRAMESTRE — Bibliografia PSCPP"}});
  if(!created?.id)throw new Error("A OpenAI não retornou o Vector Store.");
  await query("update ai_tutor_settings set vector_store_id=$1,updated_at=now() where id=1",[created.id]);
  return created.id;
}

export async function GET(){
  const admin=await getAdmin();
  if(!admin)return Response.json({error:"Acesso negado."},{status:403});
  const [settings,files]=await Promise.all([
    query("select vector_store_id,updated_at from ai_tutor_settings where id=1"),
    query("select id,openai_file_id,vector_store_id,filename,bytes,status,created_at,updated_at from ai_tutor_library_files order by created_at desc limit 200")
  ]);
  return Response.json({ready:Boolean(openAiKey()),settings:settings.rows[0]||{},files:files.rows});
}

export async function POST(request){
  const admin=await getAdmin();
  if(!admin)return Response.json({error:"Acesso negado."},{status:403});
  if(!openAiKey())return Response.json({error:"Configure OPENAI_API_KEY antes de enviar a bibliografia."},{status:503});

  const form=await request.formData();
  const incoming=form.getAll("files").filter(file=>file&&typeof file.arrayBuffer==="function");
  if(!incoming.length)return Response.json({error:"Selecione ao menos um PDF."},{status:400});
  if(incoming.length>10)return Response.json({error:"Envie no máximo 10 arquivos por vez."},{status:400});

  const vectorStoreId=await ensureVectorStore();
  const uploaded=[];

  for(const file of incoming){
    const name=String(file.name||"bibliografia.pdf");
    if(!name.toLowerCase().endsWith(".pdf")||file.type!=="application/pdf"){
      uploaded.push({filename:name,error:"Somente PDF é permitido."});
      continue;
    }
    if(Number(file.size||0)>50*1024*1024){
      uploaded.push({filename:name,error:"Arquivo acima de 50 MB."});
      continue;
    }

    try{
      const data=new FormData();
      data.set("purpose","user_data");
      data.set("file",file,name);
      const upload=await fetch("https://api.openai.com/v1/files",{
        method:"POST",
        headers:{Authorization:`Bearer ${openAiKey()}`},
        body:data
      });
      const filePayload=await upload.json().catch(()=>({}));
      if(!upload.ok)throw new Error(filePayload?.error?.message||`Upload HTTP ${upload.status}`);

      const attached=await openAiJson(`/vector_stores/${encodeURIComponent(vectorStoreId)}/files`,{
        method:"POST",
        body:{file_id:filePayload.id,attributes:{filename:name,source:"estibordo_pscpp"}}
      });

      await query(`insert into ai_tutor_library_files(openai_file_id,vector_store_id,filename,bytes,status)
        values($1,$2,$3,$4,$5)
        on conflict(openai_file_id) do update set status=excluded.status,updated_at=now()`,
        [filePayload.id,vectorStoreId,name,Number(file.size||0),String(attached?.status||"in_progress")]
      );
      uploaded.push({filename:name,file_id:filePayload.id,status:attached?.status||"in_progress"});
    }catch(error){
      uploaded.push({filename:name,error:String(error?.message||error)});
    }
  }

  return Response.json({ok:true,vector_store_id:vectorStoreId,uploaded});
}
