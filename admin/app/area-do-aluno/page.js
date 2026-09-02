import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getAdmin } from "../../lib/admin";
import { query } from "../../lib/db";

const subjects = [
  "Manobrabilidade",
  "Arte Naval",
  "Navegação em Águas Restritas",
  "Legislação e Regulamentação",
  "Meteorologia e Oceanografia",
  "Comunicações",
  "Conhecimentos Gerais"
];

export default async function Area() {
  const s = await getSession();
  if (!s) redirect("/login");

  const admin = await getAdmin();
  const ac = await query(
    "select status from user_access where user_id=$1 and product_code='pscpp-vitalicio'",
    [s.id]
  );
  const active = ac.rows[0]?.status === "active";
  const p = await query("select subject,percent from study_progress where user_id=$1", [s.id]);
  const attempts = await query(
    "select * from exam_attempts where user_id=$1 order by created_at desc limit 10",
    [s.id]
  );

  const map = Object.fromEntries(p.rows.map((x) => [x.subject, x.percent]));
  const vals = subjects.map((x) => Number(map[x] || 0));
  const overall = Math.round(vals.reduce((a, b) => a + b, 0) / subjects.length);
  const avg = attempts.rowCount
    ? (attempts.rows.reduce((a, b) => a + Number(b.score_percent), 0) / attempts.rowCount).toFixed(1)
    : "—";
  const answered = attempts.rows.reduce((a, b) => a + Number(b.total_questions || 0), 0);

  return <>
    <nav className="nav">
      <div className="navin">
        <a className="brand" href="/">SIMULADOS PSCPP<small>@noconvescomdavi</small></a>
        <div className="links">
          {admin && <a href="/admin">Admin</a>}
          <a className="primary" href="/simulado">Estudar</a>
          <form action="/api/auth/logout" method="post"><button>Sair</button></form>
        </div>
      </div>
    </nav>

    <main className="wrap">
      <div className="eyebrow">PAINEL DO ALUNO</div>
      <h1>Seu desempenho</h1>
      <p className="muted">{s.email} · Acesso: <b>{active ? "ATIVO" : "PENDENTE"}</b></p>

      <section className="metrics">
        <div className="metric"><span>PROGRESSO GERAL</span><b>{overall}%</b></div>
        <div className="metric"><span>MÉDIA</span><b>{avg}</b></div>
        <div className="metric"><span>QUESTÕES RESPONDIDAS</span><b>{answered}</b></div>
        <div className="metric"><span>SIMULADOS</span><b>{attempts.rowCount}</b></div>
      </section>

      <section className="two">
        <div className="card">
          <h2>Progresso por disciplina</h2>
          {subjects.map((x) => <div key={x} style={{ margin: "14px 0" }}>
            <b>{x}</b>
            <div className="bar"><i style={{ width: `${map[x] || 0}%` }} /></div>
          </div>)}
        </div>
        <div className="card">
          <h2>Acesso</h2>
          <p className="muted">
            {active
              ? "Sua licença vitalícia está ativa."
              : "Seu acesso está aguardando liberação. Assim que a confirmação for concluída, o conteúdo será liberado automaticamente."}
          </p>
        </div>
      </section>
    </main>
  </>;
}
