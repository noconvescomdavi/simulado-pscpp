import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getEntitlement} from "../../lib/entitlement";
import {listMindMaps} from "../../lib/mind-maps";
import StudentHeader from "../components/StudentHeader";
import NewMindMap from "./NewMindMap";
import styles from "./maps.module.css";

export const dynamic="force-dynamic";

export default async function MindMapsPage({searchParams}){
  const session=await getSession();
  if(!session)redirect("/login?next=/mapas-mentais");
  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar?locked=inactive");

  const params=await searchParams;
  const maps=await listMindMaps(session.id);
  const preset={
    subject:String(params?.subject||""),
    title:String(params?.title||""),
    note:String(params?.note||""),
  };

  return <>
    <StudentHeader active="mapas"/>
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <span>CONHECIMENTO VISUAL</span>
          <h1>Meus Mapas Mentais</h1>
          <p>Construa seu próprio material de revisão, conecte conceitos e transforme anotações em flashcards.</p>
        </div>
        <NewMindMap preset={preset}/>
      </section>

      <section className={styles.info}>
        <div><b>Privado por padrão</b><span>Só você acessa seus mapas.</span></div>
        <div><b>Autosave</b><span>Alterações salvas automaticamente no Neon.</span></div>
        <div><b>Estudo ativo</b><span>Crie, conecte, reorganize e revise.</span></div>
      </section>

      <section className={styles.grid}>
        {maps.map((map)=><a href={`/mapas-mentais/${map.id}`} className={styles.card} key={map.id}>
          <div className={styles.cardTop}><span>{map.subject_slug||"Mapa livre"}</span><b>{map.node_count} nós</b></div>
          <h2>{map.title}</h2>
          <p>{map.description||"Sem descrição. Abra o mapa para continuar construindo."}</p>
          <div className={styles.cardBottom}><span>Atualizado em {new Date(map.updated_at).toLocaleDateString("pt-BR")}</span><b>Abrir →</b></div>
        </a>)}
        {!maps.length&&<div className={styles.empty}>Seu primeiro mapa pode começar em branco ou com um modelo de estudo.</div>}
      </section>
    </main>
  </>;
}
