import fs from "node:fs";import path from "node:path";import {pathToFileURL} from "node:url";
const root=process.cwd(),dir=path.join(root,"data","questions");
const {validateQuestionTaxonomy}=await import(pathToFileURL(path.join(root,"lib/question-taxonomy.js")).href);
let quarantined=0;
for(const file of fs.readdirSync(dir).filter(x=>x.endsWith(".json"))){const slug=file.replace(/\.json$/,""),p=path.join(dir,file),bank=JSON.parse(fs.readFileSync(p,"utf8"));let dirty=false;
 for(const q of bank.questions||[]){const r=validateQuestionTaxonomy(q,slug);if(!r.legacy&&r.errors.length&&q.active!==false){q.active=false;q.status="quarantined";q.quality={...(q.quality||{}),quarantine_reason:"invalid_taxonomy_requires_source_review",taxonomy_errors:r.errors,quarantined_at:"2026-09-23"};quarantined++;dirty=true;}}
 if(dirty)fs.writeFileSync(p,JSON.stringify(bank,null,2)+"\n");
}
console.log(JSON.stringify({quarantined},null,2));
