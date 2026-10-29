#!/usr/bin/env bash
# Runs inside `firebase emulators:exec` (which sets FIREBASE_AUTH_EMULATOR_HOST, FIRESTORE_EMULATOR_HOST,
# FIREBASE_STORAGE_EMULATOR_HOST and GCLOUD_PROJECT). Starts the production server in test mode and
# runs the browser flow. Test mode only: never set these variables in production.
set -euo pipefail
export NODE_ENV=production
export MIRAAH_E2E=1
export ADMIN_EMAILS=admin@e2e.test
export E2E_FAKE_VISION=true
export STORAGE_BUCKET="${GCLOUD_PROJECT}.appspot.com"
export PASSPORT_SIGNING_KEY="$(node -e 'const {generateKeyPairSync}=require("crypto");process.stdout.write(Buffer.from(generateKeyPairSync("ed25519").privateKey.export({type:"pkcs8",format:"pem"})).toString("base64"))')"
node server-dist/server.cjs > e2e-server.log 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
node scripts/e2e.mjs http://127.0.0.1:3000
