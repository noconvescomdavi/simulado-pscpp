'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const clone = (value) => JSON.parse(JSON.stringify(value));
const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const pathKey = (parts) => parts.map((p) => String(p).replaceAll('~', '~0').replaceAll('/', '~1')).join('/');

const STYLE_DEFAULTS = {
  fontSize: '', fontWeight: '', fontFamily: '', textAlign: '', letterSpacing: '', lineHeight: '',
  color: '', backgroundColor: '', backgroundImage: '', backgroundSize: '', backgroundPosition: '', backgroundRepeat: '',
  width: '', height: '', minWidth: '', maxWidth: '', minHeight: '', maxHeight: '',
  paddingTop: '', paddingRight: '', paddingBottom: '', paddingLeft: '',
  marginTop: '', marginRight: '', marginBottom: '', marginLeft: '',
  borderRadius: '', borderWidth: '', borderStyle: '', borderColor: '',
  display: '', flexDirection: '', justifyContent: '', alignItems: '', alignContent: '', flexWrap: '',
  gap: '', rowGap: '', columnGap: '', gridTemplateColumns: '', gridTemplateRows: '', gridAutoFlow: '', order: '',
  position: '', top: '', right: '', bottom: '', left: '', zIndex: '', opacity: '', overflow: '',
  objectFit: '', objectPosition: ''
};

function walk(value, parts = [], out = []) {
  if (value === null || value === undefined) return out;
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    out.push({ parts, path: pathKey(parts), value });
    return out;
  }
  if (Array.isArray(value)) value.forEach((item, index) => walk(item, [...parts, index], out));
  else if (typeof value === 'object') Object.entries(value).forEach(([key, item]) => walk(item, [...parts, key], out));
  return out;
}

function getAt(root, parts) {
  return parts.reduce((acc, key) => acc?.[key], root);
}

function setAt(root, parts, value) {
  const next = clone(root);
  let cursor = next;
  for (let i = 0; i < parts.length - 1; i++) cursor = cursor[parts[i]];
  cursor[parts.at(-1)] = value;
  return next;
}

function labelFor(parts) {
  return parts.map(String).join(' › ');
}

function findCandidates(json, element) {
  if (!json) return [];
  const leaves = walk(json);
  const attrs = [
    element?.getAttribute?.('src'),
    element?.getAttribute?.('href'),
    element?.getAttribute?.('alt'),
    element?.getAttribute?.('title'),
  ].map(normalize).filter(Boolean);
  const own = normalize(element?.innerText || element?.textContent || '');
  if (own) attrs.unshift(own);

  const scored = [];
  for (const leaf of leaves) {
    if (typeof leaf.value !== 'string') continue;
    const value = normalize(leaf.value);
    if (!value || value.length < 2) continue;
    let score = 0;
    for (const target of attrs) {
      if (target === value) score = Math.max(score, 100);
      else if (target.includes(value) && value.length >= 4) score = Math.max(score, 70 + Math.min(value.length, 20));
      else if (value.includes(target) && target.length >= 4) score = Math.max(score, 55 + Math.min(target.length, 20));
    }
    if (score) scored.push({ ...leaf, score });
  }
  return scored.sort((a, b) => b.score - a.score).slice(0, 12);
}

function cssEscape(value) {
  if (typeof CSS !== 'undefined' && CSS.escape) return CSS.escape(value);
  return String(value).replace(/([^a-zA-Z0-9_-])/g, '\\$1');
}

function stableSelector(element) {
  if (!element || element.nodeType !== 1) return '';
  if (element.id) return `#${cssEscape(element.id)}`;

  const parts = [];
  let node = element;
  while (node && node.nodeType === 1 && node.tagName.toLowerCase() !== 'html') {
    const tag = node.tagName.toLowerCase();
    if (tag === 'body') { parts.unshift('body'); break; }

    const classes = Array.from(node.classList || [])
      .filter((c) => !c.startsWith('ev-') && !c.startsWith('is-') && !c.startsWith('data-estibordo'))
      .slice(0, 2);
    let piece = tag + classes.map((c) => `.${cssEscape(c)}`).join('');

    const parent = node.parentElement;
    if (parent) {
      const same = Array.from(parent.children).filter((child) => child.tagName === node.tagName);
      if (same.length > 1) piece += `:nth-of-type(${same.indexOf(node) + 1})`;
    }

    parts.unshift(piece);
    if (node.id) break;
    node = parent;
    if (parts.length >= 7) break;
  }
  return parts.join(' > ');
}

