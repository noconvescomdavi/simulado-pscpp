import { requireEditorAuth, routeError } from "../../../../lib/site-editor/server";
import design from "../../../../data/site/editor-design.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROUP_ORDER = ["Institucional","Conta e acesso","Área do aluno","Páginas criadas no editor","Administração","Sistema / especiais","Outras páginas / ocultas"];

function humanize(segment) {
  return String(segment || "")
    .replace(/^\[\.\.\.(.+)\]$/, "$1")
    .replace(/^\[\[\.\.\.(.+)\]\]$/, "$1")
    .replace(/^\[(.+)\]$/, "$1")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function cleanSegments(path) {
  return path.split("/").filter(Boolean).filter((p) => !/^\(.+\)$/.test(p) && !p.startsWith("@"));
}

function routeFromPageFile(file) {
  const path=file.replace(/^app\//, "").replace(/\/page\.(js|jsx|ts|tsx)$/, "");
  const parts=cleanSegments(path);
  return parts.length?"/"+parts.join("/"):"/";
}

function routeFromNotFoundFile(file) {
  const path=file.replace(/^app\//, "").replace(/\/?not-found\.(js|jsx|ts|tsx)$/, "");
  const parts=cleanSegments(path);
  return parts.length?"/"+parts.join("/")+"/__not-found":"/__404";
}

function groupFor(route,systemType) {
  if(systemType)return "Sistema / especiais";
  if (route === "/" || /^\/(plataforma|produtos|sobre-nos|sobre-a-praticagem|politica-|termos-de-uso|suporte)/.test(route)) return "Institucional";
  if (/^\/(login|cadastro|esqueci-minha-senha|redefinir-senha|verificar-email|mfa-admin|aceitar-termos|comprar|minhas-assinaturas|perfil)/.test(route)) return "Conta e acesso";
  if (/^\/paginas\//.test(route)) return "Páginas criadas no editor";
  if (/^\/admin(?:\/|$)/.test(route)) return "Administração";
  if (/^\/(area-do-aluno|conteudos|flashcards|simulado|plano-de-estudos|revisao-inteligente|analise-de-fraquezas|ranking|contramestre|treino-adaptativo|tutor-ia|study-content)/.test(route)) return "Área do aluno";
  return "Outras páginas / ocultas";
}

function isHidden(route,systemType) {
  return Boolean(systemType)
    || /^\/admin(?:\/|$)/.test(route)
    || /^\/(login|cadastro|esqueci-minha-senha|redefinir-senha|verificar-email|mfa-admin|aceitar-termos|teste-gratis-excedido)/.test(route)
    || /\[.+\]/.test(route)
    || groupFor(route) === "Outras páginas / ocultas";
}

function dynamicParams(route){return [...String(route).matchAll(/\[([^\]]+)\]/g)].map(m=>m[1].replace(/^\.\.\./,""))}

async function repositoryTree() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";
  if (!token || !owner || !repo) throw new Error("Integração GitHub do editor não configurada.");
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    { headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token}`, "X-GitHub-Api-Version": "2022-11-28" }, cache: "no-store" }
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || "Não foi possível ler a árvore do site.");
  return Array.isArray(data.tree) ? data.tree : [];
}

export async function GET() {
  try {
    await requireEditorAuth();
    const tree = await repositoryTree();
    const seen = new Set();
    const pages = [];
    for (const item of tree) {
      if (item.type !== "blob" || item.path.startsWith("app/api/")) continue;
      let route="",systemType="";
      if(/^app\/(?:.*\/)?page\.(js|jsx|ts|tsx)$/.test(item.path)) route=routeFromPageFile(item.path);
      else if(/^app\/(?:.*\/)?not-found\.(js|jsx|ts|tsx)$/.test(item.path)){route=routeFromNotFoundFile(item.path);systemType="not-found"}
      else continue;
      if (!route || route.includes("/admin/editor") || seen.has(route)) continue;
      seen.add(route);
      const params=dynamicParams(route),last=systemType?"404 / Not Found":route === "/" ? "Página inicial" : humanize(route.split("/").filter(Boolean).at(-1));
      pages.push({ route, label: last, hidden: isHidden(route,systemType), dynamic: params.length>0, params, sourcePath:item.path, systemType });
    }
    for(const [route,config] of Object.entries(design?.pages||{})){
      if(!route.startsWith("/paginas/")||seen.has(route))continue;seen.add(route);pages.push({route,label:config?.settings?.seoTitle||humanize(route.split("/").pop()),hidden:false,managed:true,sourcePath:"editor-design.json"})
    }
    if(!seen.has("/__404"))pages.push({ route: "/__404", label: "Página 404 global", hidden: true, systemType:"not-found", system: true, sourcePath:"app/not-found.*" });
    pages.sort((a,b) => a.route.localeCompare(b.route, "pt-BR"));
    const groups = GROUP_ORDER.map((group) => ({
      group,
      pages: pages.filter((p) => groupFor(p.route,p.systemType) === group)
        .map((p) => [p.route, p.label, { hidden: p.hidden, dynamic: p.dynamic, params:p.params, system: p.system, systemType:p.systemType, managed: p.managed, sourcePath:p.sourcePath }])
    })).filter((g) => g.pages.length);
    return Response.json({ ok: true, groups, total: pages.length, dynamic:pages.filter(p=>p.dynamic).length, hidden:pages.filter(p=>p.hidden).length, generatedAt:new Date().toISOString() });
  } catch (error) {
    return routeError(error);
  }
}
