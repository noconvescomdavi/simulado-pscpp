"use client";

const listeners=new Map();
const commands=new Map();
const plugins=new Map();
const adapters=new Map();

function emit(name,payload){for(const fn of listeners.get(name)||[]){try{fn(payload)}catch{}}}
function on(name,fn){if(!listeners.has(name))listeners.set(name,new Set());listeners.get(name).add(fn);return()=>listeners.get(name)?.delete(fn)}
function registerCommand(command){if(!command?.id||typeof command.run!=="function")return()=>{};commands.set(command.id,command);emit("commands:changed",Array.from(commands.values()));return()=>commands.delete(command.id)}
function registerPlugin(plugin){if(!plugin?.id)return()=>{};plugins.set(plugin.id,plugin);for(const command of plugin.commands||[])registerCommand(command);for(const adapter of plugin.adapters||[])if(adapter?.id)adapters.set(adapter.id,adapter);emit("plugins:changed",Array.from(plugins.values()));return()=>plugins.delete(plugin.id)}
function matchAdapter(node){for(const adapter of adapters.values()){try{if(adapter.match?.(node))return adapter}catch{}}return null}
function transaction(label,before,after,meta={}){const item={id:crypto.randomUUID?.()||Math.random().toString(36).slice(2),label,at:Date.now(),before,after,meta};emit("transaction",item);return item}

export const EditorSDK={on,emit,registerCommand,registerPlugin,matchAdapter,transaction,get commands(){return Array.from(commands.values())},get plugins(){return Array.from(plugins.values())},get adapters(){return Array.from(adapters.values())}};

if(typeof window!=="undefined")window.EstibordoEditorSDK=EditorSDK;

registerPlugin({id:"core.web",name:"Web Core",version:"1.0.0",adapters:[
  {id:"image",match:n=>n?.tagName==="IMG"},{id:"text",match:n=>/^(H1|H2|H3|H4|P|SPAN|LABEL|A|BUTTON)$/.test(n?.tagName||"")},{id:"media",match:n=>/^(VIDEO|AUDIO|CANVAS)$/.test(n?.tagName||"")},{id:"form",match:n=>/^(INPUT|TEXTAREA|SELECT|FORM)$/.test(n?.tagName||"")}
]});
registerPlugin({id:"core.ripeam",name:"RIPEAM / WebGL",version:"1.0.0",adapters:[
  {id:"ripeam-viewer",match:n=>Boolean(n?.closest?.('[class*="ripeam" i],[data-ripeam],[class*="viewer" i]')&&n?.closest?.("canvas"))},
  {id:"webgl",match:n=>n?.tagName==="CANVAS"}
]});
registerPlugin({id:"core.academic",name:"Academic Components",version:"1.0.0",adapters:[
  {id:"flashcard",match:n=>Boolean(n?.closest?.('[class*="flashcard" i],[data-flashcard]'))},
  {id:"question",match:n=>Boolean(n?.closest?.('[class*="question" i],[data-question]'))}
]});

export default EditorSDK;