import {redirect} from "next/navigation";
import {getAdminMfaPending} from "../../lib/admin-mfa";
import {Nav,Footer} from "../components";

export default async function Page({searchParams}){
  const pending=await getAdminMfaPending();
  if(!pending)redirect("/login");
  const q=await searchParams;
  return <><Nav/><main className="authPage"><section className="authShell"><div className="authStory"><span>ADMINISTRAÇÃO SEGURA</span><h1>Confirme o segundo fator.</h1><p>Digite o código de 6 dígitos do seu aplicativo autenticador. Um código de recuperação também pode ser usado uma única vez.</p><ul><li>TOTP padrão RFC 6238</li><li>Janela de 30 segundos</li><li>Códigos de recuperação de uso único</li></ul></div><div className="authForm"><div className="eyebrow">MFA ADMIN</div><h2>Verificação em duas etapas</h2>{q?.erro&&<p style={{color:"#a12634",fontWeight:800}}>{q.erro}</p>}<form action="/api/auth/admin-mfa/verify" method="post"><div className="field"><label htmlFor="mfa-code">CÓDIGO</label><input id="mfa-code" name="code" inputMode="numeric" autoComplete="one-time-code" placeholder="123456 ou código de recuperação" required autoFocus/></div><button className="btn primary full">Confirmar e entrar</button></form><div className="authFoot"><a href="/login">Voltar ao login</a></div></div></section></main><Footer/></>;
}
