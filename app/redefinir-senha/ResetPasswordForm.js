"use client";
import { useState } from "react";

export default function ResetPasswordForm({ token }) {
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
 const [showPassword, setShowPassword] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setMsg("Salvando nova senha...");
    const data = new FormData(e.currentTarget);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");

    if (password !== confirm) {
      setMsg("As senhas não coincidem.");
      return;
    }

    const r = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const j = await r.json().catch(() => ({}));

    if (!r.ok) {
      setMsg(j.error || "Não foi possível redefinir a senha.");
      return;
    }

    setDone(true);
    setMsg("Senha alterada com sucesso.");
  }

  if (done) {
    return <><p className="msg">{msg}</p><a className="btn primary full" href="/login">Entrar com a nova senha</a></>;
  }

  return <form onSubmit={submit}>
    <div className="field"><label>NOVA SENHA</label><div className="passwordWrap"><input name="password" type={showPassword?"text":"password"} autoComplete="new-password" minLength={10} required/><button type="button" className="passwordToggle" onClick={()=>setShowPassword(v=>!v)}>{showPassword?"Ocultar":"Mostrar"}</button></div></div>
    <div className="field"><label>CONFIRMAR NOVA SENHA</label><div className="passwordWrap"><input name="confirm" type={showPassword?"text":"password"} autoComplete="new-password" minLength={10} required/><button type="button" className="passwordToggle" onClick={()=>setShowPassword(v=>!v)}>{showPassword?"Ocultar":"Mostrar"}</button></div></div>
    <button className="btn primary full">Alterar senha</button>
    <div className="msg" role="status">{msg}</div>
  </form>;
}
