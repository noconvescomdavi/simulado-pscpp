import Image from "next/image";
import Link from "next/link";
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
      <Link className={["painel","hoje"].includes(active) ? styles.active : ""} href="/hoje"><span className={styles.icon}>⌂</span><span>Hoje</span></Link>

      <details className={styles.group} open={["conteudos","biblioteca","flashcards","mapas","ripeam3d"].includes(active)}>
        <summary><span><b className={styles.icon}>▦</b> Estudar</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/conteudos">Central de Conteúdos</Link>
          <Link href="/minha-biblioteca">Minha Biblioteca</Link>
          <Link href="/flashcards">Flashcards</Link>
          <Link href="/mapas-mentais">Mapas Mentais</Link>
          <Link href="/flashcards/ripeam/3d">Laboratório RIPEAM 3D</Link>
        </div></div>
      </details>

      <details className={styles.group} open={["simulados","adaptativo","revisao","revisao-inteligente","erros"].includes(active)}>
        <summary><span><b className={styles.icon}>▣</b> Treinar</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/simulado">Simulados</Link>
          <Link href="/conteudos/banco-de-questoes">Banco de Questões</Link>
          <Link href="/conteudos/banco-de-questoes#meus-cadernos">Meus Cadernos</Link>
          <Link href="/treino-adaptativo">Treino Inteligente</Link>
          <Link href="/centro-de-revisao">Centro de Revisão</Link>
          <Link href="/revisao-inteligente">Revisão Inteligente</Link>
          <Link href="/conteudos/caderno-de-erros">Caderno de Erros</Link>
        </div></div>
      </details>

      <details className={styles.group} open={["plano","fraquezas","trajetoria","ranking"].includes(active)}>
        <summary><span><b className={styles.icon}>◎</b> Desempenho</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/plano-de-estudos">Rota Inteligente</Link>
          <Link href="/analise-de-fraquezas">Análise de Fraquezas</Link>
          <Link href="/minha-trajetoria">Minha Trajetória</Link>
          <Link href="/ranking">Ranking</Link>
          <Link href="/conquistas">Conquistas</Link>
        </div></div>
      </details>

      <Link className={active === "tutor" ? styles.active : ""} href="/contramestre"><span className={styles.icon}>⚓</span><span>Contramestre</span></Link>

      <details className={styles.group} open={["perfil","assinaturas","offline","suporte"].includes(active)}>
        <summary><span><b className={styles.icon}>⚙</b> Conta e suporte</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/perfil">Perfil</Link>
          <Link href="/preferencias">Personalização</Link>
          <Link href="/minhas-assinaturas">Minhas Assinaturas</Link>
          <Link href="/offline">Disponibilidade offline</Link>
          <Link href="/suporte">Ajuda e Suporte</Link>
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
        <Link className={styles.logo} href="/hoje">
          <Image src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO" width={210} height={44} priority sizes="(max-width: 960px) 155px, 210px" />
        </Link>

        <div className={styles.profileCard}>
          <div className={styles.avatar}>{displayName.slice(0, 1).toUpperCase()}</div>
          <div>
            <strong>{displayName}</strong>
            <small>{session?.email || ""}</small>
            <span><i /> Online</span>
          </div>
        </div>

        <Menu active={active} flashcardDecks={flashcardDecks} />

        {admin && <Link className={styles.adminLink} href="/admin">Administração</Link>}

        <div className={styles.sidebarBottom}>
          <p>Algum problema com a plataforma?</p>
          <Link href="/suporte">Ajuda e Suporte</Link>
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

            {admin && <Link className={styles.adminLink} href="/admin">Administração</Link>}

            <form action="/api/auth/logout" method="post">
              <button className={styles.mobileLogout} type="submit">Sair da Conta</button>
            </form>
        </StudentMobileMenu>

        <Link className={styles.mobileLogo} href="/hoje">
          <Image src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO" width={210} height={44} priority sizes="(max-width: 960px) 155px, 210px" />
        </Link>

        <form className={styles.search} action="/pesquisar" method="get">
          <span>⌕</span>
          <input name="q" aria-label="Pesquisar na plataforma" placeholder="Pesquisar na plataforma..." />
        </form>

        <div className={styles.topActions}>
          <OfflineSyncStatus />
          <Link href="/minhas-assinaturas" title="Minhas Assinaturas">♛</Link>
          <Link href="/perfil" title="Meu Perfil">{displayName.slice(0, 1).toUpperCase()}</Link>
        </div>
      </header>
    </>
  );
}