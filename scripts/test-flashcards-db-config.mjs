import assert from "node:assert/strict";
import {buildFlashcardsConnectionString} from "../lib/flashcards-db.js";

const originalMain=process.env.DATABASE_URL;
const originalFlashcards=process.env.FLASHCARDS_DATABASE_URL;
try {
  process.env.DATABASE_URL="postgres://user:password@new-neon.example/neondb?sslmode=require";
  process.env.FLASHCARDS_DATABASE_URL="postgres://user:password@old-neon.example/flashcards?sslmode=require";
  let target=new URL(buildFlashcardsConnectionString());
  assert.equal(target.hostname,"new-neon.example");
  assert.equal(target.pathname,"/flashcards");
  assert.equal(target.searchParams.get("sslmode"),"verify-full");

  process.env.FLASHCARDS_DATABASE_URL="postgres://user:password@new-neon.example/neondb?sslmode=require";
  target=new URL(buildFlashcardsConnectionString());
  assert.equal(target.pathname,"/flashcards");

  process.env.FLASHCARDS_DATABASE_URL="postgres://user:password@new-neon.example/flashcards?sslmode=require";
  target=new URL(buildFlashcardsConnectionString());
  assert.equal(target.pathname,"/flashcards");
  assert.equal(target.searchParams.get("sslmode"),"verify-full");
  console.log("Flashcards database routing: OK");
} finally {
  if(originalMain===undefined)delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL=originalMain;
  if(originalFlashcards===undefined)delete process.env.FLASHCARDS_DATABASE_URL;
  else process.env.FLASHCARDS_DATABASE_URL=originalFlashcards;
}
