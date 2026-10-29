# Deploying MIRAAH (Cloud Run + Firebase)

Everything below runs in **your** Google Cloud / Firebase project. Replace `PROJECT` with your project id
(`substantial-braid-m5xj8` in `firebase-applet-config.json`) and `REGION` with e.g. `me-central2`.

## 1. Firebase
1. Firebase console → **Authentication** → enable **Google** sign-in. Add your Cloud Run domain to *Authorized domains*.
2. **Firestore** already exists (named database in `firebase-applet-config.json`).
3. **Storage** → *Get started* (creates the bucket in `storageBucket`).
4. Deploy rules (CLI, from the repo root):
   ```bash
   npx firebase-tools login
   npx firebase-tools deploy --only firestore:rules,storage --project PROJECT
   ```
   Clients cannot read or write workspace data or evidence directly; only the server can.

## 2. Secrets
```bash
node scripts/gen-signing-key.mjs            # prints PASSPORT_SIGNING_KEY (base64) and the public key
printf '%s' 'PASTE_BASE64_KEY' | gcloud secrets create passport-signing-key --data-file=- --project PROJECT
printf '%s' 'YOUR_GEMINI_KEY'  | gcloud secrets create gemini-api-key      --data-file=- --project PROJECT
```
Never commit keys or paste them into chats.

## 3. Cloud Run
```bash
gcloud run deploy miraah --source . --region REGION --project PROJECT \
  --allow-unauthenticated \
  --set-env-vars "ADMIN_EMAILS=you@example.com,AI_REQUIRE_AUTH=true" \
  --set-secrets "GEMINI_API_KEY=gemini-api-key:latest,PASSPORT_SIGNING_KEY=passport-signing-key:latest"
```
`TRUST_PROXY` defaults to 1 on Cloud Run. Leave it unset.

Give the Cloud Run service account access to Firestore and the bucket:
```bash
SA=$(gcloud run services describe miraah --region REGION --project PROJECT --format='value(spec.template.spec.serviceAccountName)')
gcloud projects add-iam-policy-binding PROJECT --member "serviceAccount:$SA" --role roles/datastore.user
gcloud storage buckets add-iam-policy-binding gs://BUCKET --member "serviceAccount:$SA" --role roles/storage.objectAdmin
gcloud secrets add-iam-policy-binding gemini-api-key --member "serviceAccount:$SA" --role roles/secretmanager.secretAccessor --project PROJECT
gcloud secrets add-iam-policy-binding passport-signing-key --member "serviceAccount:$SA" --role roles/secretmanager.secretAccessor --project PROJECT
```

## 4. First run
1. Open the service URL → **Live Workspace** → sign in with the email in `ADMIN_EMAILS`.
2. Assign roles: inspector (records), reviewer (verifies/resolves), viewer (read only).
3. Check: `GET /api/health`, `GET /api/passport/public-key` (should return the key id).

## 5. Before relying on AI suggestions
Run `GEMINI_API_KEY=... npm run eval:live` (assistant), and upload a few real photos to confirm the
vision suggestions are reasonable. The model only suggests; inspectors decide.

## Limits to know
- Rate limits are in memory per instance. Keep `--max-instances=1` or move limits to a shared store.
- Firebase web API key in `firebase-applet-config.json` is public by design; restrict it to your domain
  in Google Cloud Console → APIs & Services → Credentials.
