"use client";
import {STANDALONE_SCHEMA_VERSION,STANDALONE_STORES} from "./schema";
const DB_NAME="estibordo-standalone";
function request(req){return new Promise((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
function done(tx){return new Promise((resolve,reject)=>{tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error||new Error("Transação abortada"))})}
export function openStandaloneDb(){return new Promise((resolve,reject)=>{if(typeof indexedDB==="undefined"){reject(new Error("IndexedDB indisponível"));return}const r=indexedDB.open(DB_NAME,STANDALONE_SCHEMA_VERSION);r.onupgradeneeded=()=>{const db=r.result;for(const name of Object.values(STANDALONE_STORES))if(!db.objectStoreNames.contains(name))db.createObjectStore(name,{keyPath:"id"})};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
export async function standalonePut(store,value){const db=await openStandaloneDb();const tx=db.transaction(store,"readwrite");tx.objectStore(store).put(value);await done(tx);db.close();return value}
export async function standaloneGet(store,id){const db=await openStandaloneDb();const tx=db.transaction(store,"readonly");const value=await request(tx.objectStore(store).get(id));await done(tx);db.close();return value||null}
export async function standaloneAll(store){const db=await openStandaloneDb();const tx=db.transaction(store,"readonly");const value=await request(tx.objectStore(store).getAll());await done(tx);db.close();return value||[]}
export async function standaloneReplace(store,rows=[]){const db=await openStandaloneDb();const tx=db.transaction(store,"readwrite");const target=tx.objectStore(store);target.clear();for(const row of rows)target.put(row);await done(tx);db.close()}