function styleSnapshot(element) {
  if (!element) return clone(STYLE_DEFAULTS);
  const c = element.ownerDocument.defaultView.getComputedStyle(element);
  const px = (key) => c[key] || '';
  return {
    ...clone(STYLE_DEFAULTS),
    fontSize: px('fontSize'), fontWeight: px('fontWeight'), fontFamily: px('fontFamily'),
    textAlign: px('textAlign'), letterSpacing: px('letterSpacing'), lineHeight: px('lineHeight'),
    color: rgbToHex(c.color), backgroundColor: rgbToHex(c.backgroundColor),
    backgroundImage: c.backgroundImage === 'none' ? '' : c.backgroundImage,
    backgroundSize: c.backgroundSize, backgroundPosition: c.backgroundPosition, backgroundRepeat: c.backgroundRepeat,
    width: px('width'), height: px('height'), minWidth: px('minWidth'), maxWidth: c.maxWidth === 'none' ? '' : c.maxWidth,
    minHeight: px('minHeight'), maxHeight: c.maxHeight === 'none' ? '' : c.maxHeight,
    paddingTop: px('paddingTop'), paddingRight: px('paddingRight'), paddingBottom: px('paddingBottom'), paddingLeft: px('paddingLeft'),
    marginTop: px('marginTop'), marginRight: px('marginRight'), marginBottom: px('marginBottom'), marginLeft: px('marginLeft'),
    borderRadius: px('borderRadius'), borderWidth: px('borderWidth'), borderStyle: c.borderStyle, borderColor: rgbToHex(c.borderColor),
    display: c.display, flexDirection: c.flexDirection, justifyContent: c.justifyContent, alignItems: c.alignItems,
    alignContent: c.alignContent, flexWrap: c.flexWrap, gap: c.gap, rowGap: c.rowGap, columnGap: c.columnGap,
    gridTemplateColumns: c.gridTemplateColumns === 'none' ? '' : c.gridTemplateColumns,
    gridTemplateRows: c.gridTemplateRows === 'none' ? '' : c.gridTemplateRows,
    gridAutoFlow: c.gridAutoFlow, order: c.order, position: c.position,
    top: c.top === 'auto' ? '' : c.top, right: c.right === 'auto' ? '' : c.right,
    bottom: c.bottom === 'auto' ? '' : c.bottom, left: c.left === 'auto' ? '' : c.left,
    zIndex: c.zIndex === 'auto' ? '' : c.zIndex, opacity: c.opacity, overflow: c.overflow,
    objectFit: c.objectFit, objectPosition: c.objectPosition
  };
}

