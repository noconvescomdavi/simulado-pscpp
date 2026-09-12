import fs from "node:fs";
import assert from "node:assert/strict";

const sw=fs.readFileSync("public/sw.js","utf8");
const sync=fs.readFileSync("app/api/offline/sync/route.js","utf8");
const store=fs.readFileSync("lib/offline-store.js","utf8");
const logout=fs.readFileSync("app/logout/LogoutCleanup.js","utf8");

assert.doesNotMatch(sw,/cache\.put\(request,response\.clone\(\)\)/i,"service worker must not cache arbitrary navigations");
assert.match(sw,/SET_PRIVATE_SCOPE/,"service worker must scope private cache");
assert.match(sw,/PURGE_PRIVATE_DATA/,"service worker must purge private cache");
assert.doesNotMatch(sync,/create table if not exists offline_sync_events/i,"sync route must not execute DDL");
assert.match(sync,/MAX_EVENTS\s*=\s*50/,"sync API batch size must be capped at 50");
assert.match(store,/setOfflineUserScope/,"offline DB must bind to authenticated user");
assert.match(store,/purgeOfflinePrivateData/,"offline DB must provide purge");
assert.match(store,/offset\+=50/,"offline queue must sync in bounded batches");
assert.match(logout,/purgeOfflinePrivateData/,"logout must purge private offline data");
console.log("Offline architecture invariants: OK");
