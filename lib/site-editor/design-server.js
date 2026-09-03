import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { editorMode } from './server';

const DESIGN_PATH = 'data/site/editor-design.json';
const UPLOAD_DIR = 'public/uploads/site-editor';

const STYLE_KEYS = new Set([
  'fontSize','fontWeight','fontFamily','textAlign','letterSpacing','lineHeight',
  'color','backgroundColor','backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat',
  'width','height','minWidth','maxWidth','minHeight','maxHeight',
  'paddingTop','paddingRight','paddingBottom','paddingLeft',
  'marginTop','marginRight','marginBottom','marginLeft',
  'borderRadius','borderWidth','borderStyle','borderColor',
  'display','flexDirection','justifyContent','alignItems','alignContent','flexWrap','gap','rowGap','columnGap',
  'gridTemplateColumns','gridTemplateRows','gridAutoFlow','order',
  'position','top','right','bottom','left','zIndex','opacity','overflow','objectFit','objectPosition'
]);

const ATTR_KEYS = new Set(['src','href','alt','title','text']);
const MAX_DESIGN_BYTES = 600 * 1024;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  'png','jpg','jpeg','webp','gif','ico','avif',
  'pdf','txt','csv','doc','docx','xls','xlsx','ppt','pptx','zip'
]);

function env(name, required = true) {
  const value = process.env[name];
  if (required && !value) throw new Error(`Variável de ambiente ausente: ${name}`);
  return value || '';
}

function githubConfig() {
  return {
    token: env('GITHUB_TOKEN'),
    owner: env('GITHUB_OWNER'),
    repo: env('GITHUB_REPO'),
    branch: env('GITHUB_BRANCH', false) || 'main',
  };
}

