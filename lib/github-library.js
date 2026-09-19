import {query} from "./db";

const API="https://api.github.com";
const MAX_BYTES=95*1024*1024;

function cfg(){
  const token=String(process.env.GITHUB_LIBRARY_TOKEN||"").trim();
  const owner=String(process.env.GITHUB_LIBRARY_OWNER||"").trim();
  const repo=String(process.env.GITHUB_LIBRARY_REPO||"").trim();
  if(!token||!owner||!repo)throw new Error("Biblioteca GitHub não configurada.");
  return {token,owner,repo};
}
export function githubLibraryConfigured(){
  return Boolean(process.env.GITHUB_LIBRARY_TOKEN&&process.env.GITHUB_LIBRARY_OWNER&&process.env.GITHUB_LIBRARY_REPO);
}
function safeName(name){
  const base=String(name||"documento.pdf").replace(/[\\/]/g,"_").replace(/[^\p{L}\p{N}._() -]/gu,"_").trim();
  return (base||"documento.pdf").slice(0,220);
}
async function gh(path,options={}){
  const {token}=cfg();
  return fetch(API+path,{...options,headers:{Accept:"application/vnd.github+json",Authorization:"Bearer "+token,"X-GitHub-Api-Version":"2022-11-28",...(options.headers||{})},cache:"no-store"});
}
export async function uploadLibraryPdf(userId,file){
  if(!file||file.type!=="application/pdf")throw new Error("Somente arquivos PDF são permitidos.");
  if(file.size<=0)throw new Error("O PDF está vazio.");
  if(file.size>MAX_BYTES)throw new Error("O PDF excede o limite de 95 MB desta biblioteca.");
  const {owner,repo}=cfg(),name=safeName(file.name);
  const unique=Date.now()+"-"+Math.random().toString(36).slice(2,10);
  const path="usuarios/"+String(userId)+"/"+unique+"-"+name;
  const bytes=Buffer.from(await file.arrayBuffer());
  const response=await gh("/repos/"+encodeURIComponent(owner)+"/"+encodeURIComponent(repo)+"/contents/"+path.split("/").map(encodeURIComponent).join("/"),{
    method:"PUT",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({message:"library: adiciona "+name,content:bytes.toString("base64")})
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.message||"Não foi possível enviar o PDF ao repositório privado.");
  const saved=await query(`insert into student_library_files(user_id,provider,repository_owner,repository_name,repository_path,github_sha,name,mime_type,size_bytes,updated_at)
    values($1,'github',$2,$3,$4,$5,$6,'application/pdf',$7,now())
    returning id,name,mime_type,size_bytes,last_page,progress_percent,last_opened_at,created_at,updated_at`,
    [userId,owner,repo,path,data.content?.sha||null,name,file.size]);
  return saved.rows[0];
}
export async function getLibraryPdf(userId,id){
  const result=await query("select * from student_library_files where id=$1 and user_id=$2 limit 1",[id,userId]);
  const file=result.rows[0];
  if(!file)return null;
  const response=await gh("/repos/"+encodeURIComponent(file.repository_owner)+"/"+encodeURIComponent(file.repository_name)+"/contents/"+file.repository_path.split("/").map(encodeURIComponent).join("/"),{headers:{Accept:"application/vnd.github.raw+json"}});
  if(!response.ok)throw new Error("Não foi possível ler o PDF no repositório privado.");
  return {file,response};
}
