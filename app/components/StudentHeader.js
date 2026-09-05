import { getAdmin } from "../../lib/admin";
import { getSession } from "../../lib/auth";
import { query } from "../../lib/db";
import { listFlashcardDecks } from "../../lib/flashcards";
import styles from "./student-header.module.css";

function Menu({ active = "", flashcardDecks = [] }) {
  return (
    <nav className={styles.nav} aria-label="Área do aluno">
      <a className={active === "painel" ? styles.active : ""} href="/area-do-aluno">
        <span className={styles.icon}>⌂</span><span>Início</span>
      </a>

      <details className={styles.group} open={["plano","adaptativo","hoje","revisao","fraquezas"].includes(active)}>
        <summary>
          <span><b className={styles.icon}>◫</b> Minha Preparação</span>
          <b className={styles.chevron}>⌄</b>
        </summary>
        <div className={styles.submenu}><div>
          <a href="/plano-de-estudos">Plano de Estudos</a>
          <a href="/hoje">Plano de Hoje</a>
          <a href="/treino-adaptativo">Treino Adaptativo</a>
          <a href="/revisao-inteligente">Revisão Inteligente</a>
          <a href="/analise-de-fraquezas">Análise de Fraquezas</a>
        </div></div>
      </details>

      <details className={styles.group} open={active === "simulados"}>
        <summary>
          <span><b className={styles.icon}>▣</b> Simulados</span>
          <b className={styles.chevron}>⌄</b>
        </summary>
        <div className={styles.submenu}><div>
          <a href="/simulado">Gerar Simulado</a>
          <a href="/simulado">Meus Simulados</a>
          <a href="/area-do-aluno#desempenho">Desempenho</a>
        </div></div>
      </details>

      <details className={styles.group} open={active === "conteudos"}>
        <summary>
          <span><b className={styles.icon}>☷</b> Banco de Questões</span>
          <b className={styles.chevron}>⌄</b>
        </summary>
        <div className={styles.submenu}><div>
          <a href="/conteudos/banco-de-questoes">Gerar Caderno</a>
          <a href="/conteudos/caderno-de-erros">Caderno de Erros</a>
          <a href="/conteudos">Central de Conteúdos</a>
        </div></div>
      </details>

      <details className={styles.group} open={active === "flashcards"}>
        <summary>
          <span><b className={styles.icon}>▤</b> Flashcards</span>
          <b className={styles.chevron}>⌄</b>
        </summary>
        <div className={styles.submenu}><div>
          {flashcardDecks.map((deck) => (
            <a href={`/flashcards/${deck.slug}`} key={deck.id}>
              {deck.title}
            </a>
          ))}
          <a className={styles.submenuAll} href="/flashcards">Todos os Flashcards</a>
        </div></div>
      </details>

      <details className={styles.group}>
        <summary>
          <span><b className={styles.icon}>▦</b> Central de Estudos</span>
          <b className={styles.chevron}>⌄</b>
        </summary>
        <div className={styles.submenu}><div>
          <a href="/conteudos">Estudar por Matéria</a>
          <a href="/conteudos/caderno-de-erros">Caderno de Erros</a>
        </div></div>
      </details>

      <a className={active === "ranking" ? styles.active : ""} href="/ranking">
        <span className={styles.icon}>★</span><span>Ranking</span>
      </a>

      <a className={active === "assinaturas" ? styles.active : ""} href="/minhas-assinaturas">
        <span className={styles.icon}>♛</span><span>Minhas Assinaturas</span>
      </a>

      <div className={styles.divider} />

      <a className={active === "perfil" ? styles.active : ""} href="/perfil">
        <span className={styles.icon}>♙</span><span>Meu Perfil</span>
      </a>

      <a href="/"><span className={styles.icon}>◈</span><span>Home</span></a>
    </nav>
  );
}

export default async function StudentHeader({ active = "" }) {
  const [admin, session] = await Promise.all([getAdmin(), getSession()]);
  let displayName = session?.email?.split("@")[0] || "Aluno";
  let flashcardDecks = [];

  if (session?.id) {
    try {
      const [profile, decks] = await Promise.all([
        query("select full_name from user_profiles where user_id=$1 limit 1", [session.id]),
        listFlashcardDecks(session.id),
      ]);

      if (profile.rows[0]?.full_name) displayName = profile.rows[0].full_name;
      flashcardDecks = decks;
    } catch {
      // Mantém o cabeçalho funcional mesmo se perfil ou decks estiverem indisponíveis.
    }
  }

  return (
    <>
      <div id="student-shell" className={styles.shellMarker} />

      <aside className={styles.sidebar}>
        <a className={styles.logo} href="/area-do-aluno">
          <img src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO" />
        </a>

        <div className={styles.profileCard}>
          <div className={styles.avatar}>{displayName.slice(0, 1).toUpperCase()}</div>
          <div>
            <strong>{displayName}</strong>
            <small>{session?.email || ""}</small>
            <span><i /> Online</span>
          </div>
        </div>

        <Menu active={active} flashcardDecks={flashcardDecks} />

        {admin && <a className={styles.adminLink} href="/admin">Administração</a>}

        <div className={styles.sidebarBottom}>
          <p>Algum problema com a plataforma?</p>
          <a href="mailto:suporte@estibordo.com.br">Ajuda e Suporte</a>
          <form action="/api/auth/logout" method="post">
            <button type="submit">↪ Sair da Conta</button>
          </form>
        </div>
      </aside>

      <header className={styles.topbar}>
        <details className={styles.mobileNav}>
          <summary aria-label="Abrir menu">☰</summary>
          <div className={styles.mobilePanel}>
            <div className={styles.mobileProfile}>
              <strong>{displayName}</strong>
              <small>{session?.email || ""}</small>
            </div>

            <Menu active={active} flashcardDecks={flashcardDecks} />

            {admin && <a className={styles.adminLink} href="/admin">Administração</a>}

            <form action="/api/auth/logout" method="post">
              <button className={styles.mobileLogout} type="submit">Sair da Conta</button>
            </form>
          </div>
        </details>

        <a className={styles.mobileLogo} href="/area-do-aluno">
          <img src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO" />
        </a>

        <div className={styles.search}>
          <span>⌕</span>
          <input aria-label="Pesquisar na plataforma" placeholder="Pesquisar na plataforma..." />
        </div>

        <div className={styles.topActions}>
          <a href="/minhas-assinaturas" title="Minhas Assinaturas">♛</a>
          <a href="/perfil" title="Meu Perfil">{displayName.slice(0, 1).toUpperCase()}</a>
        </div>
      </header>
    </>
  );
}
