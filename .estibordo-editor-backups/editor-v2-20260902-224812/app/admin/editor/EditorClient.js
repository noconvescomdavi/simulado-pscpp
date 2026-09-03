'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

const clone = (value) => JSON.parse(JSON.stringify(value));
const normalize = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const pathKey = (parts) => parts.map((p) => String(p).replaceAll('~', '~0').replaceAll('/', '~1')).join('/');

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

export default function EditorClient() {
  const [auth, setAuth] = useState('checking');
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState([]);
  const [mode, setMode] = useState('local');
  const [fileId, setFileId] = useState('');
  const [json, setJson] = useState(null);
  const [original, setOriginal] = useState(null);
  const [sha, setSha] = useState('');
  const [selected, setSelected] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const iframeRef = useRef(null);

  const activeFile = files.find((file) => file.id === fileId);
  const selectedPath = pathKey(selected);
  const selectedValue = json && selected.length ? getAt(json, selected) : null;
  const dirty = useMemo(() => json && original && JSON.stringify(json) !== JSON.stringify(original), [json, original]);

  async function loadFiles() {
    const res = await fetch('/api/site-editor/files', { cache: 'no-store' });
    if (res.status === 401) { setAuth('login'); return; }
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setAuth('ready');
    setFiles(data.files);
    setMode(data.mode || 'local');
    if (!fileId && data.files[0]) setFileId(data.files[0].id);
  }

  useEffect(() => { loadFiles().catch(() => setAuth('login')); }, []);

  useEffect(() => {
    if (!fileId || auth !== 'ready') return;
    setStatus(mode === 'local' ? 'Carregando JSON local…' : 'Carregando JSON do GitHub…');
    fetch(`/api/site-editor/file?id=${encodeURIComponent(fileId)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!data.ok) throw new Error(data.error);
        setJson(data.content); setOriginal(clone(data.content)); setSha(data.sha); setSelected([]); setCandidates([]); setStatus('');
      })
      .catch((e) => setStatus(e.message));
  }, [fileId, auth, mode]);

  function wireIframe() {
    const frame = iframeRef.current;
    try {
      const doc = frame?.contentDocument;
      if (!doc || !json) return;
      doc.documentElement.dataset.estibordoEditor = 'on';
      const style = doc.createElement('style');
      style.dataset.estibordoEditorStyle = 'true';
      style.textContent = '[data-estibordo-editor-hover]{outline:2px solid #C8102E!important;outline-offset:2px!important;cursor:crosshair!important}';
      doc.head.appendChild(style);
      let last;
      const over = (event) => {
        if (last) last.removeAttribute('data-estibordo-editor-hover');
        last = event.target;
        last?.setAttribute?.('data-estibordo-editor-hover', '');
      };
      const click = (event) => {
        event.preventDefault(); event.stopPropagation();
        const found = findCandidates(json, event.target);
        setCandidates(found);
        if (found.length === 1 || found[0]?.score >= 100) setSelected(found[0].parts);
      };
      doc.addEventListener('mouseover', over, true);
      doc.addEventListener('click', click, true);
    } catch {
      setStatus('A prévia precisa estar no mesmo domínio do editor. Use uma rota interna do próprio site.');
    }
  }

  async function login(event) {
    event.preventDefault();
    setStatus('Entrando…');
    const res = await fetch('/api/site-editor/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const data = await res.json();
    if (!data.ok) { setStatus(data.error); return; }
    setPassword(''); setStatus(''); await loadFiles();
  }

  function updateValue(raw) {
    const current = selectedValue;
    let value = raw;
    if (typeof current === 'number') value = raw === '' ? 0 : Number(raw);
    if (typeof current === 'boolean') value = raw === 'true';
    setJson((prev) => setAt(prev, selected, value));
  }

  async function save() {
    if (!dirty || !json) return;
    setSaving(true); setStatus(mode === 'local' ? 'Salvando no arquivo local…' : 'Criando commit no GitHub…');
    try {
      const res = await fetch('/api/site-editor/save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: fileId, content: json, sha, message: `Edita ${activeFile?.label || fileId} pelo editor visual ESTIBORDO` }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      setOriginal(clone(json));
      if (data.sha) setSha(data.sha);
      setStatus(data.mode === 'local' ? `Salvo localmente. Backup: ${data.backup || 'criado automaticamente'}` : 'Salvo no GitHub. A Vercel fará o novo deploy automaticamente.');
    } catch (e) { setStatus(e.message); }
    finally { setSaving(false); }
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
        <p>Edite o conteúdo do site sem abrir o código-fonte.</p>
        <label>Senha do editor<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus /></label>
        <button className="ev-primary" type="submit">Entrar</button>
        {status && <div className="ev-status">{status}</div>}
      </form>
    </main>
  );

  return (
    <main className="ev-shell">
      <header className="ev-topbar">
        <div className="ev-brand"><div className="ev-flag"><span/><span/></div><div><b>ESTIBORDO</b><small>EDITOR VISUAL · {mode === 'local' ? 'MODO LOCAL' : 'GITHUB'}</small></div></div>
        <div className="ev-top-actions">
          <select value={fileId} onChange={(e) => setFileId(e.target.value)}>{files.map((file) => <option value={file.id} key={file.id}>{file.label}</option>)}</select>
          <button className="ev-ghost" onClick={() => location.reload()} type="button">Recarregar</button>
          <button className="ev-primary" disabled={!dirty || saving} onClick={save} type="button">{saving ? 'Salvando…' : dirty ? (mode === 'local' ? 'Salvar localmente' : 'Salvar no GitHub') : 'Salvo'}</button>
          <button className="ev-ghost" onClick={logout} type="button">Sair</button>
        </div>
      </header>

      {status && <div className="ev-banner">{status}</div>}

      <div className="ev-workspace">
        <aside className="ev-sidebar">
          <div className="ev-panel-title"><span>CONTEÚDO</span><small>{activeFile?.path}</small></div>
          <div className="ev-tree">{json && <JsonTree value={json} selectedPath={selectedPath} onSelect={(parts) => { setSelected(parts); setCandidates([]); }} />}</div>
        </aside>

        <section className="ev-preview">
          <div className="ev-previewbar"><div><b>PRÉVIA CLICÁVEL</b><small>Clique em um texto, imagem ou link para localizar seu valor no JSON.</small></div><span>{activeFile?.previewPath || '/'}</span></div>
          {activeFile && <iframe ref={iframeRef} title="Prévia do site" src={activeFile.previewPath || '/'} onLoad={wireIframe} />}
        </section>

        <aside className="ev-inspector">
          <div className="ev-panel-title"><span>PROPRIEDADES</span><small>{selected.length ? labelFor(selected) : 'Selecione um item'}</small></div>
          {candidates.length > 1 && (
            <div className="ev-candidates"><p>Encontrei mais de um campo possível:</p>{candidates.map((item) => <button key={item.path} onClick={() => { setSelected(item.parts); setCandidates([]); }} type="button"><b>{labelFor(item.parts)}</b><span>{String(item.value)}</span></button>)}</div>
          )}
          {selected.length > 0 ? (
            <div className="ev-field-editor">
              <label>Caminho<input value={labelFor(selected)} readOnly /></label>
              {typeof selectedValue === 'boolean' ? (
                <label>Valor<select value={String(selectedValue)} onChange={(e) => updateValue(e.target.value)}><option value="true">Sim</option><option value="false">Não</option></select></label>
              ) : String(selectedValue ?? '').length > 90 ? (
                <label>Valor<textarea rows="10" value={String(selectedValue ?? '')} onChange={(e) => updateValue(e.target.value)} /></label>
              ) : (
                <label>Valor<input type={typeof selectedValue === 'number' ? 'number' : 'text'} value={String(selectedValue ?? '')} onChange={(e) => updateValue(e.target.value)} /></label>
              )}
              <div className="ev-hint">A alteração fica apenas nesta tela até você clicar em <b>{mode === 'local' ? 'Salvar localmente' : 'Salvar no GitHub'}</b>.</div>
              <button className="ev-ghost ev-full" disabled={!dirty} onClick={() => setJson(clone(original))} type="button">Descartar alterações</button>
            </div>
          ) : !candidates.length && <div className="ev-empty"><strong>Selecione visualmente</strong><p>Clique em um elemento da prévia ou escolha um campo na árvore JSON.</p></div>}
        </aside>
      </div>
    </main>
  );
}
