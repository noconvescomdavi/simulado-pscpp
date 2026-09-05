import { redirect } from "next/navigation";
import { getSession } from "../../../lib/auth";
import { getOnboarding } from "../../../lib/integrated-study-plan";
import { SUBJECTS } from "../../../lib/subjects";
import StudentHeader from "../../components/StudentHeader";
import OnboardingForm from "./OnboardingForm";
import styles from "./configurar.module.css";

export const dynamic="force-dynamic";

export default async function ConfigurarPlano(){
  const session=await getSession();
  if(!session)redirect("/login?next=/plano-de-estudos/configurar");
  const onboarding=await getOnboarding(session.id);

  return (
    <>
      <StudentHeader active="plano"/>
      <main className={styles.page}>
        <section className={styles.hero}>
          <span>PLANO INTELIGENTE</span>
          <h1>Conte um pouco sobre seus estudos</h1>
          <p>Essas respostas calibram a carga, a ordem das matérias e a bibliografia até a prova de 01/11/2027.</p>
        </section>
        <OnboardingForm subjects={SUBJECTS} initial={onboarding}/>
      </main>
    </>
  );
}