function rgbToHex(value) {
  const v = String(value || '').trim();
  const m = v.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
  if (!m) return v === 'rgba(0, 0, 0, 0)' ? '' : v;
  return '#' + [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('');
}

function compactStyle(style) {
  const out = {};
  for (const [key, value] of Object.entries(style || {})) {
    if (value !== '' && value !== null && value !== undefined) out[key] = String(value);
  }
  return out;
}

function JsonTree({ value, parts = [], selectedPath, onSelect }) {
  if (value === null || typeof value !== 'object') {
    const path = pathKey(parts);
    return (
      <button className={`ev-leaf ${selectedPath === path ? 'is-selected' : ''}`} onClick={() => onSelect(parts)} type="button">
        <span>{String(parts.at(-1) ?? 'valor')}</span>
        <b>{String(value)}</b>
      </button>
    );
  }
  return (
    <div className="ev-tree-group">
      {parts.length > 0 && <div className="ev-tree-title">{String(parts.at(-1))}</div>}
      {Object.entries(value).map(([key, item]) => (
        <JsonTree key={key} value={item} parts={[...parts, Array.isArray(value) ? Number(key) : key]} selectedPath={selectedPath} onSelect={onSelect} />
      ))}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', options, placeholder }) {
  if (options) {
    return <label className="ev-field"><span>{label}</span><select value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">— manter original —</option>{options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select></label>;
  }
  return <label className="ev-field"><span>{label}</span><input type={type} value={value || ''} placeholder={placeholder || ''} onChange={(e) => onChange(e.target.value)} /></label>;
}

function Section({ title, children, open = false }) {
  return <details className="ev-section" open={open}><summary>{title}</summary><div className="ev-section-body">{children}</div></details>;
}

export default function EditorClient() {
  const [auth, setAuth] = useState('checking');
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('github');
  const [fileId, setFileId] = useState('');
  const [json, setJson] = useState(null);
  const [original, setOriginal] = useState(null);
  const [sha, setSha] = useState('');
  const [selected, setSelected] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  const [design, setDesign] = useState(null);
  const [designOriginal, setDesignOriginal] = useState(null);
  const [designSha, setDesignSha] = useState('');
  const [target, setTarget] = useState(null);
  const [scope, setScope] = useState('page');
  const [styleDraft, setStyleDraft] = useState(clone(STYLE_DEFAULTS));
  const [styleOverrides, setStyleOverrides] = useState({});
  const [attrsDraft, setAttrsDraft] = useState({});
  const [attrsOverrides, setAttrsOverrides] = useState({});
  const [hiddenDraft, setHiddenDraft] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mediaMode, setMediaMode] = useState('auto');

  const iframeRef = useRef(null);
  const cleanupRef = useRef(null);

  const activeFile = files.find((file) => file.id === fileId);
  const previewPath = activeFile?.previewPath || '/';
  const selectedPath = pathKey(selected);
  const selectedValue = json && selected.length ? getAt(json, selected) : null;
  const contentDirty = useMemo(() => json && original && JSON.stringify(json) !== JSON.stringify(original), [json, original]);
  const designDirty = useMemo(() => design && designOriginal && JSON.stringify(design) !== JSON.stringify(designOriginal), [design, designOriginal]);
  const dirty = Boolean(contentDirty || designDirty);

  async function loadFiles() {
    const res = await fetch('/api/site-editor/files', { cache: 'no-store' });
    if (res.status === 401) { setAuth('login'); return; }
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setAuth('ready');
    setFiles(data.files);
    setMode(data.mode || 'github');
    if (!fileId && data.files[0]) setFileId(data.files[0].id);
  }

  async function loadDesign() {
    const res = await fetch('/api/site-editor/design', { cache: 'no-store' });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setDesign(data.content);
    setDesignOriginal(clone(data.content));
    setDesignSha(data.sha || '');
  }

  useEffect(() => {
    Promise.all([loadFiles(), loadDesign()]).catch(() => setAuth('login'));
  }, []);

  useEffect(() => {
    if (!fileId || auth !== 'ready') return;
    setStatus(mode === 'local' ? 'Carregando JSON local…' : 'Carregando JSON do GitHub…');
    fetch(`/api/site-editor/file?id=${encodeURIComponent(fileId)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) throw new Error(data.error);
        setJson(data.content); setOriginal(clone(data.content)); setSha(data.sha);
        setSelected([]); setCandidates([]); setTarget(null); setStatus('');
      })
      .catch((e) => setStatus(e.message));
  }, [fileId, auth, mode]);

  function designRecord(whichScope = scope) {
    if (!design || !target?.selector) return null;
    if (whichScope === 'global') return design.global?.elements?.[target.selector] || null;
    return design.pages?.[previewPath]?.elements?.[target.selector] || null;
  }

  function selectTarget(element) {
    const selector = stableSelector(element);
    if (!selector) return;
    const computed = styleSnapshot(element);
    const attrs = {
      text: element.children.length === 0 ? (element.textContent || '') : undefined,
      href: element.getAttribute?.('href') || undefined,
      src: element.getAttribute?.('src') || undefined,
      alt: element.getAttribute?.('alt') || undefined,
      title: element.getAttribute?.('title') || undefined,
    };
    Object.keys(attrs).forEach((k) => attrs[k] === undefined && delete attrs[k]);

    const nextTarget = {
      selector,
      tag: element.tagName.toLowerCase(),
      text: normalize(element.innerText || element.textContent || ''),
      className: element.className || '',
      childElementCount: element.children.length
    };
    setTarget(nextTarget);
    setCandidates(findCandidates(json, element));
    const found = findCandidates(json, element);
    if (found.length === 1 || found[0]?.score >= 100) setSelected(found[0].parts);

    const existing = scope === 'global'
      ? design?.global?.elements?.[selector]
      : design?.pages?.[previewPath]?.elements?.[selector];
    const existingStyle = { ...(existing?.style || {}) };
    const existingAttrs = { ...(existing?.attrs || {}) };
    setStyleDraft({ ...computed, ...existingStyle });
    setStyleOverrides(existingStyle);
    setAttrsDraft({ ...attrs, ...existingAttrs });
    setAttrsOverrides(existingAttrs);
    setHiddenDraft(Boolean(existing?.hidden));
  }

  function wireIframe() {
    cleanupRef.current?.();
    const frame = iframeRef.current;
    try {
      const doc = frame?.contentDocument;
      if (!doc) return;
      const style = doc.createElement('style');
      style.dataset.estibordoEditorStyle = 'true';
      style.textContent = `
        [data-estibordo-editor-hover]{outline:2px solid #C8102E!important;outline-offset:2px!important;cursor:crosshair!important}
        [data-estibordo-editor-selected]{outline:3px solid #0b63ce!important;outline-offset:3px!important}
      `;
      doc.head.appendChild(style);

      let lastHover;
      let lastSelected;
      const over = (event) => {
        if (lastHover) lastHover.removeAttribute('data-estibordo-editor-hover');
        lastHover = event.target;
        lastHover?.setAttribute?.('data-estibordo-editor-hover', '');
      };
      const click = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (lastSelected) lastSelected.removeAttribute('data-estibordo-editor-selected');
        lastSelected = event.target;
        lastSelected?.setAttribute?.('data-estibordo-editor-selected', '');
        selectTarget(event.target);
      };
      doc.addEventListener('mouseover', over, true);
      doc.addEventListener('click', click, true);
      cleanupRef.current = () => {
        doc.removeEventListener('mouseover', over, true);
        doc.removeEventListener('click', click, true);
        style.remove();
      };
    } catch {
      setStatus('A prévia precisa estar no mesmo domínio do editor.');
    }
  }

  useEffect(() => () => cleanupRef.current?.(), []);

  useEffect(() => {
    if (!target || !design) return;
    const existing = designRecord(scope);
    const frame = iframeRef.current;
    let el;
    try { el = frame?.contentDocument?.querySelector(target.selector); } catch {}
    const computed = el ? styleSnapshot(el) : clone(STYLE_DEFAULTS);
    const existingStyle = { ...(existing?.style || {}) };
    const existingAttrs = { ...(existing?.attrs || {}) };
    setStyleDraft({ ...computed, ...existingStyle });
    setStyleOverrides(existingStyle);
    setAttrsDraft({ ...existingAttrs });
    setAttrsOverrides(existingAttrs);
    setHiddenDraft(Boolean(existing?.hidden));
  }, [scope]);

  function writeDesignTarget(nextStyleOverrides = styleOverrides, nextAttrsOverrides = attrsOverrides, nextHidden = hiddenDraft) {
    if (!target?.selector) return;
    setDesign((prev) => {
      const next = clone(prev || { version: 2, global: { favicon: '', elements: {} }, pages: {} });
      next.version = 2;
      next.global ||= { favicon: '', elements: {} };
      next.global.elements ||= {};
      next.pages ||= {};

      const config = {
        style: compactStyle(nextStyleOverrides),
        attrs: { ...nextAttrsOverrides },
        hidden: Boolean(nextHidden)
      };
      Object.keys(config.attrs).forEach((key) => {
        if (config.attrs[key] === '' || config.attrs[key] === undefined || config.attrs[key] === null) delete config.attrs[key];
      });
      if (!Object.keys(config.style).length) delete config.style;
      if (!Object.keys(config.attrs).length) delete config.attrs;

      if (scope === 'global') {
        next.global.elements[target.selector] = config;
      } else {
        next.pages[previewPath] ||= { elements: {} };
        next.pages[previewPath].elements ||= {};
        next.pages[previewPath].elements[target.selector] = config;
      }
      return next;
    });
  }

  function previewStyle(key, value) {
    const nextDraft = { ...styleDraft, [key]: value };
    const nextOverrides = { ...styleOverrides };
    if (value === '' || value === null || value === undefined) delete nextOverrides[key];
    else nextOverrides[key] = value;

    setStyleDraft(nextDraft);
    setStyleOverrides(nextOverrides);

    const frame = iframeRef.current;
    try {
      const el = frame?.contentDocument?.querySelector(target.selector);
      if (el) el.style[key] = value;
    } catch {}
    writeDesignTarget(nextOverrides, attrsOverrides, hiddenDraft);
  }

  function previewAttr(key, value) {
    const nextDraft = { ...attrsDraft, [key]: value };
    const nextOverrides = { ...attrsOverrides };
    if (value === '' || value === null || value === undefined) delete nextOverrides[key];
    else nextOverrides[key] = value;

    setAttrsDraft(nextDraft);
    setAttrsOverrides(nextOverrides);

    const frame = iframeRef.current;
    try {
      const el = frame?.contentDocument?.querySelector(target.selector);
      if (el) {
        if (key === 'text' && el.children.length === 0) el.textContent = value;
        else if (key !== 'text') {
          if (value) el.setAttribute(key, value); else el.removeAttribute(key);
        }
      }
    } catch {}
    writeDesignTarget(styleOverrides, nextOverrides, hiddenDraft);
  }

  function toggleHidden(value) {
    setHiddenDraft(value);
    const frame = iframeRef.current;
    try {
      const el = frame?.contentDocument?.querySelector(target.selector);
      if (el) el.style.display = value ? 'none' : (styleDraft.display || '');
    } catch {}
    writeDesignTarget(styleOverrides, attrsOverrides, value);
  }

  function resetTargetDesign() {
    if (!target?.selector) return;
    setDesign((prev) => {
      const next = clone(prev);
      if (scope === 'global') delete next.global?.elements?.[target.selector];
      else delete next.pages?.[previewPath]?.elements?.[target.selector];
      return next;
    });
    setTarget(null);
    setStatus('Personalização removida. Recarregue a prévia para visualizar o estilo original.');
  }

  async function login(event) {
    event.preventDefault();
    setStatus('Entrando…');
    const res = await fetch('/api/site-editor/auth', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (!data.ok) { setStatus(data.error); return; }
    setPassword(''); setStatus('');
    await Promise.all([loadFiles(), loadDesign()]);
  }

  function updateValue(raw) {
    const current = selectedValue;
    let value = raw;
    if (typeof current === 'number') value = raw === '' ? 0 : Number(raw);
    if (typeof current === 'boolean') value = raw === 'true';
    setJson((prev) => setAt(prev, selected, value));
  }

  async function saveContent() {
    if (!contentDirty || !json) return;
    const res = await fetch('/api/site-editor/save', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fileId, content: json, sha, message: `Edita ${activeFile?.label || fileId} pelo editor visual ESTIBORDO` }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setOriginal(clone(json));
    if (data.sha) setSha(data.sha);
  }

  async function saveDesignNow() {
    if (!designDirty || !design) return;
    const res = await fetch('/api/site-editor/design/save', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: design, sha: designSha }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setDesignOriginal(clone(design));
    if (data.sha) setDesignSha(data.sha);
  }

  async function save() {
    if (!dirty) return;
    setSaving(true);
    setStatus(mode === 'local' ? 'Salvando alterações locais…' : 'Salvando alterações no GitHub…');
    try {
      await saveContent();
      await saveDesignNow();
      setStatus(mode === 'local'
        ? 'Alterações salvas localmente.'
        : 'Salvo no GitHub. A Vercel fará o novo deploy automaticamente.');
    } catch (e) { setStatus(e.message); }
    finally { setSaving(false); }
  }

  async function upload(file) {
    if (!file) return;
    setUploading(true);
    setStatus(`Enviando ${file.name}…`);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/site-editor/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);

      const url = data.url;
      let chosen = mediaMode;
      if (chosen === 'auto') {
        if (target?.tag === 'img') chosen = 'image';
        else if (target?.tag === 'a') chosen = 'link';
        else chosen = 'background';
      }

      if (chosen === 'favicon') {
        setDesign((prev) => {
          const next = clone(prev);
          next.global ||= { favicon: '', elements: {} };
          next.global.favicon = url;
          return next;
        });
      } else if (!target) {
        throw new Error('Selecione um elemento na prévia ou escolha "Favicon".');
      } else if (chosen === 'image') {
        previewAttr('src', url);
      } else if (chosen === 'link') {
        previewAttr('href', url);
      } else {
        const changes = {
          backgroundImage: `url("${url}")`,
          backgroundSize: styleDraft.backgroundSize || 'cover',
          backgroundPosition: styleDraft.backgroundPosition || 'center'
        };
        const nextDraft = { ...styleDraft, ...changes };
        const nextOverrides = { ...styleOverrides, ...changes };
        setStyleDraft(nextDraft);
        setStyleOverrides(nextOverrides);
        try {
          const el = iframeRef.current?.contentDocument?.querySelector(target.selector);
          if (el) Object.entries(changes).forEach(([key, value]) => { el.style[key] = value; });
        } catch {}
        writeDesignTarget(nextOverrides, attrsOverrides, hiddenDraft);
      }
      setStatus(`Upload concluído: ${url}. Salve as alterações para gravar a associação visual.`);
    } catch (e) { setStatus(e.message); }
    finally { setUploading(false); }
  }

  async function logout() {
    await fetch('/api/site-editor/logout', { method: 'POST' });
    setAuth('login'); setJson(null); setFiles([]); setFileId('');
  }

  if (auth === 'checking') return <main className="ev-shell ev-centered"><div className="ev-loader">Carregando editor…</div></main>;
  if (auth === 'login') return (
    <main className="ev-shell ev-centered">
      <form className="ev-login" onSubmit={login}>
        <div className="ev-flag"><span/><span/></div>
        <div className="ev-eyebrow">ESTIBORDO · ADMINISTRAÇÃO</div>
        <h1>Editor visual</h1>
        <p>Conteúdo, aparência, layout e mídia sem editar o código-fonte.</p>
        <label>Senha do editor<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus /></label>
        <button className="ev-primary" type="submit">Entrar</button>
        {status && <div className="ev-status">{status}</div>}
      </form>
    </main>
  );

  return (
    <main className="ev-shell">
      <header className="ev-topbar">
        <div className="ev-brand"><div className="ev-flag"><span/><span/></div><div><b>ESTIBORDO</b><small>EDITOR VISUAL V2 · {mode === 'local' ? 'LOCAL' : 'GITHUB'}</small></div></div>
        <div className="ev-top-actions">
          <select value={fileId} onChange={(e) => setFileId(e.target.value)}>{files.map((file) => <option value={file.id} key={file.id}>{file.label}</option>)}</select>
          <button className="ev-ghost" onClick={() => iframeRef.current?.contentWindow?.location.reload()} type="button">Recarregar prévia</button>
          <button className="ev-primary" disabled={!dirty || saving} onClick={save} type="button">{saving ? 'Salvando…' : dirty ? 'Salvar alterações' : 'Salvo'}</button>
          <button className="ev-ghost" onClick={logout} type="button">Sair</button>
        </div>
      </header>

      {status && <div className="ev-banner">{status}</div>}

      <div className="ev-workspace">
        <aside className="ev-sidebar">
          <div className="ev-panel-title"><span>CONTEÚDO JSON</span><small>{activeFile?.path}</small></div>
          <div className="ev-tree">{json && <JsonTree value={json} selectedPath={selectedPath} onSelect={(parts) => { setSelected(parts); setCandidates([]); }} />}</div>
        </aside>

        <section className="ev-preview">
          <div className="ev-preview-head">
            <div><b>PRÉVIA INTERATIVA</b><span>Clique em qualquer elemento para editar aparência e conteúdo.</span></div>
            <code>{previewPath}</code>
          </div>
          <iframe ref={iframeRef} src={previewPath} title="Prévia do site" onLoad={wireIframe} />
        </section>

        <aside className="ev-inspector">
          <div className="ev-panel-title"><span>PROPRIEDADES</span><small>{target ? `${target.tag} · ${target.selector}` : 'selecione um elemento'}</small></div>

          <div className="ev-scope">
            <span>Aplicar em</span>
            <button className={scope === 'page' ? 'is-active' : ''} type="button" onClick={() => setScope('page')}>Esta página</button>
            <button className={scope === 'global' ? 'is-active' : ''} type="button" onClick={() => setScope('global')}>Todo o site</button>
          </div>

          <div className="ev-inspector-scroll">
            {target ? <>
              <Section title="Conteúdo do elemento" open>
                {target.childElementCount === 0 && <Field label="Texto" value={attrsDraft.text ?? target.text} onChange={(v) => previewAttr('text', v)} />}
                {(target.tag === 'a' || attrsDraft.href !== undefined) && <Field label="Link / href" value={attrsDraft.href || ''} onChange={(v) => previewAttr('href', v)} placeholder="/cadastro" />}
                {(target.tag === 'img' || attrsDraft.src !== undefined) && <>
                  <Field label="Imagem / src" value={attrsDraft.src || ''} onChange={(v) => previewAttr('src', v)} placeholder="/uploads/..." />
                  <Field label="Texto alternativo" value={attrsDraft.alt || ''} onChange={(v) => previewAttr('alt', v)} />
                </>}
                <Field label="Título / tooltip" value={attrsDraft.title || ''} onChange={(v) => previewAttr('title', v)} />
                {candidates.length > 0 && <div className="ev-candidates"><p>Possíveis campos JSON correspondentes:</p>{candidates.slice(0, 5).map((item) => (
                  <button key={item.path} type="button" onClick={() => setSelected(item.parts)}><b>{labelFor(item.parts)}</b><span>{String(item.value)}</span></button>
                ))}</div>}
              </Section>

              <Section title="Tipografia" open>
                <div className="ev-grid2">
                  <Field label="Tamanho" value={styleDraft.fontSize} onChange={(v) => previewStyle('fontSize', v)} placeholder="16px" />
                  <Field label="Peso" value={styleDraft.fontWeight} onChange={(v) => previewStyle('fontWeight', v)} options={['300','400','500','600','700','800','900']} />
                </div>
                <Field label="Família" value={styleDraft.fontFamily} onChange={(v) => previewStyle('fontFamily', v)} placeholder="Arial, sans-serif" />
                <div className="ev-grid2">
                  <Field label="Alinhamento" value={styleDraft.textAlign} onChange={(v) => previewStyle('textAlign', v)} options={['left','center','right','justify']} />
                  <Field label="Altura de linha" value={styleDraft.lineHeight} onChange={(v) => previewStyle('lineHeight', v)} placeholder="1.4" />
                  <Field label="Espaçamento letras" value={styleDraft.letterSpacing} onChange={(v) => previewStyle('letterSpacing', v)} placeholder="0.02em" />
                </div>
              </Section>

              <Section title="Cores">
                <div className="ev-color-grid">
                  <Field label="Texto" type="color" value={styleDraft.color || '#000000'} onChange={(v) => previewStyle('color', v)} />
                  <Field label="Fundo / botão" type="color" value={styleDraft.backgroundColor || '#ffffff'} onChange={(v) => previewStyle('backgroundColor', v)} />
                  <Field label="Borda" type="color" value={styleDraft.borderColor || '#000000'} onChange={(v) => previewStyle('borderColor', v)} />
                </div>
              </Section>

              <Section title="Caixa e dimensões">
                <div className="ev-grid2">
                  <Field label="Largura" value={styleDraft.width} onChange={(v) => previewStyle('width', v)} placeholder="320px / 100%" />
                  <Field label="Altura" value={styleDraft.height} onChange={(v) => previewStyle('height', v)} placeholder="auto / 60px" />
                  <Field label="Largura mín." value={styleDraft.minWidth} onChange={(v) => previewStyle('minWidth', v)} />
                  <Field label="Largura máx." value={styleDraft.maxWidth} onChange={(v) => previewStyle('maxWidth', v)} />
                </div>
                <h4>Padding</h4><div className="ev-grid4">
                  {['Top','Right','Bottom','Left'].map((side) => <Field key={side} label={side} value={styleDraft[`padding${side}`]} onChange={(v) => previewStyle(`padding${side}`, v)} placeholder="0px" />)}
                </div>
                <h4>Margin</h4><div className="ev-grid4">
                  {['Top','Right','Bottom','Left'].map((side) => <Field key={side} label={side} value={styleDraft[`margin${side}`]} onChange={(v) => previewStyle(`margin${side}`, v)} placeholder="0px" />)}
                </div>
                <div className="ev-grid2">
                  <Field label="Raio da borda" value={styleDraft.borderRadius} onChange={(v) => previewStyle('borderRadius', v)} placeholder="8px" />
                  <Field label="Espessura borda" value={styleDraft.borderWidth} onChange={(v) => previewStyle('borderWidth', v)} placeholder="1px" />
                  <Field label="Estilo borda" value={styleDraft.borderStyle} onChange={(v) => previewStyle('borderStyle', v)} options={['none','solid','dashed','dotted','double']} />
                </div>
              </Section>

              <Section title="Posicionamento e layout">
                <div className="ev-grid2">
                  <Field label="Display" value={styleDraft.display} onChange={(v) => previewStyle('display', v)} options={['block','inline','inline-block','flex','inline-flex','grid','none']} />
                  <Field label="Position" value={styleDraft.position} onChange={(v) => previewStyle('position', v)} options={['static','relative','absolute','fixed','sticky']} />
                  <Field label="Direção flex" value={styleDraft.flexDirection} onChange={(v) => previewStyle('flexDirection', v)} options={['row','row-reverse','column','column-reverse']} />
                  <Field label="Justificar" value={styleDraft.justifyContent} onChange={(v) => previewStyle('justifyContent', v)} options={['flex-start','center','flex-end','space-between','space-around','space-evenly']} />
                  <Field label="Alinhar itens" value={styleDraft.alignItems} onChange={(v) => previewStyle('alignItems', v)} options={['stretch','flex-start','center','flex-end','baseline']} />
                  <Field label="Gap" value={styleDraft.gap} onChange={(v) => previewStyle('gap', v)} placeholder="16px" />
                  <Field label="Ordem" value={styleDraft.order} onChange={(v) => previewStyle('order', v)} placeholder="0" />
                  <Field label="Colunas grid" value={styleDraft.gridTemplateColumns} onChange={(v) => previewStyle('gridTemplateColumns', v)} placeholder="repeat(3, 1fr)" />
                </div>
                <h4>Offsets</h4><div className="ev-grid4">
                  {['top','right','bottom','left'].map((key) => <Field key={key} label={key} value={styleDraft[key]} onChange={(v) => previewStyle(key, v)} placeholder="auto" />)}
                </div>
                <div className="ev-grid2">
                  <Field label="Z-index" value={styleDraft.zIndex} onChange={(v) => previewStyle('zIndex', v)} />
                  <Field label="Opacidade" value={styleDraft.opacity} onChange={(v) => previewStyle('opacity', v)} placeholder="1" />
                  <Field label="Overflow" value={styleDraft.overflow} onChange={(v) => previewStyle('overflow', v)} options={['visible','hidden','auto','scroll','clip']} />
                </div>
              </Section>

              <Section title="Imagem / background">
                <Field label="Background image" value={styleDraft.backgroundImage} onChange={(v) => previewStyle('backgroundImage', v)} placeholder='url("/imagem.png")' />
                <div className="ev-grid2">
                  <Field label="Tamanho" value={styleDraft.backgroundSize} onChange={(v) => previewStyle('backgroundSize', v)} options={['cover','contain','auto']} />
                  <Field label="Posição" value={styleDraft.backgroundPosition} onChange={(v) => previewStyle('backgroundPosition', v)} options={['center','top','bottom','left','right']} />
                  <Field label="Repetição" value={styleDraft.backgroundRepeat} onChange={(v) => previewStyle('backgroundRepeat', v)} options={['no-repeat','repeat','repeat-x','repeat-y']} />
                  {target.tag === 'img' && <Field label="Object fit" value={styleDraft.objectFit} onChange={(v) => previewStyle('objectFit', v)} options={['cover','contain','fill','none','scale-down']} />}
                </div>
              </Section>

              <Section title="Visibilidade">
                <label className="ev-toggle"><input type="checkbox" checked={hiddenDraft} onChange={(e) => toggleHidden(e.target.checked)} /><span>Ocultar este elemento</span></label>
              </Section>

              <Section title="Upload de mídia e arquivos" open>
                <Field label="Usar upload como" value={mediaMode} onChange={setMediaMode} options={['auto','image','background','link','favicon']} />
                <label className="ev-upload">
                  <input type="file" disabled={uploading} onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ''; }} />
                  <span>{uploading ? 'Enviando…' : 'Escolher arquivo do computador'}</span>
                </label>
                <p className="ev-help">Imagens: PNG, JPG, WebP, GIF, ICO, AVIF. Arquivos: PDF, Office, CSV, TXT, ZIP. Limite: 10 MB.</p>
              </Section>

              <button className="ev-danger" type="button" onClick={resetTargetDesign}>Remover personalização deste elemento</button>
            </> : <div className="ev-empty"><b>Selecione um elemento</b><p>Clique em qualquer texto, botão, imagem, caixa ou bloco da prévia. O editor mostrará tipografia, cores, caixa, layout, visibilidade, conteúdo e upload.</p>
              <Section title="Favicon do site" open>
                <Field label="Favicon atual" value={design?.global?.favicon || ''} onChange={(v) => setDesign((prev) => { const next = clone(prev); next.global.favicon = v; return next; })} placeholder="/favicon.png" />
                <label className="ev-upload">
                  <input type="file" disabled={uploading} accept=".png,.jpg,.jpeg,.webp,.ico,.avif" onChange={(e) => { setMediaMode('favicon'); upload(e.target.files?.[0]); e.target.value = ''; }} />
                  <span>{uploading ? 'Enviando…' : 'Enviar novo favicon'}</span>
                </label>
              </Section>
            </div>}

            {selected.length > 0 && json && <Section title="Valor JSON selecionado" open>
              <div className="ev-json-path">{labelFor(selected)}</div>
              {typeof selectedValue === 'boolean'
                ? <select value={String(selectedValue)} onChange={(e) => updateValue(e.target.value)}><option value="true">true</option><option value="false">false</option></select>
                : <textarea rows={6} value={String(selectedValue ?? '')} onChange={(e) => updateValue(e.target.value)} />}
            </Section>}
          </div>
        </aside>
      </div>
    </main>
  );
}
