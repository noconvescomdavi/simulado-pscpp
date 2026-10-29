import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

// Fingerprint the conservative static local import closure. A source imported
// indirectly by a normalizer or a supplemental bank must invalidate --check.
export async function hashLocalModuleClosure(root, entries, additionalInputs = []) {
  const rootPath = path.resolve(root);
  const visited = new Set();
  const queue = [...entries];
  async function resolveLocal(importer, specifier) {
    const base = path.resolve(rootPath, path.dirname(importer), specifier);
    if (base !== rootPath && !base.startsWith(rootPath + path.sep)) throw new Error(`Import outside project: ${importer}`);
    for (const candidate of [base, `${base}.js`, `${base}.mjs`, `${base}.json`, path.join(base, 'index.js')]) {
      try { if ((await fs.stat(candidate)).isFile()) return path.relative(rootPath, candidate).split(path.sep).join('/'); }
      catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
    throw new Error(`Unresolved local import in ${importer}: ${specifier}`);
  }
  while (queue.length) {
    const file = queue.pop();
    if (visited.has(file)) continue;
    visited.add(file);
    if (file.endsWith('.json')) continue;
    const text = await fs.readFile(path.join(rootPath, file), 'utf8');
    const imports = /(?:\bfrom\s*|\bimport\s*\(\s*|\bimport\s*|\brequire\s*\(\s*)["'](\.[^"']+)["']/g;
    for (const match of text.matchAll(imports)) queue.push(await resolveLocal(file, match[1]));
  }
  for (const file of additionalInputs) visited.add(file);
  const hash = createHash('sha256');
  const inputs = [...visited].sort();
  for (const file of inputs) { hash.update(file); hash.update(await fs.readFile(path.join(rootPath, file))); }
  return { sourceHash: hash.digest('hex'), inputs };
}
