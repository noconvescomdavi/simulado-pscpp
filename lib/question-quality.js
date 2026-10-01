export const QUESTION_QUALITY_VERSION="1.2";
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
 // A named subject naturally repeats in all five parallel alternatives. For
 // reviewed content questions, only a distinctive overlap with the key is a
 // leak; shared context must not quarantine otherwise valid questions.
 const reviewed=(question.editorial_review?.content_reviewed===true&&question.editorial_review?.version==="legislation-content-v2")
   || (question.editorial_review?.complete_stem_restored===true&&question.editorial_review?.complete_stem_version==="notebook-complete-stems-v1");
 const leakText=reviewed&&question.source?.title?text.replace(question.source.title,""):text;
 const correctOverlap=overlap(leakText,correct);
 const otherOverlap=Math.max(0,...options.filter((_,i)=>i!==ci).map(o=>overlap(leakText,optionText(o))));
 // Completing an intentional gap is the task, not an accidental continuation
 // leak. A reviewed gap still fails if its literal answer is already supplied.
 const reviewedGap=reviewed&&/_{3,}/.test(text)&&/complete/i.test(text);
 const literalGapLeak=reviewedGap&&correct&&norm(text).includes(norm(correct));
 const distinctive=reviewedGap?Boolean(literalGapLeak):!reviewed||correctOverlap-otherOverlap>=.15;
 if(correct&&distinctive&&continuationRisk(text,correct))issues.push({code:"stem_answer_continuation",severity:"critical",message:"O gabarito parece completar literalmente o enunciado."});
 if(correct&&distinctive&&correctOverlap>=.58)issues.push({code:"stem_answer_overlap",severity:"high",message:"Sobreposição lexical excessiva entre enunciado e gabarito."});
 if(correct&&options.length>=4){const correctWords=words(correct).length;const lengths=options.map(x=>words(optionText(x)).length);const median=[...lengths].sort((a,b)=>a-b)[Math.floor(lengths.length/2)]||1;if(correctWords>Math.max(median*1.8,median+10))issues.push({code:"answer_length_leak",severity:"medium",message:"A resposta correta é muito mais detalhada que os distratores."});const similarities=options.map(x=>overlap(text,optionText(x)));const sorted=[...similarities].sort((a,b)=>b-a);if((!reviewedGap||literalGapLeak)&&similarities[ci]===sorted[0]&&sorted[0]-Number(sorted[1]||0)>=.28)issues.push({code:"answer_similarity_leak",severity:"high",message:"A alternativa correta é semanticamente/textualmente muito mais próxima do enunciado."});}
 if(!question.explanation)issues.push({code:"missing_explanation",severity:"low",message:"Explicação ausente."});
 return{ok:!issues.some(x=>["critical","high"].includes(x.severity)),score:Math.max(0,100-issues.reduce((s,x)=>s+({critical:40,high:25,medium:12,low:5}[x.severity]||0),0)),issues,version:QUESTION_QUALITY_VERSION};
}
export function fingerprintQuestion(question={}){return norm(question.question).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9 ]/g,"").split(" ").filter(x=>x.length>3).sort().join(" ");}
export function findLikelyDuplicates(questions=[]){const seen=new Map(),pairs=[];for(const q of questions){const fp=fingerprintQuestion(q);if(!fp)continue;if(seen.has(fp))pairs.push([seen.get(fp),q]);else seen.set(fp,q)}return pairs;}

// Known extraction defects in Arte Naval cap. 1. Keep the answer key and
// question identity intact while repairing the text shown in both banks.
const knownOcrArtifacts=/cacacarga|gragragrande|popopor|guru pés|\beuum\b|\bentre entre\b|Considere A definição técnica “|A descrição inclui ainda esta característica:/gi;
const hasKnownOcrArtifact=/cacacarga|gragragrande|popopor|guru pés|\beuum\b|\bentre entre\b|Considere A definição técnica “|A descrição inclui ainda esta característica:/i;
function repairOcrText(value){
 if(typeof value!=="string")return value;
 return value.replace(knownOcrArtifacts,(match)=>({
   cacacarga:"carga",gragragrande:"grande",popopor:"por","guru pés":"gurupés",
   euum:"em um","entre entre":"entre",
   "considere a definição técnica “":"Considere a seguinte definição técnica: ",
   "a descrição inclui ainda esta característica:":"Característica adicional:"
 })[match.toLowerCase()]||match);
}
function repairKnownOcrArtifacts(question){
 const fields=[question.question,question.explanation,question.topic,question.source?.locator,question.bibliography?.locator,...(question.options||[]).map(optionText),...(question.assertions||[]).map(x=>typeof x==="string"?x:x?.text)];
 if(!fields.some(value=>typeof value==="string"&&hasKnownOcrArtifact.test(value)))return question;
 const repairEntry=(entry)=>typeof entry==="string"?repairOcrText(entry):Array.isArray(entry)?entry.map(repairEntry):entry&&typeof entry==="object"?Object.fromEntries(Object.entries(entry).map(([key,value])=>[key,repairEntry(value)])):entry;
 return repairEntry(question);
}

