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
    : "—";
}

function statusLabel(status){
  const s=String(status||"").toLowerCase();
  if(s==="approved") return "Aprovado";
  if(s==="pending") return "Pendente";
  if(s==="failed") return "Falhou";
  if(s==="rejected") return "Rejeitado";
  if(s==="cancelled") return "Cancelado";
  if(s==="refunded") return "Estornado";
  if(s==="charged_back") return "Chargeback";
  if(s==="review") return "Em análise";
  return status||"—";
}

export default async function Page({searchParams}){
  const s=await getSession();
  if(!s) redirect("/cadastro");

  const q=await searchParams;
  const [a,p,pr]=await Promise.all([
    getUserAccess(s.id),
    query("select * from payment_orders where user_id=$1 order by created_at desc limit 5",[s.id]),
    query("select full_name,cpf,phone from user_profiles where user_id=$1 limit 1",[s.id])
  ]);

  const c=getPaymentConfig();
  const ready=Boolean(pr.rows[0]?.full_name&&pr.rows[0]?.cpf&&pr.rows[0]?.phone);
  const retorno=String(q?.retorno||"");
  const erro=String(q?.erro||"");

  return (
    <>
      <StudentHeader active="assinaturas"/>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.copy}>
            <span>ACESSO À PLATAFORMA</span>
            <h1>365 dias de preparação.</h1>
            <p>Pagamento processado pelo Mercado Pago em ambiente seguro.</p>
            <ul>
              <li>Checkout hospedado pelo Mercado Pago</li>
              <li>Conexão protegida por HTTPS/SSL</li>
              <li>Liberação automática após confirmação do pagamento</li>
            </ul>
          </div>

          <article className={styles.checkoutCard}>
            {a?.active ? (
              <>
                <div className={styles.activeBadge}>ACESSO ATIVO</div>
                <h2>Acesso liberado</h2>
                <p>{a.lifetime ? "Seu acesso é vitalício." : <>Válido até <strong>{d(a.expires_at)}</strong>.</>}</p>
                <a className={styles.primary} href="/conteudos">Acessar conteúdos</a>
              </>
            ) : (
              <>
                <span className={styles.plan}>PLANO ANUAL</span>
                <strong className={styles.price}>{formatCurrencyFromCents(c.priceCents)}</strong>
                <small>365 dias</small>

                <div className={styles.securityBadges} aria-label="Segurança do checkout">
                  <span>🔒 Checkout seguro</span>
                  <span>🛡️ HTTPS / SSL</span>
                  <span>✓ Mercado Pago</span>
                </div>

                {retorno==="sucesso" && <div className={styles.notice}>Pagamento enviado. Estamos confirmando a aprovação com o Mercado Pago.</div>}
                {retorno==="pendente" && <div className={styles.notice}>Pagamento pendente. Assim que o Mercado Pago confirmar, seu acesso será liberado automaticamente.</div>}
                {retorno==="falha" && <div className={styles.error}>O pagamento não foi concluído. Nenhum acesso foi ativado. Você pode tentar novamente.</div>}
                {erro==="checkout" && <div className={styles.error}>Não foi possível iniciar o checkout agora. Tente novamente em instantes.</div>}
                {erro==="configuracao" && <div className={styles.error}>O checkout está temporariamente indisponível. A configuração de pagamento precisa ser revisada.</div>}

                {["sucesso","pendente"].includes(retorno) && <PaymentStatusPoller/>}

                {q?.locked && (
                  <div className={styles.error}>
                    {q.locked==="expired" ? "Seu acesso expirou." : "Acesso ainda não ativado."}
                  </div>
                )}

                {!ready && (
                  <div className={styles.profileWarning}>
                    Antes do pagamento, complete nome, CPF e telefone.
                    <a href="/perfil">Completar meu perfil</a>
                  </div>
                )}

                <form action="/api/payments/mercado-pago/checkout" method="post">
                  <button className={styles.primary} disabled={!c.ready||!ready}>Ir para o Mercado Pago</button>
                </form>

                <p className={styles.secure}>Os dados de pagamento são informados diretamente no ambiente do Mercado Pago e não são armazenados pela ESTIBORDO.</p>
                {!c.ready && <p className={styles.configMessage}>Checkout indisponível: revise as variáveis de integração no ambiente de produção.</p>}
              </>
            )}
          </article>
        </section>

        {p.rowCount>0 && (
          <section className={styles.history}>
            <h2>Histórico de pagamentos</h2>
            <div className={styles.paymentList}>
              {p.rows.map(x=>(
                <article key={x.id}>
                  <div><strong>{statusLabel(x.status)}</strong><small>{d(x.created_at)}</small></div>
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
