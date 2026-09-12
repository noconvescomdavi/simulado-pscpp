import {notFound,redirect} from "next/navigation";
import {getSession} from "../../../lib/auth";
import {query} from "../../../lib/db";
import StudentHeader from "../../components/StudentHeader";
import PdfReaderClient from "./PdfReaderClient";
import styles from "../library.module.css";

export default async function ReaderPage({params}){
  const session=await getSession();
  if(!session)redirect("/login?next=/minha-biblioteca");
  const {id}=await params;
  const result=await query("select id,name,last_page,progress_percent from student_drive_files where id=$1 and user_id=$2 limit 1",[id,session.id]).catch(()=>({rows:[]}));
  const file=result.rows[0];
  if(!file)notFound();
  return <>
    <StudentHeader active="biblioteca"/>
    <main className={styles.readerPage}>
      <div className={styles.readerHead}><div><a href="/minha-biblioteca">← Minha Biblioteca</a><h1>{file.name}</h1></div><span>Arquivo armazenado no Google Drive</span></div>
      <PdfReaderClient file={file} adobeClientId={process.env.NEXT_PUBLIC_ADOBE_PDF_CLIENT_ID||""}/>
    </main>
  </>;
}
