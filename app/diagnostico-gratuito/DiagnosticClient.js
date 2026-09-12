"use client";
import {useMemo,useState} from "react";
const QS=[
 {s:"RIPEAM",q:"Em rumos cruzados, qual embarcação deve manter-se fora do caminho?",o:["A que avista a outra por boreste","A que avista a outra por bombordo","Sempre a mais lenta"],a:0},
 {s:"Manobrabilidade",q:"Ao avaliar uma manobra, por que vento e corrente precisam ser considerados?",o:["Porque alteram forças e movimento do navio","Apenas por exigência documental","Somente em fundeio"],a:0},
 {s:"Meteorologia",q:"Uma queda rápida de pressão atmosférica pode indicar:",o:["Mudança significativa do tempo","Ausência de vento","Maré meteorológica nula"],a:0},
 {s:"Navegação",q:"Em águas restritas, qual princípio é mais adequado?",o:["Planejamento contínuo e monitoramento da posição","Confiar apenas no GPS","Evitar uso de referências visuais"],a:0},
 {s:"Arte Naval",q:"Conhecer características de casco e apêndices ajuda principalmente a:",o:["Antecipar comportamento hidrodinâmico e de manobra","Determinar escala Beaufort","Calcular horário legal"],a:0},
 {s:"Comunicações",q:"Na comunicação operacional, a prioridade é:",o:["Clareza, padronização e confirmação de entendimento","Velocidade acima da precisão","Uso de linguagem coloquial"],a:0}
];
export default function DiagnosticClient(){
 const [answers,setAnswers]=useState({}),[done,setDone]=useState(false);
 const score=useMemo(()=>QS.reduce((n,x,i)=>n+(answers[i]===x.a?1:0),0),[answers]);
 function finish(){if(Object.keys(answers).length<QS.length)return;setDone(true);fetch("/api/growth/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event:"diagnostic_completed",metadata:{score,total:QS.length}})}).catch(()=>{});}
 if(done){const pct=Math.round(score/QS.length*100);const weak=QS.filter((x,i)=>answers[i]!==x.a).map(x=>x.s);return <section className="diagnosticResult"><span>SEU RETRATO INICIAL</span><h2>{pct}% de aproveitamento nesta amostra.</h2><p>Este diagnóstico é demonstrativo e não estima aprovação. Ele mostra como a ESTIBORDO pode transformar respostas em prioridades.</p><div className="diagnosticResultGrid"><article><strong>Pontos para reforçar</strong><p>{weak.length?weak.join(" · "):"Nenhuma área desta amostra ficou abaixo do esperado."}</p></article><article><strong>Próximo passo sugerido</strong><p>{weak.length?"Treino direcionado + revisão dos tópicos com erro.":"Avançar para uma avaliação maior e medir consistência."}</p></article></div><div className="diagnosticCtas"><a className="btn primary" href="/cadastro?origem=diagnostico">Criar conta e ativar minha rota</a><a className="btn decisionSecondary" href="/plataforma">Ver como a rota funciona</a></div></section>}
 return <section className="diagnosticQuiz">{QS.map((x,i)=><article key={i}><span>{String(i+1).padStart(2,"0")} · {x.s}</span><h2>{x.q}</h2><div>{x.o.map((o,j)=><button onClick={()=>setAnswers(a=>({...a,[i]:j}))} className={answers[i]===j?"selected":""} key={o}>{o}</button>)}</div></article>)}<button className="diagnosticFinish" disabled={Object.keys(answers).length<QS.length} onClick={finish}>Ver meu diagnóstico</button></section>
}