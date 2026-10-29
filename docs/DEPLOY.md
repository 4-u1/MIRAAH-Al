# Deploying MIRAAH

The default setup is **one server, SQLite, Docker**. The database and the evidence photos live on the server's disk, so you can host in Saudi Arabia with any provider that sells a Linux VPS. Sign-in uses **Firebase Authentication** with Google accounts. The free Spark plan is enough, because nothing else in Firebase is needed.

An alternative backend (Firestore + Cloud Storage on Cloud Run) is described at the end.

---

## 1. Server
- A Linux VPS. The minimum is 1 vCPU, 1–2 GB RAM and 20 GB disk; more disk for photos. Choose a Saudi data centre if data residency matters.
- A domain or subdomain (e.g. `miraah.example.com`) with an **A record** pointing to the server's IP.
- Install Docker and the Compose plugin with `curl -fsSL https://get.docker.com | sh`.
- Open ports 80 and 443.

## 2. Firebase sign-in (free)
1. Open console.firebase.google.com and select project `substantial-braid-m5xj8` (or your own project, updating `firebase-applet-config.json`).
2. Go to **Authentication**, then **Sign-in method**, and enable **Google**.
3. Under **Authentication**, go to **Settings**, then **Authorized domains**, and add your domain (e.g. `miraah.example.com`).
4. In Google Cloud Console, go to **APIs & Services**, then **Credentials**, and restrict the browser key to your domain **and** `substantial-braid-m5xj8.firebaseapp.com`. Google sign-in needs the second one.

## 3. Get the code and create secrets on the server
```bash
git clone https://github.com/4-u1/MIRAAH-Al.git miraah && cd miraah
docker run --rm -v "$PWD":/w -w /w node:22-slim node scripts/gen-signing-key.mjs
```
Create `.env` next to `docker-compose.yml`. Never commit it, and never paste keys into chats.
```
ADMIN_EMAILS=you@example.com
PASSPORT_SIGNING_KEY=<the base64 line printed above>
GEMINI_API_KEY=<your Gemini key>
```
Lock it down with `chmod 600 .env`.

Edit `Caddyfile` and replace `miraah.example.com` with your domain.

## 4. Start
```bash
docker compose up -d --build
docker compose logs -f miraah     # expect: "Live workspace enabled · store sqlite · signing on (key …)"
```
Caddy obtains the HTTPS certificate automatically.

## 5. First run
1. Open `https://your-domain`, go to **Live Workspace**, and sign in with the email in `ADMIN_EMAILS`.
2. Assign roles:
   - **inspector** records assets, photos and findings
   - **reviewer** verifies and resolves findings
   - **viewer** has read-only access
3. Check that it works: `https://your-domain/api/health`, and `/api/passport/public-key` should show a `key_id`.
4. Upload a few real inspection photos and check that the AI suggestions are sensible. The model only suggests; the inspector decides.

## 6. Backups (do this on day one)
```bash
docker compose exec miraah node scripts/backup.mjs      # writes ./backups/<timestamp>/ (database + photos)
```
Schedule it every night with `crontab -e`:
```
0 2 * * * cd /root/miraah && docker compose exec -T miraah node scripts/backup.mjs >> backups/backup.log 2>&1
```
Then copy `./backups` off the server, for example with `rsync` to another machine or object storage. A backup that stays on the same disk does not protect you from losing the server.

**To restore:** stop the service with `docker compose stop miraah`, then copy `miraah.db` and the `evidence/` folder from a backup into the `miraah-data` volume and start it again.

## 7. Updates
```bash
git pull && docker compose up -d --build
```
Data is in the `miraah-data` volume and survives rebuilds.

## Rules for this setup
- **Run one instance only.** SQLite and the in-memory rate limits assume a single server process.
- **Keep `TRUST_PROXY=1`.** `docker-compose.yml` already sets it, because the app sits behind Caddy.
- **Never set test-only variables in production.** These are `FIREBASE_AUTH_EMULATOR_HOST`, `E2E_FAKE_VISION` and `MIRAAH_E2E`. If either of the first two is set without `MIRAAH_E2E=1`, the server refuses to start.

## Known limits (MVP)
- **Single tenant:** every role can see every asset and every photo on this server.
- **Photo metadata:** photos are stored as uploaded, including any EXIF metadata such as GPS.
- **Audit log:** the database itself makes the log append-only (it rejects updates and deletes), but each entry is written right after its change, not in the same transaction.
- **Revoked users:** a disabled user keeps access until their token expires, up to 1 hour.
- **Manual findings:** in the formulas, a manual (inspector-recorded) finding counts with confidence 100. Its stored and exported confidence is empty.
- **Role changes:** these are audited, but no screen shows them yet.

---

## Alternative: Firestore + Cloud Storage on Cloud Run
Set `WORKSPACE_STORE=firebase`. This requires the **Blaze** plan, and it never uses the local disk. Steps:

1. Enable the APIs: run, cloudbuild, artifactregistry, secretmanager, firestore and storage.
2. In Firebase, enable Storage.
3. Deploy the rules with `npx firebase-tools deploy --only firestore:rules,storage`.
4. Create a dedicated service account with `roles/datastore.user` and bucket `roles/storage.objectAdmin`.
5. Put the secrets in Secret Manager and grant that service account `secretAccessor`.
6. Deploy:
   ```bash
   gcloud run deploy miraah --source . --service-account SA --max-instances 1 \
     --set-env-vars '^;^WORKSPACE_STORE=firebase;ADMIN_EMAILS=a@x.com,b@y.com' \
     --set-secrets 'GEMINI_API_KEY=gemini-api-key:latest,PASSPORT_SIGNING_KEY=passport-signing-key:latest'
   ```
   If the build is denied, grant the Cloud Build service account `roles/run.builder`.
