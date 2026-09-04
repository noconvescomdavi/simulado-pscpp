import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getUserAccess} from "../../lib/access";
import {getPaymentConfig,formatCurrencyFromCents} from "../../lib/payments";
import StudentHeader from "../components/StudentHeader";

function daysLeft(expiresAt){
  if(!expiresAt) return 0;
  return Math.max(0,Math.ceil((new Date(expiresAt).getTime()-Date.now())/86400000));
}

export default async function MinhasAssinaturas(){
  const session=await getSession();
  if(!session) redirect("/login?next=/minhas-assinaturas");

  const access=await getUserAccess(session.id);
  const config=getPaymentConfig();
  const active=access?.active===true;
  const remaining=daysLeft(access?.expires_at);

  return (
    <>
      <StudentHeader active="assinaturas"/>
      <main className="subscriptionPage">
        <section className="subscriptionHero">
          <span>MINHA CONTA</span>
          <h1>Minhas Assinaturas</h1>
          <p>Acompanhe o status do seu acesso a ESTIBORDO e a validade do seu plano.</p>
        </section>

        <section className="subscriptionCard">
          <div>
            <span className={`subscriptionStatus ${active?"isActive":"isInactive"}`}>
              {active?"ATIVA":access?.effective_status==="expired"?"EXPIRADA":"TESTE GRATIS / SEM ASSINATURA"}
            </span>
            <h2>ESTIBORDO - Plano anual</h2>
            <p>Valor: <strong>{formatCurrencyFromCents(config.priceCents)}</strong> - 365 dias de acesso.</p>
          </div>

          {active ? (
            <div className="subscriptionValidity">
              <div><small>Valida ate</small><strong>{new Date(access.expires_at).toLocaleDateString("pt-BR")}</strong></div>
              <div><small>Tempo restante</small><strong>{remaining} dias</strong></div>
              <a href="/conteudos">Acessar conteudos</a>
            </div>
          ) : (
            <div className="subscriptionValidity">
              <p>Adquira o plano anual para liberar todos os simulados, cadernos, flashcards e demais materiais.</p>
              <a href="/comprar">Comprar assinatura</a>
            </div>
          )}
        </section>
      </main>
    </>
  );
}