async function githubRequest(apiPath, options = {}) {
  const { token } = githubConfig();
  const response = await fetch(`https://api.github.com${apiPath}`, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    cache: 'no-store',
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data?.message || `GitHub respondeu ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
}

function normalizeRepoPath(value) {
  const safe = String(value || '').replace(/\\/g, '/').replace(/^\/+/, '');
  if (!safe || safe.includes('..') || path.isAbsolute(safe)) {
    const error = new Error('Caminho inválido.');
    error.status = 400;
    throw error;
  }
  return safe;
}

function localPath(repoPath) {
  const root = path.resolve(process.cwd());
  const absolute = path.resolve(root, normalizeRepoPath(repoPath));
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    const error = new Error('Caminho fora do projeto.');
    error.status = 403;
    throw error;
  }
  return absolute;
}

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function defaultDesign() {
  return { version: 2, global: { favicon: '', elements: {} }, pages: {} };
}

function safeUrl(value) {
  const v = String(value ?? '').trim();
  if (!v) return '';
  if (/^(javascript|data|vbscript):/i.test(v)) return '';
  return v.slice(0, 2048);
}

function sanitizeElementConfig(input) {
  if (!input || typeof input !== 'object') return {};
  const out = { style: {}, attrs: {} };

  for (const [key, value] of Object.entries(input.style || {})) {
    if (!STYLE_KEYS.has(key)) continue;
    if (value === null || value === undefined) continue;
    out.style[key] = String(value).slice(0, 500);
  }

  for (const [key, value] of Object.entries(input.attrs || {})) {
    if (!ATTR_KEYS.has(key)) continue;
    if ((key === 'src' || key === 'href')) out.attrs[key] = safeUrl(value);
    else out.attrs[key] = String(value ?? '').slice(0, 10000);
  }

  if (typeof input.hidden === 'boolean') out.hidden = input.hidden;
  if (!Object.keys(out.style).length) delete out.style;
  if (!Object.keys(out.attrs).length) delete out.attrs;
  return out;
}

function sanitizeElements(input) {
  const out = {};
  if (!input || typeof input !== 'object') return out;
  const entries = Object.entries(input).slice(0, 2000);
  for (const [selector, config] of entries) {
    const safeSelector = String(selector || '').trim().slice(0, 600);
    if (!safeSelector) continue;
    out[safeSelector] = sanitizeElementConfig(config);
  }
  return out;
}

export function sanitizeDesign(input) {
  const out = defaultDesign();
  if (!input || typeof input !== 'object') return out;

  out.global.favicon = safeUrl(input?.global?.favicon);
  out.global.elements = sanitizeElements(input?.global?.elements);

  if (input.pages && typeof input.pages === 'object') {
    for (const [page, pageConfig] of Object.entries(input.pages).slice(0, 300)) {
      const safePage = String(page || '/').trim().slice(0, 300);
      if (!safePage.startsWith('/')) continue;
      out.pages[safePage] = { elements: sanitizeElements(pageConfig?.elements) };
    }
  }

  const bytes = Buffer.byteLength(JSON.stringify(out), 'utf8');
  if (bytes > MAX_DESIGN_BYTES) {
    const error = new Error('O arquivo de design excedeu o limite de segurança de 600 KB.');
    error.status = 413;
    throw error;
  }
  return out;
}

export async function readDesign() {
  if (editorMode() === 'local') {
    try {
      const buffer = await fs.readFile(localPath(DESIGN_PATH));
      return { content: sanitizeDesign(JSON.parse(buffer.toString('utf8'))), sha: sha256(buffer), mode: 'local' };
    } catch (error) {
      if (error?.code === 'ENOENT') return { content: defaultDesign(), sha: '', mode: 'local' };
      throw error;
    }
  }

  const { owner, repo, branch } = githubConfig();
  const apiPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${DESIGN_PATH.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(branch)}`;
  try {
    const data = await githubRequest(apiPath);
    const text = Buffer.from(String(data.content || '').replace(/\n/g, ''), 'base64').toString('utf8');
    return { content: sanitizeDesign(JSON.parse(text)), sha: data.sha || '', mode: 'github' };
  } catch (error) {
    if (error?.status === 404) return { content: defaultDesign(), sha: '', mode: 'github' };
    throw error;
  }
}

export async function saveDesign(content, sha) {
  const clean = sanitizeDesign(content);
  const text = `${JSON.stringify(clean, null, 2)}\n`;

  if (editorMode() === 'local') {
    const absolute = localPath(DESIGN_PATH);
    await fs.mkdir(path.dirname(absolute), { recursive: true });

    if (sha) {
      const current = await fs.readFile(absolute);
      if (sha256(current) !== sha) {
        const error = new Error('O design mudou desde que você abriu o editor. Recarregue antes de salvar.');
        error.status = 409;
        throw error;
      }
    }

    const backupDir = path.join(process.cwd(), '.estibordo-editor-backups');
    await fs.mkdir(backupDir, { recursive: true });
    try {
      const current = await fs.readFile(absolute);
      const stamp = new Date().toISOString().replace(/[:.]/g, '-');
      await fs.writeFile(path.join(backupDir, `editor-design.${stamp}.bak`), current);
    } catch {}

    await fs.writeFile(absolute, text, 'utf8');
    return { sha: sha256(Buffer.from(text)), mode: 'local' };
  }

  const { owner, repo, branch } = githubConfig();
  const apiPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${DESIGN_PATH.split('/').map(encodeURIComponent).join('/')}`;
  const body = {
    message: 'Atualiza aparência pelo editor visual ESTIBORDO',
    content: Buffer.from(text, 'utf8').toString('base64'),
    branch,
  };
  if (sha) body.sha = sha;

  const data = await githubRequest(apiPath, { method: 'PUT', body: JSON.stringify(body) });
  return { sha: data?.content?.sha || '', commit: data?.commit?.html_url || null, mode: 'github' };
}

function extensionOf(name) {
  const ext = String(name || '').split('.').pop()?.toLowerCase() || '';
  return ext.replace(/[^a-z0-9]/g, '');
}

function slugBase(name) {
  const raw = String(name || 'arquivo').replace(/\.[^.]+$/, '');
  return raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70) || 'arquivo';
}

export async function saveUpload(file) {
  if (!file || typeof file.arrayBuffer !== 'function') {
    const error = new Error('Arquivo inválido.');
    error.status = 400;
    throw error;
  }

  const ext = extensionOf(file.name);
  if (!ALLOWED_EXTENSIONS.has(ext)) {
    const error = new Error(`Formato .${ext || '?'} não permitido pelo editor.`);
    error.status = 415;
    throw error;
  }

  if (Number(file.size || 0) > MAX_UPLOAD_BYTES) {
    const error = new Error('O arquivo excede o limite de 10 MB.');
    error.status = 413;
    throw error;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const date = new Date();
  const folder = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
  const shortHash = crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 10);
  const filename = `${Date.now()}-${slugBase(file.name)}-${shortHash}.${ext}`;
  const repoPath = `${UPLOAD_DIR}/${folder}/${filename}`;
  const publicUrl = `/${repoPath.replace(/^public\//, '')}`;

  if (editorMode() === 'local') {
    const absolute = localPath(repoPath);
    await fs.mkdir(path.dirname(absolute), { recursive: true });
    await fs.writeFile(absolute, buffer);
    return { url: publicUrl, path: repoPath, mode: 'local' };
  }

  const { owner, repo, branch } = githubConfig();
  const apiPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${repoPath.split('/').map(encodeURIComponent).join('/')}`;
  const body = {
    message: `Adiciona mídia ${file.name} pelo editor visual ESTIBORDO`,
    content: buffer.toString('base64'),
    branch,
  };
  const data = await githubRequest(apiPath, { method: 'PUT', body: JSON.stringify(body) });
  return { url: publicUrl, path: repoPath, commit: data?.commit?.html_url || null, mode: 'github' };
}
