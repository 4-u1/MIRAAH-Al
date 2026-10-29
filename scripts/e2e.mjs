// End-to-end test of the signed-in Live Workspace flow in a real browser, against the Firebase
// Auth / Firestore / Storage emulators. Run by the `e2e` CI job (see .github/workflows/ci.yml).
// Flow: admin assigns roles → inspector creates an asset, coverage, uploads a photo, gets an
// AI suggestion (fake model), confirms a finding → reviewer verifies, resolves and exports a
// signed passport → the server confirms fingerprint and signature.
import { chromium } from "playwright";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { mkdirSync, writeFileSync } from "fs";

const BASE = process.argv[2] || "http://127.0.0.1:3000";
const PROJECT = process.env.GCLOUD_PROJECT;
const failures = [];
const passes = [];
const ok = (m) => (passes.push(m), console.log("PASS", m));
const bad = (m) => (failures.push(m), console.log(`::error title=e2e::${m}`));

const USERS = {
  admin: { email: "admin@e2e.test", password: "pass-1234" },
  insp: { email: "insp@e2e.test", password: "pass-1234" },
  rev: { email: "rev@e2e.test", password: "pass-1234" },
};

initializeApp({ projectId: PROJECT });
for (const u of Object.values(USERS)) {
  await getAuth().createUser({ email: u.email, password: u.password, emailVerified: true }).catch(() => {});
}
ok("emulator users created");

for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`${BASE}/api/health`)).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 1000));
}

mkdirSync("e2e-shots", { recursive: true });
const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==", "base64");
writeFileSync("e2e-shots/photo.png", png);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
let step = 0;
const shot = (name) => page.screenshot({ path: `e2e-shots/${String(++step).padStart(2, "0")}-${name}.png`, fullPage: true });

async function as(who) {
  await page.evaluate(() => window.__miraahTest?.signOut());
  await page.waitForTimeout(300);
  await page.evaluate(({ e, p }) => window.__miraahTest.signIn(e, p), { e: USERS[who].email, p: USERS[who].password });
  await page.getByRole("button", { name: "Live Workspace" }).first().click();
  await page.getByText(USERS[who].email).first().waitFor({ timeout: 20000 });
}

try {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => Boolean(window.__miraahTest), null, { timeout: 20000 });
  ok("test build exposes emulator sign-in");

  // Admin assigns roles
  await as("admin");
  for (const [email, role] of [[USERS.insp.email, "inspector"], [USERS.rev.email, "reviewer"]]) {
    await page.getByTestId("role-email").fill(email);
    await page.getByTestId("role-select").selectOption(role);
    await page.getByTestId("role-save").click();
    await page.getByText(`${email} — ${role}`).waitFor({ timeout: 10000 });
  }
  ok("admin assigned inspector and reviewer roles");
  await shot("admin-roles");

  // Inspector: asset, coverage, photo, AI suggestion, finding
  await as("insp");
  await page.getByTestId("new-asset").click();
  await page.getByPlaceholder("Name *").fill("E2E Villa");
  await page.getByPlaceholder("City *").fill("Riyadh");
  await page.getByPlaceholder("District").fill("Malqa");
  await page.getByPlaceholder("Address / location").fill("Street 1");
  await page.getByPlaceholder("Built area m² *").fill("450");
  await page.getByPlaceholder("Build year *").fill("2016");
  await page.getByPlaceholder("Valuation SAR (as provided)").fill("3500000");
  await page.getByPlaceholder("Case reference").fill("E2E-001");
  await page.getByTestId("create-asset").click();
  await page.getByText("Inspection coverage by area").waitFor({ timeout: 15000 });
  ok("inspector created an asset");

  await page.getByTestId("add-area").click();
  await page.getByTestId("coverage-name").last().fill("Roof");
  await page.getByTestId("coverage-pct").last().fill("80");
  await page.getByTestId("save-coverage").click();
  await page.getByText("80%").first().waitFor({ timeout: 10000 });
  ok("coverage saved (80%)");

  await page.getByTestId("upload-input").setInputFiles("e2e-shots/photo.png");
  await page.getByText(/SHA-256 [0-9a-f]{16}/).first().waitFor({ timeout: 15000 });
  ok("photo uploaded and its SHA-256 shown");

  await page.getByTestId("ai-suggest").first().click();
  await page.getByText("e2e-fake").first().waitFor({ timeout: 15000 });
  ok("AI suggestion stored and shown");
  await page.getByTestId("use-suggestion").first().click();
  await page.getByTestId("finding-area").fill("Roof parapet");
  await page.getByTestId("save-finding").click();
  await page.getByText("AI + inspector").first().waitFor({ timeout: 10000 });
  ok("finding saved from the AI suggestion (confirmed by inspector)");
  await shot("inspector-asset");

  // Reviewer: verify, resolve, export, verify signature
  await as("rev");
  await page.getByTestId("asset-row").first().click();
  await page.getByTestId("verify-finding").first().click();
  await page.getByText(`✓ ${USERS.rev.email}`).first().waitFor({ timeout: 10000 });
  await page.getByTestId("resolve-finding").first().click();
  await page.waitForTimeout(800);
  ok("reviewer verified and resolved the finding");

  await page.getByTestId("export-passport").click();
  await page.getByText("Ed25519 signature").first().waitFor({ timeout: 15000 });
  await page.getByTestId("verify-export").click();
  await page.getByTestId("verify-msg").waitFor({ timeout: 10000 });
  const msg = await page.getByTestId("verify-msg").innerText();
  /✓ data matches fingerprint/.test(msg) && /signature valid/.test(msg) && !/invalid/.test(msg)
    ? ok(`signed passport verified by the server (${msg.trim()})`)
    : bad(`verify message: ${msg}`);
  const body = await page.innerText("body");
  /recorded data/i.test(body) ? ok("passport labelled as recorded data") : bad("passport not labelled as recorded data");
  /DEMO/.test(await page.locator("text=NOT AN OFFICIAL DOCUMENT").first().innerText()) && bad("recorded passport shows a DEMO watermark");
  await shot("reviewer-export");
} catch (e) {
  bad(`flow stopped: ${String(e.message || e).split("\n")[0]}`);
  await shot("failure").catch(() => {});
}

await browser.close();
for (const e of errors.slice(0, 5)) bad(`page error: ${e.slice(0, 200)}`);
console.log(`::notice title=E2E summary::${failures.length} failure(s), ${passes.length} passed — ${passes.join(" | ").slice(0, 900)}`);
process.exit(failures.length ? 1 : 0);
