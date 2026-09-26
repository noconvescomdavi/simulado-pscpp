import {isStandaloneBuild} from "../../lib/standalone/mode";
import StandaloneTrajectory from "./StandaloneTrajectory";
import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getIntegratedStudyPlan} from "../../lib/integrated-study-plan";
import {getLearningProfile,getStudyTimeSummary} from "../../lib/learning-engine";
import {getLearningGraph} from "../../lib/learning-graph";
import {getUserMetrics} from "../../lib/metrics";
import StudentHeader from "../components/StudentHeader";
import styles from "./trajectory.module.css";


function fmtDate(value){
  if(!value)return "—";
  return new Date(value+"T12:00:00").toLocaleDateString("pt-BR");
}

async function WebTrajectory(){
  const session=await getSession();
  if(!session)redirect("/login?next=/minha-trajetoria");
  const [plan,learning,time,graph,metrics]=await Promise.all([
    getIntegratedStudyPlan(session.id,0),
    getLearningProfile(session.id),
    getStudyTimeSummary(session.id),
    getLearningGraph(session.id),
    getUserMetrics(session.id)
  ]);
  if(plan.needs_onboarding)redirect("/plano-de-estudos/configurar");

  const status=plan.tracking?.schedule_health==="behind"?"Atrasado":plan.tracking?.schedule_health==="attention"?"Atenção":"Em dia";
  return <><StudentHeader active="trajetoria"/><main className={styles.page}>
    <section className={styles.hero}>
      <div><span>MINHA TRAJETÓRIA</span><h1>Do ponto atual até a prova.</h1><p>Uma visão única de domínio, consistência, carga real, bibliografia e risco do cronograma.</p></div>
      <div className={styles.score}><strong>{Math.round(Number(learning.overall_mastery||0))}</strong><span>Mastery Score</span></div>
    </section>

    <section className={styles.kpis}>
      <article><span>ADERÊNCIA</span><strong>{plan.tracking?.adherence_percent??100}%</strong><small>últimos 30 dias válidos</small></article>
      <article><span>TEMPO REAL</span><strong>{time.week_minutes} min</strong><small>últimos 7 dias</small></article>
      <article><span>BACKLOG</span><strong>{plan.tracking?.backlog_count||0}</strong><small>{plan.tracking?.backlog_minutes||0} min estimados</small></article>
      <article><span>CRONOGRAMA</span><strong>{status}</strong><small>capacidade de recuperação: {plan.tracking?.recovery_capacity_minutes||0} min</small></article>
      <article><span>1ª LEITURA</span><strong>{fmtDate(plan.first_pass?.projected_finish)}</strong><small>{plan.first_pass?.on_track?"ritmo compatível":"risco de atraso"}</small></article>
      <article><span>PRONTIDÃO</span><strong>{plan.readiness}%</strong><small>índice integrado ESTIBORDO</small></article>
    </section>

    <section className={styles.titleMetrics}>
      <div className={styles.head}><div><span>AVALIAÇÃO PSCPP</span><h2>Simulados e Prova de Títulos</h2></div></div>
      <div className={styles.titleMetricGrid}>
        <article><span>MÉDIA DOS SIMULADOS</span><strong>{Number(metrics.overall.exam_average||0).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})}%</strong><small>média de todos os simulados concluídos</small></article>
        <article><span>PROVA DE TÍTULOS</span><strong>{Number(metrics.overall.title_score||0).toLocaleString("pt-BR",{minimumFractionDigits:1,maximumFractionDigits:1})} / 10</strong><small>pontuação calculada conforme Edital PSCPP 2012</small></article>
      </div>
      <div className={styles.titleBreakdown}>
        <div><span>Tempo de embarque</span><b>{Number(metrics.overall.title_score_breakdown?.embarkation||0).toFixed(1)} / 3</b></div>
        <div><span>Categoria / posto</span><b>{Number(metrics.overall.title_score_breakdown?.category||0).toFixed(1)} / 2</b></div>
        <div><span>Comando / praticagem</span><b>{Number(metrics.overall.title_score_breakdown?.command||0).toFixed(1)} / 5</b></div>
      </div>
    </section>

    <section className={styles.graphSummary}>
      <div><span>GRAFO DE APRENDIZAGEM</span><strong>{graph.totals.questions.toLocaleString("pt-BR")}</strong><small>questões indexadas</small></div>
      <div><span>OBRAS</span><strong>{graph.totals.works}</strong><small>fontes/títulos reconhecidos pela taxonomia</small></div>
      <div><span>CAPÍTULOS</span><strong>{graph.totals.chapters}</strong><small>nós de capítulo/seção</small></div>
      <div><span>TÓPICOS</span><strong>{graph.totals.topics}</strong><small>tópicos conectados ao banco</small></div>
      <div><span>BIBLIOGRAFIA</span><strong>{graph.totals.bibliography_units}</strong><small>unidades obrigatórias no plano</small></div>
    </section>

    <section className={styles.subjects}>
      <div className={styles.head}><div><span>MAPA DE DOMÍNIO</span><h2>Conteúdo programático por matéria, obra, capítulo e tópico</h2><p>Tópicos sem respostas permanecem visíveis como “Não avaliado”; ausência de evidência não é tratada como domínio.</p></div></div>
      <div className={styles.subjectGrid}>{graph.subjects.map(subject=><article key={subject.slug}>
        <div className={styles.subjectHead}><div><strong>{subject.title}</strong><small>{subject.measured_topics} tópicos medidos · {subject.bibliography_units} unidades bibliográficas</small></div><b>{Math.round(Number(subject.mastery_score||0))}%</b></div>
        <div className={styles.bar}><i style={{width:Math.max(2,Number(subject.mastery_score||0))+"%"}}/></div>
        <div className={styles.weakest}>{subject.works.map(work=><div key={work.id}><strong>{work.title}</strong>{work.chapters.map(ch=><div key={ch.id}><small>{ch.label}</small>{ch.topics.map(topic=><div key={topic.id}><span>{topic.label}</span><b>{Number(topic.confidence_score||0)<=0?"Não avaliado":Math.round(Number(topic.mastery_score||0))+"%"}</b></div>)}</div>)}</div>)}</div>
      </article>)}</div>
    </section>

    <section className={styles.timeline}>
      <div><span>AGORA</span><strong>{plan.phase.label}</strong><small>{plan.first_pass?.known_pages_remaining||0} páginas conhecidas restantes</small></div>
      <i/>
      <div><span>META INTERNA</span><strong>15/07/2027</strong><small>margem operacional da 1ª leitura</small></div>
      <i/>
      <div><span>1ª PASSAGEM</span><strong>01/08/2027</strong><small>100% da bibliografia ao menos uma vez</small></div>
      <i/>
      <div><span>PROVA</span><strong>01/11/2027</strong><small>reta final de revisão pesada</small></div>
    </section>
  </main></>;
}

export default async function MinhaTrajetoria(){if(isStandaloneBuild())return <StandaloneTrajectory/>;return WebTrajectory();}
