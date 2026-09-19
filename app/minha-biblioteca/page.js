import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getEntitlement} from "../../lib/entitlement";
import StudentHeader from "../components/StudentHeader";
import LibraryClient from "./LibraryClient";
import styles from "./library.module.css";

export default async function MinhaBiblioteca({searchParams}){
 const session=await getSession();if(!session)redirect("/login?next=/minha-biblioteca");
 const entitlement=await getEntitlement(session.id);if(!entitlement.active&&!entitlement.trial)redirect("/comprar?locked=inactive");
 const q=await searchParams;
 return <><StudentHeader active="biblioteca"/><main className={styles.page}>
  <section className={styles.hero}><div><span>MINHA BIBLIOTECA</span><h1>Seus PDFs, dentro da ESTIBORDO.</h1><p>Envie seus materiais diretamente do computador, celular ou tablet e continue a leitura pela plataforma com seu progresso salvo.</p></div><div className={styles.privacy}><strong>Biblioteca privada</strong><p>Os documentos são vinculados ao seu usuário. A ESTIBORDO valida sua sessão antes de listar ou entregar cada PDF.</p></div></section>
  <LibraryClient initialMessage={q?.erro||""}/>
 </main></>;
}