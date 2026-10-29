# Deploying MIRAAH (Cloud Run + Firebase)

Run these in order, in **your** project. Set the variables first:

```bash
PROJECT=substantial-braid-m5xj8          # projectId in firebase-applet-config.json
REGION=me-central2                        # or another Cloud Run region
BUCKET=substantial-braid-m5xj8.firebasestorage.app   # storageBucket in firebase-applet-config.json
SA=miraah-run@$PROJECT.iam.gserviceaccount.com
```

## 1. Prerequisites
- The Firebase project is on the **Blaze** plan. Cloud Storage buckets on `*.firebasestorage.app` require it.
- Install `gcloud`, then sign in with `gcloud auth login`.

```bash
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com \
  secretmanager.googleapis.com firestore.googleapis.com storage.googleapis.com --project $PROJECT
```

## 2. Firebase console
1. Go to **Authentication**, then **Sign-in method**, and enable **Google**.
2. Go to **Storage** and click *Get started*. This creates the bucket.
3. Deploy the security rules from the repo root:
   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules,storage --project $PROJECT
   ```
   These rules block clients from reading or writing workspace data and evidence directly. Only the server can.

## 3. Dedicated service account (least privilege)
```bash
gcloud iam service-accounts create miraah-run --project $PROJECT --display-name "MIRAAH Cloud Run"
gcloud projects add-iam-policy-binding $PROJECT --member "serviceAccount:$SA" --role roles/datastore.user
gcloud storage buckets add-iam-policy-binding gs://$BUCKET --member "serviceAccount:$SA" --role roles/storage.objectAdmin
```

## 4. Secrets
```bash
node scripts/gen-signing-key.mjs     # prints PASSPORT_SIGNING_KEY (base64) and the public key
printf '%s' 'PASTE_BASE64_KEY' | gcloud secrets create passport-signing-key --data-file=- --project $PROJECT
printf '%s' 'YOUR_GEMINI_KEY'  | gcloud secrets create gemini-api-key      --data-file=- --project $PROJECT
for s in passport-signing-key gemini-api-key; do
  gcloud secrets add-iam-policy-binding $s --member "serviceAccount:$SA" --role roles/secretmanager.secretAccessor --project $PROJECT
done
```
Never commit keys or paste them into chats.

## 5. Deploy
Use `^;^` so that more than one admin email can be passed without the comma breaking the list:
```bash
gcloud run deploy miraah --source . --region $REGION --project $PROJECT \
  --service-account $SA --allow-unauthenticated --max-instances 1 \
  --set-env-vars '^;^ADMIN_EMAILS=you@example.com,colleague@example.com;AI_REQUIRE_AUTH=true' \
  --set-secrets 'GEMINI_API_KEY=gemini-api-key:latest,PASSPORT_SIGNING_KEY=passport-signing-key:latest'
```
- `--max-instances 1` is needed because rate limits are held in memory.
- Leave `TRUST_PROXY` unset. It defaults to 1 on Cloud Run.
- Never set `FIREBASE_AUTH_EMULATOR_HOST`, `E2E_FAKE_VISION` or `MIRAAH_E2E` in production. On Cloud Run the server refuses to start if `FIREBASE_AUTH_EMULATOR_HOST` or `E2E_FAKE_VISION` is set.
- `--source` builds with Cloud Build. In newer projects, grant the Cloud Build service account `roles/run.builder` first if the build is denied.

After deploying, go to Firebase **Authentication**, then **Settings**, then **Authorized domains**, and add the Cloud Run URL's domain.

## 6. First run
1. Open the service URL. Go to **Live Workspace** and sign in with an email listed in `ADMIN_EMAILS`.
2. Assign roles:
   - **inspector** records assets, photos and findings
   - **reviewer** verifies and resolves findings
   - **viewer** has read-only access
3. Check that it works: `GET /api/health`, and `GET /api/passport/public-key` (this should return a `key_id`).
4. Upload a few real inspection photos and confirm the AI suggestions are sensible. The model only suggests; inspectors decide.

## 7. Restrict the public Firebase web key
In Google Cloud Console, go to **APIs & Services**, then **Credentials**. Restrict the browser key to your Cloud Run domain **and** `PROJECT.firebaseapp.com`. Google sign-in needs the second one.

## Known limits (MVP)
- **Single tenant.** Every role can see every asset and every photo in the deployment. Use one deployment per organisation until per-case access is added.
- **Photo metadata.** Photos are stored as uploaded, including any EXIF metadata such as GPS.
- **Audit log.** Entries are written right after each change and are not in the same transaction, so a failure between the two steps could leave a change without an audit entry.
- **Revoked users.** A disabled user keeps access until their token expires, up to 1 hour.
- **Manual findings.** In the formulas a manual (inspector-recorded) finding counts with confidence 100. Its stored and exported confidence is empty.
- **Role changes.** These are written to the audit log, but no screen shows them yet.
- **Asset list.** It shows up to 500 assets.
- **Rate limits.** These are per instance. Keep `--max-instances 1`, or move the limits to a shared store.
