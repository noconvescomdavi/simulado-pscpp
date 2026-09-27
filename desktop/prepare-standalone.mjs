import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const standalone = path.join(root, ".next", "standalone");
const runtime = path.join(root, "desktop", "runtime");

async function assertDirectory(dir) {
  const info = await stat(dir).catch(() => null);
  if (!info?.isDirectory()) throw new Error(`Diretório obrigatório ausente: ${dir}`);
}

await assertDirectory(standalone);
await assertDirectory(path.join(root, ".next", "static"));
await assertDirectory(path.join(root, "public"));

await rm(runtime, { recursive: true, force: true });
await mkdir(runtime, { recursive: true });
await cp(standalone, runtime, { recursive: true });
await mkdir(path.join(runtime, ".next"), { recursive: true });
await cp(path.join(root, ".next", "static"), path.join(runtime, ".next", "static"), { recursive: true });
await cp(path.join(root, "public"), path.join(runtime, "public"), { recursive: true });

await stat(path.join(runtime, "server.js"));

const forbidden = ["DATABASE_URL=", "postgresql://", "postgres://"];
async function scanTextFile(file) {
  const { readFile } = await import("node:fs/promises");
  const body = await readFile(file, "utf8").catch(() => "");
  for (const token of forbidden) {
    if (body.includes(token)) throw new Error(`Segredo/conexão PostgreSQL detectado no runtime desktop: ${file}`);
  }
}
await scanTextFile(path.join(runtime, ".env"));
await scanTextFile(path.join(runtime, ".env.local"));
console.log("Runtime desktop preparado em desktop/runtime.");
