import {availableQuestionBanks,getQuestionBank} from "./question-banks";
import {questionTaxonomy} from "./question-filters";
import {bibliographyUnits} from "../data/study/bibliography";
import {getTopicMastery} from "./learning-engine";

const norm=(value)=>String(value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g," ").trim();

export async function getLearningGraph(userId){
  const mastery=await getTopicMastery(userId,{sync:false});
  const masteryMap=new Map(mastery.map(x=>[x.key,x]));
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
      const work=works.get(workId)||{
        id:workId,title:tax.work?.title||"Obra não informada",questions:0,chapters:new Map()
      };
      work.questions++;
      const chapterId=tax.chapter?.id||"sem-capitulo";
      const chapter=work.chapters.get(chapterId)||{
        id:chapterId,label:tax.chapter?.label||tax.section||"Seção não informada",questions:0,topics:new Map()
      };
      chapter.questions++;
      const topicId=tax.topic?.id||q.topic_code||norm(q.topic)||"topico";
      const key=`${subject}|${q.topic_code||""}|${q.topic||"Conteúdo geral"}`;
      const topic=chapter.topics.get(topicId)||{
        id:topicId,label:tax.topic?.title||q.topic||"Conteúdo geral",topic_code:q.topic_code||"",
        questions:0,mastery_score:Number(masteryMap.get(key)?.mastery_score||0),
        confidence_score:Number(masteryMap.get(key)?.confidence_score||0)
      };
      topic.questions++;
      chapter.topics.set(topicId,topic);
      work.chapters.set(chapterId,chapter);
      works.set(workId,work);
    }

    const requiredUnits=requiredBySubject.get(subject)||[];
    const normalizedRequired=new Set(requiredUnits.flatMap(x=>[norm(x.bibliography_key),norm(x.publication)].filter(Boolean)));
    const workRows=[...works.values()].map(work=>{
      const requiredMatch=normalizedRequired.has(norm(work.id))||normalizedRequired.has(norm(work.title));
      return{
        ...work,
        required:requiredMatch,
        chapters:[...work.chapters.values()].map(ch=>({...ch,topics:[...ch.topics.values()]}))
      };
    });
    const subjectMastery=mastery.filter(x=>x.subject===subject);
    subjects.push({
      slug:subject,
      title:bankInfo.title,
      question_count:bankInfo.count,
      measured_topics:subjectMastery.length,
      mastery_score:subjectMastery.length?Math.round(subjectMastery.reduce((s,x)=>s+x.mastery_score,0)/subjectMastery.length*10)/10:0,
      bibliography_units:requiredUnits.length,
      resources:{
        questions:"/conteudos/banco-de-questoes?subject="+encodeURIComponent(subject),
        theory:"/study-content/simulado/"+subject+"/",
        flashcards:"/flashcards",
        maps:"/mapas-mentais",
        ...(subject==="navegacao-aguas-restritas"?{ripeam3d:"/flashcards/ripeam/3d"}:{})
      },
      works:workRows
    });
  }

  const totals=subjects.reduce((acc,s)=>{
    acc.questions+=s.question_count;
    acc.works+=s.works.length;
    acc.chapters+=s.works.reduce((n,w)=>n+w.chapters.length,0);
    acc.topics+=s.works.reduce((n,w)=>n+w.chapters.reduce((m,ch)=>m+ch.topics.length,0),0);
    acc.bibliography_units+=s.bibliography_units;
    return acc;
  },{questions:0,works:0,chapters:0,topics:0,bibliography_units:0});

  return{version:"v1",totals,subjects};
}
