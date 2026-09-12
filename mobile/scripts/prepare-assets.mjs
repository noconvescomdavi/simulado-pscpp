import { mkdir, copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const mobileRoot = resolve(process.cwd());
const sourceLogo = resolve(mobileRoot, '../public/estibordo/logos/estibordo-logo-principal.svg');
const assetsDir = resolve(mobileRoot, 'assets');

await mkdir(assetsDir, { recursive: true });
await copyFile(sourceLogo, resolve(assetsDir, 'logo.svg'));
await copyFile(sourceLogo, resolve(assetsDir, 'logo-dark.svg'));

console.log('ESTIBORDO Android assets preparados a partir da identidade visual oficial.');
