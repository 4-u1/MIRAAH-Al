# Claims Ledger

Every factual claim found in the README, UI text (Arabic and English), LLM prompts, exports and the in-app presentation, with its status after the `hardening/infath-submission` work.

**Status:** `REAL` = implemented and evidenced · `SIMULATED` = demo data, visibly labelled in the UI · `PLANNED` = described only as future work · `FIXED` = was false, now corrected or removed · `UNVERIFIED` = cannot be checked from the codebase; the owner must confirm.

Baseline: commit `f6508d8` (before this work).

## Product and data

| # | Claim (before) | Where | Status | Evidence | Action taken |
|---|---|---|---|---|---|
| C1 | Prototype built for the Infath Innovation program (Qassim University × Infath), asset-inspection track | README, dossier | UNVERIFIED | Stated by the owner | Kept as "submitted to"; no affiliation implied |
| C2 | "100% compliance with the Infath brief" (8 rows of 100%) | README L20–31 | FIXED | — | Removed; replaced by Implemented / Simulated / Planned tables |
| C3 | Raises asset sale value by 12–22% | README L60 | FIXED | No source | Removed |
| C4 | Cuts dossier preparation time by 70% | README L39 | FIXED | No source | Removed |
| C5 | React 18 + Three.js; folders `SpatialTwin/`, `Inspection/`, `Simulation/`, `Verification/` | README | FIXED | `package.json` has React 19 and no `three`; folders don't exist | README structure rewritten from the actual tree |
| C6 | All assets, findings, valuations, inspectors | `src/data/mockAssets.ts` | SIMULATED | File content | Global demo-data banner on every screen |
| C7 | Evidence frames are inspection captures with AI boxes | Findings, drill-down, dossier | SIMULATED | Frames are Unsplash stock URLs | Caption "illustrative stock image" on the evidence viewer |
| C8 | July 2026 MoJ real-estate operations from the Saudi Open Data portal | `src/data/saudiRealEstateJuly2026.ts`, market views | UNVERIFIED | App totals match the bundled CSV (345 rows, 65,702 ops, conveyance 8,785). Portal not reachable from the review environment | Wording changed from "officially backed" to "bundled open-data file"; owner must confirm the source |
| C9 | Market indicators, forecasts, comps | `MarketTrendsView` | SIMULATED | Hard-coded series | Simulated badge + note |

## Scores and logic

| # | Claim | Where | Status | Evidence | Action |
|---|---|---|---|---|---|
| C10 | Condition Index, Coverage, Confidence, Readiness, Risk computed by formula | `src/utils/scoring.ts` | REAL | `tests/scoring.test.ts`, `docs/READINESS_INDEX.md` | Documented; worked example pinned by a test |
| C11 | Presentation formulas (−25 per critical, "starts at 95%", "−20 per missing deed", weights 40/40/20) | `ProjectDossierModal` | FIXED | Didn't match the code | Rewritten to the real formulas |
| C12 | Moisture blocker "in North Wall" | `scoring.ts` | FIXED | Hard-coded text for every asset | Uses the finding's recorded area (test) |
| C13 | Coverage-gap blocker found the roof only | `scoring.ts` | FIXED | `find(roof ∥ pct<60)` missed other gaps | Lowest-coverage area below 70% (tests) |
| C14 | What-If simulation | `WhatIfSimulatorView` | REAL (estimate) | Calls `calculateLiquidationReadiness` | Labelled as an estimate in the docs |
| C15 | Time-to-sale (7–45 business days) | `aiCoverSummary.ts` | SIMULATED | Fixed bands by score | Marked "illustrative assumption" |

## AI

| # | Claim | Where | Status | Evidence | Action |
|---|---|---|---|---|---|
| C16 | Assistant has live IoT, BIM-AI, blockchain registry (SRE-Chain), real-time AVM, Balady/MOMRAH/e-deed checks | `server.ts` system prompt | FIXED | None exist | Prompt lists only implemented features; simulated and unavailable ones are named explicitly (`tests/prompts.test.ts`) |
| C17 | Replies come from "Gemini 3.8 Flash" | server + client | FIXED | Canned text was labelled with the model id when no key or on error | No key: `source:"template", model:null`. Error: 503. UI shows the actual engine (`tests/server.test.ts`) |
| C18 | Fallback ROI: "+320,000 SAR, 9.14×, −18 days" | server + client fallbacks | FIXED | Invented figures | Removed; template restates provided numbers only |
| C19 | `gemini-3.8-flash` is a valid model | `server/llm.ts` | REAL | Listed as stable on ai.google.dev Gemini models page (checked Oct 2026) | Configurable via `GEMINI_MODEL` |
| C20 | "AI Vision analysis identified…" on upload, confidence 88–98% | `MediaUploadModal` | FIXED | `Math.random()`; type chosen by the user | Manual labelling, confidence 100, honest progress text |
| C21 | "AI cover summary" with accredited Taqeem valuation, legal clearance, LiDAR | `aiCoverSummary.ts` | FIXED | Fixed template | Rewritten to state computed facts and their limits |
| C22 | "Thermal" image mode | Drill-down | FIXED | CSS hue filter | Renamed "hue filter (not thermal)" |

