"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";
import styles from "./bank.module.css";

export default function DeleteNotebookButton({id,title,answeredCount,completed}){
  const router=useRouter();
  const [busy,setBusy]=useState(false);
  const [removed,setRemoved]=useState(false);
  const [error,setError]=useState("");

  async function remove(){
    if(busy||removed)return;

    const notice=Number(answeredCount)>0
      ?"O histórico geral de desempenho já contabilizado será mantido, mas as respostas e os resultados específicos deste caderno deixarão de aparecer."
      :"O caderno será retirado do seu histórico.";
    const message=`Excluir o caderno "${title}"?

${notice}

Esta ação não poderá ser desfeita.`;
    if(!window.confirm(message))return;

    setBusy(true);
    setError("");
    try{
      const response=await fetch("/api/question-notebooks/"+encodeURIComponent(id),{
        method:"DELETE",
        headers:{"Accept":"application/json"}
      });
      const data=await response.json().catch(()=>({}));
      if(!response.ok){
        setError(data.error||"Não foi possível excluir o caderno.");
        return;
      }
      setRemoved(true);
      router.refresh();
    }catch{
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    }finally{
      setBusy(false);
    }
  }

  return <div className={styles.deleteContainer}>
    {!removed&&<button
      type="button"
      className={styles.deleteNotebook}
      disabled={busy}
      aria-busy={busy}
      aria-label={`Excluir caderno ${title}`}
      title={completed?"Excluir caderno concluído":"Excluir caderno em andamento"}
      onClick={remove}
    >{busy?"Excluindo…":"Excluir"}</button>}
    {removed&&<span className={styles.deleteSuccess} role="status">Caderno excluído.</span>}
    {error&&<span className={styles.deleteError} role="alert">{error}</span>}
  </div>;
}
