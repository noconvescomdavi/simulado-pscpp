"use client";
import { useState } from "react";

export default function ResetPasswordForm({ token }) {
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);

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
    <div className="field"><label>NOVA SENHA</label><input name="password" type="password" autoComplete="new-password" minLength={10} required/></div>
    <div className="field"><label>CONFIRMAR NOVA SENHA</label><input name="confirm" type="password" autoComplete="new-password" minLength={10} required/></div>
    <button className="btn primary full">Alterar senha</button>
    <div className="msg" role="status">{msg}</div>
  </form>;
}
