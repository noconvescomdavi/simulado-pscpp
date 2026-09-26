import fs from "node:fs/promises";import path from "node:path";
const source=process.env.ESTIBORDO_PRIVATE_SEED||path.resolve(".standalone-private/seed.json");const dest=path.resolve("public/standalone-private/seed.json");
const raw=JSON.parse(await fs.readFile(source,"utf8"));if(raw?.account_email!=="davi.lopes42@hotmail.com")throw new Error("O seed privado não pertence à conta standalone autorizada.");
const forbidden=/(password|hash|token|secret|mfa|oauth|database_url|session_cookie)/i;function scrub(v){if(Array.isArray(v))return v.map(scrub);if(v&&typeof v==="object")return Object.fromEntries(Object.entries(v).filter(([k])=>!forbidden.test(k)).map(([k,x])=>[k,scrub(x)]));return v}
const seed=scrub({...raw,schema_version:2,source:"neon-export:weathered-mud-33091087"});delete seed.account_email;await fs.mkdir(path.dirname(dest),{recursive:true});await fs.writeFile(dest,JSON.stringify(seed));console.log("Standalone seed prepared:",dest);
