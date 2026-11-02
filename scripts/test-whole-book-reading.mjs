import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname,resolve } from "node:path";
import vm from "node:vm";
const dir=dirname(fileURLToPath(import.meta.url));
const source=readFileSync(resolve(dir,"../data/study/bibliography.js"),"utf8").replace(/\bexport\s+/g,"");
const book=vm.runInNewContext(source+"\n({bibliographyUnits,WHOLE_BOOK_CHAPTER_SOURCES})");
const units=book.bibliographyUnits();
const required={"met-0":13,"met-1":14,"met-2":17,"radioperador":4,"normam501":16,"normam701":8,"normam224":3};
test("verified full-book plans never remain a single generic 45-minute publication",()=>{
 for(const [key,n] of Object.entries(required)){
  const rows=units.filter(x=>x.bibliography_key===key);
  assert.equal(rows.length,n,key);
  assert.ok(rows.every(x=>x.section_key!=="integral"),key);
  assert.ok(rows.every(x=>Boolean(x.chapter)),key);
 }
});
test("every printed page is covered exactly once for books with page plans",()=>{
 for(const key of ["met-0","met-1","met-2","radioperador"]){
  const rows=units.filter(x=>x.bibliography_key===key&&x.page_start!=null);
  const pages=new Set();
  for(const row of rows){
   assert.ok(row.page_end>=row.page_start,key);
   for(let p=row.page_start;p<=row.page_end;p++){
    assert.ok(!pages.has(p),"duplicate page "+key+":"+p);
    pages.add(p);
   }
  }
  assert.ok(pages.size>100,key);
 }
});
test("unverified pagination is labeled as such",()=>{
 const p=units.filter(x=>x.bibliography_key==="met-2");
 assert.ok(p.every(x=>x.pages_verified===false));
 assert.ok(p.every(x=>x.chapter.includes("capítulo a conferir")));
 assert.ok(book.WHOLE_BOOK_CHAPTER_SOURCES["met-2"].source.includes("ainda não verificados"));
});
test("sections reference their actual source files when located",()=>{
 for(const key of ["met-0","met-1","radioperador","normam501","normam701","normam224"]){
  const ref=book.WHOLE_BOOK_CHAPTER_SOURCES[key];
  assert.ok(ref.documentUrl.startsWith("https://drive.google.com/file/d/"),key);
 }
});