## Trust, documents, exports

| # | Claim | Where | Status | Evidence | Action |
|---|---|---|---|---|---|
| C23 | "SHA-256 VERIFIED" document hash | `AccreditedPdfViewerModal` | FIXED | String built from asset id + doc name | Removed from specimens |
| C24 | Passport "blockchain hash", "Merkle root", "InfathRegistryV2" | `ExportPassportModal` | FIXED | Fake hex strings | Real SHA-256 of canonical passport JSON; verify button and file check (`tests/passport.test.ts`) |
| C25 | Export JSON: `authority: Infath`, accreditations, SBC matrix "100%", `digital_signature_valid: true` | `ExportPassportModal` | FIXED | Hard-coded | Removed; `data_status:"demo"` + disclaimer |
| C26 | CSV SBC reference and repair cost per finding | `ExportPassportModal` | FIXED | Invented from severity | CSV built from the same data as JSON (test) |
| C27 | Title deed (MoJ), SBC certificate, Taqeem valuation, Infath auction clearance; "official seal", "معتمد رسمياً" | Documents viewer, seal | FIXED → SIMULATED | Mock documents | Renamed "specimen", red watermark, issuer lines say "not issued by …", seal text "SPECIMEN · NOT AN OFFICIAL SEAL" |
| C28 | "Certified" dossier PDF, "VERIFIED · GENUINE", "Prepared for judicial enforcement" | Dossier pages | FIXED | — | Prototype wording + watermark on screen and print |
| C29 | Public verify link `miraah.sa/verify/...` and QR | `BuyerView` | PLANNED | Domain not live | Marked planned; QR illustrative |
| C30 | API endpoints `/api/assets`, `/api/inspections/...` | API Explorer | PLANNED | Not implemented | "Proposed API design" banner |

## Security and identity

| # | Claim | Where | Status | Evidence | Action |
|---|---|---|---|---|---|
| C31 | Users are judicial officers of Infath | `firebase.ts`, `AuthContext`, account menu | FIXED | Every Google user got `role: judicial_officer` | `demo_user`, no organisation |
| C32 | AI endpoints protected | `server.ts` | FIXED | No auth, no limits, 15 MB body | Firebase token, zod, 100 KB, burst + daily caps (`tests/server.test.ts`) |
| C33 | Tamper-proof audit trail | Firestore | FIXED → REAL | Owner could edit or delete records and change `inspectorUid` | Append-only rules with field allow-list (`tests/firestore.rules.test.ts`, emulator) |
| C34 | Key isolation: Gemini key server-side only | build | REAL | CI "Bundle secret scan" step | — |

## PropTech "Cognitive OS" (IoT, BIM, predictive, blockchain, AVM, legal)

| # | Claim | Status | Action |
|---|---|---|---|
| C35 | Live IoT gauges, "5/5 LIVE" | SIMULATED | Badge "Simulated"; header says no real systems are connected |
| C36 | BIM-AI deviation, 10-year predictive AI | SIMULATED | Same |
| C37 | National registry & blockchain passport, "100% immutable proof", SHA-256 | SIMULATED | Renamed "future concept · simulated"; hash labelled "illustrative value" |
| C38 | Live comps AVM; Balady legal audit "100% valid" | SIMULATED | Badge |
| C39 | Drone autonomous survey, 3D twin | SIMULATED | Badge; README says Canvas 2D rendering of demo data |
| C40 | Integrations with Infath API, Najiz, Real Estate Exchange, REGA, Taqeem | PLANNED | README "Planned"; dossier says "no integration exists" |

## Counts

40 claims. Was false and now corrected: **22** (of which 1 is now SIMULATED and 1 now REAL). Real: **4**. Simulated and labelled: **9**. Planned: **3**. Unverified, owner to confirm: **2**. **Known false claims remaining: 0.**

Known residual wording: decorative strings inside large simulated components (e.g. sensor names, SLA penalty text) were not rewritten line by line. They sit under the "Simulated" badge and the global demo banner.
