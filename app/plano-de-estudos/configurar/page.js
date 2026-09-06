import { redirect } from "next/navigation";
import { getSession } from "../../../lib/auth";
import { getOnboarding } from "../../../lib/integrated-study-plan";
import { getStudyOnboardingProfile } from "../../../lib/study-onboarding-profile";
import { SUBJECTS } from "../../../lib/subjects";
import { bibliographyUnits } from "../../../data/study/bibliography";
import StudentHeader from "../../components/StudentHeader";
import OnboardingForm from "./OnboardingForm";
import styles from "./configurar.module.css";

export const dynamic="force-dynamic";

export default async function ConfigurarPlano(){
  const session=await getSession();
  if(!session)redirect("/login?next=/plano-de-estudos/configurar");

  const [onboarding,profile]=await Promise.all([
    getOnboarding(session.id),
    getStudyOnboardingProfile(session.id)
  ]);

  const units=bibliographyUnits().map(unit=>({
    subject_slug:unit.subject_slug,
    bibliography_key:unit.bibliography_key,
    publication:unit.publication,
    section_key:unit.section_key,
    section:unit.section,
    chapter:unit.chapter,
    page_start:unit.page_start,
    page_end:unit.page_end
  }));

  return (
    <>
      <StudentHeader active="plano"/>
      <main className={styles.page}>
        <section className={styles.hero}>
          <span>DIAGNÓSTICO INICIAL</span>
          <h1>Vamos montar um plano que realmente caiba na sua rotina.</h1>
          <p>Suas respostas calibram carga diária, prioridade das matérias, ponto de partida na bibliografia e ritmo de revisão até a prova de 01/11/2027.</p>
        </section>
        <OnboardingForm
          subjects={SUBJECTS}
          bibliographyUnits={units}
          initial={onboarding}
          initialProfile={profile}
        />
      </main>
    </>
  );
}
