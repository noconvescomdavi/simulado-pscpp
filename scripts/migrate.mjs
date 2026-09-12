import fs from "node:fs";
import crypto from "node:crypto";
import pg from "pg";
const {Client}=pg;

const url=process.env.DATABASE_URL;
if(!url)throw new Error("DATABASE_URL ausente.");
const manifest=JSON.parse(fs.readFileSync("db/migrations/manifest.json","utf8"));
const client=new Client({connectionString:url,ssl:process.env.NODE_ENV==="production"?{rejectUnauthorized:true}:undefined});
await client.connect();
try{
  await client.query(`create table if not exists schema_migrations(
    migration_id text primary key,
    migration_order int not null unique,
    path text not null,
    checksum_sha256 text not null,
    applied_at timestamptz not null default now()
  )`);
  for(const item of [...manifest.migrations].sort((a,b)=>a.order-b.order)){
    const raw=fs.readFileSync(item.path,"utf8");
    const checksum=crypto.createHash("sha256").update(raw).digest("hex");
    const existing=await client.query("select checksum_sha256,path from schema_migrations where migration_id=$1",[item.id]);
    if(existing.rowCount){
      if(existing.rows[0].checksum_sha256!==checksum)throw new Error(`Migration alterada após aplicação: ${item.id} (${item.path})`);
      continue;
    }
    const sql=raw.replace(/^\s*BEGIN\s*;/i,"").replace(/COMMIT\s*;\s*$/i,"");
    await client.query("BEGIN");
    try{
      await client.query(sql);
      await client.query("insert into schema_migrations(migration_id,migration_order,path,checksum_sha256) values($1,$2,$3,$4)",[item.id,item.order,item.path,checksum]);
      await client.query("COMMIT");
      console.log("Applied",item.id,item.path);
    }catch(error){
      await client.query("ROLLBACK");
      throw error;
    }
  }
}finally{await client.end()}
