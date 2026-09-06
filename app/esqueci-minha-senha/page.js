"use client";
import { useState } from "react";
import { Nav, Footer } from "../components";

export default function ForgotPassword() {
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg("Enviando...");
    setOk(false);
    const data = new FormData(e.currentTarget);
    const r = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data)),
    });
    const j = await r.json().catch(() => ({}));
    setOk(r.ok);
    setMsg(j.message || j.error || "Não foi possível processar a solicitação.");
  }

  return <><Nav/><main className="authPage"><section className="authShell">
    <div className="authStory"><span>RECUPERAÇÃO DE ACESSO</span><h1>Recupere o acesso à sua conta.</h1><p>Informe o mesmo e-mail utilizado no cadastro. Se ele estiver registrado, você receberá um link seguro para criar uma nova senha.</p></div>
    <div className="authForm"><div className="eyebrow">ESQUECI MINHA SENHA</div><h2>Redefinir senha</h2><p>O link enviado por e-mail expira em 30 minutos e só pode ser usado uma vez.</p>
      <form onSubmit={submit}><div className="field"><label>E-MAIL</label><input name="email" type="email" autoComplete="email" placeholder="seu@email.com" required/></div><button className="btn primary full">Enviar link de redefinição</button><div className="msg" role="status">{msg}</div></form>
      <div className="authFoot"><a href="/login">← Voltar para o login</a></div>
    </div>
  </section></main><Footer/></>;
}
