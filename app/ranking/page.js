import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getLeaderboard} from "../../lib/ranking";
import StudentHeader from "../components/StudentHeader";
import styles from "./ranking.module.css";

export const dynamic = "force-dynamic";

function medal(position) {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  return position;
}

export default async function RankingPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/ranking");

  const ranking = await getLeaderboard(session.id, 50);
  const podium = ranking.leaders.slice(0, 3);

  return (
    <>
      <StudentHeader active="ranking" />
      <main className={styles.page}>
        <section className={styles.hero}>
          <span>DESEMPENHO ACADÊMICO</span>
          <h1>Ranking ESTIBORDO</h1>
          <p>
            Classificação baseada em aproveitamento, volume de questões,
            simulados realizados e consistência de estudo.
          </p>
          <small>
            Para entrar no ranking é necessário responder pelo menos {ranking.minimum_questions} questões.
            Os nomes são exibidos de forma abreviada.
          </small>
        </section>

        {podium.length > 0 && (
          <section className={styles.podium}>
            {podium.map((student) => (
              <article className={student.user_id === String(session.id) ? styles.me : ""} key={student.user_id}>
                <b>{medal(student.position)}</b>
                <h2>{student.name}</h2>
                <strong>{student.score} pts</strong>
                <span>{student.accuracy}% de acerto</span>
              </article>
            ))}
          </section>
        )}

        {ranking.current ? (
          <section className={styles.myPosition}>
            <span>SUA POSIÇÃO</span>
            <strong>#{ranking.current.position}</strong>
            <div>
              <b>{ranking.current.score} pts</b>
              <small>
                {ranking.current.accuracy}% · {ranking.current.questions} questões · {ranking.current.exams} simulados
              </small>
            </div>
          </section>
        ) : (
          <section className={styles.myPosition}>
            <span>SUA POSIÇÃO</span>
            <strong>—</strong>
            <div>
              <b>Ranking ainda não liberado</b>
              <small>Complete {ranking.minimum_questions} questões para entrar na classificação.</small>
            </div>
          </section>
        )}

        <section className={styles.table}>
          <div className={styles.header}>
            <span>POS.</span><span>ALUNO</span><span>PONTOS</span><span>ACERTO</span>
            <span>QUESTÕES</span><span>SIMULADOS</span><span>DIAS/30</span>
          </div>
          {ranking.leaders.map((student) => (
            <article className={student.user_id === String(session.id) ? styles.meRow : ""} key={student.user_id}>
              <b>{medal(student.position)}</b>
              <strong>{student.name}{student.user_id === String(session.id) ? " (você)" : ""}</strong>
              <span>{student.score}</span>
              <span>{student.accuracy}%</span>
              <span>{student.questions}</span>
              <span>{student.exams}</span>
              <span>{student.active_days_30}</span>
            </article>
          ))}
          {!ranking.leaders.length && <p className={styles.empty}>Ainda não há alunos elegíveis para o ranking.</p>}
        </section>

        <section className={styles.method}>
          <h2>Como a pontuação é calculada</h2>
          <p>
            50% aproveitamento · 20% volume de questões · 15% simulados · 15% consistência nos últimos 30 dias.
            Volume e frequência possuem teto para evitar vantagem desproporcional por repetição excessiva.
          </p>
        </section>
      </main>
    </>
  );
}
