"use client";
import {useState} from "react";

export default function MfaSetupClient({enabled,secret,uri}){
  const [state,setState]=useState({busy:false,error:"",codes:null,secret,uri,enabled});
  async function post(action,extra={}){
    setState(s=>({...s,busy:true,error:""}));
    const res=await fetch("/api/admin/mfa",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,...extra})});
    const j=await res.json().catch(()=>({}));
    if(!res.ok){setState(s=>({...s,busy:false,error:j.error||"Não foi possível concluir."}));return}
    if(action==="prepare")setState(s=>({...s,busy:false,secret:j.secret,uri:j.uri}));
    if(action==="enable")setState(s=>({...s,busy:false,codes:j.recoveryCodes||[],enabled:true}));
    if(action==="disable"&&j.logout)location.href="/login";
  }
  if(state.codes)return <section className="panel"><h2>MFA ativado</h2><p>Guarde estes códigos de recuperação em local seguro. Eles não serão exibidos novamente.</p><pre style={{whiteSpace:"pre-wrap",fontSize:16,lineHeight:1.9}}>{state.codes.join("\n")}</pre><a className="btn primary" href="/login">Fazer novo login com MFA</a></section>;
  if(state.enabled)return <section className="panel"><h2>MFA ativo</h2><div className="admin-notice">O segundo fator é obrigatório em novos logins administrativos.</div>{state.error&&<div className="admin-notice">{state.error}</div>}<details style={{marginTop:18}}><summary>Desativar MFA</summary><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);post("disable",{password:f.get("password"),code:f.get("code")})}} style={{marginTop:12}}><label>Senha atual<input name="password" type="password" autoComplete="current-password" required style={{display:"block",margin:"6px 0 10px",padding:10}}/></label><label>Código TOTP ou recuperação<input name="code" required style={{display:"block",margin:"6px 0 10px",padding:10}}/></label><button className="btn primary" disabled={state.busy}>Confirmar desativação</button></form></details></section>;
  return <section className="panel"><h2>Autenticador TOTP</h2><p>Use Google Authenticator, Microsoft Authenticator, 1Password ou outro app compatível.</p>{state.error&&<div className="admin-notice">{state.error}</div>}{!state.secret?<button className="btn primary" disabled={state.busy} onClick={()=>post("prepare")}>Gerar chave de configuração</button>:<><p><strong>Chave:</strong></p><code style={{display:"block",wordBreak:"break-all",padding:12}}>{state.secret}</code><details><summary>URI para aplicativos compatíveis</summary><code style={{display:"block",wordBreak:"break-all",padding:12}}>{state.uri}</code></details><form onSubmit={e=>{e.preventDefault();const f=new FormData(e.currentTarget);post("enable",{code:f.get("code")})}} style={{marginTop:18}}><label>Código de 6 dígitos<input name="code" inputMode="numeric" pattern="[0-9]{6}" required style={{display:"block",marginTop:6,padding:10}}/></label><button className="btn primary" disabled={state.busy} style={{marginTop:12}}>Validar e ativar MFA</button></form></>}</section>;
}
