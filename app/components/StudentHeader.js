import { getAdmin } from "../../lib/admin";
import styles from "./student-header.module.css";
export default async function StudentHeader({ active="" }){
 const admin=await getAdmin();
 const links=[["Painel","/area-do-aluno","painel"],["Conteúdos","/conteudos","conteudos"],["Simulados","/simulado","simulados"],["Perfil","/perfil","perfil"]];
 return <header className={styles.header}><div className={styles.inner}><a className={styles.brand} href="/area-do-aluno"><img src="/estibordo/logos/estibordo-logo-horizontal.svg" alt="ESTIBORDO"/></a><nav className={styles.links}>{links.map(([l,h,k])=><a key={h} className={active===k?styles.active:""} href={h}>{l}</a>)}{admin&&<a href="/admin">Admin</a>}<form action="/api/auth/logout" method="post"><button>Sair</button></form></nav></div></header>}
