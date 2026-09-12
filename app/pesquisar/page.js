import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import {getQuestionBank} from "../../lib/question-banks";
import {SUBJECTS} from "../../lib/subjects";
import StudentHeader from "../components/StudentHeader";

const ITEMS=[
["Plano de Hoje","Próxima missão e prioridades do dia","/hoje","Ação"],
["Minha Rota","Planejamento inteligente, calendário e bibliografia","/plano-de-estudos","Preparação"],
["Treino Inteligente","Questões escolhidas pelas suas fraquezas","/treino-adaptativo","Prática"],
["Centro de Revisão","Erros, fraquezas e repetição espaçada","/centro-de-revisao","Revisão"],
["Análise de Fraquezas","Diagnóstico por matéria e tópico","/analise-de-fraquezas","Desempenho"],
["Minha Trajetória","Aderência, domínio e projeção até a prova","/minha-trajetoria","Desempenho"],
["Simulados","Gerar e revisar simulados","/simulado","Prática"],
["Banco de Questões","Gerar cadernos e praticar questões","/conteudos/banco-de-questoes","Prática"],
["Central de Erros","Revisar questões erradas","/conteudos/caderno-de-erros","Revisão"],
["Flashcards","Revisão ativa por cartões","/flashcards","Revisão"],
["Mapas Mentais","Criar e revisar mapas pessoais","/mapas-mentais","Estudo"],
["Laboratório RIPEAM 3D","Explorar, identificar e resolver situações RIPEAM","/flashcards/ripeam/3d","Laboratório"],
["Contramestre","Tutor acadêmico especializado","/contramestre","Tutor"],
["Minha Biblioteca","Bibliografia e arquivos de estudo","/minha-biblioteca","Estudo"],
["Ranking","Desempenho comparativo","/ranking","Comunidade"]
];
const norm=v=>String(v||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
export default async function Page({searchParams}){
 const s=await getSession();if(!s)redirect("/login?next=/pesquisar");
 const q=String((await searchParams)?.q||"").trim(),needle=norm(q);
 const tools=needle?ITEMS.filter(x=>norm(x.join(" ")).includes(needle)):ITEMS;
 const questionHits=[];
 if(needle.length>=3){for(const subject of SUBJECTS){const bank=getQuestionBank(subject.slug);for(const item of bank?.questions||[]){const hay=norm([item.question,item.topic,item.topic_code,item.source?.title,item.tracking?.chapter?.label].filter(Boolean).join(" "));if(hay.includes(needle)){questionHits.push({subject:subject.slug,label:subject.label,id:item.id,question:item.question,topic:item.topic});if(questionHits.length>=24)break}}if(questionHits.length>=24)break}}
 return <><StudentHeader/><main style={{minHeight:"100vh",background:"#071927",color:"#e7f0f7",padding:"90px 28px 50px"}}><div style={{maxWidth:1100,margin:"auto"}}><span style={{fontSize:10,fontWeight:900,letterSpacing:".12em",color:"#86bfe3"}}>BUSCA UNIVERSAL</span><h1 style={{fontSize:36,margin:"6px 0"}}>{q?`Resultados para “${q}”`:"Encontre qualquer parte da sua preparação"}</h1><p style={{color:"#8eaabd"}}>Ferramentas, tópicos e questões em uma única busca.</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12,marginTop:24}}>{tools.map(([title,text,href,type])=><a key={href} href={href} style={{border:"1px solid #174267",background:"#0a2235",borderRadius:12,padding:18,color:"#e7f0f7"}}><small style={{color:"#70bde9"}}>{type}</small><strong style={{display:"block",fontSize:15,marginTop:5}}>{title}</strong><span style={{display:"block",fontSize:11,lineHeight:1.5,color:"#8eaabd",marginTop:6}}>{text}</span></a>)}</div>{questionHits.length>0&&<section style={{marginTop:28}}><h2>Questões e tópicos</h2><div style={{display:"grid",gap:8}}>{questionHits.map(x=><a key={x.subject+"|"+x.id} href={`/conteudos/banco-de-questoes?subject=${encodeURIComponent(x.subject)}`} style={{border:"1px solid #153d59",background:"#081d2d",borderRadius:9,padding:12,color:"#e7f0f7"}}><small style={{color:"#78bce5"}}>{x.label} · {x.topic||"Conteúdo geral"}</small><strong style={{display:"block",fontSize:11,marginTop:4}}>{String(x.question).slice(0,180)}</strong></a>)}</div></section>}</div></main></>
}