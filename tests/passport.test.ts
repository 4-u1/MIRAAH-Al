import { describe, it, expect } from "vitest";
import {
  buildPassportData,
  buildPassportExport,
  buildPassportCsv,
  canonicalJson,
  sha256Hex,
  verifyPassportExport,
  CSV_HEADERS,
} from "../src/utils/passport";
import { computeAssetScores } from "../src/utils/scoring";
import { MOCK_ASSETS } from "../src/data/mockAssets";

describe("sha256Hex", () => {
  it("matches the standard test vectors", async () => {
    expect(await sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(await sha256Hex("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });
});

describe("canonicalJson", () => {
  it("sorts keys recursively and is independent of insertion order", () => {
    expect(canonicalJson({ b: 1, a: { d: [3, { z: 1, y: 2 }], c: "x" } })).toBe('{"a":{"c":"x","d":[3,{"y":2,"z":1}]},"b":1}');
    expect(canonicalJson({ a: 1, b: 2 })).toBe(canonicalJson({ b: 2, a: 1 }));
  });
  it("drops undefined fields and rejects non-finite numbers", () => {
    expect(canonicalJson({ a: undefined, b: null })).toBe('{"b":null}');
    expect(() => canonicalJson({ a: Number.NaN })).toThrow();
  });
});

describe("passport export", () => {
  const asset = MOCK_ASSETS[0];
  const scores = computeAssetScores(asset.findings, asset.coverageAreas, asset.missingFieldsCount);
  const data = buildPassportData(asset, scores);

  it("is honest about its status", () => {
    expect(data.data_status).toBe("demo");
    const text = JSON.stringify(data).toLowerCase();
    for (const banned of ["blockchain", "accredit", "certified", "digital_signature", "authority"]) {
      expect(text).not.toContain(banned);
    }
  });

  it("fingerprint verifies, and any change to the data breaks it", async () => {
    const exp = await buildPassportExport(data, new Date("2026-10-29T00:00:00Z"));
    expect(exp.fingerprint.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(await verifyPassportExport(exp)).toBe(true);

    const tampered = JSON.parse(JSON.stringify(exp));
    tampered.passport.scores.liquidation_readiness_index += 1;
    expect(await verifyPassportExport(tampered)).toBe(false);
  });

  it("fingerprint is stable across exports and ignores generated_at", async () => {
    const a = await buildPassportExport(data, new Date("2026-01-01T00:00:00Z"));
    const b = await buildPassportExport(buildPassportData(asset, scores), new Date("2026-12-31T00:00:00Z"));
    expect(a.fingerprint.sha256).toBe(b.fingerprint.sha256);
  });

  it("CSV carries the same numbers and fingerprint as the JSON", async () => {
    const exp = await buildPassportExport(data);
    const csv = buildPassportCsv(data, exp.fingerprint.sha256);
    const lines = csv.replace(/^﻿/, "").split("\r\n");
    expect(lines[0]).toBe(CSV_HEADERS.join(","));
    expect(lines.length).toBe(1 + Math.max(1, data.findings.length));
    const parse = (l: string) => l.slice(1, -1).split('","');
    const row = parse(lines[1]);
    const col = (h: (typeof CSV_HEADERS)[number]) => row[CSV_HEADERS.indexOf(h)];
    expect(Number(col("liquidation_readiness_index"))).toBe(data.scores.liquidation_readiness_index);
    expect(Number(col("condition_index"))).toBe(data.scores.condition_index);
    expect(col("passport_sha256")).toBe(exp.fingerprint.sha256);
    expect(col("data_status")).toBe("demo");
  });

  it("CSV neutralises spreadsheet formula injection", () => {
    const evil = { ...data, asset: { ...data.asset, name: '=HYPERLINK("http://x","y")' } };
    const csv = buildPassportCsv(evil, "0".repeat(64));
    expect(csv).toContain(`"'=HYPERLINK(""http://x"",""y"")"`);
  });
});
