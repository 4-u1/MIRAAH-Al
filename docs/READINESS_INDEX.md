# MIRAAH scoring formulas

All scores are computed in `src/utils/scoring.ts` by deterministic code (no AI). Tests: `tests/scoring.test.ts`.
The AI assistant only reads these numbers; it never computes or changes them.

## Inputs

| Input | Source |
|---|---|
| Findings | `asset.findings`: severity (`Critical` / `Moderate` / `Low`), confidence `conf` 0–100, `isResolved`, evidence frames |
| Coverage areas | `asset.coverageAreas[].pct`: recorded coverage 0–100 per area |
| Missing fields | `asset.missingFieldsCount`: asset-profile fields not provided |

In this prototype all inputs are demo data. For manually labelled findings (upload flow) `conf` is 100.

## 1. Condition Index (CI)

```
CI = clamp(round(100 − Σ_unresolved weight(severity) × conf/100), 0, 100)
weight: Critical = 15, Moderate = 8, Low = 3
```
Resolved findings are not penalised.

## 2. Inspection Coverage (COV)

```
COV = round(mean(area.pct))          (0 if there are no areas)
```

## 3. Inspection Confidence (CONF)

```
CONF = clamp(round(0.50 × COV + 0.30 × mean(conf of all findings) + 0.20 × evidence%), 0, 100)
evidence% = 100 × (findings with ≥1 evidence frame) / (all findings)
If there are no findings: CONF = round(0.50 × COV + 40)
```

## 4. Liquidation Readiness Index (LRI)

```
LRI = clamp(round(100 − 0.40 × (100 − CI) − 0.35 × (100 − COV) − 5 × unresolved − 3 × missingFields), 0, 100)
```
CI and COV enter this formula already rounded.

## 5. Risk level

Evaluated in order:
1. Any unresolved Critical finding → **High**
2. CI ≥ 85 and COV ≥ 90 → **Low**
3. CI ≥ 65 or COV ≥ 70 → **Moderate**
4. CI < 50 or COV < 50 → **High**
5. otherwise → **Requires Expert Review**

## 6. Readiness blockers

- `COVERAGE_GAP` (High): the area with the lowest coverage, if it is below 70%.
- `UNRESOLVED_MOISTURE` (Medium): first unresolved Moisture finding, naming its recorded area.
- `MISSING_DOCS` (Medium): one or more missing asset-profile fields.
- `PENDING_VERIFICATION` (Low): only if none of the above apply and unresolved findings remain.

## Worked example: demo asset #20481 (Al-Andalus Commercial Building)

Values below were produced by running `computeAssetScores` on `src/data/mockAssets.ts` and checked by hand.

| Finding | Severity | conf | Penalty |
|---|---|---|---|
| 1 | Moderate | 88 | 8 × 0.88 = 7.04 |
| 2 | Low | 91 | 3 × 0.91 = 2.73 |
| 3 | Low | 79 | 3 × 0.79 = 2.37 |
| 4 | Low | 74 | 3 × 0.74 = 2.22 |
| 5 | Low | 93 | 3 × 0.93 = 2.79 |
| 6 | Critical | 95 | 15 × 0.95 = 14.25 |
| | | | **Σ = 31.40** |

- CI = round(100 − 31.40) = **69**
- COV = round(mean(100, 98, 95, 92, 99)) = round(96.8) = **97**
- CONF = round(0.50 × 97 + 0.30 × 86.67 + 0.20 × 100) = round(94.5) = **95**
- LRI = round(100 − 0.40 × 31 − 0.35 × 3 − 5 × 6 − 3 × 1) = round(53.55) = **54**
- Risk = **High** (an unresolved Critical finding)

## Known limitations

- Weights and coefficients are design choices for the prototype, not calibrated against real auction outcomes.
- Coverage is an unweighted mean; large and small areas count equally.
- Confidence values in the demo data are illustrative; there is no vision model in this version.
- The score is not an engineering assessment or a valuation. Any official use needs a licensed engineer and an accredited valuer.
