import { requireEditorAuth, routeError } from "../../../../lib/site-editor/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GROUP_ORDER = ["Institucional","Conta e acesso","Área do aluno","Administração","Outras páginas / ocultas"];

function humanize(segment) {
  return String(segment || "")
    .replace(/^\[\.\.\.(.+)\]$/, "$1")
    .replace(/^\[(.+)\]$/, "$1")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function routeFromFile(file) {
  let parts = file.replace(/^app\//, "").replace(/\/page\.(js|jsx|ts|tsx)$/, "").split("/").filter(Boolean);
  parts = parts.filter((p) => !/^\(.+\)$/.test(p) && !p.startsWith("@"));
  if (parts.length === 1 && /^page\.(js|jsx|ts|tsx)$/.test(parts[0])) return "/";
  return "/" + parts.join("/");
}

function groupFor(route) {
  if (route === "/" || /^\/(plataforma|produtos|sobre-nos|sobre-a-praticagem|politica-|termos-de-uso|suporte)/.test(route)) return "Institucional";
  if (/^\/(login|cadastro|esqueci-minha-senha|redefinir-senha|verificar-email|mfa-admin|aceitar-termos|comprar|minhas-assinaturas|perfil)/.test(route)) return "Conta e acesso";
  if (/^\/admin(?:\/|$)/.test(route)) return "Administração";
  if (/^\/(area-do-aluno|conteudos|flashcards|simulado|plano-de-estudos|revisao-inteligente|analise-de-fraquezas|ranking|contramestre|treino-adaptativo|tutor-ia|study-content)/.test(route)) return "Área do aluno";
  return "Outras páginas / ocultas";
}

function isHidden(route) {
  return /^\/admin(?:\/|$)/.test(route)
    || /^\/(login|cadastro|esqueci-minha-senha|redefinir-senha|verificar-email|mfa-admin|aceitar-termos|teste-gratis-excedido)/.test(route)
    || /\[.+\]/.test(route)
    || groupFor(route) === "Outras páginas / ocultas";
}

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
      if (item.type !== "blob" || !/^app\/(?:.*\/)?page\.(js|jsx|ts|tsx)$/.test(item.path) || item.path.startsWith("app/api/")) continue;
      const route = routeFromFile(item.path);
      if (!route || route.includes("/admin/editor") || seen.has(route)) continue;
      seen.add(route);
      const last = route === "/" ? "Página inicial" : humanize(route.split("/").filter(Boolean).at(-1));
      pages.push({ route, label: last, hidden: isHidden(route), dynamic: /\[.+\]/.test(route) });
    }
    pages.push({ route: "/__404", label: "Página 404", hidden: true, system: true });
    pages.sort((a,b) => a.route.localeCompare(b.route, "pt-BR"));
    const groups = GROUP_ORDER.map((group) => ({
      group,
      pages: pages.filter((p) => groupFor(p.route) === group || (p.system && group === "Outras páginas / ocultas"))
        .map((p) => [p.route, p.label, { hidden: p.hidden, dynamic: p.dynamic, system: p.system }])
    })).filter((g) => g.pages.length);
    return Response.json({ ok: true, groups, total: pages.length });
  } catch (error) {
    return routeError(error);
  }
}
