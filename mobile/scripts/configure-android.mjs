import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const androidRoot = resolve(process.cwd(), "android");
const manifestPath = resolve(androidRoot, "app/src/main/AndroidManifest.xml");
const gradlePath = resolve(androidRoot, "app/build.gradle");

const versionName = process.env.ESTIBORDO_VERSION_NAME || "1.0.0";
const versionCode = Number.parseInt(process.env.ESTIBORDO_VERSION_CODE || "1", 10);

if (!Number.isInteger(versionCode) || versionCode < 1) {
  throw new Error("ESTIBORDO_VERSION_CODE deve ser inteiro >= 1.");
}

let manifest = await readFile(manifestPath, "utf8");

const customSchemeFilter = [
  "            <intent-filter>",
  "                <action android:name=\"android.intent.action.VIEW\" />",
  "                <category android:name=\"android.intent.category.DEFAULT\" />",
  "                <category android:name=\"android.intent.category.BROWSABLE\" />",
  "                <data android:scheme=\"estibordo\" />",
  "            </intent-filter>"
].join("\n");

const httpsFilter = [
  "            <intent-filter android:autoVerify=\"true\">",
  "                <action android:name=\"android.intent.action.VIEW\" />",
  "                <category android:name=\"android.intent.category.DEFAULT\" />",
  "                <category android:name=\"android.intent.category.BROWSABLE\" />",
  "                <data android:scheme=\"https\" android:host=\"simulado-pscpp.vercel.app\" />",
  "            </intent-filter>"
].join("\n");

if (!manifest.includes('android:scheme="estibordo"')) {
  manifest = manifest.replace("</activity>", customSchemeFilter + "\n" + httpsFilter + "\n        </activity>");
}

if(!manifest.includes('android:usesCleartextTraffic="false"')){
  manifest=manifest.replace("<application","<application\n        android:usesCleartextTraffic=\"false\"");
}
await writeFile(manifestPath, manifest, "utf8");

let gradle = await readFile(gradlePath, "utf8");
gradle = gradle.replace(/versionCode\s+\d+/, "versionCode " + versionCode);
gradle = gradle.replace(/versionName\s+"[^"]+"/, 'versionName "' + versionName + '"');
gradle = gradle.replace(/release\s*\{([\s\S]*?)\n\s*\}/,(match,body)=>{
  let next=body;
  if(!/minifyEnabled\s+true/.test(next))next=next.replace(/minifyEnabled\s+false/,"minifyEnabled true");
  if(!/shrinkResources\s+true/.test(next))next+="\n            shrinkResources true";
  if(!/proguardFiles/.test(next))next+="\n            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'";
  return "release {"+next+"\n        }";
});
await writeFile(gradlePath, gradle, "utf8");

console.log("Android configurado:", { versionName, versionCode });
