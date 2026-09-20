export const QUESTION_QUALITY_VERSION="1.0";
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
 if(!question.explanation)issues.push({code:"missing_explanation",severity:"low",message:"Explicação ausente."});
 return{ok:!issues.some(x=>["critical","high"].includes(x.severity)),score:Math.max(0,100-issues.reduce((s,x)=>s+({critical:40,high:25,medium:12,low:5}[x.severity]||0),0)),issues,version:QUESTION_QUALITY_VERSION};
}
export function fingerprintQuestion(question={}){return norm(question.question).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g,"").split(" ").filter(x=>x.length>3).sort().join(" ");}
export function findLikelyDuplicates(questions=[]){const seen=new Map(),pairs=[];for(const q of questions){const fp=fingerprintQuestion(q);if(!fp)continue;if(seen.has(fp))pairs.push([seen.get(fp),q]);else seen.set(fp,q)}return pairs;}
