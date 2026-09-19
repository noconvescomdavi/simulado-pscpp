import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root=path.resolve(process.cwd(),"..");
const out=path.resolve(process.cwd(),"www/content");
const groups={
  questions:["data/questions","data/question-extensions"],
  flashcards:["public/flashcards"],
  models:["public/models/ripeam"],
  study:["protected-content/study-content"],
  scenes:["lib/ripeam-3d-default-scenes.js"],
};

function extractFlashcardDecks(){
  const dir=path.join(root,"db/flashcards");
  const decks=[];
  for(const file of walk(dir).filter(x=>/_seed_.*\.sql$/i.test(x))){
    const sql=fs.readFileSync(file,"utf8");
    const header=/VALUES\s*\(\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'\s*,\s*'([^']*)'\s*,/i.exec(sql);
    if(!header)continue;
    const after=sql.slice(header.index+header[0].length);
    const quoted=/\$([A-Z0-9_]*)\$([\s\S]*?)\$\1\$::jsonb/i.exec(after);
    if(!quoted)continue;
    try{
      const cards=JSON.parse(quoted[2]);
      decks.push({slug:header[1],subject_slug:header[2],subject_label:header[3],title:header[4],description:header[5],cards});
    }catch(error){console.warn("Deck ignorado:",file,error.message)}
  }
  return decks;
}

function walk(dir){
  if(!fs.existsSync(dir))return[];
  if(fs.statSync(dir).isFile())return[dir];
  return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const full=path.join(dir,entry.name);
    return entry.isDirectory()?walk(full):[full];
  });
}
function sha(file){return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex")}
function copyGroup(name,dirs){
  const files=dirs.flatMap(rel=>walk(path.join(root,rel)));
  const manifest=[];
  for(const file of files){
    const rel=path.relative(root,file).replaceAll(path.sep,"/");
    const dest=path.join(out,rel);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    fs.copyFileSync(file,dest);
    manifest.push({path:rel,size:fs.statSync(file).size,sha256:sha(file)});
  }
  return manifest;
}

fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
const contents={};
for(const [name,dirs] of Object.entries(groups))contents[name]=copyGroup(name,dirs);
const manifest={
  schema:1,
  generated_at:new Date().toISOString(),
  content_version:process.env.GITHUB_SHA||process.env.VERCEL_GIT_COMMIT_SHA||"local",
  questions:{count:contents.questions.filter(x=>x.path.startsWith("data/questions/")).length,files:contents.questions},
  flashcards:{count:contents.flashcards.length,files:contents.flashcards},
  models:{count:contents.models.length,files:contents.models},
  study:{count:contents.study.length,files:contents.study},
  total_bytes:Object.values(contents).flat().reduce((sum,x)=>sum+x.size,0)
};
const decks=extractFlashcardDecks();
fs.writeFileSync(path.join(out,"flashcard-decks.json"),JSON.stringify({decks},null,2));
manifest.flashcards.decks=decks.length;
manifest.flashcards.cards=decks.reduce((sum,d)=>sum+d.cards.length,0);

const threeRoot=path.join(process.cwd(),"node_modules/three");
const vendor=path.join(process.cwd(),"www/vendor/three");
fs.rmSync(vendor,{recursive:true,force:true});
if(fs.existsSync(threeRoot)){
  fs.mkdirSync(vendor,{recursive:true});
  fs.copyFileSync(path.join(threeRoot,"build/three.module.js"),path.join(vendor,"three.module.js"));
  const src=path.join(threeRoot,"examples/jsm");
  for(const file of walk(src)){
    const rel=path.relative(src,file);
    const dest=path.join(vendor,"examples/jsm",rel);
    fs.mkdirSync(path.dirname(dest),{recursive:true});
    fs.copyFileSync(file,dest);
  }
}

fs.writeFileSync(path.join(out,"manifest.json"),JSON.stringify(manifest,null,2));
console.log("Pacote offline criado:",manifest.total_bytes,"bytes");
console.log("Questões:",manifest.questions.files.length,"arquivos; modelos:",manifest.models.count,"; flashcards:",manifest.flashcards.count);
