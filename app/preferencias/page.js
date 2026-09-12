import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getStudentPreferences} from "../../lib/student-preferences";
import StudentHeader from "../components/StudentHeader";
import PreferencesClient from "./PreferencesClient";
import styles from "./preferences.module.css";
export const dynamic="force-dynamic";
export default async function PreferencesPage(){const s=await getSession();if(!s)redirect("/login?next=/preferencias");const preferences=await getStudentPreferences(s.id);return <><StudentHeader active="perfil"/><main className={styles.page}><span>PERSONALIZAÇÃO</span><h1>Como a ESTIBORDO deve organizar sua experiência?</h1><p>Ajuste a duração das sessões, o tipo de estudo preferido e o nível de detalhe do painel. O motor continua respeitando fraquezas e revisões críticas.</p><PreferencesClient initial={preferences}/></main></>}
