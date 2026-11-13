"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import styles from "./bank.module.css";

export default function NotebookHistoryActions({id,title,answeredCount}){
  const router=useRouter();
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");

  async function remove(){
    if(busy)return;
    const message="Excluir definitivamente o caderno \""+title+"\"?\n\n"+(
      Number(answeredCount)>0
        ?"As respostas dentro deste caderno serão excluídas, mas o histórico geral de acertos e erros já contabilizado será mantido."
        :"O caderno será removido do histórico."
    )+"\n\nEsta ação não pode ser desfeita.";
    if(!window.confirm(message))return;
    setBusy(true);setError("");
    try{
      const response=await fetch("/api/question-notebooks/"+encodeURIComponent(id),{method:"DELETE"});
      const data=await response.json().catch(()=>({}));
      if(!response.ok){setError(data.error||"Falha ao excluir o caderno.");setBusy(false);return;}
      router.refresh();
    }catch{
      setError("Sem conexão. Não foi possível excluir o caderno.");
      setBusy(false);
    }
  }

  return <div className={styles.manageActions}>
    <a className={styles.editAction} href={"/conteudos/banco-de-questoes?editar="+encodeURIComponent(id)+"#gerar-caderno"} aria-label={"Editar "+title}>Editar</a>
    <button className={styles.deleteAction} type="button" disabled={busy} aria-busy={busy} onClick={remove} aria-label={"Excluir "+title}>{busy?"Excluindo…":"Excluir"}</button>
    {error&&<span className={styles.manageError} role="alert">{error}</span>}
  </div>;
}
