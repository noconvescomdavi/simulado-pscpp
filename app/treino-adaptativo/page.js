import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getEntitlement} from "../../lib/entitlement";
import {getIntegratedStudyPlan} from "../../lib/integrated-study-plan";
import StudentHeader from "../components/StudentHeader";
import AdaptiveClient from "./AdaptiveClient";
import styles from "./adaptive.module.css";

export const dynamic="force-dynamic";

export default async function TreinoAdaptativo(){
  const session=await getSession();
  if(!session)redirect("/login?next=/treino-adaptativo");
  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar?locked=inactive");

  const plan=await getIntegratedStudyPlan(session.id,0);
  if(plan.needs_onboarding)redirect("/plano-de-estudos/configurar");

  return (
    <>
      <StudentHeader active="adaptativo"/>
      <main className={styles.page}>
        <section className={styles.hero}>
          <span>TREINO ADAPTATIVO</span>
          <h1>A plataforma escolhe o que você precisa treinar.</h1>
          <p>O algoritmo combina desempenho, volume respondido, autoavaliação e matérias ainda pouco cobertas.</p>
        </section>

        <section className={styles.grid}>
          <article className={styles.panel}>
            <span>PRIORIDADES DO MOMENTO</span>
            <div className={styles.list}>{plan.weighted_subjects.map((s,i)=><div key={s.slug}><b>{i+1}</b><div><strong>{s.label}</strong><small>{s.questions} respostas · {s.correct} acertos · {s.errors} erros</small></div><em>{s.accuracy}%</em></div>)}</div>
          </article>

          <article className={styles.action}>
            <span>SESSÃO RECOMENDADA</span>
            <h2>{entitlement.trial?"10":"20"} questões</h2>
            <p>Questões distribuídas automaticamente entre as matérias de maior prioridade.</p>
            <AdaptiveClient trial={entitlement.trial}/>
          </article>
        </section>
      </main>
    </>
  );
}
