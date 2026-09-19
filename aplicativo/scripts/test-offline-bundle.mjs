import fs from "node:fs";
import path from "node:path";
const root=path.resolve(process.cwd(),"www");
const required=["index.html","app.js","local-engine.js","study.html","study.js","flashcards.html","flashcards.js","laboratorio.html","laboratorio.js","plano.html","plano.js","content/manifest.json","content/flashcard-decks.json","vendor/three/three.module.js","vendor/three/examples/jsm/loaders/GLTFLoader.js","vendor/three/examples/jsm/controls/OrbitControls.js"];
for(const rel of required){if(!fs.existsSync(path.join(root,rel)))throw new Error("Arquivo offline ausente: "+rel)}
const manifest=JSON.parse(fs.readFileSync(path.join(root,"content/manifest.json"),"utf8"));
if(!(manifest.questions?.files?.length>0))throw new Error("Banco de questões não foi embarcado.");
if(!(manifest.models?.count>=5))throw new Error("Modelos 3D insuficientes.");
const decks=JSON.parse(fs.readFileSync(path.join(root,"content/flashcard-decks.json"),"utf8")).decks||[];
if(!decks.length||!decks.some(d=>d.cards?.length))throw new Error("Decks de flashcards não foram extraídos.");
for(const m of manifest.models.files||[]){if(!fs.existsSync(path.join(root,"content",m.path)))throw new Error("Modelo ausente: "+m.path)}
const engine=fs.readFileSync(path.join(root,"local-engine.js"),"utf8"),study=fs.readFileSync(path.join(root,"study.js"),"utf8"),lab=fs.readFileSync(path.join(root,"laboratorio.js"),"utf8");
for(const token of ["notebook.create","notebook.answer","exam.snapshot","study.task","Authorization","auth_token"])if(!engine.includes(token))throw new Error("Fluxo local/sync ausente: "+token);
for(const token of ["createActivity","saveAnswer","finish","Continuar último"])if(!study.includes(token))throw new Error("Fluxo de estudo incompleto: "+token);
for(const token of ["Propulsão mecânica","Sem governo","Manobra restrita","Praticagem","Fundeada","Encalhada"])if(!lab.includes(token))throw new Error("Cenário RIPEAM ausente: "+token);
console.log("Offline smoke OK",{questionFiles:manifest.questions.files.length,models:manifest.models.count,decks:decks.length,cards:decks.reduce((s,d)=>s+d.cards.length,0)});
