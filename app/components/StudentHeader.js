import { getAdmin } from "../../lib/admin";
import { getSession } from "../../lib/auth";
import { query } from "../../lib/db";
import { listFlashcardDecks } from "../../lib/flashcards";
import styles from "./student-header.module.css";
import StudySessionTracker from "./StudySessionTracker";
import OfflineSyncStatus from "./OfflineSyncStatus";
import StudentMobileMenu from "./StudentMobileMenu";

function Menu({ active = "", flashcardDecks = [] }) {
  return (
    <nav className={styles.nav} aria-label="Área do aluno">
      <a className={["painel","hoje"].includes(active) ? styles.active : ""} href="/hoje"><span className={styles.icon}>⌂</span><span>Hoje</span></a>

      <details className={styles.group} open={["conteudos","biblioteca","flashcards","mapas","ripeam3d"].includes(active)}>
        <summary><span><b className={styles.icon}>▦</b> Estudar</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <a href="/conteudos">Central de Conteúdos</a>
          <a href="/minha-biblioteca">Minha Biblioteca</a>
          <a href="/flashcards">Flashcards</a>
          <a href="/mapas-mentais">Mapas Mentais</a>
          <a href="/flashcards/ripeam/3d">Laboratório RIPEAM 3D</a>
        </div></div>
      </details>

      <details className={styles.group} open={["simulados","adaptativo","revisao"].includes(active)}>
        <summary><span><b className={styles.icon}>▣</b> Treinar</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <a href="/simulado">Simulados</a>
          <a href="/conteudos/banco-de-questoes">Banco de Questões</a>
          <a href="/conteudos/banco-de-questoes#meus-cadernos">Meus Cadernos</a>
          <a href="/treino-adaptativo">Treino Inteligente</a>
          <a href="/centro-de-revisao">Centro de Revisão</a>
          <a href="/conteudos/caderno-de-erros">Caderno de Erros</a>
        </div></div>
      </details>

      <details className={styles.group} open={["plano","fraquezas","trajetoria","ranking"].includes(active)}>
        <summary><span><b className={styles.icon}>◎</b> Desempenho</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <a href="/plano-de-estudos">Rota Inteligente</a>
          <a href="/analise-de-fraquezas">Análise de Fraquezas</a>
          <a href="/minha-trajetoria">Minha Trajetória</a>
          <a href="/ranking">Ranking</a>
          <a href="/conquistas">Conquistas</a>
        </div></div>
      </details>

      <a className={active === "tutor" ? styles.active : ""} href="/contramestre"><span className={styles.icon}>⚓</span><span>Contramestre</span></a>

      <details className={styles.group} open={["perfil","assinaturas","offline","suporte"].includes(active)}>
        <summary><span><b className={styles.icon}>⚙</b> Conta e suporte</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <a href="/perfil">Perfil</a>
          <a href="/preferencias">Personalização</a>
          <a href="/minhas-assinaturas">Minhas Assinaturas</a>
          <a href="/offline">Disponibilidade offline</a>
          <a href="/suporte">Ajuda e Suporte</a>
        </div></div>
      </details>
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
      <StudySessionTracker/>
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
          <a href="/suporte">Ajuda e Suporte</a>
          <form action="/api/auth/logout" method="post">
            <button type="submit">↪ Sair da Conta</button>
          </form>
        </div>
      </aside>

      <header className={styles.topbar}>
        <StudentMobileMenu className={styles.mobileNav} panelClassName={styles.mobilePanel}>
            <div className={styles.mobileProfile}>
              <strong>{displayName}</strong>
              <small>{session?.email || ""}</small>
            </div>

            <Menu active={active} flashcardDecks={flashcardDecks} />

            {admin && <a className={styles.adminLink} href="/admin">Administração</a>}

            <form action="/api/auth/logout" method="post">
              <button className={styles.mobileLogout} type="submit">Sair da Conta</button>
            </form>
        </StudentMobileMenu>

        <a className={styles.mobileLogo} href="/area-do-aluno">
          <img src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO" />
        </a>

        <form className={styles.search} action="/pesquisar" method="get">
          <span>⌕</span>
          <input name="q" aria-label="Pesquisar na plataforma" placeholder="Pesquisar na plataforma..." />
        </form>

        <div className={styles.topActions}>
          <OfflineSyncStatus />
          <a href="/minhas-assinaturas" title="Minhas Assinaturas">♛</a>
          <a href="/perfil" title="Meu Perfil">{displayName.slice(0, 1).toUpperCase()}</a>
        </div>
      </header>
    </>
  );
}