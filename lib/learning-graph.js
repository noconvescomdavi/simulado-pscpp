import {availableQuestionBanks,getQuestionBank} from "./question-banks";
import {questionTaxonomy} from "./question-filters";
import {bibliographyUnits} from "../data/study/bibliography";
import {query} from "./db";

const norm=(value)=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();
const globalForLearningGraph=globalThis;

function buildStaticGraph(){
  if(globalForLearningGraph.__estibordoLearningGraph)return globalForLearningGraph.__estibordoLearningGraph;
  const required=bibliographyUnits();
  const requiredBySubject=new Map();
  for(const item of required){
    if(!requiredBySubject.has(item.subject_slug))requiredBySubject.set(item.subject_slug,[]);
    requiredBySubject.get(item.subject_slug).push(item);
  }

  const subjects=[];
  for(const bankInfo of availableQuestionBanks()){
    const subject=bankInfo.slug;
    const bank=getQuestionBank(subject);
    const works=new Map();
    for(const q of bank?.questions||[]){
      const tax=questionTaxonomy(q,subject);
      const workId=tax.work?.id||"obra-nao-informada";
      const work=works.get(workId)||{id:workId,title:tax.work?.title||"Obra não informada",questions:0,chapters:new Map()};
      work.questions++;
      const chapterId=tax.chapter?.id||"sem-capitulo";
      const chapter=work.chapters.get(chapterId)||{id:chapterId,label:tax.chapter?.label||tax.section||"Seção não informada",questions:0,topics:new Map()};
      chapter.questions++;
      const topicId=tax.topic?.id||q.topic_code||norm(q.topic)||"topico";
      const topic=chapter.topics.get(topicId)||{
        id:topicId,label:tax.topic?.title||q.topic||"Conteúdo geral",topic_code:q.topic_code||"",questions:0
      };
      topic.questions++;
      chapter.topics.set(topicId,topic);
      work.chapters.set(chapterId,chapter);
      works.set(workId,work);
    }

    const requiredUnits=requiredBySubject.get(subject)||[];
    const normalizedRequired=new Set(requiredUnits.flatMap(x=>[norm(x.bibliography_key),norm(x.publication)].filter(Boolean)));
    const workRows=[...works.values()].map(work=>({
      id:work.id,title:work.title,questions:work.questions,
      required:normalizedRequired.has(norm(work.id))||normalizedRequired.has(norm(work.title)),
      chapters:[...work.chapters.values()].map(ch=>({
        id:ch.id,label:ch.label,questions:ch.questions,
        topics:[...ch.topics.values()]
      }))
    }));
    subjects.push({
      slug:subject,title:bankInfo.title,question_count:bankInfo.count,bibliography_units:requiredUnits.length,
      resources:{
        questions:"/conteudos/banco-de-questoes?subject="+encodeURIComponent(subject),
        theory:"/study-content/simulado/"+subject+"/",
        flashcards:"/flashcards",maps:"/mapas-mentais",
        ...(subject==="navegacao-aguas-restritas"?{ripeam3d:"/flashcards/ripeam/3d"}:{})
      },
      works:workRows
    });
  }
  const totals=subjects.reduce((acc,s)=>{
    acc.questions+=s.question_count;acc.works+=s.works.length;
    acc.chapters+=s.works.reduce((n,w)=>n+w.chapters.length,0);
    acc.topics+=s.works.reduce((n,w)=>n+w.chapters.reduce((m,ch)=>m+ch.topics.length,0),0);
    acc.bibliography_units+=s.bibliography_units;return acc;
  },{questions:0,works:0,chapters:0,topics:0,bibliography_units:0});
  const graph={version:"v2-cached-topology",totals,subjects};
  globalForLearningGraph.__estibordoLearningGraph=graph;
  return graph;
}

export async function getLearningGraph(userId){
  const base=buildStaticGraph();
  const result=await query(`select subject_slug,topic_code,topic_label,mastery_score,confidence_score
    from student_topic_mastery where user_id=$1`,[userId]).catch(()=>({rows:[]}));
  const masteryMap=new Map(result.rows.map(x=>[
    `${x.subject_slug}|${x.topic_code||""}|${x.topic_label||"Conteúdo geral"}`,x
  ]));

  const subjects=base.subjects.map(subject=>{
    let masterySum=0,masteryWeight=0,measuredTopics=0;
    const works=subject.works.map(work=>({...work,chapters:work.chapters.map(ch=>({...ch,topics:ch.topics.map(topic=>{
      const key=`${subject.slug}|${topic.topic_code||""}|${topic.label||"Conteúdo geral"}`;
      const row=masteryMap.get(key);
      const confidence=Number(row?.confidence_score||0);
      const mastery=Number(row?.mastery_score||0);
      if(confidence>0){measuredTopics++;const weight=Math.max(1,confidence);masterySum+=mastery*weight;masteryWeight+=weight;}
      return {...topic,mastery_score:mastery,confidence_score:confidence};
    })}))}));
    return {...subject,works,measured_topics:measuredTopics,mastery_score:masteryWeight?Math.round(masterySum/masteryWeight*10)/10:0};
  });
  return {...base,subjects};
}
