import { getAdmin } from "../../lib/admin";
import styles from "./student-header.module.css";

export default async function StudentHeader({ active = "" }) {
  const admin = await getAdmin();

  const links = [
    ["Hoje", "/hoje", "hoje"],
    ["Painel", "/area-do-aluno", "painel"],
    ["ConteÃºdos", "/conteudos", "conteudos"],
    ["Simulados", "/simulado", "simulados"],
    ["Flashcards", "/flashcards", "flashcards"],
    ["Minhas Assinaturas", "/minhas-assinaturas", "assinaturas"],
    ["Perfil", "/perfil", "perfil"],
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a className={styles.brand} href="/">
          <img src="/estibordo/logos/estibordo-logo-header.png" alt="ESTIBORDO" />
        </a>

        <nav className={styles.links} aria-label="NavegaÃ§Ã£o da Ã¡rea do aluno">
          {links.map(([label, href, key]) => (
            <a key={href} className={active === key ? styles.active : ""} href={href}>
              {label}
            </a>
          ))}

          {admin && <a href="/admin">Admin</a>}

          <form action="/api/auth/logout" method="post">
            <button type="submit">Sair</button>
          </form>
        </nav>
      </div>
    </header>
  );
}