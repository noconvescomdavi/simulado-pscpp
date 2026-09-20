import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getEntitlement} from "../../lib/entitlement";
import {listFlashcardDecks} from "../../lib/flashcards";
import StudentHeader from "../components/StudentHeader";
import styles from "./flashcards.module.css";

const SUBJECT_ORDER=["manobrabilidade","arte-naval","navegacao-aguas-restritas","legislacao-regulamentacao","meteorologia-oceanografia","comunicacoes","conhecimentos-gerais"];
const SUBJECT_LABELS={
  manobrabilidade:"Manobrabilidade",
  "arte-naval":"Arte Naval",
  "navegacao-aguas-restritas":"Navegação em Águas Restritas",
  "legislacao-regulamentacao":"Legislação e Regulamentação",
  "meteorologia-oceanografia":"Meteorologia e Oceanografia",
  comunicacoes:"Comunicações",
  "conhecimentos-gerais":"Conhecimentos Gerais",
};
export default async function FlashcardsPage(){
 const s=await getSession();if(!s)redirect('/login?next=/flashcards');
 const e=await getEntitlement(s.id);if(!e.active&&!e.trial)redirect('/comprar?locked=inactive');
 let decks=await listFlashcardDecks(s.id);if(e.trial)decks=decks.filter(d=>d.slug==='cis');
 const grouped=SUBJECT_ORDER.map(key=>({key,label:SUBJECT_LABELS[key],decks:decks.filter(d=>d.subject_slug===key)})).filter(g=>g.decks.length);
 const extras=decks.filter(d=>!SUBJECT_ORDER.includes(d.subject_slug));
 return <><StudentHeader active="flashcards"/><main className={styles.page}>
  <section className={styles.hero}><div><span className={styles.eyebrow}>ESTUDO ATIVO • BIBLIOGRAFIA PSCPP 2027</span><h1>Flashcards</h1><p>{e.trial?'No período de testes, o Código Internacional de Sinais (CIS) fica liberado em sua totalidade.':'Revise por matéria e bibliografia. Os erros voltam para revisão, cartões difíceis ficam marcados e seu progresso permanece salvo.'}</p></div></section>
  <section className={styles.deckGrid}><a className={styles.deckCard} href="/flashcards/meus-mapas"><div className={styles.deckTop}><span>PESSOAL</span><b>Dos seus mapas</b></div><h2>Flashcards dos meus mapas</h2><p>Transforme nós e anotações dos seus mapas mentais em cartões pessoais de revisão.</p><div className={styles.deckAction}><span>Abrir flashcards pessoais</span><b>→</b></div></a></section>
  {grouped.map(g=><section key={g.key} style={{marginTop:"32px"}}><div style={{marginBottom:"14px"}}><span className={styles.eyebrow}>MATÉRIA</span><h2 style={{margin:"6px 0 0"}}>{g.label}</h2></div><div className={styles.deckGrid}>{g.decks.map(d=><a className={styles.deckCard} href={`/flashcards/${d.slug}`} key={d.id}><div className={styles.deckTop}><span>{d.subject_label}</span><b>{d.card_count} cartões</b></div><h2>{d.title}</h2><p>{d.description}</p><div className={styles.deckAction}><span>Abrir flashcards</span><b>→</b></div></a>)}</div></section>)}
  {!!extras.length&&<section style={{marginTop:"32px"}}><div className={styles.deckGrid}>{extras.map(d=><a className={styles.deckCard} href={`/flashcards/${d.slug}`} key={d.id}><div className={styles.deckTop}><span>{d.subject_label}</span><b>{d.card_count} cartões</b></div><h2>{d.title}</h2><p>{d.description}</p><div className={styles.deckAction}><span>Abrir flashcards</span><b>→</b></div></a>)}</div></section>}
 </main></>
}