"use client";
function api(){return typeof window!=="undefined"?window.EstibordoLocal:null}
export function hasAndroidLocalStore(){return Boolean(api())}
export async function androidGet(store,key){const raw=api()?.get(store,String(key));if(raw==null||raw==="")return null;try{return JSON.parse(raw)}catch{return raw}}
export async function androidPut(store,key,value){api()?.put(store,String(key),JSON.stringify(value));return value}
export async function androidAll(store){const raw=api()?.all(store);if(!raw)return[];try{return JSON.parse(raw)||[]}catch{return[]}}
export async function androidDelete(store,key){api()?.remove(store,String(key))}
