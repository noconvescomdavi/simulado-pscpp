import fs from "node:fs";
import path from "node:path";
const root=new URL("../data/pscpp/",import.meta.url);
const official=JSON.parse(fs.readFileSync(new URL("official-exams.json",root),"utf8"));
const generated=JSON.parse(fs.readFileSync(new URL("generated-questions.json",root),"utf8"));
const generatedBatchDir=new URL("generated-batches/",root);
const generatedBatchQuestions=fs.existsSync(generatedBatchDir)
 ? fs.readdirSync(generatedBatchDir).filter(file=>/^batch_\d{3}\.json$/.test(file)).sort().flatMap(file=>JSON.parse(fs.readFileSync(new URL(file,generatedBatchDir),"utf8")).questions||[])
 : [];
generated.questions=[...(generated.questions||[]),...generatedBatchQuestions];
const inventory=JSON.parse(fs.readFileSync(new URL("source-inventory.json",root),"utf8"));
const errors=[]; const warnings=[]; const ids=new Set();
const warnOnce=new Set();
function warn(message){if(!warnOnce.has(message)){warnOnce.add(message);warnings.push(message)}}
const officialIssues={extraction_artifact:{},invalid_option_keys:{},invalid_option_count:{}};
function recordOfficialIssue(type,q){const year=String(q.year||"unknown");officialIssues[type][year]=(officialIssues[type][year]||0)+1}
function audit(q,kind){
 if(!q.id) errors.push(kind+": question without id");
 else if(ids.has(q.id)) errors.push("duplicate id "+q.id); else ids.add(q.id);
 if(q.active!==false&&!q.annulled){
  if(!q.question) errors.push(q.id+": missing question");
  if(!Array.isArray(q.options)||q.options.length!==5) kind==="official"?recordOfficialIssue("invalid_option_count",q):errors.push(q.id+": must have exactly 5 options");
  if(!/^[A-E]$/.test(String(q.correct_answer||"").toUpperCase())) errors.push(q.id+": invalid answer");
  const keys=(q.options||[]).map(o=>String(o?.key||"").toUpperCase());
  if(keys.join("")!=="ABCDE"||new Set(keys).size!==5) kind==="official"?recordOfficialIssue("invalid_option_keys",q):errors.push(q.id+": invalid option keys");
  if(/<PARSED TEXT FOR PAGE|Diretoria de Portos e Costas/.test(JSON.stringify(q))) {
   kind==="official"?recordOfficialIssue("extraction_artifact",q):errors.push(q.id+": PDF extraction artifact");
  }
 }
 if(kind==="generated"&&q.active!==false){
  if(q.pscpp_origin!=="generated_pscpp") errors.push(q.id+": invalid generated origin");
  if(!q.bibliography?.publication) errors.push(q.id+": missing bibliography publication");
  if(!q.validation_status||q.validation_status!=="approved") errors.push(q.id+": generated question not approved");
  if(!q.explanation) errors.push(q.id+": missing explanation");
  if(!q.pscpp_format) errors.push(q.id+": missing pscpp_format");
  if(!q.difficulty) errors.push(q.id+": missing difficulty");
  if(!q.cognitive_level) errors.push(q.id+": missing cognitive level");
  if(!q.bibliography?.locator) errors.push(q.id+": missing bibliography locator");
  if(!["hard","very_hard","medium"].includes(q.difficulty)) errors.push(q.id+": invalid difficulty");
  if(!Number.isInteger(q.cognitive_level)||q.cognitive_level<2||q.cognitive_level>5) errors.push(q.id+": invalid cognitive level");
  const structured=["assertions","vf","true_false"].includes(q.pscpp_format);
  if(structured&&(!Array.isArray(q.assertions)||q.assertions.length<3)) errors.push(q.id+": structured format without assertions array");
  if(Array.isArray(q.assertions)&&q.assertions.some((item,index)=>!new RegExp(`^${["I","II","III","IV","V"][index]}\\)\\s+`).test(String(item)))) errors.push(q.id+": malformed structured assertion labels");
 }
}
for(const q of official.questions||[]) audit(q,"official");
for(const q of generated.questions||[]) audit(q,"generated");
for(const [type,counts] of Object.entries(officialIssues)){
 const total=Object.values(counts).reduce((sum,count)=>sum+count,0);
 if(total) warn(`official legacy ${type}: ${total} item(s), by year ${JSON.stringify(counts)}; pending source-PDF visual repair`);
}
const expected=inventory.historical_total||264;
if((official.questions||[]).length!==expected) errors.push(`official corpus mismatch: ${(official.questions||[]).length}/${expected}`);
const activeOfficial=(official.questions||[]).filter(q=>q.active!==false&&!q.annulled).length;
const annulled=(official.questions||[]).filter(q=>q.annulled).length;
const approvedGenerated=(generated.questions||[]).filter(q=>q.active!==false&&q.validation_status==="approved").length;
const eligibleStatuses=new Set(inventory.generation_policy?.eligible_status||[]);
const eligiblePublications=new Set((inventory.verified_bibliography||[]).filter(source=>eligibleStatuses.has(source.status)).map(source=>source.publication));
for(const q of generated.questions||[]){
 if(q.active!==false&&q.validation_status==="approved"&&!eligiblePublications.has(q.bibliography?.publication)) errors.push(`${q.id}: bibliography is not an eligible verified source`);
}
const generatedTarget=Number(inventory.generated_question_target?.minimum_approved||0);
if(process.env.PSCPP_FINAL_AUDIT==="1"&&approvedGenerated<generatedTarget) errors.push(`generated corpus below final target: ${approvedGenerated}/${generatedTarget}`);
const normalized=s=>String(s||"").toLowerCase().replace(/[^a-z0-9áàâãéêíóôõúç ]/gi," ").replace(/\s+/g," ").trim();
const texts=new Map();
for(const q of [...(official.questions||[]),...(generated.questions||[])]){if(q.active===false||q.annulled)continue;const key=normalized(q.question);if(texts.has(key))errors.push(`exact semantic-text duplicate: ${texts.get(key)} / ${q.id}`);else texts.set(key,q.id)}
const answerDistribution=Object.fromEntries("ABCDE".split("").map(letter=>[letter,(generated.questions||[]).filter(q=>q.active!==false&&q.validation_status==="approved"&&String(q.correct_answer).toUpperCase()===letter).length]));
const difficultyDistribution=Object.fromEntries(["medium","hard","very_hard"].map(level=>[level,(generated.questions||[]).filter(q=>q.active!==false&&q.validation_status==="approved"&&q.difficulty===level).length]));
console.log(JSON.stringify({ok:!errors.length,official_total:(official.questions||[]).length,official_active:activeOfficial,official_annulled:annulled,generated_approved:approvedGenerated,generated_target:generatedTarget,generated_remaining:Math.max(0,generatedTarget-approvedGenerated),pool_active:activeOfficial+approvedGenerated,answer_distribution:answerDistribution,difficulty_distribution:difficultyDistribution,errors,warnings},null,2));
if(errors.length)process.exit(1);
