export const QUESTION_QUALITY_VERSION="1.1";
const words=v=>norm(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g," ").split(/\s+/).filter(x=>x.length>=4);
const overlap=(a,b)=>{const A=new Set(words(a)),B=new Set(words(b));if(!A.size||!B.size)return 0;let hit=0;for(const x of A)if(B.has(x))hit++;return hit/Math.min(A.size,B.size)};
const optionText=x=>typeof x==="string"?x:x?.text||x?.label||"";
function correctIndex(q,options){const key=String(q.correct_answer||q.answer||"").trim().toUpperCase();if(/^[A-Z]$/.test(key))return key.charCodeAt(0)-65;const n=Number(key);if(Number.isInteger(n))return n;return options.findIndex(x=>String(x?.correct||"")==="true");}
function continuationRisk(stem,answer){const s=norm(stem),a=norm(answer);if(!s||!a)return false;const tail=words(s).slice(-10).join(" "),head=words(a).slice(0,12).join(" ");return overlap(tail,head)>=.45||(/[,;:]$/.test(s)&&/^(assim|portanto|devem|deve|ser|estar|gerar|transmitir|receber)\b/.test(a));}
const norm=v=>String(v||"").trim().replace(/\s+/g," ").toLowerCase();
export function auditQuestion(question={}){
 const issues=[];const text=String(question.question||"").trim();const options=Array.isArray(question.options)?question.options:[];
 if(text.length<35)issues.push({code:"short_stem",severity:"high",message:"Enunciado curto ou possivelmente sem contexto."});
 if(/^(descrição|description)\s*:/i.test(text))issues.push({code:"orphan_description",severity:"high",message:"Enunciado parece começar por uma descrição sem referente."});
 if(options.length<4)issues.push({code:"few_options",severity:"medium",message:"Menos de quatro alternativas."});
 const unique=new Set(options.map(x=>norm(typeof x==="string"?x:x?.text)));
 if(options.length&&unique.size!==options.length)issues.push({code:"duplicate_options",severity:"high",message:"Alternativas duplicadas ou equivalentes textualmente."});
 if(!question.correct_answer&&!question.answer)issues.push({code:"missing_key",severity:"critical",message:"Gabarito ausente."});
 if(!question.source&&!question.tracking?.work)issues.push({code:"missing_source",severity:"medium",message:"Fonte bibliográfica não rastreada."});
 const ci=correctIndex(question,options),correct=ci>=0?optionText(options[ci]):"";
 if(correct&&continuationRisk(text,correct))issues.push({code:"stem_answer_continuation",severity:"critical",message:"O gabarito parece completar literalmente o enunciado."});
 if(correct&&overlap(text,correct)>=.58)issues.push({code:"stem_answer_overlap",severity:"high",message:"Sobreposição lexical excessiva entre enunciado e gabarito."});
 if(correct&&options.length>=4){const correctWords=words(correct).length;const lengths=options.map(x=>words(optionText(x)).length);const median=[...lengths].sort((a,b)=>a-b)[Math.floor(lengths.length/2)]||1;if(correctWords>Math.max(median*1.8,median+10))issues.push({code:"answer_length_leak",severity:"medium",message:"A resposta correta é muito mais detalhada que os distratores."});const similarities=options.map(x=>overlap(text,optionText(x)));const sorted=[...similarities].sort((a,b)=>b-a);if(similarities[ci]===sorted[0]&&sorted[0]-Number(sorted[1]||0)>=.28)issues.push({code:"answer_similarity_leak",severity:"high",message:"A alternativa correta é semanticamente/textualmente muito mais próxima do enunciado."});}
 if(!question.explanation)issues.push({code:"missing_explanation",severity:"low",message:"Explicação ausente."});
 return{ok:!issues.some(x=>["critical","high"].includes(x.severity)),score:Math.max(0,100-issues.reduce((s,x)=>s+({critical:40,high:25,medium:12,low:5}[x.severity]||0),0)),issues,version:QUESTION_QUALITY_VERSION};
}
export function fingerprintQuestion(question={}){return norm(question.question).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g,"").split(" ").filter(x=>x.length>3).sort().join(" ");}
export function findLikelyDuplicates(questions=[]){const seen=new Map(),pairs=[];for(const q of questions){const fp=fingerprintQuestion(q);if(!fp)continue;if(seen.has(fp))pairs.push([seen.get(fp),q]);else seen.set(fp,q)}return pairs;}
