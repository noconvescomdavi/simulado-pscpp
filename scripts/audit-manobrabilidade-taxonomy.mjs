import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const bankPath = path.join(root, "data/questions/manobrabilidade.json");
const outDir = path.join(root, "reports");
const outPath = path.join(outDir, "manobrabilidade-taxonomy-audit.json");
const topicsDir = path.join(outDir, "manobrabilidade-topics");
const bank = JSON.parse(fs.readFileSync(bankPath, "utf8"));
const questions = Array.isArray(bank.questions) ? bank.questions : [];

const norm = (v) => String(v ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const slug = (v) => norm(v).replace(/\s+/g,"-").slice(0,80) || "sem-titulo";
const count = (map, key) => map.set(key, (map.get(key) || 0) + 1);
const sourceTitles = new Map();
const sourceLocators = new Map();
const sourcePairs = new Map();
const modules = new Map();
const topics = new Map();
const topicGroups = new Map();
let v2 = 0;
let legacy = 0;
let tracking = 0;

function romanChapter(text) {
  const m = String(text || "").match(/chapter\s+(ix|vi|v)\b/i);
  return m?.[1]?.toUpperCase() || null;
}
function arabicChapter(text) {
  const m = String(text || "").match(/(?:chapter|cap(?:itulo|ítulo|\.)?)\s*(\d{1,2})\b/i);
  return m ? Number(m[1]) : null;
}
function sectionNumber(text) {
  const m = String(text || "").match(/(?:section|secao|seção)\s*(\d{1,2})\b/i);
  return m ? Number(m[1]) : null;
}
function predict(q) {
  const title = norm(q?.source?.title);
  const author = norm(q?.source?.author);
  const locator = String(q?.source?.locator || "");
  const loc = norm(locator);
  const mod = norm(q?.module);
  const topic = norm(q?.topic);
  const combined = `${loc} ${mod} ${topic}`;
  if (title.includes("naval shiphandling") || author.includes("crenshaw")) return { bibliography_id:"crenshaw-naval-shiphandling", chapter_id:"crenshaw-naval-shiphandling::ch2", confidence:"high", reason:"obra possui somente Chapter 2 no catálogo" };
  if (title.includes("principles of naval architecture") || author.includes("lewis")) {
    const roman=romanChapter(locator), sec=sectionNumber(locator);
    if ((roman==="V"||roman==="VI")&&sec) return {bibliography_id:"pna-v2",chapter_id:`pna-v2::ch${roman==="V"?5:6}-s${sec}`,confidence:"high",reason:"chapter/section explícitos"};
    if (roman==="IX"&&sec) return {bibliography_id:"pna-v3",chapter_id:`pna-v3::ch9-s${sec}`,confidence:"high",reason:"chapter/section explícitos"};
    return {confidence:"none",reason:"PNA sem chapter/section canônicos inequívocos"};
  }
  if (title.includes("ship resistance and flow") || (author.includes("larsson")&&author.includes("raven"))) {
    const ch=arabicChapter(locator); if(ch>=1&&ch<=8)return {bibliography_id:"larsson-resistance",chapter_id:`larsson-resistance::ch${ch}`,confidence:"high",reason:"chapter explícito"};
    return {confidence:"none",reason:"Larsson sem capítulo inequívoco"};
  }
  if (title.includes("practical ship hydrodynamics") || author.includes("bertram")) {
    const ch=arabicChapter(locator); if([2,3,6].includes(ch))return {bibliography_id:"bertram",chapter_id:`bertram::ch${ch}`,confidence:"high",reason:"chapter explícito"};
    if(combined.includes("leme")||combined.includes("rudder")||combined.includes("manoeuv")||combined.includes("maneuver"))return {bibliography_id:"bertram",chapter_id:"bertram::ch6",confidence:"medium",reason:"tema de manobra/lemes"};
    if(combined.includes("propuls")||combined.includes("propeller")||combined.includes("helice"))return {bibliography_id:"bertram",chapter_id:"bertram::ch2",confidence:"medium",reason:"tema de propulsores"};
    if(combined.includes("resist"))return {bibliography_id:"bertram",chapter_id:"bertram::ch3",confidence:"medium",reason:"tema de resistência/propulsão"};
    return {confidence:"none",reason:"Bertram sem capítulo inequívoco"};
  }
  if (title.includes("explanatory notes") || loc.includes("msc circ 1053") || loc.includes("msc 1 circ 1053")) {
    const ch=arabicChapter(locator); if([1,2,3].includes(ch))return {bibliography_id:"msc1053",chapter_id:`msc1053::ch${ch}`,confidence:"high",reason:"chapter explícito"};
    return {confidence:"none",reason:"MSC/Circ.1053 sem capítulo inequívoco"};
  }
  if ((title.includes("standards for ship manoeuvrability")||title.includes("standards for ship maneuverability")||loc.includes("msc 137 76"))&&!title.includes("explanatory")) return {bibliography_id:"msc137",chapter_id:"msc137::annex6",confidence:"high",reason:"única unidade canônica: Annex 6"};
  if (title.includes("manobrabilidade do navio no seculo 21") || (author.includes("edson mesquita")&&!title.includes("hidrodinamica"))) {
    const ch=arabicChapter(locator); if(ch>=2&&ch<=11)return {bibliography_id:"santos-manobrabilidade",chapter_id:`santos-manobrabilidade::ch${ch}`,confidence:"high",reason:"capítulo explícito"};
    return {confidence:"none",reason:"Santos Manobrabilidade sem capítulo inequívoco"};
  }
  if (title.includes("principios de hidrodinamica")||title.includes("acao das ondas")) {
    const ch=arabicChapter(locator); if([3,4].includes(ch))return {bibliography_id:"santos-hidrodinamica",chapter_id:`santos-hidrodinamica::ch${ch}`,confidence:"high",reason:"capítulo explícito"};
    return {confidence:"none",reason:"Santos Hidrodinâmica sem capítulo inequívoco"};
  }
  if (title.includes("revised guidance")||loc.includes("msc 1 circ 1228")||loc.includes("msc circ 1228")) {
    const s=sectionNumber(locator); if([1,3,4].includes(s))return {bibliography_id:"msc1228",chapter_id:`msc1228::s${s}`,confidence:"high",reason:"seção explícita"};
    if(/\b3(?:\.|\b)/.test(locator))return {bibliography_id:"msc1228",chapter_id:"msc1228::s3",confidence:"medium",reason:"subitem da seção 3"};
    if(/\b4(?:\.|\b)/.test(locator))return {bibliography_id:"msc1228",chapter_id:"msc1228::s4",confidence:"medium",reason:"subitem da seção 4"};
    return {confidence:"none",reason:"MSC.1/Circ.1228 sem seção inequívoca"};
  }
  if (title.includes("provision and display of manoeuvring information")||title.includes("provision and display of maneuvering information")||loc.includes("a 601 15")) return {bibliography_id:"a601",chapter_id:"a601::s1",confidence:"high",reason:"única unidade canônica"};
  return {confidence:"none",reason:"obra não reconhecida"};
}

const predicted=new Map(),confidence=new Map(),unmappedReasons=new Map(),unmappedSamples=[],mediumSamples=[];
for(const q of questions){
  if(q?.taxonomy)v2++;else legacy++; if(q?.tracking)tracking++;
  const title=String(q?.source?.title||"(sem título)"), locator=String(q?.source?.locator||"(sem locator)");
  count(sourceTitles,title);count(sourceLocators,locator);count(sourcePairs,`${title} || ${locator}`);count(modules,String(q?.module||"(sem módulo)"));count(topics,String(q?.topic||"(sem tópico)"));
  const workSlug=slug(title); if(!topicGroups.has(workSlug))topicGroups.set(workSlug,{title,rows:new Map()});
  const group=topicGroups.get(workSlug); const k=JSON.stringify([q.module||"",q.topic_code||"",q.topic||"",locator]); count(group.rows,k);
  const p=predict(q);count(confidence,p.confidence);if(p.chapter_id)count(predicted,p.chapter_id);
  if(p.confidence==="none"){count(unmappedReasons,p.reason);if(unmappedSamples.length<150)unmappedSamples.push({id:q.id,module:q.module,topic_code:q.topic_code,topic:q.topic,source:q.source,reason:p.reason});}
  else if(p.confidence==="medium"&&mediumSamples.length<100)mediumSamples.push({id:q.id,module:q.module,topic_code:q.topic_code,topic:q.topic,source:q.source,prediction:p});
}
const sorted=(map)=>[...map.entries()].map(([key,count])=>({key,count})).sort((a,b)=>b.count-a.count||a.key.localeCompare(b.key,"pt-BR"));
const report={generated_at:new Date().toISOString(),bank_id:bank.bank_id,total:questions.length,v2,legacy,tracking,source_titles:sorted(sourceTitles),top_source_locators:sorted(sourceLocators).slice(0,300),source_pairs:sorted(sourcePairs).slice(0,500),modules:sorted(modules),topics_count:topics.size,prediction_confidence:Object.fromEntries(confidence),predicted_chapter_coverage:sorted(predicted),unmapped_reasons:sorted(unmappedReasons),unmapped_samples:unmappedSamples,medium_confidence_samples:mediumSamples};
fs.mkdirSync(outDir,{recursive:true});fs.mkdirSync(topicsDir,{recursive:true});
fs.writeFileSync(outPath,JSON.stringify(report,null,2)+"\n");
for(const [workSlug,group] of topicGroups){
  const rows=[...group.rows.entries()].map(([raw,count])=>{const [module,topic_code,topic,locator]=JSON.parse(raw);return {count,module,topic_code,topic,locator};}).sort((a,b)=>b.count-a.count||a.topic.localeCompare(b.topic,"pt-BR"));
  fs.writeFileSync(path.join(topicsDir,`${workSlug}.json`),JSON.stringify({source_title:group.title,total:rows.reduce((s,r)=>s+r.count,0),rows},null,2)+"\n");
}
console.log(JSON.stringify({total:report.total,v2,legacy,tracking,prediction_confidence:report.prediction_confidence,chapters_predicted:predicted.size,topic_files:topicGroups.size},null,2));
