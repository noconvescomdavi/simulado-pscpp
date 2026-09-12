import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {query} from "../../lib/db";
import StudentHeader from "../components/StudentHeader";
import styles from "./achievements.module.css";
export const dynamic="force-dynamic";
export default async function Achievements(){
  const s=await getSession();if(!s)redirect("/login?next=/conquistas");
  const r=await query("select a.code,a.name,a.description,a.icon,ua.unlocked_at from achievements a left join user_achievements ua on ua.achievement_id=a.id and ua.user_id=$1 order by (ua.unlocked_at is null),ua.unlocked_at desc nulls last,a.id",[s.id]);
  const unlocked=r.rows.filter(x=>x.unlocked_at).length;
  return <><StudentHeader active="trajetoria"/><main className={styles.page}><span>CONQUISTAS</span><h1>Progresso que representa aprendizagem.</h1><p>{unlocked} de {r.rows.length} conquistas desbloqueadas. Aqui, gamificação mede consistência, prática e domínio — não cliques vazios.</p><div className={styles.grid}>{r.rows.map(x=><article className={x.unlocked_at?styles.unlocked:""} key={x.code}><i>{x.icon||"⚓"}</i><div><strong>{x.name}</strong><span>{x.description}</span><small>{x.unlocked_at?("Desbloqueada em "+new Date(x.unlocked_at).toLocaleDateString("pt-BR")):"Ainda não desbloqueada"}</small></div></article>)}</div></main></>
}
