import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getUserAccess} from "../../lib/access";
import {getPaymentConfig,formatCurrencyFromCents} from "../../lib/payments";
import StudentHeader from "../components/StudentHeader";
import {getAiTutorAccess,AI_TUTOR_PRICE_CENTS} from "../../lib/ai-tutor";

function daysLeft(expiresAt){
  if(!expiresAt) return 0;
  return Math.max(0,Math.ceil((new Date(expiresAt).getTime()-Date.now())/86400000));
}

export default async function MinhasAssinaturas(){
  const session=await getSession();
  if(!session) redirect("/login?next=/minhas-assinaturas");

  const [access,tutorAccess]=await Promise.all([getUserAccess(session.id),getAiTutorAccess(session.id)]);
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
        <section className="subscriptionCard">
          <div>
            <span className={`subscriptionStatus ${tutorAccess?.active?"isActive":"isInactive"}`}>{tutorAccess?.active?"ATIVO":"ADICIONAL"}</span>
            <h2>⚓ CONTRAMESTRE</h2>
            <p>Pacote adicional: <strong>{formatCurrencyFromCents(AI_TUTOR_PRICE_CENTS)}/mês</strong>.</p>
          </div>
          <div className="subscriptionValidity">
            {tutorAccess?.active ? <><div><small>Válido até</small><strong>{new Date(tutorAccess.expires_at).toLocaleDateString("pt-BR")}</strong></div><a href="/tutor-ia">Abrir CONTRAMESTRE</a></> : <><p>CONTRAMESTRE especializado exclusivamente no universo PSCPP e marítimo.</p><a href="/tutor-ia">Conhecer e comprar</a></>}
          </div>
        </section>
      </main>
    </>
  );
}