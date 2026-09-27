#!/usr/bin/env bash
set -euo pipefail
SEED="${1:-.standalone-private/estibordo-private-seed.json}"
MANIFEST="${2:-.standalone-private/estibordo-private-seed-manifest.json}"
[ -f "$SEED" ] || { echo "Private seed not found: $SEED" >&2; exit 2; }
node -e 'const fs=require("fs"),p=process.argv[1],d=JSON.parse(fs.readFileSync(p));if(d.schema_version!==2||!d.data||!Array.isArray(d.data.profile))throw Error("invalid private seed");for(const k of ["answers","notebooks","exams","mastery","review_queue","study_sessions","study_plan","bibliography"])if(!Array.isArray(d.data[k]))throw Error("missing "+k);' "$SEED"
rm -rf android/app/src/main/assets/private
mkdir -p android/app/src/main/assets/private
cp "$SEED" android/app/src/main/assets/private/estibordo-private-seed.json
[ ! -f "$MANIFEST" ] || cp "$MANIFEST" android/app/src/main/assets/private/estibordo-private-seed-manifest.json
cleanup(){ rm -rf android/app/src/main/assets/private; }
trap cleanup EXIT
(cd android && gradle --no-daemon assembleDebug)
APK=android/app/build/outputs/apk/debug/app-debug.apk
unzip -l "$APK" | grep -q 'assets/private/estibordo-private-seed.json'
mkdir -p .standalone-private/output
cp "$APK" .standalone-private/output/ESTIBORDO-Private.apk
echo "Private APK: .standalone-private/output/ESTIBORDO-Private.apk"
