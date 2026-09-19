import fs from "node:fs";
const root=new URL("../data/pscpp/",import.meta.url);
const official=JSON.parse(fs.readFileSync(new URL("official-exams.json",root),"utf8"));
const generated=JSON.parse(fs.readFileSync(new URL("generated-questions.json",root),"utf8"));
const inventory=JSON.parse(fs.readFileSync(new URL("source-inventory.json",root),"utf8"));
const errors=[]; const warnings=[]; const ids=new Set();
function audit(q,kind){
 if(!q.id) errors.push(kind+": question without id");
 else if(ids.has(q.id)) errors.push("duplicate id "+q.id); else ids.add(q.id);
 if(q.active!==false&&!q.annulled){
  if(!q.question) errors.push(q.id+": missing question");
  if(!Array.isArray(q.options)||q.options.length!==5) errors.push(q.id+": must have exactly 5 options");
  if(!/^[A-E]$/.test(String(q.correct_answer||"").toUpperCase())) errors.push(q.id+": invalid answer");
  const keys=(q.options||[]).map(o=>String(o?.key||"").toUpperCase());
  if(keys.join("")!=="ABCDE"||new Set(keys).size!==5) errors.push(q.id+": invalid option keys");
  if(/<PARSED TEXT FOR PAGE|Diretoria de Portos e Costas/.test(JSON.stringify(q))) errors.push(q.id+": PDF extraction artifact");
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
 }
}
for(const q of official.questions||[]) audit(q,"official");
for(const q of generated.questions||[]) audit(q,"generated");
const expected=inventory.historical_total||264;
if((official.questions||[]).length!==expected) errors.push(`official corpus mismatch: ${(official.questions||[]).length}/${expected}`);
const activeOfficial=(official.questions||[]).filter(q=>q.active!==false&&!q.annulled).length;
const annulled=(official.questions||[]).filter(q=>q.annulled).length;
const approvedGenerated=(generated.questions||[]).filter(q=>q.active!==false&&q.validation_status==="approved").length;
const normalized=s=>String(s||"").toLowerCase().replace(/[^a-z0-9áàâãéêíóôõúç ]/gi," ").replace(/\s+/g," ").trim();
const texts=new Map();
for(const q of [...(official.questions||[]),...(generated.questions||[])]){if(q.active===false||q.annulled)continue;const key=normalized(q.question);if(texts.has(key))errors.push(`exact semantic-text duplicate: ${texts.get(key)} / ${q.id}`);else texts.set(key,q.id)}
console.log(JSON.stringify({ok:!errors.length,official_total:(official.questions||[]).length,official_active:activeOfficial,official_annulled:annulled,generated_approved:approvedGenerated,pool_active:activeOfficial+approvedGenerated,errors,warnings},null,2));
if(errors.length)process.exit(1);
