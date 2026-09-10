const SHELL_CACHE = "estibordo-shell-v2";
const RIPEAM_MODEL_CACHE = "estibordo-ripeam-models-v1";
const RIPEAM_RUNTIME_CACHE = "estibordo-ripeam-runtime-v1";
const RIPEAM_MAX_MODEL_ENTRIES = 12;
const SHELL_ASSETS = ["/offline.html", "/pwa-icon"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) =>
            (key.startsWith("estibordo-shell-") && key !== SHELL_CACHE) ||
            (key.startsWith("estibordo-ripeam-models-") && key !== RIPEAM_MODEL_CACHE) ||
            (key.startsWith("estibordo-ripeam-runtime-") && key !== RIPEAM_RUNTIME_CACHE)
          )
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

async function trimRipeamModelCache(cache) {
  try {
    const keys = await cache.keys();
    if (keys.length <= RIPEAM_MAX_MODEL_ENTRIES) return;
    // Cache Storage não expõe last-access nativamente. Mantemos o conjunto
    // pequeno e removemos entradas excedentes mais antigas na ordem do cache.
    const excess = keys.length - RIPEAM_MAX_MODEL_ENTRIES;
    await Promise.all(keys.slice(0, excess).map((key) => cache.delete(key)));
  } catch {}
}

async function cacheRuntimeDependency(request) {
  const cache = await caches.open(RIPEAM_RUNTIME_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === "opaque")) {
      try { await cache.put(request, response.clone()); } catch {}
    }
    return response;
  } catch (error) {
    const fallback = await cache.match(request);
    if (fallback) return fallback;
    throw error;
  }
}

async function cacheVersionedRipeamModel(request) {
  const cache = await caches.open(RIPEAM_MODEL_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (!response || !response.ok) return response;

  // Só guardamos modelos versionados por hash (?v=...). Isso evita que uma
  // substituição futura reutilize acidentalmente um GLB antigo com o mesmo nome.
  const url = new URL(request.url);
  if (!url.searchParams.get("v")) return response;

  try {
    // Remove versões antigas do mesmo GLB para não acumular dezenas de MB.
    const keys = await cache.keys();
    await Promise.all(
      keys
        .filter((key) => {
          const oldUrl = new URL(key.url);
          return oldUrl.pathname === url.pathname && oldUrl.href !== url.href;
        })
        .map((key) => cache.delete(key))
    );
    await cache.put(request, response.clone());
    await trimRipeamModelCache(cache);
  } catch {
    // Quota/armazenamento indisponível não deve impedir o viewer de funcionar.
  }

  return response;
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  // Decoders/runtime do Three.js usados pelo laboratório também são
  // cacheados, inclusive quando vêm de CDN. Não inclui APIs nem conteúdo do aluno.
  const runtimeHost = ["esm.sh","www.gstatic.com","cdn.jsdelivr.net"].includes(url.hostname);
  if (runtimeHost) {
    event.respondWith(cacheRuntimeDependency(request));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Nunca cachear APIs nem conteúdo potencialmente autenticado.
  if (url.pathname.startsWith("/api/")) return;

  // GLBs RIPEAM versionados: cache-first persistente.
  // 1ª abertura: baixa e guarda localmente.
  // Próximas: lê do Cache Storage sem baixar novamente.
  // Quando o hash muda, uma nova URL é baixada automaticamente.
  if (url.pathname.startsWith("/models/ripeam/") && url.pathname.toLowerCase().endsWith(".glb")) {
    event.respondWith(cacheVersionedRipeamModel(request));
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("/offline.html"))
    );
    return;
  }

  if (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/estibordo/") ||
    url.pathname === "/pwa-icon"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (!response || response.status !== 200 || response.type !== "basic") return response;
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
          return response;
        });
      })
    );
  }
});
