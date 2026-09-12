import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const gradlePath = resolve(process.cwd(), 'android/app/build.gradle');
let gradle = await readFile(gradlePath, 'utf8');

const required = [
  'ANDROID_KEYSTORE_FILE',
  'ANDROID_KEYSTORE_PASSWORD',
  'ANDROID_KEY_ALIAS',
  'ANDROID_KEY_PASSWORD'
];

const missing = required.filter((name) => !process.env[name]);
if (missing.length) {
  console.log('Assinatura de release não configurada; build continuará sem assinatura Play.');
  process.exit(0);
}

const signingBlock = `
    signingConfigs {
        release {
            storeFile file(System.getenv("ANDROID_KEYSTORE_FILE"))
            storePassword System.getenv("ANDROID_KEYSTORE_PASSWORD")
            keyAlias System.getenv("ANDROID_KEY_ALIAS")
            keyPassword System.getenv("ANDROID_KEY_PASSWORD")
        }
    }
`;

if (!gradle.includes('signingConfigs {')) {
  gradle = gradle.replace(/android\s*\{/, (match) => match + signingBlock);
}

gradle = gradle.replace(
  /release\s*\{([\s\S]*?)\n\s*\}/,
  (match, body) => {
    if (body.includes('signingConfig signingConfigs.release')) return match;
    return `release {${body}\n            signingConfig signingConfigs.release\n        }`;
  }
);

await writeFile(gradlePath, gradle, 'utf8');
console.log('Assinatura de release configurada para o AAB.');
