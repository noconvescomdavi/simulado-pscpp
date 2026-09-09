import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {hasCurrentLegalConsent} from "../../lib/legal-consent";
import {Nav,Footer} from "../components";

export default async function Page(){
  const session=await getSession();
  if(!session)redirect("/login?next=/aceitar-termos");
  if(await hasCurrentLegalConsent(session.id))redirect("/area-do-aluno");
  return <><Nav/><main className="authPage"><section className="authShell"><div className="authStory"><span>ATUALIZAÇÃO LEGAL</span><h1>Precisamos registrar sua concordância com os documentos vigentes.</h1><p>Isso organiza os direitos e responsabilidades de uso da plataforma e o tratamento dos seus dados.</p></div><div className="authForm"><div className="eyebrow">TERMOS E PRIVACIDADE</div><h2>Continue sua preparação</h2><p>Leia os documentos antes de prosseguir.</p><p><a href="/termos-de-uso" target="_blank">Termos de Uso</a><br/><a href="/politica-de-privacidade" target="_blank">Política de Privacidade</a></p><form action="/api/account/accept-terms" method="post"><label style={{display:"flex",gap:9,alignItems:"flex-start",fontSize:11,lineHeight:1.5}}><input type="checkbox" name="accept" value="yes" required/><span>Li e aceito os Termos de Uso e a Política de Privacidade vigentes.</span></label><button className="btn primary full" style={{marginTop:14}}>Aceitar e continuar</button></form></div></section></main><Footer/></>;
}
