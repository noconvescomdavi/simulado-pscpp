import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";

const root=process.cwd();
const dir=path.join(root,"db/migrations");
const manifest=JSON.parse(fs.readFileSync(path.join(dir,"manifest.json"),"utf8"));
assert.equal(manifest.version,1,"manifest version must be 1");
assert.ok(Array.isArray(manifest.migrations)&&manifest.migrations.length>0,"manifest must list migrations");

const ids=new Set(),orders=new Set(),paths=new Set();
for(const item of manifest.migrations){
  assert.ok(item.id&&typeof item.id==="string","migration id required");
  assert.ok(Number.isInteger(item.order)&&item.order>0,"migration order must be positive integer");
  assert.ok(item.path&&typeof item.path==="string","migration path required");
  assert.ok(!ids.has(item.id),`duplicate migration id: ${item.id}`);
  assert.ok(!orders.has(item.order),`duplicate migration order: ${item.order}`);
  assert.ok(!paths.has(item.path),`duplicate migration path: ${item.path}`);
  ids.add(item.id);orders.add(item.order);paths.add(item.path);
  assert.ok(fs.existsSync(path.join(root,item.path)),`missing migration file: ${item.path}`);
}
const sorted=[...manifest.migrations].sort((a,b)=>a.order-b.order);
for(let i=0;i<sorted.length;i++)assert.equal(sorted[i].order,i+1,"migration order must be contiguous");

const sqlFiles=fs.readdirSync(dir).filter(x=>x.endsWith(".sql")).map(x=>`db/migrations/${x}`).sort();
assert.deepEqual([...paths].sort(),sqlFiles,"every SQL migration must appear exactly once in manifest");
console.log(`Migration manifest: OK (${sqlFiles.length} migrations)`);
