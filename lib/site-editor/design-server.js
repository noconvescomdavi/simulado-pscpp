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
  'position','top','right','bottom','left','zIndex','opacity','overflow','objectFit','objectPosition',
  'backgroundImage','backgroundSize','backgroundPosition','backgroundRepeat','boxShadow','filter',
  'textTransform','textDecoration','whiteSpace','cursor','translate'
]);

const ATTR_KEYS = new Set(['src','href','alt','title','text']);
const MAX_DESIGN_BYTES = 900 * 1024;
const MAX_UPLOAD_BYTES = 20 * 1024 * 1024;

const ALLOWED_EXTENSIONS = new Set([
  'png','jpg','jpeg','webp','gif','ico','avif',
  'mp4','webm','mp3','wav','ogg','m4a'
]);

const BLOCK_TYPES = new Set([
  'text','button','image','section','box','decorative','gallery','menu','form','video',
  'interactive','list','embed','social','input','widget','cms','blog','app','api',
  'hero','cta','stats','socialbar','cards'
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
  if (typeof input.locked === 'boolean') out.locked = input.locked;
  if (Number.isInteger(Number(input.cloneCount)) && Number(input.cloneCount) > 0) out.cloneCount = Math.min(10, Number(input.cloneCount));
  if (Number.isInteger(Number(input.moveDelta)) && Number(input.moveDelta) !== 0) out.moveDelta = Math.max(-50, Math.min(50, Number(input.moveDelta)));
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

function shortText(value, max=2000) {
  return String(value ?? '').slice(0, max);
}

function sanitizePairs(value, maxItems=50) {
  if (!Array.isArray(value)) return [];
  return value.slice(0,maxItems).map(item=>{
    if (!Array.isArray(item)) return null;
    return [shortText(item[0],500), shortText(item[1],2000)];
  }).filter(Boolean);
}

function sanitizeStrings(value, maxItems=100) {
  return Array.isArray(value) ? value.slice(0,maxItems).map(v=>shortText(v,2000)) : [];
}

function sanitizeBlock(input) {
  if (!input || typeof input !== 'object') return null;
  const type=String(input.type||'').trim();
  if (!BLOCK_TYPES.has(type)) return null;
  const out={ id:shortText(input.id||`blk_${crypto.randomUUID()}`,120), type, style:{} };
  for (const [key,value] of Object.entries(input.style||{})) {
    if (STYLE_KEYS.has(key) && value!==null && value!==undefined) out.style[key]=shortText(value,500);
  }
  for (const key of ['text','title','button','href','src','alt','placeholder','code']) {
    if (key in input) out[key]=(key==='href'||key==='src')?safeUrl(input[key]):shortText(input[key],key==='code'?12000:4000);
  }
  if ('images' in input) out.images=sanitizeStrings(input.images,60).map(safeUrl).filter(Boolean);
  if ('items' in input) out.items=sanitizePairs(input.items,100);
  if ('fields' in input) out.fields=sanitizeStrings(input.fields,40);
  return out;
}

function sanitizePageSettings(input) {
  if (!input || typeof input !== 'object') return {};
  const out={};
  const enums={
    colorTheme:new Set(['estibordo','light','dark','ocean']),
    textTheme:new Set(['default','editorial','compact','display']),
    transition:new Set(['none','fade','slide','scale'])
  };
  for (const [key,set] of Object.entries(enums)) {
    const value=String(input[key]||'');
    if (set.has(value)) out[key]=value;
  }
  if ('background' in input) out.background=shortText(input.background,1200);
  if ('seoTitle' in input) out.seoTitle=shortText(input.seoTitle,180);
  if ('seoDescription' in input) out.seoDescription=shortText(input.seoDescription,600);
  if ('googleAdsId' in input) out.googleAdsId=shortText(input.googleAdsId,120);
  if ('metaPixelId' in input) out.metaPixelId=shortText(input.metaPixelId,120);
  return out;
}

function sanitizeMedia(input) {
  if (!Array.isArray(input)) return [];
  return input.slice(-250).map(item=>({
    name:shortText(item?.name,240),
    url:safeUrl(item?.url),
    type:shortText(item?.type,120),
    createdAt:shortText(item?.createdAt,80)
  })).filter(item=>item.url);
}

export function sanitizeDesign(input) {
  const out = defaultDesign();
  if (!input || typeof input !== 'object') return out;

  out.global.favicon = safeUrl(input?.global?.favicon);
  out.global.elements = sanitizeElements(input?.global?.elements);
  out.global.media = sanitizeMedia(input?.global?.media);

  if (input.pages && typeof input.pages === 'object') {
    for (const [page, pageConfig] of Object.entries(input.pages).slice(0, 300)) {
      const safePage = String(page || '/').trim().slice(0, 300);
      if (!safePage.startsWith('/')) continue;
      out.pages[safePage] = {
        elements: sanitizeElements(pageConfig?.elements),
        blocks: Array.isArray(pageConfig?.blocks) ? pageConfig.blocks.slice(0,200).map(sanitizeBlock).filter(Boolean) : [],
        settings: sanitizePageSettings(pageConfig?.settings)
      };
    }
  }

  const bytes = Buffer.byteLength(JSON.stringify(out), 'utf8');
  if (bytes > MAX_DESIGN_BYTES) {
    const error = new Error('O arquivo de design excedeu o limite de segurança de 900 KB.');
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
    const error = new Error('O arquivo excede o limite de 20 MB.');
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
