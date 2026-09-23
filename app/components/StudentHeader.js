import Image from "next/image";
import Link from "next/link";
import { getAdmin } from "../../lib/admin";
import { getSession } from "../../lib/auth";
import { query } from "../../lib/db";
import {unstable_cache} from "next/cache";
import styles from "./student-header.module.css";
import StudySessionTracker from "./StudySessionTracker";
import StudentMobileMenu from "./StudentMobileMenu";

const cachedProfileName=unstable_cache(async(userId)=>{
  const profile=await query("select full_name from user_profiles where user_id=$1 limit 1",[userId]);
  return profile.rows[0]?.full_name||null;
},["student-header-profile"],{revalidate:300});

function Menu({ active = "" }) {
  return (
    <nav className={styles.nav} aria-label="Área do aluno">
      <Link className={active === "painel" ? styles.active : ""} href="/area-do-aluno"><span className={styles.icon}>⌂</span><span>Hoje</span></Link>

      <Link className={active === "perfil" ? styles.active : ""} href="/perfil"><span className={styles.icon}>♙</span><span>Perfil</span></Link>
      <details className={styles.group} open={["plano","adaptativo","hoje","revisao","fraquezas","trajetoria","preferencias"].includes(active)}>
        <summary><span><b className={styles.icon}>◫</b> Minha Preparação</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/plano-de-estudos">Meu Plano de Estudos</Link>
          <Link href="/hoje">Plano de Hoje</Link>
          <Link href="/treino-adaptativo">Treino Inteligente</Link>
          <Link href="/centro-de-revisao">Centro de Revisão</Link>
          <Link href="/analise-de-fraquezas">Desempenho e Fraquezas</Link>
          <Link href="/minha-trajetoria">Minha Trajetória</Link>
          <Link href="/preferencias">Personalização</Link>
        </div></div>
      </details>

      <details className={styles.group} open={active === "simulados"}>
        <summary><span><b className={styles.icon}>▣</b> Simulados</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/simulado">Gerar Simulado</Link>
          <Link href="/simulado">Meus Simulados</Link>
          <Link href="/area-do-aluno#desempenho">Desempenho</Link>
        </div></div>
      </details>

      <details className={styles.group} open={["conteudos","banco","cadernos","erros"].includes(active)}>
        <summary><span><b className={styles.icon}>☷</b> Banco de Questões</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/conteudos/banco-de-questoes">Gerar Caderno</Link>
          <Link href="/conteudos/banco-de-questoes#meus-cadernos">Meus Cadernos</Link>
          <Link href="/conteudos/caderno-de-erros">Caderno de Erros</Link>
          <Link href="/conteudos">Central de Conteúdos</Link>
        </div></div>
      </details>

      <details className={styles.group} open={active === "flashcards"}>
        <summary><span><b className={styles.icon}>▤</b> Flashcards</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/flashcards">Todos os Flashcards</Link>
          <Link href="/flashcards/meus-mapas">Dos meus mapas</Link>
        </div></div>
      </details>

      <Link className={active === "ripeam3d" ? styles.active : ""} href="/flashcards/ripeam/3d"><span className={styles.icon}>◈</span><span>Laboratório RIPEAM 3D</span></Link>

      <details className={styles.group} open={active === "mapas"}>
        <summary><span><b className={styles.icon}>🧠</b> Mapas Mentais</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/mapas-mentais">Meus Mapas Mentais</Link>
          <Link href="/mapas-mentais?template=study">Criar Novo Mapa</Link>
          <Link href="/flashcards/meus-mapas">Flashcards dos Mapas</Link>
        </div></div>
      </details>

      <Link className={active === "biblioteca" ? styles.active : ""} href="/minha-biblioteca"><span className={styles.icon}>▧</span><span>Minha Biblioteca</span></Link>

      <details className={styles.group}>
        <summary><span><b className={styles.icon}>▦</b> Central de Estudos</span><b className={styles.chevron}>⌄</b></summary>
        <div className={styles.submenu}><div>
          <Link href="/conteudos">Estudar por Matéria</Link>
          <Link href="/conteudos/caderno-de-erros">Caderno de Erros</Link>
        </div></div>
      </details>

      <Link className={active === "tutor" ? styles.active : ""} href="/contramestre"><span className={styles.icon}>⚓</span><span>Contramestre</span></Link>
      <Link className={active === "ranking" ? styles.active : ""} href="/ranking"><span className={styles.icon}>★</span><span>Ranking</span></Link>
      <Link href="/conquistas"><span className={styles.icon}>✦</span><span>Conquistas</span></Link>
      <Link className={active === "assinaturas" ? styles.active : ""} href="/minhas-assinaturas"><span className={styles.icon}>♛</span><span>Minhas Assinaturas</span></Link>
      <Link className={active === "suporte" ? styles.active : ""} href="/suporte"><span className={styles.icon}>✉</span><span>Suporte</span></Link>
      <div className={styles.divider} />
      <Link href="/"><span className={styles.icon}>◈</span><span>Home</span></Link>
    </nav>
  );
}
export default async function StudentHeader({ active = "" }) {
  const session = await getSession();
  const admin = session?.role === "admin" ? await getAdmin() : null;
  let displayName = session?.email?.split("@")[0] || "Aluno";

  if (session?.id) {
    try {
      const profileName = await cachedProfileName(session.id);
      if (profileName) displayName = profileName;
    } catch {
      // Mantém o cabeçalho funcional mesmo se o perfil estiver indisponível.
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

        <Menu active={active} />

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

            <Menu active={active} />

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
          <Link href="/minhas-assinaturas" title="Minhas Assinaturas">♛</Link>
          <Link href="/perfil" title="Meu Perfil">{displayName.slice(0, 1).toUpperCase()}</Link>
        </div>
      </header>
    </>
  );
}