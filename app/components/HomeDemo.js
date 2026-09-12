"use client";
import {useState} from "react";

const OPTIONS=[
 {id:"b",label:"B — A embarcação que avista a outra por bombordo deve sempre manobrar."},
 {id:"c",label:"C — A embarcação que tem a outra por boreste deve manter-se fora do caminho."},
 {id:"d",label:"D — Ambas devem guinar para bombordo."}
];

export default function HomeDemo(){
 const [answer,setAnswer]=useState("");
 const correct=answer==="c";
 return <div className="homeDemoCard">
  <div className="demoTop"><span>DEMONSTRAÇÃO • RIPEAM</span><b>QUESTÃO 01</b></div>
  <h3>Duas embarcações de propulsão mecânica navegam em rumos que se cruzam, com risco de abalroamento. Qual princípio determina quem deve manter-se fora do caminho?</h3>
  <div className="demoOptions">{OPTIONS.map(o=><button className={answer===o.id?(correct?"demoCorrect":"demoWrong"):""} onClick={()=>setAnswer(o.id)} key={o.id}>{o.label}</button>)}</div>
  {answer&&<div className={correct?"demoFeedback correct":"demoFeedback wrong"}>
    <strong>{correct?"Correto.":"Aqui existe uma oportunidade de revisão."}</strong>
    <p>A Regra 15 do RIPEAM estabelece, em situação de rumos cruzados entre embarcações de propulsão mecânica, que aquela que avista a outra por boreste deve manter-se fora do caminho.</p>
    <div className="demoLearning"><span>Tópico identificado <b>RIPEAM · Regra 15</b></span><span>Na ESTIBORDO <b>este resultado alimentaria seu diagnóstico e próximas revisões.</b></span></div>
    <a href="/cadastro">Quero estudar assim →</a>
  </div>}
 </div>
}