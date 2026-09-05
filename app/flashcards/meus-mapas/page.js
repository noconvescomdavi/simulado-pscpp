import {redirect} from "next/navigation";
import {getSession} from "../../../lib/auth";
import {getEntitlement} from "../../../lib/entitlement";
import {listMapFlashcards} from "../../../lib/mind-maps";
import StudentHeader from "../../components/StudentHeader";
import PersonalMapCards from "./PersonalMapCards";
import styles from "./personal.module.css";

export const dynamic="force-dynamic";

export default async function MapFlashcardsPage(){
  const session=await getSession();
  if(!session)redirect("/login?next=/flashcards/meus-mapas");
  const entitlement=await getEntitlement(session.id);
  if(!entitlement.active&&!entitlement.trial)redirect("/comprar?locked=inactive");
  const cards=await listMapFlashcards(session.id);

  return <>
    <StudentHeader active="flashcards"/>
    <main className={styles.page}>
      <span>CRIADOS POR VOCÊ</span>
      <h1>Flashcards dos meus mapas</h1>
      <p>Os nós convertidos em flashcards aparecem aqui. A pergunta é o título do nó e a resposta é sua própria anotação.</p>
      <PersonalMapCards cards={cards}/>
    </main>
  </>;
}
