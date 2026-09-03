import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getAdmin } from "../../lib/admin";
import { query } from "../../lib/db";
import { getUserMetrics } from "../../lib/metrics";
import { normalizeSubject, subjectLabel } from "../../lib/subjects";
import "./dashboard.css";
import content from "../../data/site/area-do-aluno.json";

function formatNumber(value) {
  return new Intl.NumberFormat("pt-BR").format(Number(value || 0));
}

export default async function Area() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [admin, accessResult, progressResult, performance] = await Promise.all([
    getAdmin(),
    query(
      "select status from user_access where user_id=$1 and product_code='pscpp-vitalicio'",
      [session.id]
    ),
    query("select subject,percent from study_progress where user_id=$1", [session.id]),
    getUserMetrics(session.id),
  ]);

  const active = accessResult.rows[0]?.status === "active";
  const progressMap = Object.fromEntries(
    progressResult.rows.map((row) => [normalizeSubject(row.subject), Number(row.percent || 0)])
  );
  const progressValues = performance.subjects.map((subject) => progressMap[subject.slug] || 0);
  const overallProgress = Math.round(
    progressValues.reduce((total, value) => total + value, 0) / performance.subjects.length
  );

  return <>
    <header className="dashboardHeader">
      <div className="dashboardHeaderInner">
        <a className="dashboardBrand" href="/">
          <img src="/estibordo/logos/estibordo-logo-horizontal.svg" alt="ESTIBORDO" />
        </a>
        <div className="dashboardActions">
          {admin && <a href="/admin">{content.header.admin}</a>}
          <a className="dashboardStudy" href="/simulado">{content.header.study}</a>
          <form action="/api/auth/logout" method="post"><button type="submit">{content.header.logout}</button></form>
        </div>
      </div>
    </header>

    <main className="wrap studentDashboard" id="desempenho">
      <section className="dashboardIntro">
        <div><div className="sectionEyebrow">{content.intro.eyebrow}</div><h1>{content.intro.title}</h1><p>{session.email}</p></div>
        <span className={`accessBadge ${active ? "active" : "pending"}`}>{active ? content.intro.active : content.intro.pending}</span>
      </section>

      <section className="performanceMetrics" aria-label="Soma de todas as matérias">
        <div className="performanceMetric"><span>{content.metrics.attempts}</span><strong>{formatNumber(performance.overall.attempts)}</strong></div>
        <div className="performanceMetric"><span>{content.metrics.questions}</span><strong>{formatNumber(performance.overall.questions)}</strong></div>
        <div className="performanceMetric success"><span>{content.metrics.correct}</span><strong>{formatNumber(performance.overall.correct)}</strong></div>
        <div className="performanceMetric danger"><span>{content.metrics.errors}</span><strong>{formatNumber(performance.overall.errors)}</strong></div>
        <div className="performanceMetric"><span>{content.metrics.accuracy}</span><strong>{performance.overall.accuracy}%</strong></div>
      </section>

      <section className="dashboardSplit">
        <article className="dashboardPanel priorityPanel">
          <div className="panelHeading"><div><span>{content.analysis.eyebrow}</span><h2>{content.analysis.title}</h2></div></div>
          {performance.overall.needs_study.length ? <ol className="priorityList">
            {performance.overall.needs_study.map((item) => <li key={`${item.subject}-${item.module}-${item.topic_code}-${item.topic}`}>
              <div><strong>{item.topic}</strong><span>{subjectLabel(item.subject)} · {item.module}</span></div>
              <b>{item.errors} erros · {item.error_rate}%</b>
            </li>)}
          </ol> : <p className="emptyPerformance">{content.analysis.empty}</p>}
        </article>

        <article className="dashboardPanel progressPanel">
          <div className="panelHeading"><div><span>{content.progress.eyebrow}</span><h2>{content.progress.title}</h2></div><strong>{overallProgress}%</strong></div>
          <div className="largeProgress"><i style={{ width: `${overallProgress}%` }} /></div>
          <p>{content.progress.description}</p>
        </article>
      </section>

      <section className="subjectPerformance" id="disciplinas">
        <div className="subjectPerformanceHeading"><div><span className="sectionEyebrow">{content.subjects.eyebrow}</span><h2>{content.subjects.title}</h2></div><p>{content.subjects.description}</p></div>
        <div className="subjectPerformanceGrid">
          {performance.subjects.map((subject) => <article className="subjectPerformanceCard" key={subject.slug}>
            <div className="subjectPerformanceTitle"><div><span>{subject.label}</span><small>{subject.questions ? `${subject.questions} questões respondidas` : content.subjects.noAnswers}</small></div><strong>{subject.accuracy}%</strong></div>
            <div className="subjectStats">
              <div><span>{content.subjects.attempts}</span><b>{subject.attempts}</b></div>
              <div><span>{content.metrics.correct}</span><b className="successText">{subject.correct}</b></div>
              <div><span>{content.metrics.errors}</span><b className="dangerText">{subject.errors}</b></div>
              <div><span>{content.subjects.bestScore}</span><b>{subject.best_score}%</b></div>
            </div>
            <div className="accuracyBar"><i style={{ width: `${subject.accuracy}%` }} /></div>
            <div className="studyPriority"><span>{content.subjects.needsStudy}</span>
              {subject.needs_study.length ? <ul>{subject.needs_study.map((item) => <li key={`${item.topic_code}-${item.topic}`}><b>{item.topic}</b><small>{item.errors} erros em {item.answers} respostas</small></li>)}</ul> : <p>{content.subjects.insufficient}</p>}
            </div>
          </article>)}
        </div>
      </section>
    </main>
  </>;
}
