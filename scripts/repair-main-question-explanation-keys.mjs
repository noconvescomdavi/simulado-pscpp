import fs from "node:fs";import path from "node:path";
const dir=path.join(process.cwd(),"data/questions"),files=fs.readdirSync(dir).filter(x=>x.endsWith(".json"));
const norm=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim();
let scanned=0,changed=0,unresolved=[];const changes=[];
for(const name of files){const p=path.join(dir,name),data=JSON.parse(fs.readFileSync(p,"utf8")),arr=Array.isArray(data)?data:data.questions;if(!Array.isArray(arr))continue;let fc=0;
for(const q of arr){scanned++;const key=String(q.correct_answer||q.answer||"").toUpperCase(),opts=Array.isArray(q.options)?q.options:[],correct=opts.find(o=>String(o?.key||"").toUpperCase()===key),exp=String(q.explanation||"");const m=exp.match(/((?:alternativa|op[cç][aã]o|gabarito)\s*[:=-]?\s*)([A-E])(\b)/i);if(!m||!key||m[2].toUpperCase()===key||!correct)continue;
const colon=exp.indexOf(":",m.index);const tail=colon>=0?exp.slice(colon+1).split(/\.\s+(?:As demais|As outras|Os demais)/i)[0]:"";const ct=norm(correct.text),tt=norm(tail);const supported=tt.length>=18&&(ct.includes(tt)||tt.includes(ct)||ct.split(" ").filter(w=>w.length>4&&tt.includes(w)).length>=Math.min(8,Math.max(4,Math.floor(ct.split(" ").length*.45))));
if(!supported){unresolved.push({file:name,id:q.id,json:key,explanation:m[2].toUpperCase(),tail,correct:correct.text});continue}
const before=exp,after=exp.slice(0,m.index)+m[1]+key+m[3]+exp.slice(m.index+m[0].length);q.explanation=after;changed++;fc++;changes.push({file:name,id:q.id,from:m[2].toUpperCase(),to:key});}
if(fc)fs.writeFileSync(p,JSON.stringify(data,null,2)+"\n");}
fs.mkdirSync("reports",{recursive:true});fs.writeFileSync("reports/explanation-key-repair.json",JSON.stringify({questions_scanned:scanned,explanations_changed:changed,unresolved_count:unresolved.length,changes,unresolved},null,2)+"\n");console.log(JSON.stringify({questions_scanned:scanned,explanations_changed:changed,unresolved_count:unresolved.length},null,2));
