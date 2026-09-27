"use client";
import {STANDALONE_STORES} from "./schema";import {standaloneAll,standaloneGet,standalonePut} from "./store";
function uuid(){return globalThis.crypto?.randomUUID?.()||String(Date.now())+"-"+Math.random().toString(16).slice(2)}
export async function appendStandaloneChange(type,payload,{id=null}={}){const event={id:id||uuid(),type,payload,created_at:new Date().toISOString(),sync_state:"pending",schema_version:1};await standalonePut(STANDALONE_STORES.journal,event);return event}
export async function listStandaloneChanges({state="pending"}={}){const rows=await standaloneAll(STANDALONE_STORES.journal);return rows.filter(x=>!state||x.sync_state===state).sort((a,b)=>String(a.created_at).localeCompare(String(b.created_at)))}
export async function markStandaloneChangesExported(ids,exportId){for(const id of ids){const row=await standaloneGet(STANDALONE_STORES.journal,id);if(row)await standalonePut(STANDALONE_STORES.journal,{...row,sync_state:"exported",export_id:exportId,exported_at:new Date().toISOString()})}}
