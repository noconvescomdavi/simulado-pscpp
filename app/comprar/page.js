import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getUserAccess} from "../../lib/access";
import {query} from "../../lib/db";
import {formatCurrencyFromCents,getPaymentConfig} from "../../lib/payments";
import StudentHeader from "../components/StudentHeader";
import PaymentStatusPoller from "./PaymentStatusPoller";
import styles from "./checkout.module.css";

export const dynamic="force-dynamic";

function d(v){
  return v
    ? new Intl.DateTimeFormat("pt-BR",{dateStyle:"long",timeZone:"America/Sao_Paulo"}).format(new Date(v))
    : "â€”";
}

export default async function Page({searchParams}){
  const s=await getSession();
  if(!s) redirect("/cadastro");

  const q=await searchParams;
  const [a,p,pr]=await Promise.all([
    getUserAccess(s.id),
    query("select * from payment_orders where user_id=$1 order by created_at desc limit 5",[s.id]),
    query("select full_name,cpf,phone from user_profiles where user_id=$1",[s.id])
  ]);

  const c=getPaymentConfig();
  const ready=Boolean(pr.rows[0]?.full_name&&pr.rows[0]?.cpf&&pr.rows[0]?.phone);

  return (
    <>
      <StudentHeader active="assinaturas"/>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <span>ACESSO Ã€ PLATAFORMA</span>
            <h1>365 dias de preparaÃ§Ã£o.</h1>
            <p>Checkout Seguro do Mercado Pago</p>
            <ul>
              <li>Pagamento processado pelo Mercado Pago</li>
              <li>ConexÃ£o protegida por HTTPS/SSL</li>
              <li>LiberaÃ§Ã£o automÃ¡tica apÃ³s confirmaÃ§Ã£o do pagamento</li>
            </ul>
          </div>

          <article className={styles.checkoutCard}>
            {a?.active ? (
              <>
                <div className={styles.activeBadge}>ACESSO ATIVO</div>
                <h2>Acesso liberado</h2>
                <p>VÃ¡lido atÃ© <strong>{d(a.expires_at)}</strong>.</p>
                <a className={styles.primary} href="/conteudos">Acessar conteÃºdos</a>
              </>
            ) : (
              <>
                <span className={styles.plan}>PLANO ANUAL</span>
                <strong className={styles.price}>{formatCurrencyFromCents(c.priceCents)}</strong>
                <small>365 dias</small>

                <div className={styles.securityBadges} aria-label="SeguranÃ§a do checkout">
                  <span>ðŸ”’ Checkout seguro</span>
                  <span>ðŸ›¡ï¸ HTTPS / SSL</span>
                  <span>âœ“ Mercado Pago</span>
                </div>

                {["sucesso","pendente"].includes(String(q?.retorno||"")) && <PaymentStatusPoller/>}

                {q?.locked && (
                  <div className={styles.error}>
                    {q.locked==="expired" ? "Seu acesso expirou." : "Acesso ainda nÃ£o ativado."}
                  </div>
                )}

                {!ready && (
                  <div className={styles.profileWarning}>
                    Complete nome, CPF e telefone.
                    <a href="/perfil">Abrir perfil</a>
                  </div>
                )}

                <form action="/api/payments/mercado-pago/checkout" method="post">
                  <button className={styles.primary} disabled={!c.ready||!ready}>
                    Ir para o Mercado Pago
                  </button>
                </form>

                <p className={styles.secure}>
                  Seus dados de pagamento sÃ£o processados no ambiente seguro do Mercado Pago.
                </p>

                {!c.ready && <p className={styles.configMessage}>Configure as variÃ¡veis do Mercado Pago no Vercel.</p>}
              </>
            )}
          </article>
        </section>

        {p.rowCount>0 && (
          <section className={styles.history}>
            <h2>HistÃ³rico de pagamentos</h2>
            <div className={styles.paymentList}>
              {p.rows.map(x=>(
                <article key={x.id}>
                  <div>
                    <strong>{x.status}</strong>
                    <small>{d(x.created_at)}</small>
                  </div>
                  <b>{formatCurrencyFromCents(Number(x.amount_cents))}</b>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}