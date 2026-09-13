"use client";
import {useState} from "react";
import {Nav,Footer} from "../components";
import TurnstileWidget from "../components/TurnstileWidget";

export default function Cadastro(){
 const [msg,setMsg]=useState(""),[showPassword,setShowPassword]=useState(false),[accepted,setAccepted]=useState(false);
 async function submit(e){
  e.preventDefault();const f=new FormData(e.currentTarget),o=Object.fromEntries(f);
  if(o.password!==o.confirm){setMsg("As senhas não coincidem.");return}
  setMsg("Criando sua conta...");
  const payload={...o,accept_terms:o.accept_terms==="on",enable_2fa:o.enable_2fa==="on",turnstile_token:o["cf-turnstile-response"]||""};
  const r=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
  const j=await r.json();if(r.ok)location.href="/verificar-email?email="+encodeURIComponent(j.email||o.email);else setMsg(j.error||"Não foi possível criar a conta.");
 }
 function googleSignup(){if(!accepted){setMsg("Aceite os Termos de Uso e a Política de Privacidade antes de continuar com o Google.");return}location.href="/api/auth/google/start?intent=signup&terms=1"}
 return <><Nav/><main className="authPage authPageWide"><section className="authShell authShellWide"><div className="authStory"><span>COMECE SUA PREPARAÇÃO</span><h1>Crie uma conta mais completa e segura desde o primeiro acesso.</h1><p>Seus dados de conta ficam separados dos dados acadêmicos. CPF, telefone e endereço são tratados como informações pessoais protegidas.</p><ul><li>Verificação anti-bot</li><li>Login opcional com Google</li><li>2FA com aplicativo autenticador</li><li>Dados pessoais protegidos</li></ul></div><div className="authForm authFormWide"><div className="eyebrow">NOVO ALUNO</div><h2>Criar conta</h2><p>Preencha seus dados principais. Informações marítimas ajudam a personalizar a experiência e podem ser deixadas em branco.</p>
 <button type="button" className="googleAuthButton" onClick={googleSignup}><span>G</span> Continuar com Google</button><div className="authDivider"><span>ou cadastre com e-mail</span></div>
 <form onSubmit={submit}>
  <div className="authSectionTitle">Identificação</div><div className="authFieldsGrid">
   <div className="field fieldSpan2"><label>NOME COMPLETO</label><input name="full_name" autoComplete="name" required/></div>
   <div className="field"><label>CPF</label><input name="cpf" inputMode="numeric" placeholder="000.000.000-00" required/></div>
   <div className="field"><label>TELEFONE / WHATSAPP</label><input name="phone" inputMode="tel" autoComplete="tel" placeholder="(21) 99999-9999" required/></div>
   <div className="field fieldSpan2"><label>E-MAIL</label><input name="email" type="email" autoComplete="email" placeholder="seu@email.com" required/></div>
  </div>
  <div className="authSectionTitle">Endereço <small>pode completar depois</small></div><div className="authFieldsGrid">
   <div className="field"><label>CEP</label><input name="postal_code" inputMode="numeric" autoComplete="postal-code"/></div>
   <div className="field"><label>ESTADO</label><input name="state" maxLength="2" placeholder="RJ"/></div>
   <div className="field fieldSpan2"><label>ENDEREÇO</label><input name="street" autoComplete="address-line1"/></div>
   <div className="field"><label>NÚMERO</label><input name="number"/></div>
   <div className="field"><label>COMPLEMENTO</label><input name="complement" autoComplete="address-line2"/></div>
   <div className="field"><label>BAIRRO</label><input name="neighborhood"/></div>
   <div className="field"><label>CIDADE</label><input name="city" autoComplete="address-level2"/></div>
  </div>
  <div className="authSectionTitle">Contexto marítimo <small>opcional</small></div><div className="authFieldsGrid">
   <div className="field"><label>ATUAÇÃO</label><select name="maritime_role" defaultValue=""><option value="">Prefiro não informar</option><option>Aquaviário</option><option>Oficial de Náutica</option><option>Contramestre</option><option>Comandante</option><option>Praticante</option><option>Estudante</option><option>Outro</option></select></div>
   <div className="field"><label>NÍVEL DE EXPERIÊNCIA</label><select name="experience_level" defaultValue=""><option value="">Prefiro não informar</option><option>Iniciante</option><option>Intermediário</option><option>Avançado</option></select></div>
  </div>
  <div className="authSectionTitle">Segurança</div><div className="authFieldsGrid">
   <div className="field"><label>SENHA</label><div className="passwordWrap"><input name="password" type={showPassword?"text":"password"} autoComplete="new-password" minLength="10" required/><button type="button" className="passwordToggle" onClick={()=>setShowPassword(v=>!v)}>{showPassword?"Ocultar":"Mostrar"}</button></div></div>
   <div className="field"><label>CONFIRMAR SENHA</label><div className="passwordWrap"><input name="confirm" type={showPassword?"text":"password"} autoComplete="new-password" minLength="10" required/><button type="button" className="passwordToggle" onClick={()=>setShowPassword(v=>!v)}>{showPassword?"Ocultar":"Mostrar"}</button></div></div>
  </div>
  <label className="authCheck"><input name="enable_2fa" type="checkbox"/><span>Quero ativar autenticação em duas etapas (2FA) após confirmar meu e-mail.</span></label>
  <TurnstileWidget/>
  <label className="authCheck"><input name="accept_terms" type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} required/><span>Li e aceito os <a href="/termos-de-uso" target="_blank">Termos de Uso</a> e a <a href="/politica-de-privacidade" target="_blank">Política de Privacidade</a>.</span></label>
  <button className="btn primary full">Criar minha conta</button><div className="msg" role="status">{msg}</div>
 </form><div className="authFoot">Já possui uma conta? <a href="/login">Entrar</a></div></div></section></main><Footer/></>
}