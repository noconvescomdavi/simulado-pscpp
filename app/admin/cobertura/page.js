import {redirect} from "next/navigation";
import {getAdmin} from "../../../lib/admin";
import "./coverage.css";
import {getQuestionBank} from "../../../lib/question-banks";
import {taxonomyCatalog,validateQuestionTaxonomy,SUBJECT_TAXONOMY} from "../../../lib/question-taxonomy";

function status(n){return n===0?"critical":n<25?"low":n<=50?"target":"wide"}
function label(s){return {critical:"CRÍTICO",low:"INSUFICIENTE",target:"META",wide:"COBERTURA AMPLA"}[s]}
export default async function Page(){if(!(await getAdmin("content.manage")))redirect("/admin");
 const catalog=taxonomyCatalog();
 const chapters=catalog.chapters.map(ch=>({...ch,count:0,topics:new Map()}));
 const index=new Map(chapters.map(ch=>[ch.chapter_id,ch]));
 let total=0,legacy=0,invalid=0,tracked=0;
 for(const subject of Object.values(SUBJECT_TAXONOMY)){
   const bank=getQuestionBank(subject.slug);
   for(const q of bank?.questions||[]){
     total++;
     const v=validateQuestionTaxonomy(q,subject.slug);
     if(v.legacy){legacy++;continue}
     if(v.errors.length){invalid++;continue}
     tracked++;
     const ch=index.get(q.taxonomy.chapter_id);
     if(ch){ch.count++;const key=q.taxonomy.topic_id;ch.topics.set(key,(ch.topics.get(key)||0)+1)}
   }
 }
 const critical=chapters.filter(x=>x.count===0).length,target=chapters.filter(x=>x.count>=25&&x.count<=50).length;
 const grouped=Object.values(SUBJECT_TAXONOMY).map(s=>({subject:s,chapters:chapters.filter(x=>x.subject_slug===s.slug)}));
 return <main className="wrap admin-wrap coverage">
   <div className="eyebrow">ADMINISTRAÇÃO · BANCO V2</div><h1>Mapa de Cobertura</h1>
   <p>Auditoria bibliográfica automática. A cobertura usa os IDs canônicos da taxonomia; questões antigas continuam contabilizadas no total, mas aparecem como LEGACY até receberem rastreabilidade v2.</p>
   <div className="coverage-kpis">
    <article><b>{total.toLocaleString("pt-BR")}</b><span>questões totais</span></article>
    <article><b>{tracked.toLocaleString("pt-BR")}</b><span>rastreadas v2</span></article>
    <article><b>{legacy.toLocaleString("pt-BR")}</b><span>legacy</span></article>
    <article><b>{invalid.toLocaleString("pt-BR")}</b><span>taxonomia inválida</span></article>
    <article><b>{critical}</b><span>capítulos críticos</span></article>
    <article><b>{target}</b><span>na meta 25–50</span></article>
   </div>
   <div className="coverage-legend"><span>0 crítico</span><span>1–24 insuficiente</span><span>25–50 meta</span><span>&gt;50 ampla</span></div>
   {grouped.map(({subject,chapters})=><section className="coverage-subject" key={subject.slug}>
    <h2>{subject.label}</h2>
    <div className="coverage-table"><div className="coverage-row coverage-head"><b>Publicação / capítulo</b><b>Questões</b><b>Status</b></div>
    {chapters.map(ch=>{const s=status(ch.count);return <div className="coverage-row" key={ch.chapter_id}>
      <div><strong>{catalog.publications.find(p=>p.bibliography_id===ch.bibliography_id)?.label||ch.bibliography_id}</strong><span>{ch.label}</span><code>{ch.chapter_id}</code></div>
      <b>{ch.count}</b><span className={"coverage-status "+s}>{label(s)}</span>
    </div>})}</div>
   </section>)}
 </main>
}
