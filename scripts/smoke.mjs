// End-to-end smoke test of the production build in a real browser.
// Usage: start the server (npm start), then: node scripts/smoke.mjs [baseUrl]
// Prints GitHub Actions annotations; exits 1 on any failure. Screenshots go to smoke-shots/.
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const BASE = process.argv[2] || "http://127.0.0.1:3000";
const failures = [];
const note = (t, m) => console.log(`::notice title=${t}::${m}`);
const fail = (t, m) => {
  failures.push(`${t}: ${m}`);
  console.log(`::error title=${t}::${m}`);
};

// Phrases that must never appear on screen (false claims removed in this branch).
const FORBIDDEN = [
  "Gemini 3.8", "LIVE VERIFIED", "SCE VERIFIED", "OFFICIAL ACCREDITED", "Enforcement Order", "ISO/IEC 17020",
  "Certified Valuation", "AUTO-SYNC", "VLM 2.5", "Merkle", "InfathRegistry", "Accredited Liquidation", "معتمد رسمي",
  "100% Verified", "9.14x", "844%", "Plot #419", "IMMUTABLE PROOF", "Taqeem Certified", "VERIFIED · GENUINE",
];

function checkText(where, text) {
  for (const f of FORBIDDEN) if (text.includes(f)) fail(`forbidden text on ${where}`, f);
}

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`${BASE}/api/health`);
      if (r.ok) return r.json();
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("server did not start");
}

const health = await waitForServer();
health.ai === "disabled" && health.authRequired === true
  ? note("health", JSON.stringify(health))
  : fail("health", JSON.stringify(health));

const unauth = await fetch(`${BASE}/api/ai/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "hi" }),
});
unauth.status === 401 ? note("api auth", "POST /api/ai/chat without token → 401") : fail("api auth", `expected 401, got ${unauth.status}`);

mkdirSync("smoke-shots", { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));
page.on("console", (m) => {
  if (m.type() === "error" && !/firestore|firebase|googleapis|ERR_|net::|Failed to load resource|CORS/i.test(m.text())) pageErrors.push(`console: ${m.text()}`);
});

await page.goto(BASE, { waitUntil: "domcontentloaded" });
try {
  await page.getByText("Prototype with demo data", { exact: false }).first().waitFor({ timeout: 20000 });
  note("banner", "demo-data banner visible");
} catch {
  fail("banner", "demo-data banner not found");
}
await page.screenshot({ path: "smoke-shots/01-passport.png" });
checkText("passport", await page.innerText("body"));

const tabs = ["Findings", "Spatial Coverage", "Market Trends", "What-If Simulator", "Next Best Actions", "Buyer Transparency", "PropTech 2.0 OS"];
for (const [i, label] of tabs.entries()) {
  try {
    await page.getByRole("button", { name: label }).first().click({ timeout: 5000 });
    await page.waitForTimeout(800);
    const text = await page.innerText("body");
    checkText(label, text);
    if (!text.includes("Prototype with demo data")) fail("banner", `missing on ${label}`);
    await page.screenshot({ path: `smoke-shots/${String(i + 2).padStart(2, "0")}-${label.replace(/\W+/g, "_")}.png` });
    note("tab", `${label} rendered`);
  } catch (e) {
    fail("tab", `${label}: ${e.message.split("\n")[0]}`);
  }
}

// What-If must start from the asset's computed readiness (asset 20481 → 54), not a constant.
try {
  await page.getByRole("button", { name: "What-If Simulator" }).first().click();
  await page.waitForTimeout(800);
  const t = await page.innerText("body");
  /\b54\b/.test(t) ? note("what-if", "shows the computed readiness 54 for asset 20481") : fail("what-if", "computed readiness 54 not shown");
} catch (e) {
  fail("what-if", e.message.split("\n")[0]);
}

// Export window: 4 data-driven pages with a real 64-hex SHA-256.
try {
  await page.getByRole("button", { name: "Asset Passport" }).first().click();
  await page.waitForTimeout(500);
  await page.getByText("EXPORT DOSSIER", { exact: false }).first().click({ timeout: 5000 });
  await page.waitForTimeout(1500);
  const titles = ["Summary", "Scores & formulas", "Findings", "Fingerprint & limits"];
  for (const [i, t] of titles.entries()) {
    await page.getByRole("button", { name: `${i + 1}. ${t}` }).click();
    await page.waitForTimeout(300);
    const text = await page.innerText("body");
    checkText(`export page ${i + 1}`, text);
    if (!/SHA-256 [0-9a-f]{64}/.test(text)) fail("export", `page ${i + 1}: full SHA-256 not shown`);
    await page.screenshot({ path: `smoke-shots/20-export-page${i + 1}.png` });
  }
  note("export", "4 pages rendered with a 64-hex SHA-256");
  await page.keyboard.press("Escape");
} catch (e) {
  fail("export", e.message.split("\n")[0]);
}

// Arabic: switch language and re-check the passport view.
try {
  await page.goto(BASE, { waitUntil: "domcontentloaded" });
  await page.getByText("Prototype with demo data", { exact: false }).first().waitFor({ timeout: 20000 });
  await page.getByRole("button", { name: "عربي" }).first().click();
  await page.waitForTimeout(800);
  const t = await page.innerText("body");
  checkText("arabic passport", t);
  t.includes("نموذج تجريبي ببيانات توضيحية") ? note("arabic", "Arabic banner visible") : fail("arabic", "Arabic banner not found");
  await page.screenshot({ path: "smoke-shots/30-arabic.png" });
} catch (e) {
  fail("arabic", e.message.split("\n")[0]);
}

await browser.close();
if (pageErrors.length) for (const e of pageErrors.slice(0, 10)) fail("page error", e.slice(0, 300));
console.log(`::notice title=Smoke summary::${failures.length} failure(s)`);
process.exit(failures.length ? 1 : 0);
