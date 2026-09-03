import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { cookies, headers } from 'next/headers';

const COOKIE_NAME = 'estibordo_site_editor';

function env(name, required = true) {
  const value = process.env[name];
  if (required && !value) throw new Error(`Variável de ambiente ausente: ${name}`);
  return value || '';
}

export function editorMode() {
  const mode = (env('SITE_EDITOR_MODE', false) || 'github').toLowerCase();
  if (!['local', 'github'].includes(mode)) throw new Error('SITE_EDITOR_MODE deve ser "local" ou "github".');
  return mode;
}

function timingSafeEqualText(a, b) {
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (aa.length !== bb.length) return false;
  return crypto.timingSafeEqual(aa, bb);
}

function authSignature() {
  return crypto.createHmac('sha256', env('SITE_EDITOR_COOKIE_SECRET')).update('authorized').digest('hex');
}

export function validatePassword(password) {
  return timingSafeEqualText(password, env('SITE_EDITOR_PASSWORD'));
}

export async function isEditorAuthenticated() {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value || '';
  return timingSafeEqualText(value, authSignature());
}

export async function setEditorCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, authSignature(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export async function clearEditorCookie() {
  const store = await cookies();
  store.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
}

export async function requireEditorAuth() {
  if (!(await isEditorAuthenticated())) {
    const error = new Error('Não autorizado');
    error.status = 401;
    throw error;
  }
}

export async function assertSameOrigin() {
  const h = await headers();
  const origin = h.get('origin');
  const host = h.get('host');
  if (!origin || !host) return;
  const originHost = new URL(origin).host;
  if (originHost !== host) {
    const error = new Error('Origem inválida');
    error.status = 403;
    throw error;
  }
}

function parseFiles() {
  let parsed;
  try {
    parsed = JSON.parse(env('SITE_EDITOR_FILES'));
  } catch {
    throw new Error('SITE_EDITOR_FILES deve ser um JSON válido.');
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('SITE_EDITOR_FILES deve conter ao menos um arquivo.');
  }
  return parsed.map((item, index) => {
    if (!item || typeof item !== 'object' || !item.path) {
      throw new Error(`Entrada ${index + 1} de SITE_EDITOR_FILES é inválida.`);
    }
    const safePath = String(item.path).replace(/\\/g, '/').replace(/^\/+/, '');
    if (safePath.includes('..') || path.isAbsolute(safePath) || !safePath.toLowerCase().endsWith('.json')) {
      throw new Error(`Caminho não permitido em SITE_EDITOR_FILES: ${item.path}`);
    }
    return {
      id: String(item.id || `file-${index + 1}`),
      label: String(item.label || safePath),
      path: safePath,
      previewPath: String(item.previewPath || '/'),
    };
  });
}

export function editorFiles() {
  return parseFiles();
}

export function resolveEditorFile(id) {
  const file = editorFiles().find((item) => item.id === id);
  if (!file) {
    const error = new Error('Arquivo não permitido pelo editor.');
    error.status = 404;
    throw error;
  }
  return file;
}

function localFilePath(file) {
  const root = path.resolve(process.cwd());
  const absolute = path.resolve(root, file.path);
  const relative = path.relative(root, absolute);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    const error = new Error('O arquivo configurado está fora do projeto.');
    error.status = 403;
    throw error;
  }
  return absolute;
}

function textSha(text) {
  return crypto.createHash('sha256').update(text, 'utf8').digest('hex');
}

export async function readLocalJson(file) {
  const absolute = localFilePath(file);
  let text;
  try {
    text = await fs.readFile(absolute, 'utf8');
  } catch (error) {
    if (error?.code === 'ENOENT') {
      const e = new Error(`Arquivo local não encontrado: ${file.path}`);
      e.status = 404;
      throw e;
    }
    throw error;
  }
  return { content: JSON.parse(text), sha: textSha(text), file, mode: 'local' };
}

export async function saveLocalJson(file, content, sha) {
  const absolute = localFilePath(file);
  const current = await fs.readFile(absolute, 'utf8');
  const currentSha = textSha(current);
  if (sha && currentSha !== sha) {
    const error = new Error('O arquivo local mudou desde que você abriu o editor. Recarregue antes de salvar.');
    error.status = 409;
    throw error;
  }

  const backupDir = path.join(process.cwd(), '.estibordo-editor-backups');
  await fs.mkdir(backupDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${file.path.replace(/[\\/]/g, '__')}.${stamp}.bak`;
  await fs.writeFile(path.join(backupDir, backupName), current, 'utf8');

  const nextText = `${JSON.stringify(content, null, 2)}\n`;
  await fs.writeFile(absolute, nextText, 'utf8');
  return { sha: textSha(nextText), backup: path.join('.estibordo-editor-backups', backupName) };
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

export async function readGithubJson(file) {
  const { owner, repo, branch } = githubConfig();
  const apiPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${file.path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(branch)}`;
  const data = await githubRequest(apiPath);
  if (data.type !== 'file' || !data.content) throw new Error('O caminho configurado não é um arquivo JSON válido.');
  const text = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf8');
  return { content: JSON.parse(text), sha: data.sha, file, mode: 'github' };
}

export async function saveGithubJson(file, content, sha, message) {
  const { owner, repo, branch } = githubConfig();
  const apiPath = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${file.path.split('/').map(encodeURIComponent).join('/')}`;
  const body = {
    message: message || `Edita ${file.path} pelo editor visual ESTIBORDO`,
    content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`, 'utf8').toString('base64'),
    branch,
    sha,
  };
  return githubRequest(apiPath, { method: 'PUT', body: JSON.stringify(body) });
}

export async function readEditorJson(file) {
  return editorMode() === 'local' ? readLocalJson(file) : readGithubJson(file);
}

export async function saveEditorJson(file, content, sha, message) {
  if (editorMode() === 'local') return saveLocalJson(file, content, sha);
  const result = await saveGithubJson(file, content, sha, message);
  return { sha: result?.content?.sha || null, commit: result?.commit?.html_url || null };
}

export function routeError(error) {
  const status = Number(error?.status) || 500;
  const safeMessage = status >= 500 ? String(error?.message || 'Não foi possível concluir a operação.') : String(error?.message || 'Erro');
  return Response.json({ ok: false, error: safeMessage }, { status });
}
