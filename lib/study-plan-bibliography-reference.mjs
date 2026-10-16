// Rótulos bibliográficos do Plano de Estudos. Não altera registros persistidos.
const clean=value=>typeof value==="string"?value.trim():"";
const generic=/^(?:publica[cç][aã]o indicada|conte[uú]do indicado|leitura da se[cç][aã]o indicada|se[cç][aã]o indicada|cap[ií]tulo n[aã]o especificado|sem cap[ií]tulo delimitado)\b/i;
export const isGenericSection=value=>!clean(value)||generic.test(clean(value));
const isRelevantTask=task=>task?.type==="reading"||task?.type==="questions"||task?.task_type==="reading"||task?.task_type==="questions";

function referenceKeys(task={}){
  const fixation=task.fixation||task.metadata?.fixation||{};
  let bibliographyKey=clean(task.bibliography_key||task.metadata?.bibliography_key||fixation.bibliography_key);
  let sectionKey=clean(task.section_key||task.metadata?.section_key||fixation.section_key);
  const parts=clean(task.key||task.task_key).split("|");
  if((!bibliographyKey||!sectionKey)&&parts[0]==="read"&&parts.length>=3){
    bibliographyKey ||= parts[1];
    sectionKey ||= parts[2];
  }else if((!bibliographyKey||!sectionKey)&&parts[0]==="questions"&&parts.length>=5){
    bibliographyKey ||= parts[3];
    sectionKey ||= parts[4];
  }
  return {bibliographyKey,sectionKey};
}
const firstMeaningful=(items,key)=>items.map(item=>clean(item?.[key])).find(Boolean)||"";

export function resolveStudyReference(task={},catalog=[]){
  if(!isRelevantTask(task))return null;
  const {bibliographyKey,sectionKey}=referenceKeys(task);
  const matches=catalog.filter(item=>item.bibliography_key===bibliographyKey&&item.section_key===sectionKey
    &&(!task.subject&&!task.subject_slug||item.subject_slug===(task.subject||task.subject_slug)));
  const candidates=matches.length?matches:catalog.filter(item=>item.bibliography_key===bibliographyKey&&item.section_key===sectionKey);
  const fix=task.fixation||task.metadata?.fixation||{};
  const fromTitle=task.type==="reading"||task.task_type==="reading"?clean(task.title||task.metadata?.title):"";
  const publication=firstMeaningful(candidates,"publication")||clean(fix.publication)||
    (isGenericSection(fromTitle)?"":fromTitle);
  const sections=[...candidates.map(item=>clean(item.chapter||item.section)),
    clean(fix.chapter),clean(task.chapter||task.metadata?.chapter)];
  const chapter=sections.find(value=>value&&!isGenericSection(value))||null;
  if(!publication&&!chapter)return null;
  const pageFrom=task.page_from??task.metadata?.page_from??fix.page_from??null;
  const pageTo=task.page_to??task.metadata?.page_to??fix.page_to??null;
  const pages=pageFrom!=null&&pageTo!=null&&Number(pageTo)>=Number(pageFrom)
    ?"páginas "+pageFrom+"–"+pageTo:"";
  const chapterLabel=chapter||"Capítulo não delimitado no Anexo 2-B";
  return {
    bibliography_key:bibliographyKey||null,section_key:sectionKey||null,
    publication:publication||null,chapter,chapter_specified:Boolean(chapter),
    chapter_label:chapterLabel,pages,
    label:[publication,chapterLabel].filter(Boolean).join(" — ")
  };
}

export function enrichStudyTaskReference(task={},catalog=[]){
  if(!isRelevantTask(task))return task;
  const reference=resolveStudyReference(task,catalog);
  if(!reference)return task;
  const type=task.type||task.task_type;
  const isReading=type==="reading";
  const originalTitle=clean(task.title);
  const normalizedTitle=isReading&&isGenericSection(originalTitle)&&reference.publication
    ?reference.publication
    :type==="questions"&&/questões de fixação\s*[—–-]\s*(?:publica[cç][aã]o indicada|conte[uú]do indicado)/i.test(originalTitle)
      ?"Questões de fixação — "+reference.label
      :task.title;
  return{
    ...task,
    title:normalizedTitle,
    chapter:isGenericSection(task.chapter)?reference.chapter:task.chapter,
    description:isGenericSection(task.description)?reference.label:task.description,
    bibliographic_reference:reference
  };
}

export function studyTaskDisplay(task={}){
  const reference=task.bibliographic_reference;
  const type=task.type||task.task_type;
  const originalDate=clean(task.source_plan_date);
  const dated=(task.reprogrammed||task.postponed_manually)&&originalDate
    ?originalDate.slice(0,10).split("-").reverse().join("/"):"";
  if((type==="reading"||type==="questions")&&reference?.publication){
    const source=[reference.publication,reference.chapter].filter(Boolean).join(" — ");
    const noChapter=reference.chapter_specified?"":"Capítulo não delimitado no Anexo 2-B";
    const pages=reference.pages?" · "+reference.pages:"";
    if(type==="reading")return{
      title:dated?"Reprogramada de "+dated+" · "+source:source,
      details:(reference.chapter||noChapter)+pages,
      chapter_tag:reference.chapter||"Sem capítulo delimitado",
      publication:reference.publication
    };
    return{
      title:"Questões de fixação — "+source,
      details:(reference.chapter?"Referência: "+reference.chapter:"Referência: "+noChapter)+pages,
      chapter_tag:reference.chapter||"Sem capítulo delimitado",
      publication:reference.publication
    };
  }
  const initial=clean(task.title)||"Atividade";
  const missing=type==="reading"&&isGenericSection(initial)
    ?"Obra não identificada no cadastro bibliográfico"
    :type==="questions"&&/publica[cç][aã]o indicada|conte[uú]do indicado/i.test(initial)
    ?"Questões de fixação — obra não identificada":initial;
  const description=clean(task.description);
  return {title:dated&&type==="reading"?"Reprogramada de "+dated+" · "+missing:missing,
    details:isGenericSection(description)?"Referência bibliográfica não identificada.":description||"Referência bibliográfica não identificada.",
    chapter_tag:null,publication:null};
}
