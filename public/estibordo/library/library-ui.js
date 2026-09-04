(() => {
  "use strict";

  const subject = document.body?.dataset?.subject || inferSubject();
  if (!subject) return;

  const API_SEARCH = "/api/library/search";
  const API_TOPICS = `/api/library/topics/${encodeURIComponent(subject)}`;

  function inferSubject() {
    const m = location.pathname.match(/\/simulado\/([^/?#]+)/);
    return m ? decodeURIComponent(m[1]) : "";
  }

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));

  const cleanCode = (s) => String(s || "").trim().replace(/\.$/, "");

  function pageLabel(r) {
    const a = r.page_start;
    const b = r.page_end;
    if (!a && !b) return "";
    if (a === b || !b) return `p. ${a}`;
    return `p. ${a}–${b}`;
  }

  function sourceLine(r) {
    const bits = [
      r.title,
      Array.isArray(r.authors) && r.authors.length ? r.authors.join(", ") : "",
      r.edition || "",
      r.publication_year || "",
      pageLabel(r),
      r.language ? String(r.language).toUpperCase() : ""
    ].filter(Boolean);
    return bits.join(" · ");
  }

  function snippet(text, max = 900) {
    text = String(text || "").trim();
    if (text.length <= max) return text;
    return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
  }

  async function search(q, limit = 12) {
    const url = new URL(API_SEARCH, location.origin);
    url.searchParams.set("q", q);
    url.searchParams.set("subject", subject);
    url.searchParams.set("limit", limit);
    const res = await fetch(url, { credentials:"same-origin", cache:"no-store" });
    if (!res.ok) {
      let msg = "Não foi possível pesquisar a biblioteca.";
      try { const j = await res.json(); msg = j.error || msg; } catch {}
      throw new Error(msg);
    }
    const data = await res.json();
    return data.results || [];
  }

  function resultsHtml(rows) {
    if (!rows.length) {
      return `<div class="est-library-empty">Nenhuma referência encontrada para esta pesquisa.</div>`;
    }
    return rows.map(r => `
      <article class="est-library-result">
        <div class="est-library-result-title">${esc(r.title || "Documento")}</div>
        <div class="est-library-meta">${esc(sourceLine(r))}</div>
        <div class="est-library-snippet">${esc(snippet(r.content))}</div>
      </article>
    `).join("");
  }

  function ensureOverlay() {
    let overlay = document.getElementById("estLibraryOverlay");
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.id = "estLibraryOverlay";
    overlay.className = "est-library-overlay";
    overlay.innerHTML = `
      <div class="est-library-modal" role="dialog" aria-modal="true" aria-labelledby="estLibraryModalTitle">
        <div class="est-library-modal-head">
          <div>
            <div class="est-library-kicker">BIBLIOTECA PESQUISÁVEL</div>
            <h3 id="estLibraryModalTitle">Referências</h3>
          </div>
          <button class="est-library-close" type="button" aria-label="Fechar">×</button>
        </div>
        <div class="est-library-modal-body">
          <div class="est-library-status">Pesquisando…</div>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector(".est-library-close").addEventListener("click", () => overlay.classList.remove("open"));
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("open"); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") overlay.classList.remove("open"); });
    return overlay;
  }

  async function openTopic(title, code = "") {
    const overlay = ensureOverlay();
    overlay.classList.add("open");
    overlay.querySelector("#estLibraryModalTitle").textContent =
      `${code ? code + " — " : ""}${title}`;
    const body = overlay.querySelector(".est-library-modal-body");
    body.innerHTML = `<div class="est-library-status">Pesquisando em toda a biblioteca…</div>`;
    try {
      const rows = await search(title, 10);
      body.innerHTML = resultsHtml(rows);
    } catch (e) {
      body.innerHTML = `<div class="est-library-empty">${esc(e.message)}</div>`;
    }
  }

  function attachExistingTopics() {
    const items = [...document.querySelectorAll(".program .item")];
    for (const item of items) {
      if (item.dataset.libraryBound === "1") continue;
      const titleEl = item.querySelector(".item-text");
      const codeEl = item.querySelector(".item-num");
      if (!titleEl) continue;
      item.dataset.libraryBound = "1";
      item.classList.add("est-topic-clickable");
      item.title = "Clique para consultar este assunto na bibliografia";
      item.addEventListener("click", e => {
        if (e.target.closest("input,button,a")) return;
        document.querySelectorAll(".est-topic-selected").forEach(x => x.classList.remove("est-topic-selected"));
        item.classList.add("est-topic-selected");
        openTopic(titleEl.textContent.trim(), cleanCode(codeEl?.textContent));
      });
    }
  }

  function installSearchPanel() {
    let original = document.getElementById("topicSearch");
    let host = original?.closest(".tools");

    if (!host) {
      const main = document.querySelector("main") || document.body;
      host = document.createElement("section");
      host.className = "est-library-shell";
      const hero = document.querySelector(".subject-hero");
      (hero?.parentNode || main).insertBefore(host, hero ? hero.nextSibling : main.firstChild);
    } else {
      host.classList.add("est-library-shell");
    }

    // Preserve existing expand/recolher controls, but create a dedicated global panel.
    const panel = document.createElement("section");
    panel.className = "est-library-shell";
    panel.id = "estLibrarySearch";
    panel.innerHTML = `
      <div class="est-library-head">
        <div class="est-library-kicker">BIBLIOTECA TÉCNICA · 144 DOCUMENTOS</div>
        <h2>Pesquisar na bibliografia</h2>
        <p>Busque termos, normas, equipamentos e conceitos em português ou inglês, com indicação de documento e página.</p>
      </div>
      <div class="est-library-searchbar">
        <input class="est-library-input" id="estLibraryInput"
          placeholder="Ex.: cavitação, squat, bank effect, NORMAM-311, radar, pilot transfer...">
        <button class="est-library-btn" id="estLibraryButton" type="button">Pesquisar</button>
      </div>
      <div class="est-library-status" id="estLibraryStatus">Digite pelo menos 2 caracteres.</div>
      <div class="est-library-results" id="estLibraryResults"></div>`;

    if (host.id === "estLibrarySearch") return;
    host.parentNode.insertBefore(panel, host);

    const input = panel.querySelector("#estLibraryInput");
    const button = panel.querySelector("#estLibraryButton");
    const status = panel.querySelector("#estLibraryStatus");
    const results = panel.querySelector("#estLibraryResults");

    // Se já existe a busca local antiga, sincroniza o texto digitado.
    if (original) {
      original.addEventListener("input", () => { input.value = original.value; });
    }

    async function run() {
      const q = input.value.trim();
      if (q.length < 2) {
        status.textContent = "Digite pelo menos 2 caracteres.";
        results.innerHTML = "";
        return;
      }
      button.disabled = true;
      status.textContent = "Pesquisando em toda a biblioteca…";
      try {
        const rows = await search(q, 20);
        status.textContent = `${rows.length} resultado(s) mais relevante(s).`;
        results.innerHTML = resultsHtml(rows);
      } catch (e) {
        status.textContent = e.message;
        results.innerHTML = "";
      } finally {
        button.disabled = false;
      }
    }

    button.addEventListener("click", run);
    input.addEventListener("keydown", e => { if (e.key === "Enter") run(); });
  }

  async function buildDynamicProgramIfMissing() {
    if (document.querySelector(".program .item")) return;

    const main = document.querySelector("main") || document.body;
    let mount = document.querySelector(".program");

    if (!mount) {
      const label = document.createElement("span");
      label.className = "source-label";
      label.textContent = "CONTEÚDO PROGRAMÁTICO";
      mount = document.createElement("section");
      mount.className = "program est-dynamic-program";
      main.append(label, mount);
    }

    mount.innerHTML = `<div class="est-library-status">Carregando conteúdo programático…</div>`;

    try {
      const res = await fetch(API_TOPICS, { credentials:"same-origin", cache:"no-store" });
      if (!res.ok) throw new Error("Não foi possível carregar os tópicos.");
      const data = await res.json();
      const topics = data.topics || [];

      mount.innerHTML = topics.map(t => `
        <div class="est-dynamic-topic item" data-library-bound="1">
          <button type="button" data-title="${esc(t.title_pt)}" data-code="${esc(t.topic_code)}">
            <span class="est-dynamic-code">${esc(String(t.topic_code).replace(/~\d+$/,""))}.</span>
            <span class="est-dynamic-title">${esc(t.title_pt)}</span>
          </button>
        </div>
      `).join("");

      mount.addEventListener("click", e => {
        const btn = e.target.closest("button[data-title]");
        if (!btn) return;
        openTopic(btn.dataset.title, String(btn.dataset.code || "").replace(/~\d+$/,""));
      });
    } catch (e) {
      mount.innerHTML = `<div class="est-library-empty">${esc(e.message)}</div>`;
    }
  }

  function disableOldLocalSearchConflict() {
    // A busca antiga continua útil para filtrar tópicos locais.
    // Não removemos seus listeners; a nova caixa faz a busca bibliográfica.
  }

  function init() {
    installSearchPanel();
    attachExistingTopics();
    buildDynamicProgramIfMissing();
    disableOldLocalSearchConflict();
    ensureOverlay();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once:true });
  } else {
    init();
  }
})();
