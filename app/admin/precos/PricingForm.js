"use client";

import {useState} from "react";
import styles from "./pricing.module.css";

function toBRLInput(cents){
  return (Number(cents||0)/100).toFixed(2).replace(".",",");
}
function toCents(value){
  const normalized=String(value||"").trim().replace(/\./g,"").replace(",",".");
  const amount=Number(normalized);
  return Number.isFinite(amount)&&amount>0?Math.round(amount*100):0;
}
function formatBRL(cents){
  return new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(cents||0)/100);
}

export default function PricingForm({initialSubscriptionCents,initialContramestreCents,subscriptionUpdatedAt,contramestreUpdatedAt}){
  const [subscription,setSubscription]=useState(toBRLInput(initialSubscriptionCents));
  const [contramestre,setContramestre]=useState(toBRLInput(initialContramestreCents));
  const [saved,setSaved]=useState({
    subscriptionPriceCents:initialSubscriptionCents,
    contramestrePriceCents:initialContramestreCents
  });
  const [busy,setBusy]=useState(false);
  const [message,setMessage]=useState("");
  const [error,setError]=useState("");

  async function save(e){
    e.preventDefault();
    setMessage("");setError("");
    const subscriptionPriceCents=toCents(subscription);
    const contramestrePriceCents=toCents(contramestre);
    if(!subscriptionPriceCents||!contramestrePriceCents){
      setError("Informe valores válidos maiores que zero.");
      return;
    }
    if(!window.confirm(`Confirmar novos preços?\n\nAssinatura anual: ${formatBRL(subscriptionPriceCents)}\nCONTRAMESTRE: ${formatBRL(contramestrePriceCents)}/mês\n\nOs próximos checkouts usarão estes valores.`))return;

    setBusy(true);
    const r=await fetch("/api/admin/pricing",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({subscriptionPriceCents,contramestrePriceCents})
    });
    const j=await r.json().catch(()=>({}));
    setBusy(false);
    if(!r.ok){setError(j.error||"Não foi possível salvar os preços.");return}
    setSaved(j.pricing);
    setSubscription(toBRLInput(j.pricing.subscriptionPriceCents));
    setContramestre(toBRLInput(j.pricing.contramestrePriceCents));
    setMessage("Preços atualizados com sucesso. Os novos checkouts já usarão estes valores.");
  }

  return <form className={styles.form} onSubmit={save}>
    <div className={styles.grid}>
      <article className={styles.card}>
        <span>PLANO PRINCIPAL</span>
        <h2>Assinatura ESTIBORDO</h2>
        <p>365 dias de acesso à plataforma.</p>
        <label>
          <small>Preço da assinatura</small>
          <div className={styles.money}><b>R$</b><input inputMode="decimal" value={subscription} onChange={e=>setSubscription(e.target.value)} aria-label="Preço da assinatura anual"/></div>
        </label>
        <div className={styles.current}>Atual: <strong>{formatBRL(saved.subscriptionPriceCents)}</strong></div>
        {subscriptionUpdatedAt&&<small className={styles.updated}>Última alteração registrada: {new Date(subscriptionUpdatedAt).toLocaleString("pt-BR")}</small>}
      </article>

      <article className={styles.card}>
        <span>ADICIONAL</span>
        <h2>CONTRAMESTRE</h2>
        <p>30 dias de acesso ao tutor especializado.</p>
        <label>
          <small>Preço mensal</small>
          <div className={styles.money}><b>R$</b><input inputMode="decimal" value={contramestre} onChange={e=>setContramestre(e.target.value)} aria-label="Preço mensal do Contramestre"/></div>
        </label>
        <div className={styles.current}>Atual: <strong>{formatBRL(saved.contramestrePriceCents)}/mês</strong></div>
        {contramestreUpdatedAt&&<small className={styles.updated}>Última alteração registrada: {new Date(contramestreUpdatedAt).toLocaleString("pt-BR")}</small>}
      </article>
    </div>

    <section className={styles.info}>
      <strong>Sincronização automática</strong>
      <p>O valor salvo aqui é a fonte central de preço. Mudanças afetam a exibição para o aluno e o valor enviado ao Mercado Pago em novos pedidos. Pedidos já criados mantêm o valor registrado no momento da criação.</p>
    </section>

    {error&&<div className={styles.error}>{error}</div>}
    {message&&<div className={styles.success}>{message}</div>}

    <div className={styles.actions}>
      <button type="submit" disabled={busy}>{busy?"Salvando...":"Salvar novos preços"}</button>
    </div>
  </form>;
}
