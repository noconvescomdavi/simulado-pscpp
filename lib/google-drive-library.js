import {query} from "./db";
import {encryptToken,decryptToken} from "./token-vault";

const DRIVE_SCOPE="https://www.googleapis.com/auth/drive.file";

function appUrl(){
  return String(process.env.NEXT_PUBLIC_APP_URL||"").replace(/\/$/,"");
}

export function googleDriveConfigured(){
  return Boolean(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY &&
    process.env.NEXT_PUBLIC_GOOGLE_DRIVE_APP_ID &&
    appUrl()
  );
}

export function googleDriveRedirectUri(){
  if(!appUrl())throw new Error("NEXT_PUBLIC_APP_URL não configurada.");
  return appUrl()+"/api/library/google/callback";
}

export function googleDriveAuthorizationUrl(state){
  if(!googleDriveConfigured())throw new Error("Google Drive ainda não está configurado.");
  const params=new URLSearchParams({
    client_id:process.env.GOOGLE_CLIENT_ID,
    redirect_uri:googleDriveRedirectUri(),
    response_type:"code",
    access_type:"offline",
    prompt:"consent",
    include_granted_scopes:"false",
    scope:DRIVE_SCOPE,
    state
  });
  return "https://accounts.google.com/o/oauth2/v2/auth?"+params.toString();
}

async function tokenRequest(params){
  const response=await fetch("https://oauth2.googleapis.com/token",{
    method:"POST",
    headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams(params),
    cache:"no-store"
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(data.error_description||data.error||"Falha na autenticação do Google Drive.");
  return data;
}

export async function exchangeGoogleCode(code){
  return tokenRequest({
    code:String(code||""),
    client_id:process.env.GOOGLE_CLIENT_ID||"",
    client_secret:process.env.GOOGLE_CLIENT_SECRET||"",
    redirect_uri:googleDriveRedirectUri(),
    grant_type:"authorization_code"
  });
}

export async function saveGoogleConnection(userId,tokens){
  const current=await query(
    "select refresh_token_enc from google_drive_connections where user_id=$1 limit 1",
    [userId]
  ).catch(()=>({rows:[]}));
  const refresh=tokens.refresh_token
    ?encryptToken(tokens.refresh_token)
    :(current.rows[0]?.refresh_token_enc||null);
  const access=tokens.access_token?encryptToken(tokens.access_token):null;
  const expiresAt=tokens.expires_in
    ?new Date(Date.now()+Math.max(0,Number(tokens.expires_in)-30)*1000)
    :null;

  await query(`
    insert into google_drive_connections(
      user_id,access_token_enc,refresh_token_enc,token_expiry,scope,connected_at,updated_at
    ) values($1,$2,$3,$4,$5,now(),now())
    on conflict(user_id) do update set
      access_token_enc=excluded.access_token_enc,
      refresh_token_enc=coalesce(excluded.refresh_token_enc,google_drive_connections.refresh_token_enc),
      token_expiry=excluded.token_expiry,
      scope=excluded.scope,
      updated_at=now()
  `,[userId,access,refresh,expiresAt,String(tokens.scope||DRIVE_SCOPE)]);
}

async function loadConnection(userId){
  const result=await query(
    "select * from google_drive_connections where user_id=$1 limit 1",
    [userId]
  );
  return result.rows[0]||null;
}

export async function getGoogleAccessToken(userId){
  if(!googleDriveConfigured())throw new Error("Google Drive ainda não está configurado.");
  const connection=await loadConnection(userId);
  if(!connection)throw new Error("Google Drive não conectado.");

  const validUntil=connection.token_expiry?new Date(connection.token_expiry).getTime():0;
  if(connection.access_token_enc&&validUntil>Date.now()+60000){
    return decryptToken(connection.access_token_enc);
  }

  const refresh=decryptToken(connection.refresh_token_enc);
  if(!refresh)throw new Error("Reconecte o Google Drive para renovar a autorização.");

  const tokens=await tokenRequest({
    refresh_token:refresh,
    client_id:process.env.GOOGLE_CLIENT_ID||"",
    client_secret:process.env.GOOGLE_CLIENT_SECRET||"",
    grant_type:"refresh_token"
  });
  await saveGoogleConnection(userId,{...tokens,refresh_token:refresh});
  return tokens.access_token;
}

export async function googleDriveStatus(userId){
  if(!googleDriveConfigured())return {configured:false,connected:false};
  const result=await query(
    "select token_expiry,connected_at,updated_at from google_drive_connections where user_id=$1 limit 1",
    [userId]
  ).catch(()=>({rows:[]}));
  return {configured:true,connected:Boolean(result.rows[0]),connection:result.rows[0]||null};
}

export async function driveApi(userId,path,options={}){
  const token=await getGoogleAccessToken(userId);
  const response=await fetch("https://www.googleapis.com/drive/v3/"+path,{
    ...options,
    headers:{
      Authorization:"Bearer "+token,
      ...(options.headers||{})
    },
    cache:"no-store"
  });
  if(response.status===401)throw new Error("Autorização do Google Drive expirada. Reconecte sua conta.");
  return response;
}

export async function importDrivePdf(userId,fileId){
  const fields="id,name,mimeType,size,modifiedTime,webViewLink,iconLink";
  const response=await driveApi(
    userId,
    "files/"+encodeURIComponent(fileId)+"?fields="+encodeURIComponent(fields)+"&supportsAllDrives=true"
  );
  const file=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(file.error?.message||"Não foi possível acessar o arquivo selecionado.");
  if(file.mimeType!=="application/pdf")throw new Error("Somente arquivos PDF podem ser adicionados à biblioteca.");

  const saved=await query(`
    insert into student_drive_files(
      user_id,drive_file_id,name,mime_type,size_bytes,modified_time,web_view_link,icon_link,updated_at
    ) values($1,$2,$3,$4,$5,$6,$7,$8,now())
    on conflict(user_id,drive_file_id) do update set
      name=excluded.name,
      mime_type=excluded.mime_type,
      size_bytes=excluded.size_bytes,
      modified_time=excluded.modified_time,
      web_view_link=excluded.web_view_link,
      icon_link=excluded.icon_link,
      updated_at=now()
    returning id,drive_file_id,name,mime_type,size_bytes,modified_time,web_view_link,last_page,progress_percent,last_opened_at,created_at,updated_at
  `,[
    userId,file.id,String(file.name||"PDF").slice(0,500),file.mimeType,
    file.size?Number(file.size):null,file.modifiedTime||null,file.webViewLink||null,file.iconLink||null
  ]);
  return saved.rows[0];
}
