import {BIBLIOGRAPHY} from '../../data/study/bibliography.js';

export const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
export const slug=v=>norm(v).replace(/\s+/g,'-').slice(0,80)||'topico';
const keys=['A','B','C','D','E'];
export function catalogUnit(subjectSlug,bibliographyId,sectionKey){const work=(BIBLIOGRAPHY[subjectSlug]||[]).find(w=>w.key===bibliographyId);if(!work)throw new Error(`Obra não encontrada: ${subjectSlug}/${bibliographyId}`);const section=(work.sections||[]).find(s=>s.key===sectionKey);if(!section)throw new Error(`Unidade não encontrada: ${bibliographyId}/${sectionKey}`);return {work,section,chapterId:`${bibliographyId}::${sectionKey}`};}
export function chapterCount(questions,chapterId){return questions.filter(q=>q?.taxonomy?.chapter_id===chapterId).length;}
export function nextIdFactory(questions,prefix){let max=0;for(const q of questions){const m=String(q.id||'').match(new RegExp(`^${prefix}-(\\d+)$`,'i'));if(m)max=Math.max(max,Number(m[1]));}return()=>`${prefix}-${String(++max).padStart(4,'0')}`;}
function rotate(arr,n){return arr.map((_,i)=>arr[(i+n)%arr.length]);}
function optionObjects(texts,correctText,shift){const base=rotate(texts,shift);const unique=[];for(const t of base)if(!unique.includes(t))unique.push(t);if(!unique.includes(correctText))unique.unshift(correctText);const picked=unique.slice(0,5);if(!picked.includes(correctText))picked[4]=correctText;return {options:picked.map((text,i)=>({key:keys[i],text})),correct_answer:keys[picked.indexOf(correctText)]};}
export function makeQuestionsFromPairs({bank,subjectId,subjectSlug,prefix,bibliographyId,sectionKey,pairs,source,need,module,topicCodePrefix='EXP'}){
  if(!Array.isArray(pairs)||pairs.length<5)throw new Error(`${bibliographyId}/${sectionKey}: são necessários >=5 pares`);
  const {work,section,chapterId}=catalogUnit(subjectSlug,bibliographyId,sectionKey);const nextId=nextIdFactory(bank.questions,prefix);const result=[];
  const defs=pairs.map(p=>p[1]),terms=pairs.map(p=>p[0]);
  for(let i=0;i<need;i++){
    const idx=i%pairs.length;const [term,definition]=pairs[idx];const mode=i%3;let question,correct,choices,style,explanation;
    if(mode===0){question=`Considerando ${section.chapter||section.label}, qual alternativa caracteriza corretamente “${term}”?`;correct=definition;choices=defs;style='Conceitual';explanation=`“${term}” corresponde a ${definition.charAt(0).toLowerCase()+definition.slice(1)}.`;}
    else if(mode===1){question=`No contexto de ${section.chapter||section.label}, qual conceito corresponde à descrição: “${definition}”?`;correct=term;choices=terms;style='Associação conceitual';explanation=`A descrição apresentada identifica “${term}”.`;} 
    else {question=`Em uma análise comparativa de ${section.chapter||section.label}, qual associação envolvendo “${term}” está correta?`;correct=`${term} — ${definition}`;choices=pairs.map((p,j)=>`${p[0]} — ${pairs[(j+1)%pairs.length][1]}`);choices[idx]=correct;style='Análise/contraste';explanation=`A associação correta é “${term} — ${definition}”; as demais opções trocam conceitos e descrições.`;}
    const {options,correct_answer}=optionObjects(choices,correct,(i*2+idx)%choices.length);
    const topicId=`${subjectId}-${bibliographyId}-${sectionKey}-${slug(term)}`;
    result.push({id:nextId(),subject:bank.subject||subjectSlug,module:module||`Cobertura bibliográfica — ${work.title}`,topic_code:`${topicCodePrefix}.${bibliographyId}.${sectionKey}.${String(i+1).padStart(2,'0')}`,topic:term,difficulty:i%5===0?'Difícil':i%2===0?'Médio':'Fácil',style,question,options,correct_answer,explanation,taxonomy:{subject_id:subjectId,subject_slug:subjectSlug,bibliography_id:bibliographyId,chapter_id:chapterId,topic_id:topicId,subtopic_id:null},tracking:{subject_slug:subjectSlug,work:{id:bibliographyId,title:work.title,author:source.author||''},chapter:{id:chapterId,number:sectionKey,title:section.chapter||section.label,label:section.label||section.chapter},section:section.chapter||section.label,module:module||`Cobertura bibliográfica — ${work.title}`,topic:{id:topicId,title:term}},source:{author:source.author||'',title:source.title||work.title,edition:source.edition||'',locator:source.locator||section.chapter||section.label},tags:[subjectSlug,bibliographyId,chapterId,slug(term),'cobertura-v2']});
  }
  return result;
}
export function appendToFloor({bank,subjectId,subjectSlug,prefix,bibliographyId,sectionKey,pairs,source,module,floor=25}){const {chapterId}=catalogUnit(subjectSlug,bibliographyId,sectionKey);const current=chapterCount(bank.questions,chapterId);const need=Math.max(0,floor-current);if(!need)return {added:[],current,before:current,after:current};const added=makeQuestionsFromPairs({bank,subjectId,subjectSlug,prefix,bibliographyId,sectionKey,pairs,source,need,module});bank.questions.push(...added);return {added,current,before:current,after:current+added.length};}
export function assertUniqueIds(bank){const ids=bank.questions.map(q=>q.id);if(new Set(ids).size!==ids.length)throw new Error('IDs duplicados após expansão');}
export function semanticSignature(q){return norm(`${q.question}|${(q.options||[]).map(o=>o.text).join('|')}`);}
export function assertNoExactQuestionDuplicates(bank){const seen=new Map();for(const q of bank.questions){const s=norm(q.question);if(seen.has(s))throw new Error(`Enunciado duplicado: ${q.id} / ${seen.get(s)}`);seen.set(s,q.id);}}
