import fs from "node:fs";import path from "node:path";
const dir=path.join(process.cwd(),"data","questions");
const files=fs.readdirSync(dir).filter(f=>f.endsWith(".json"));
const get=(q,...ks)=>{for(const k of ks){const v=k.split(".").reduce((a,x)=>a?.[x],q);if(typeof v==="string"&&v.trim())return v.trim();}return""};
const pub=q=>get(q,"source.title","reference.title","source_title","bibliography","book","publication");
const topic=q=>get(q,"topic","topic_name","subject_detail","module","reference.section","locator.section","content_topic");
const objective=q=>Array.isArray(q.options)&&q.options.length>=2&&!/\bI\)|\bII\)|\bIII\)|\bIV\)/.test(String(q.question||""));
const bad=s=>/(?:\bitem\s+\d|\bsubitem\s+\d|\btrecho\s+\d|\bp\.\s*\d|p[aá]gina\s+\d|arquivo fornecido|qual (?:regra|disposi[cç][aã]o).*(?:item|subitem)|prev[eê].*(?:item|subitem))/i.test(s);
let stats={scanned:0,objective:0,rewritten:0,by_file:{},missing_metadata:[]};
for(const file of files){const p=path.join(dir,file),bank=JSON.parse(fs.readFileSync(p,"utf8"));let n=0;
for(const q of bank.questions||[]){stats.scanned++;if(!objective(q))continue;stats.objective++;const old=String(q.question||"");if(!bad(old))continue;
const publication=pub(q), assunto=topic(q);
if(!publication||!assunto){stats.missing_metadata.push({file,id:q.id,publication,assunto,question:old});continue;}
q.question=`De acordo com ${publication}, acerca de ${assunto}, assinale a alternativa que apresenta corretamente a disposição, requisito ou conceito previsto na publicação.`;
q.audit=q.audit||{};q.audit.locator_removed_from_stem=true;q.audit.previous_stem=old;n++;stats.rewritten++;}
stats.by_file[file]=n;if(n)fs.writeFileSync(p,JSON.stringify(bank,null,2)+"\n");}
const residual=[];
for(const file of files){const bank=JSON.parse(fs.readFileSync(path.join(dir,file),"utf8"));for(const q of bank.questions||[])if(objective(q)&&bad(String(q.question||"")))residual.push({file,id:q.id,question:q.question});}
stats.residual=residual.length;stats.residual_examples=residual.slice(0,50);
fs.mkdirSync("reports",{recursive:true});fs.writeFileSync("reports/objective-stem-normalization.json",JSON.stringify(stats,null,2)+"\n");
console.log(JSON.stringify(stats,null,2));if(residual.length||stats.missing_metadata.length)process.exitCode=2;