export function reformulateLeakingStem(question={}){
 question=repairKnownOcrArtifacts(question);
 // Official PSCPP exam items are primary-source records. Their wording, repetitions,
 // quotations and even source typos must be preserved instead of normalized into a
 // generic prompt such as "acerca de Questão ...".
 if(question?.origin==="official_exam"||question?.pscpp_origin==="official_exam")return question;
 // Individually reviewed content stems already identify the technical object.
 // Lexical overlap with similar alternatives must not turn them back into
 // generic commands asking students to remember a source locator.
 if(question.editorial_review?.content_reviewed===true&&question.editorial_review?.version==="legislation-content-v2")return question;
 const stem=String(question.question||"");
 const quoted=/[“"][^”"]{18,}[”"]/.test(stem);
 const options=Array.isArray(question.options)?question.options:[];
 const ci=correctIndex(question,options),correct=ci>=0?optionText(options[ci]):"";
 const artificialLocator=/\b(?:item|trecho|p\.?|pag(?:ina)?\.?)\s*\d+/i.test(stem)&&/\b(?:arquivo fornecido|trecho\s+\d+|p\.?\s*\d+)\b/i.test(stem);
 const parsedArtifact=/<\s*parsed text for page|parsed text for page|arquivo fornecido|texto extra[ií]do|conte[uú]do extra[ií]do|p[aá]gina do (?:pdf|arquivo)|fragmento (?:do|da) (?:pdf|arquivo)|recorte (?:do|da) (?:pdf|arquivo)/i.test(stem);
 const mechanicalStem=/\b(?:conte[uú]do|texto|dispositivo)\s+(?:de|do)\s+(?:item|trecho|p[aá]gina)\s*\d+/i.test(stem)
   || /\b(?:item|se[cç][aã]o|cap[ií]tulo|art\.?|regra)\s*[\wº°.-]+\s*,?\s*trecho\s*\d+/i.test(stem);
 const leaking=quoted||artificialLocator||parsedArtifact||mechanicalStem||(correct&&(continuationRisk(stem,correct)||overlap(stem,correct)>=.58));
 if(!leaking)return question;
 // If the source fragment is artificial and the alternatives themselves are
 // clearly contaminated by extraction/protocol debris, quarantine the item
 // instead of serving a cosmetically rewritten but semantically broken question.
 const optionBlob=options.map(optionText).join(" ");
 const contaminationHits=[
   /POSITION:LAT|LON=/i,
   /XML|SOAP|CDRL|Web Services|ASP\b/i,
   /correio eletr[oô]nico/i,
   /esta[cç][aã]o base|automatic location/i
 ].reduce((n,re)=>n+(re.test(optionBlob)?1:0),0);
 if((artificialLocator||parsedArtifact||mechanicalStem)&&contaminationHits>=2){
   return {...question,active:false,status:"quarantined",quality:{...(question.quality||{}),quarantine_reason:"runtime_semantic_extraction_contamination"}};
 }
 const title=question.source?.title||question.tracking?.work?.title||"a publicação indicada";
 const rawLocator=question.source?.locator||question.tracking?.section||"";
 const locator=String(rawLocator)
   .replace(/,?\s*trecho\s*\d+/gi,"")
   .replace(/,?\s*\bp\.?\s*\d+(?:\s*[-–]\s*\d+)?(?:\s*do arquivo fornecido)?/gi,"")
   .replace(/\b(?:do|no)\s+arquivo fornecido\b/gi,"")
   .replace(/\s+,/g,",").replace(/,\s*,/g,", ").replace(/\s{2,}/g," ").trim().replace(/^,|,$/g,"").trim();
 const style=norm(question.style);
 const negative=/\b(incorreta|incorreto|exceto|n[aã]o\s+(?:est[aá]|corresponde|constitui|representa|se\s+aplica|apresenta))\b/i.test(stem);
 const basePrompt=style.includes("aplic")?`Em uma situação que exija a aplicação de ${locator} de ${title}, qual alternativa apresenta a conduta, requisito ou conceito compatível com a publicação?`:style.includes("sequ")?`Considerando os requisitos estabelecidos em ${locator} de ${title}, qual alternativa apresenta corretamente uma das disposições aplicáveis?`:`De acordo com ${locator} de ${title}, assinale a alternativa que apresenta corretamente a disposição, requisito ou conceito previsto na publicação.`;
 const exactNegative=/\bEXCETO\b/i.test(stem)?"EXCETO":/\bINCORRETA\b/i.test(stem)?"INCORRETA":/\bINCORRETO\b/i.test(stem)?"INCORRETO":/\bN[AÃ]O\b/i.test(stem)?"NÃO":null;
 const cleanContext=locator?locator:"a disposição pertinente";
 const safeBase=style.includes("aplic")?`Em uma situação que exija a aplicação de ${cleanContext} de ${title}, qual alternativa apresenta a conduta, requisito ou conceito compatível com a publicação?`:style.includes("sequ")?`Considerando os requisitos estabelecidos em ${cleanContext} de ${title}, qual alternativa apresenta corretamente uma das disposições aplicáveis?`:`De acordo com ${title}, acerca de ${cleanContext}, assinale a alternativa que apresenta corretamente a disposição, requisito ou conceito previsto na publicação.`;
 const prompt=negative&&exactNegative
   ? `De acordo com ${title}, acerca de ${cleanContext}, assinale a alternativa ${exactNegative}, conforme solicitado.`
   : safeBase;
 return{...question,question:prompt,provenance:{...(question.provenance||{}),mass_reformulation:{version:"answer-leak-v1",reason:"stem normalized to remove answer-disclosing source fragment"}}};
}

// production deploy trigger for runtime semantic quarantine
