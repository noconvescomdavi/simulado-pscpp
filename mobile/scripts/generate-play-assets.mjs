import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const logoPath = resolve(root, "../public/estibordo/logos/estibordo-logo-principal.svg");
const out = resolve(root, "store-assets");
const logo = await readFile(logoPath);
await mkdir(out, { recursive: true });

await sharp({
  create: { width: 512, height: 512, channels: 4, background: "#07141f" }
})
  .composite([{ input: logo, gravity: "center", density: 360 }])
  .png()
  .toFile(resolve(out, "icon-512.png"));

const featureLogo = await sharp(logo, { density: 300 })
  .resize({ width: 620, height: 300, fit: "inside", withoutEnlargement: false })
  .png()
  .toBuffer();

await sharp({
  create: { width: 1024, height: 500, channels: 4, background: "#07141f" }
})
  .composite([{ input: featureLogo, gravity: "center" }])
  .png()
  .toFile(resolve(out, "feature-graphic-1024x500.png"));

console.log("Assets Play Store gerados em mobile/store-assets.");
