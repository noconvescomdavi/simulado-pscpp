import fs from "node:fs";
const client=fs.readFileSync("app/simulado/[subject]/Client.js","utf8");
const store=fs.readFileSync("lib/offline-store.js","utf8");
const main=fs.readFileSync("android/app/src/main/java/br/com/estibordo/app/MainActivity.java","utf8");
const server=fs.readFileSync("android/app/src/main/java/br/com/estibordo/app/LocalHttpServer.java","utf8");
const layout=fs.readFileSync("app/layout.js","utf8");
const checks=[
 [client.includes("standaloneEnabled()||!navigator.onLine"),"exam load/start must short-circuit standalone"],
 [client.includes("standaloneEnabled() || !navigator.onLine || state?.offline"),"exam answer/pause/finish must prefer local runtime"],
 [client.includes("saveLocalStudyTask"),"exam completion must persist study plan locally"],
 [store.includes("if(standaloneEnabled())return {ok:true,standalone:true"),"standalone sync must never call remote API"],
 [main.includes("shouldInterceptRequest")&&main.includes("LOCAL_HOST.equalsIgnoreCase(uri.getHost())"),"WebView must block non-loopback subresources"],
 [server.includes('InetAddress.getByName("127.0.0.1")'),"HTTP server must bind loopback only"],
 [server.includes('path.contains("..")'),"HTTP server must reject traversal"],
 [layout.includes("!standalone&&")&&layout.includes("WebVitalsReporter"),"standalone root must exclude online/legacy runtimes"]
];
const bad=checks.filter(([ok])=>!ok).map(([,m])=>m);if(bad.length){console.error("Android exam runtime audit failed:\n"+bad.join("\n"));process.exit(1)}
console.log("Android exam runtime audit passed:",checks.length,"gates");
