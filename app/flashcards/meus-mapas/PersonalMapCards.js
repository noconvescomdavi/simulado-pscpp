"use client";
import {useState} from "react";
import styles from "./personal.module.css";

export default function PersonalMapCards({cards}){
  const [index,setIndex]=useState(0);
  const [flipped,setFlipped]=useState(false);
  if(!cards.length)return <div className={styles.empty}>Ainda não há flashcards criados a partir dos seus mapas mentais.</div>;
  const card=cards[index];
  function move(delta){
    setFlipped(false);
    setIndex(current=>(current+delta+cards.length)%cards.length);
  }
  return <section className={styles.study}>
    <div className={styles.counter}>{index+1} / {cards.length}</div>
    <button className={`${styles.card} ${flipped?styles.flipped:""}`} onClick={()=>setFlipped(v=>!v)}>
      <small>{card.map_title}{card.subject_slug?` · ${card.subject_slug}`:""}</small>
      <strong>{flipped?card.back:card.front}</strong>
      <span>{flipped?"Clique para voltar":"Clique para revelar a anotação"}</span>
    </button>
    <div className={styles.controls}>
      <button onClick={()=>move(-1)}>← Anterior</button>
      <a href={`/mapas-mentais/${card.mind_map_id}`}>Abrir mapa</a>
      <button onClick={()=>move(1)}>Próximo →</button>
    </div>
  </section>;
}
