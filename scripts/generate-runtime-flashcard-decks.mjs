import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {readFile,writeFile} from "node:fs/promises";
import {buildAllPscppBibliographyDecks} from "../lib/bibliography-flashcards.js";

const bank=new URL("../data/questions/runtime-active-banks.json",import.meta.url);
const output=new URL("../data/questions/runtime-flashcard-decks.json",import.meta.url);
const source=JSON.parse(await readFile(bank,"utf8"));
const digest=createHash("sha256").update(source.source_hash).update(await readFile(new URL("../lib/bibliography-flashcards.js",import.meta.url))).digest("hex");
if(process.argv.includes("--check")){
  const saved=JSON.parse(await readFile(output,"utf8"));
  assert.equal(saved.source_hash,digest,"Flashcards desatualizados; execute npm run generate:flashcard-decks");
  assert.equal(saved.decks.length,7);
  console.log(`Flashcards prontos: ${saved.decks.length} baralhos`);
}else{
  const decks=buildAllPscppBibliographyDecks();
  await writeFile(output,JSON.stringify({source_hash:digest,decks}));
  console.log(`Flashcards gerados: ${decks.length} baralhos`);
}
