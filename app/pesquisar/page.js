import {redirect} from "next/navigation";
import {getSession} from "../../lib/auth";
import StudentHeader from "../components/StudentHeader";

const ITEMS=[
  ["Plano de Estudos","Planejamento inteligente, calendário e bibliografia","/plano-de-estudos"],
  ["Plano de Hoje","Tarefas e prioridades do dia","/hoje"],
  ["Treino Adaptativo","Questões priorizadas pelas suas fraquezas","/treino-adaptativo"],
  ["Revisão Inteligente","Fila de revisão espaçada","/revisao-inteligente"],
  ["Análise de Fraquezas","Diagnóstico por matéria e tópico","/analise-de-fraquezas"],
  ["Minha Trajetória","Aderência, domínio e projeção até a prova","/minha-trajetoria"],
  ["Simulados","Gerar e revisar simulados","/simulado"],
  ["Banco de Questões","Gerar cadernos e praticar questões","/conteudos/banco-de-questoes"],
  ["Caderno de Erros","Revisar questões erradas","/conteudos/caderno-de-erros"],
  ["Flashcards","Revisão ativa por cartões","/flashcards"],
  ["Mapas Mentais","Criar e revisar mapas pessoais","/mapas-mentais"],
  ["Laboratório RIPEAM 3D","Cenas, luzes e marcas RIPEAM","/flashcards/ripeam/3d"],
  ["Contramestre","Tutor acadêmico especializado","/contramestre"],
  ["Ranking","Acompanhar desempenho comparativo","/ranking"],
  ["Assinaturas","Consultar acessos e validade","/minhas-assinaturas"],
  ["Perfil e Privacidade","Dados pessoais, sessões e LGPD","/perfil"],
  ["Suporte","Abrir e acompanhar solicitações","/suporte"]
];

function norm(value){return String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();}

export default async function Page({searchParams}){
  const session=await getSession();
  if(!session)redirect("/login?next=/pesquisar");
  const q=String((await searchParams)?.q||"").trim();
  const needle=norm(q);
  const results=needle?ITEMS.filter(([title,text])=>norm(title+" "+text).includes(needle)):ITEMS;
  return <><StudentHeader/><main style={{minHeight:"100vh",background:"#071927",color:"#e7f0f7",padding:"90px 28px 50px",maxWidth:"none"}}><div style={{maxWidth:980,margin:"auto"}}><span style={{fontSize:10,fontWeight:900,letterSpacing:".12em",color:"#86bfe3"}}>BUSCA NA PLATAFORMA</span><h1 style={{fontSize:36,margin:"6px 0"}}>{q?"Resultados para “"+q+"”":"Ferramentas da ESTIBORDO"}</h1><p style={{color:"#8eaabd"}}>{results.length} resultado(s) encontrado(s).</p><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:12,marginTop:24}}>{results.map(([title,text,href])=><a key={href} href={href} style={{border:"1px solid #174267",background:"#0a2235",borderRadius:12,padding:18,color:"#e7f0f7"}}><strong style={{display:"block",fontSize:15}}>{title}</strong><span style={{display:"block",fontSize:11,lineHeight:1.5,color:"#8eaabd",marginTop:6}}>{text}</span><b style={{display:"block",fontSize:10,color:"#86bfe3",marginTop:14}}>Abrir →</b></a>)}</div>{!results.length&&<div style={{marginTop:22,padding:22,border:"1px solid #174267",borderRadius:12,color:"#8eaabd"}}>Nenhuma ferramenta corresponde a essa busca.</div>}</div></main></>;
}
