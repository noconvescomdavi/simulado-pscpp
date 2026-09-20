import { getQuestionBank } from "./question-banks";
import { questionTaxonomy } from "./question-filters";

export const PSCPP_FLASHCARD_SUBJECTS = [
  ["manobrabilidade","Manobrabilidade"],
  ["arte-naval","Arte Naval"],
  ["navegacao-aguas-restritas","Navegação em Águas Restritas"],
  ["legislacao-regulamentacao","Legislação e Regulamentação"],
  ["meteorologia-oceanografia","Meteorologia e Oceanografia"],
  ["comunicacoes","Comunicações"],
  ["conhecimentos-gerais","Conhecimentos Gerais"],
];

const TARGET_PER_SUBJECT=80;
const BAD_STEMS=/\b(exceto|incorreta|correta\s+é|alternativa|opções|assertivas|afirmações\s+[ivx]+|itens\s+[ivx]+|assinale|julgue|considere\s+as|analise\s+as)\b/i;

function text(v){return String(v??"").replace(/\s+/g," ").trim();}
function optionText(option){
  if(typeof option==="string") return text(option.replace(/^[A-E][\)\.\-:]\s*/i,""));
  if(option&&typeof option==="object") return text(option.text??option.label??option.value??option.content??"");
  return "";
}
function answerText(q){
  const key=text(q.correct_answer||q.answer).toUpperCase();
  const opts=Array.isArray(q.options)?q.options:[];
  if(/^[A-E]$/.test(key)){
    const idx=key.charCodeAt(0)-65;
    return optionText(opts[idx]);
  }
  if(/^\d+$/.test(key) && opts[Number(key)]) return optionText(opts[Number(key)]);
  const direct=opts.find(o=>typeof o==="object"&&text(o?.key||o?.id||o?.letter).toUpperCase()===key);
  return optionText(direct)||text(q.correct_answer||q.answer);
}
function sourceLabel(q,tax){
  const src=q?.source&&typeof q.source==="object"?q.source:{title:q?.source||"",locator:""};
  return [tax?.work?.title||src.title,tax?.chapter?.label||tax?.section||src.locator].filter(Boolean).join(" · ");
}
function frontText(q,tax){
  const stem=text(q.question);
  if(stem && !BAD_STEMS.test(stem) && stem.length<=280) return stem;
  const topic=text(tax?.topic?.title||q.topic||q.module||"conceito");
  return `Sobre ${topic}, qual conceito ou regra essencial deve ser lembrado?`;
}
function cardFromQuestion(q,subject,index){
  const tax=questionTaxonomy(q,subject);
  const answer=answerText(q);
  if(!answer) return null;
  const explanation=text(q.explanation);
  const source=sourceLabel(q,tax);
  return {
    id:`PSCPP-${subject.toUpperCase().replaceAll("-","_")}-${String(index+1).padStart(3,"0")}`,
    code:String(index+1).padStart(2,"0"),
    name:frontText(q,tax),
    category:text(tax?.topic?.id||q.topic_code||"revisao"),
    pt:answer,
    en:answer,
    note:[explanation&&`Macete/explicação: ${explanation}`,source&&`Fonte: ${source}`].filter(Boolean).join("\n"),
    tags:[subject,tax?.work?.id,tax?.chapter?.id,tax?.topic?.id,"pscpp-2027"].filter(Boolean),
    bibliography:{work_id:tax?.work?.id||"",work:tax?.work?.title||"",chapter_id:tax?.chapter?.id||"",chapter:tax?.chapter?.label||"",section:tax?.section||""},
    source_question_id:String(q.id??""),
  };
}
function roundRobinByWork(questions,subject){
  const groups=new Map();
  for(const q of questions||[]){
    const tax=questionTaxonomy(q,subject);
    const answer=answerText(q);
    if(!answer||answer.length<2||answer.length>700) continue;
    const work=tax?.work?.id||"sem-obra";
    if(!groups.has(work)) groups.set(work,[]);
    groups.get(work).push(q);
  }
  const buckets=[...groups.values()].sort((a,b)=>b.length-a.length);
  const picked=[];let cursor=0;
  while(picked.length<TARGET_PER_SUBJECT&&buckets.some(x=>x.length)){
    const bucket=buckets[cursor%buckets.length];
    if(bucket?.length) picked.push(bucket.shift());
    cursor++;
  }
  return picked;
}
export function buildPscppBibliographyDeck(subject,label){
  const bank=getQuestionBank(subject);
  const picked=roundRobinByWork(bank?.questions||[],subject);
  const cards=picked.map((q,i)=>cardFromQuestion(q,subject,i)).filter(Boolean);
  return {
    slug:`pscpp-${subject}`,
    subject_slug:subject,
    subject_label:label,
    title:`${label} — Bibliografia PSCPP 2027`,
    description:`${cards.length} flashcards de recuperação ativa distribuídos entre as obras e capítulos rastreados no banco auditado de ${label}.`,
    cards,
  };
}
export function buildAllPscppBibliographyDecks(){
  return PSCPP_FLASHCARD_SUBJECTS.map(([subject,label])=>buildPscppBibliographyDeck(subject,label));
}
