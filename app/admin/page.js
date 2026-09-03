import { redirect } from "next/navigation";
import { getSession } from "../../lib/auth";
import { getAdmin } from "../../lib/admin";
import { query } from "../../lib/db";
import content from "../../data/site/admin.json";

export const dynamic = "force-dynamic";

function fmtDate(value) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo"
  }).format(new Date(value));
}

function StatusBadge({ value }) {
  const normalized = String(value || "pending").toLowerCase();
  return <span className={`status status-${normalized}`}>{normalized.toUpperCase()}</span>;
}

export default async function AdminPage({ searchParams }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const admin = await getAdmin();
  if (!admin) redirect("/area-do-aluno");

  const sp = await searchParams;
  const q = String(sp?.q || "").trim().slice(0, 160);
  const message = String(sp?.msg || "").trim().slice(0, 200);

  const stats = await query(`
    SELECT
      COUNT(*) FILTER (WHERE u.role = 'student')::int AS students,
      COUNT(*) FILTER (WHERE u.status = 'blocked')::int AS blocked,
      COUNT(*) FILTER (WHERE a.status = 'active')::int AS active_access,
      COUNT(*) FILTER (WHERE a.status = 'pending')::int AS pending_access,
      COUNT(*) FILTER (WHERE a.status = 'revoked')::int AS revoked_access
    FROM users u
    LEFT JOIN user_access a
      ON a.user_id = u.id AND a.product_code = 'pscpp-vitalicio'
  `);

  const values = [];
  let where = "";
  if (q) {
    values.push(`%${q}%`);
    where = `WHERE u.email ILIKE $1`;
  }

  const users = await query(`
    SELECT
      u.id,
      u.email,
      u.role,
      u.status AS account_status,
      u.created_at,
      u.last_login_at,
      COALESCE(a.status, 'pending') AS access_status,
      a.lifetime,
      a.activated_at,
      COALESCE(ex.exams, 0)::int AS exams,
      COALESCE(ex.answered, 0)::int AS answered,
      COALESCE(ex.avg_score, 0) AS avg_score,
      COALESCE(pr.avg_progress, 0)::int AS avg_progress
    FROM users u
    LEFT JOIN user_access a
      ON a.user_id = u.id AND a.product_code = 'pscpp-vitalicio'
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*)::int AS exams,
        COALESCE(SUM(total_questions), 0)::int AS answered,
        ROUND(COALESCE(AVG(score_percent), 0), 1) AS avg_score
      FROM exam_attempts
      WHERE user_id = u.id
    ) ex ON TRUE
    LEFT JOIN LATERAL (
      SELECT ROUND(COALESCE(AVG(percent), 0), 0)::int AS avg_progress
      FROM study_progress
      WHERE user_id = u.id
    ) pr ON TRUE
    ${where}
    ORDER BY u.created_at DESC
    LIMIT 100
  `, values);

  const s = stats.rows[0] || {};

  return <>
    <nav className="nav">
      <div className="navin">
        <a className="brand" href="/">{content.nav.brand}<small>{content.nav.brandSmall}</small></a>
        <div className="links">
          <a href="/area-do-aluno">{content.nav.studentArea}</a>
          <form action="/api/auth/logout" method="post"><button>{content.nav.logout}</button></form>
        </div>
      </div>
    </nav>

    <main className="wrap admin-wrap">
      <div className="admin-heading">
        <div>
          <div className="eyebrow">{content.heading.eyebrow}</div>
          <h1>{content.heading.title}</h1>
          <p className="muted">{content.heading.restricted} · {admin.email}</p>
        </div>
        <form className="admin-search" method="get" action="/admin">
          <input name="q" type="search" defaultValue={q} placeholder={content.search.placeholder} aria-label="Pesquisar aluno por e-mail" />
          <button className="btn primary" type="submit">{content.search.button}</button>
          {q && <a className="btn" href="/admin">{content.search.clear}</a>}
        </form>
      </div>

      {message && <div className="admin-notice">{message}</div>}

      <section className="metrics admin-metrics">
        <div className="metric"><span>{content.metrics.students}</span><b>{s.students || 0}</b></div>
        <div className="metric"><span>{content.metrics.active}</span><b>{s.active_access || 0}</b></div>
        <div className="metric"><span>{content.metrics.pending}</span><b>{s.pending_access || 0}</b></div>
        <div className="metric"><span>{content.metrics.blocked}</span><b>{s.blocked || 0}</b></div>
      </section>

      <section className="card admin-card">
        <div className="admin-table-head">
          <div>
            <h2>{content.users.title}</h2>
            <p className="muted">Mostrando até 100 registros{q ? ` para “${q}”` : " mais recentes"}.</p>
          </div>
          <span className="muted">{content.users.revoked}: {s.revoked_access || 0}</span>
        </div>

        <div className="table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                {content.users.headers.map((header)=><th key={header}>{header}</th>)}
              </tr>
            </thead>
            <tbody>
              {users.rows.map((u) => <tr key={u.id}>
                <td>
                  <strong>{u.email}</strong>
                  <small>{u.role === "admin" ? "Administrador" : "Aluno"}</small>
                </td>
                <td><StatusBadge value={u.account_status} /></td>
                <td>
                  <StatusBadge value={u.access_status} />
                  <small>{u.lifetime ? "Vitalícia" : "—"}</small>
                </td>
                <td>
                  <strong>{u.avg_score}% média</strong>
                  <small>{u.exams} simulados · {u.answered} questões</small>
                  <small>{u.avg_progress}% progresso médio</small>
                </td>
                <td>
                  <small>Cadastro: {fmtDate(u.created_at)}</small>
                  <small>Último login: {fmtDate(u.last_login_at)}</small>
                  <small>Ativação: {fmtDate(u.activated_at)}</small>
                </td>
                <td>
                  <div className="admin-actions">
                    {u.access_status !== "active" && <form action={`/api/admin/users/${u.id}/access`} method="post">
                      <input type="hidden" name="action" value="active" />
                      <button className="mini mini-good" type="submit">Ativar licença</button>
                    </form>}
                    {u.access_status === "active" && <form action={`/api/admin/users/${u.id}/access`} method="post">
                      <input type="hidden" name="action" value="revoked" />
                      <button className="mini mini-warn" type="submit">Revogar licença</button>
                    </form>}
                    {u.account_status === "active" && u.id !== admin.id && <form action={`/api/admin/users/${u.id}/status`} method="post">
                      <input type="hidden" name="status" value="blocked" />
                      <button className="mini mini-danger" type="submit">Bloquear conta</button>
                    </form>}
                    {u.account_status === "blocked" && <form action={`/api/admin/users/${u.id}/status`} method="post">
                      <input type="hidden" name="status" value="active" />
                      <button className="mini mini-good" type="submit">Desbloquear</button>
                    </form>}
                  </div>
                </td>
              </tr>)}
              {!users.rowCount && <tr><td colSpan="6" className="empty">{content.users.empty}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </>;
}
