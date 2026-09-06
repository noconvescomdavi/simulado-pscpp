import { Nav, Footer } from "../components";
import ResetPasswordForm from "./ResetPasswordForm";

export default async function ResetPassword({ searchParams }) {
  const q = await searchParams;
  const token = String(q?.token || "");

  return <><Nav/><main className="authPage"><section className="authShell">
    <div className="authStory"><span>SEGURANÇA DA CONTA</span><h1>Crie uma nova senha.</h1><p>Escolha uma senha nova com pelo menos 10 caracteres. O link de recuperação é de uso único.</p></div>
    <div className="authForm"><div className="eyebrow">REDEFINIR SENHA</div><h2>Nova senha</h2>
      {token ? <ResetPasswordForm token={token}/> : <><p className="msg">Link de redefinição inválido.</p><a href="/esqueci-minha-senha">Solicitar novo link</a></>}
    </div>
  </section></main><Footer/></>;
}
