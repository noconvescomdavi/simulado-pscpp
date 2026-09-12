import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getEntitlement} from "../../lib/entitlement";
import StudentHeader from "../components/StudentHeader";
import DriveLibraryClient from "./DriveLibraryClient";
import styles from "./library.module.css";

export default async function MinhaBiblioteca({searchParams}){
  const session=await getSession();
  if(!session)redirect("/login?next=/minha-biblioteca");
  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar?locked=inactive");
  const q=await searchParams;
  return <>
    <StudentHeader active="biblioteca"/>
    <main className={styles.page}>
      <section className={styles.hero}>
        <div><span>MINHA BIBLIOTECA</span><h1>Seus PDFs, no seu Google Drive.</h1><p>Escolha PDFs do seu Drive e leia dentro da ESTIBORDO. O arquivo continua armazenado na sua própria conta Google; a plataforma guarda apenas a referência e seu progresso de leitura.</p></div>
        <div className={styles.privacy}><strong>Privacidade por padrão</strong><p>A ESTIBORDO usa o escopo <code>drive.file</code>: somente arquivos que você selecionar explicitamente ficam acessíveis à plataforma.</p></div>
      </section>
      <DriveLibraryClient initialMessage={q?.conectado?"Google Drive conectado.":q?.erro||""}/>
    </main>
  </>;
}
