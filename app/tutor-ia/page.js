import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {AI_TUTOR_DAILY_LIMIT,getAiTutorAccess,getTutorConversation,getTutorUsage,listTutorConversations} from "../../lib/ai-tutor";
import StudentHeader from "../components/StudentHeader";
import TutorChat from "./TutorChat";
import styles from "./tutor.module.css";
export const dynamic="force-dynamic";

export default async function TutorPage({searchParams}){
  const session=await getSession();if(!session)redirect("/login?next=/tutor-ia");
  const access=await getAiTutorAccess(session.id);
  const usage=await getTutorUsage(session.id);
  const params=await searchParams;
  const conversations=access?.active?await listTutorConversations(session.id):[];
  const selected=params?.c&&access?.active?await getTutorConversation(session.id,String(params.c)):null;
  return <><StudentHeader active="tutor"/><main className={styles.page}>
    <section className={styles.hero}><div><span>TUTOR ACADÊMICO ESPECIALIZADO</span><h1>✨ Tutor IA ESTIBORDO</h1><p>Um tutor focado exclusivamente no universo PSCPP e marítimo. Tire dúvidas, peça explicações e revise conceitos.</p></div><div className={styles.badge}>PACOTE ADICIONAL<br/><strong>R$ 100/mês</strong></div></section>
    {access?.active?<TutorChat conversations={conversations} initialConversation={selected} remaining={Math.max(0,AI_TUTOR_DAILY_LIMIT-Number(usage.questions||0))}/>:<section className={styles.locked}>
      <div className={styles.lockIcon}>✨</div><h2>Adicione o Tutor IA à sua preparação</h2>
      <p>Este recurso não está incluído no plano principal da ESTIBORDO. O acesso ao Tutor IA é vendido separadamente por <strong>R$ 100 por mês</strong>.</p>
      <div className={styles.features}><span>✓ Até {AI_TUTOR_DAILY_LIMIT} perguntas por dia</span><span>✓ Foco em PSCPP e universo marítimo</span><span>✓ Histórico privado de conversas</span><span>✓ Explicações técnicas e didáticas</span></div>
      <form action="/api/payments/mercado-pago/tutor-checkout" method="post"><button>Comprar Tutor IA — R$ 100/mês</button></form>
      <small>O pacote libera 30 dias de acesso após a confirmação do pagamento. Renove mensalmente para continuar utilizando.</small>
    </section>}
  </main></>;
}
