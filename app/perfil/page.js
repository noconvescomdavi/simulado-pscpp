import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {query} from "../../lib/db";
import {formatCpf} from "../../lib/profile";
import StudentHeader from "../components/StudentHeader";
import styles from "./profile.module.css";

export const dynamic="force-dynamic";

export default async function Page({searchParams}){
  const s=await getSession();
  if(!s)redirect("/login?next=/perfil");
  const p=(await query("select * from user_profiles where user_id=$1 limit 1",[s.id])).rows[0]||{};
  const q=await searchParams;
  return <><StudentHeader active="perfil"/><main className={styles.page}><section className={styles.card}>
    <div className={styles.heading}><span>MINHA CONTA</span><h1>Perfil e privacidade</h1><p>Mantenha somente os dados necessários para sua conta e checkout.</p></div>
    {q?.salvo==="1"&&<div className={styles.success}>Dados atualizados.</div>}
    {q?.erro&&<div className={styles.error}>{String(q.erro).slice(0,160)}</div>}
    <form className={styles.form} action="/api/profile" method="post">
      <label className={styles.wide}>Nome completo<input name="full_name" defaultValue={p.full_name||""}/></label>
      <label>E-mail<input value={s.email} disabled/></label>
      <label>CPF<input name="cpf" defaultValue={formatCpf(p.cpf)}/></label>
      <label>Telefone<input name="phone" defaultValue={p.phone||""}/></label>
      <label>WhatsApp (opcional)<input name="whatsapp" defaultValue={p.whatsapp||""}/></label>
      <label>UF (opcional)<input name="state" maxLength="2" defaultValue={p.state||""}/></label>
      <div className={styles.actions}><button>Salvar meus dados</button></div>
    </form>

    <div className={styles.accountGrid}>
      <section><span>SEGURANÇA</span><h2>Sessões da conta</h2><p>Encerre todas as sessões caso tenha usado um computador compartilhado ou suspeite de acesso indevido.</p><form action="/api/account/logout-all" method="post"><button className={styles.secondary}>Sair de todos os dispositivos</button></form></section>
      <section><span>PRIVACIDADE</span><h2>Seus dados</h2><p>Baixe uma cópia estruturada dos principais dados vinculados à sua conta.</p><a className={styles.secondaryLink} href="/api/account/export">Baixar meus dados</a></section>
    </div>

    <details className={styles.danger}><summary>Excluir minha conta</summary><div><p>A exclusão encerra o acesso e remove dados diretamente identificáveis e dados de aprendizagem quando possível. Registros financeiros e de segurança podem ser mantidos pelo prazo legal aplicável.</p><form action="/api/account/delete" method="post"><label>Senha atual<input type="password" name="password" autoComplete="current-password" required/></label><label>Digite EXCLUIR<input name="confirmation" required/></label><button>Excluir conta permanentemente</button></form></div></details>
    <div className={styles.legalLinks}><a href="/politica-de-privacidade">Política de Privacidade</a><a href="/termos-de-uso">Termos de Uso</a><a href="/politica-de-cookies">Cookies</a></div>
  </section></main></>;
}
