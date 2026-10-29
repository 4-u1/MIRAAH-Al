import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Upload, Sparkles, Check, X, FileDown, ShieldCheck, Plus, Save } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ws, verifyExport, type Me, type WsAsset, type WsEvidence, type WsFinding, type AuditEntry, type CoverageArea } from "../../lib/workspaceApi";
import { PassportDocument, PASSPORT_PAGE_TITLES } from "../ExportPassport/PassportDocument";
import { sanitizeElementForCanvas } from "../../utils/canvasSanitizer";
import type { PassportData, PassportExport } from "../../utils/passport";
import { errorText } from "./WorkspaceView";

const card = "rounded-2xl border border-slate-800 bg-slate-950/70 p-5";
const input = "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none";
const btn = "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50";
const DEFECTS = ["Crack", "Moisture", "Surface Damage", "Paint Peeling"] as const;
const SEVERITIES = ["Critical", "Moderate", "Low"] as const;

type Detail = Awaited<ReturnType<typeof ws.asset>>;
type SignedExport = PassportExport & { signature?: { algorithm: string; key_id: string; signed_by: { email: string | null; uid: string }; value: string } };

const Thumb: React.FC<{ id: string; isArabic: boolean }> = ({ id, isArabic }) => {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let u: string | null = null;
    ws.imageUrl(id)
      .then((x) => {
        if (cancelled) URL.revokeObjectURL(x);
        else {
          u = x;
          setUrl(x);
        }
      })
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
      if (u) URL.revokeObjectURL(u);
    };
  }, [id]);
  if (failed) return <div className="flex h-36 w-full items-center justify-center rounded-lg bg-slate-800 text-xs text-slate-400">{isArabic ? "تعذّر تحميل الصورة" : "Could not load image"}</div>;
  return url ? <img src={url} alt="" className="h-36 w-full rounded-lg object-cover" /> : <div className="h-36 w-full animate-pulse rounded-lg bg-slate-800" />;
};

const AR: Record<string, string> = {
  Crack: "تشقق",
  Moisture: "رطوبة",
  "Surface Damage": "تلف سطحي",
  "Paint Peeling": "تقشر دهان",
  Critical: "حرج",
  Moderate: "متوسط",
  Low: "منخفض",
  High: "مرتفع",
  "Requires Expert Review": "يتطلب مراجعة خبير",
  None: "لا يوجد",
  "Residential Villa": "فيلا سكنية",
  "Commercial Tower": "برج تجاري",
  "Residential Compound": "مجمع سكني",
  "Logistics Warehouse": "مستودع لوجستي",
};
export const label = (v: string, ar: boolean) => (ar ? AR[v] ?? v : v);

export const AssetWorkspace: React.FC<{ assetId: string; me: Me; isArabic: boolean; onBack: () => void }> = ({ assetId, me, isArabic, onBack }) => {
  const t = (en: string, ar: string) => (isArabic ? ar : en);
  const canWrite = me.role === "inspector" || me.isAdmin;
  const canReview = me.role === "reviewer" || me.isAdmin;
  const [d, setD] = useState<Detail | null>(null);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string>("");
  const [coverage, setCoverage] = useState<CoverageArea[]>([]);
  const [finding, setFinding] = useState({ type: "Crack" as (typeof DEFECTS)[number], severity: "Moderate" as (typeof SEVERITIES)[number], area: "", description: "", evidenceIds: [] as string[], source: "manual" as "manual" | "ai-confirmed" });
  const [exp, setExp] = useState<SignedExport | null>(null);
  const [page, setPage] = useState<1 | 2 | 3 | 4>(1);
  const [verifyMsg, setVerifyMsg] = useState("");
  const pdfRef = useRef<HTMLDivElement>(null);

  const arRef = useRef(isArabic);
  arRef.current = isArabic;
  const load = useCallback(async () => {
    try {
      const x = await ws.asset(assetId);
      setD(x);
      setCoverage(x.asset.coverageAreas);
      setAudit(await ws.audit(assetId));
    } catch (e) {
      setError(errorText(e, arRef.current));
    }
  }, [assetId]);

  useEffect(() => {
    load();
  }, [load]);

  const run = async (label: string, fn: () => Promise<unknown>) => {
    setBusy(label);
    setError("");
    try {
      await fn();
      await load();
    } catch (e) {
      setError(errorText(e, isArabic));
    } finally {
      setBusy("");
    }
  };

  if (!d) return <div className={card}>{error || t("Loading…", "جارٍ التحميل…")}</div>;
  const a: WsAsset = d.asset;
  const s = d.scores;

  const useSuggestion = (ev: WsEvidence) => {
    const sg = ev.aiSuggestion;
    if (!sg || !sg.defect_present) return;
    setFinding({
      type: sg.defect_type as (typeof DEFECTS)[number],
      severity: sg.severity as (typeof SEVERITIES)[number],
      area: sg.location_hint || "",
      description: sg.rationale,
      evidenceIds: [ev.id],
      source: "ai-confirmed",
    });
  };

  const exportPassport = () =>
    run("export", async () => {
      setExp((await ws.passport(a.id)) as unknown as SignedExport);
      setVerifyMsg("");
      setPage(1);
    });

  const downloadJson = () => {
    if (!exp) return;
    const blob = new Blob([JSON.stringify(exp, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url;
    el.download = `MIRAAH_Passport_${a.id}.json`;
    el.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    const container = pdfRef.current;
    if (!container) return;
    setBusy("pdf");
    try {
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pages = Array.from(container.children) as HTMLElement[];
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], { scale: 2, backgroundColor: "#FFFFFF", logging: false, onclone: (doc) => sanitizeElementForCanvas(doc) });
        if (i > 0) pdf.addPage();
        const w = pdf.internal.pageSize.getWidth();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, w, Math.min((canvas.height * w) / canvas.width, pdf.internal.pageSize.getHeight()), undefined, "FAST");
      }
      pdf.save(`MIRAAH_Passport_${a.id}.pdf`);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy("");
    }
  };

  const showVerify = (r: Awaited<ReturnType<typeof verifyExport>>) =>
    setVerifyMsg(
      `${r.fingerprintValid ? "✓" : "✗"} ${t("data matches fingerprint", "البيانات تطابق البصمة")} · ${
        r.signatureValid === null ? t("not signed", "غير موقّع") : r.signatureValid ? `✓ ${t("signature valid", "التوقيع صحيح")} (${r.signedBy?.email ?? ""})` : `✗ ${t("signature invalid", "التوقيع غير صحيح")}`
      }`
    );

  const verifyFile = async (file?: File) => {
    if (!file) return;
    try {
      showVerify(await verifyExport(JSON.parse(await file.text())));
    } catch (e) {
      setVerifyMsg(`✗ ${errorText(e, isArabic)}`);
    }
  };

  const Back = isArabic ? ArrowRight : ArrowLeft;

  return (
    <div className="space-y-5" dir={isArabic ? "rtl" : "ltr"}>
      <div className={`${card} flex flex-wrap items-center justify-between gap-3`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 text-slate-300 hover:bg-white/10" title={t("Back", "رجوع")}>
            <Back className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-black text-white">{isArabic ? a.nameArabic || a.name : a.name}</h2>
            <p className="text-xs text-slate-400">
              {label(a.type, isArabic)} · {a.city}
              {a.district ? ` / ${a.district}` : ""} · {a.sizeSqm.toLocaleString()} m² · {a.buildYear}
              {a.caseReference ? ` · ${a.caseReference}` : ""}
            </p>
          </div>
        </div>
        <button data-testid="export-passport" onClick={exportPassport} disabled={!!busy} className={`${btn} bg-cyan-500 text-slate-950 hover:bg-cyan-400`}>
          <ShieldCheck className="h-4 w-4" /> {me.signing ? t("Signed passport", "جواز موقّع") : t("Passport export", "تصدير الجواز")}
        </button>
      </div>

      {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</div>}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          [t("Readiness", "الجاهزية"), `${s.liquidationReadiness}/100`],
          [t("Condition", "الحالة"), `${s.conditionIndex}/100`],
          [t("Coverage", "التغطية"), `${s.coveragePct}%`],
          [t("Confidence", "الثقة"), `${s.inspectionConfidence}`],
          [t("Risk", "المخاطر"), label(s.riskLevel, isArabic)],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-center">
            <div className="text-[11px] text-slate-400">{k}</div>
            <div className="text-xl font-black text-white">{v}</div>
          </div>
        ))}
      </div>
      {s.readinessBlockers.length > 0 && (
        <ul className="space-y-1 text-xs text-amber-200">
          {s.readinessBlockers.map((b) => (
            <li key={b.code}>• {b.description}</li>
          ))}
        </ul>
      )}

      {/* Coverage */}
      <div className={card}>
        <h3 className="mb-3 text-sm font-bold text-white">{t("Inspection coverage by area", "تغطية الفحص لكل منطقة")}</h3>
        <div className="space-y-2">
          {coverage.map((c, i) => (
            <div key={c.id} className="flex items-center gap-2">
              <input data-testid="coverage-name" className={input} value={c.area} disabled={!canWrite} onChange={(e) => setCoverage(coverage.map((x, j) => (j === i ? { ...x, area: e.target.value } : x)))} />
              <input
                data-testid="coverage-pct"
                className={`${input} max-w-[90px]`}
                type="number"
                min={0}
                max={100}
                value={c.pct}
                disabled={!canWrite}
                onChange={(e) => setCoverage(coverage.map((x, j) => (j === i ? { ...x, pct: Math.max(0, Math.min(100, Math.round(Number(e.target.value)))) } : x)))}
              />
              <span className="text-xs text-slate-400">%</span>
              {canWrite && (
                <button onClick={() => setCoverage(coverage.filter((_, j) => j !== i))} className="rounded p-1 text-slate-400 hover:text-red-300">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {canWrite && (
          <div className="mt-3 flex gap-2">
            <button data-testid="add-area" onClick={() => setCoverage([...coverage, { id: crypto.randomUUID().slice(0, 8), area: "", pct: 0 }])} className={`${btn} border border-slate-700 text-slate-200`}>
              <Plus className="h-4 w-4" /> {t("Add area", "إضافة منطقة")}
            </button>
            <button
              data-testid="save-coverage"
              onClick={() => run("coverage", () => ws.updateAsset(a.id, { coverageAreas: coverage.filter((c) => c.area.trim()) }))}
              disabled={!!busy}
              className={`${btn} bg-emerald-500 text-slate-950`}
            >
              <Save className="h-4 w-4" /> {t("Save coverage", "حفظ التغطية")}
            </button>
          </div>
        )}
      </div>

      {/* Evidence */}
      <div className={card}>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-white">
            {t("Evidence photos", "صور الأدلة")} ({d.evidence.length})
          </h3>
          {canWrite && (
            <label className={`${btn} cursor-pointer bg-cyan-500 text-slate-950`}>
              <Upload className="h-4 w-4" /> {busy === "upload" ? t("Uploading…", "جارٍ الرفع…") : t("Upload photo", "رفع صورة")}
              <input
                data-testid="upload-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  e.target.value = "";
                  if (f) run("upload", () => ws.upload(a.id, f));
                }}
              />
            </label>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {d.evidence.map((ev) => (
            <div key={ev.id} className="space-y-2 rounded-xl border border-slate-800 p-2">
              <Thumb id={ev.id} isArabic={isArabic} />
              <div className="font-mono text-[10px] text-slate-500" dir="ltr">
                SHA-256 {ev.sha256.slice(0, 16)}… · {(ev.sizeBytes / 1024).toFixed(0)} KB · {ev.uploadedBy}
              </div>
              {ev.aiSuggestion ? (
                <div className="rounded-lg bg-slate-900 p-2 text-xs text-slate-200">
                  <div className="font-bold">
                    {t("AI suggestion", "اقتراح الذكاء الاصطناعي")} ({ev.aiSuggestion.model}):{" "}
                    {ev.aiSuggestion.defect_present ? `${label(ev.aiSuggestion.defect_type, isArabic)} · ${label(ev.aiSuggestion.severity, isArabic)}` : t("no defect seen", "لا يظهر عيب")} · {Math.round(ev.aiSuggestion.confidence * 100)}% {t("(model self-reported)", "(تقدير النموذج لنفسه)")}
                  </div>
                  <div className="text-slate-400">{ev.aiSuggestion.rationale}</div>
                  <div className="mt-1 text-[10px] text-amber-300">{t("A suggestion only — the inspector decides.", "اقتراح فقط — القرار للمفتش.")}</div>
                  {canWrite && ev.aiSuggestion.defect_present && (
                    <button data-testid="use-suggestion" onClick={() => useSuggestion(ev)} className={`${btn} mt-2 border border-cyan-600 text-cyan-200`}>
                      {t("Use as a finding (review first)", "استخدمه كملاحظة (راجعه أولاً)")}
                    </button>
                  )}
                </div>
              ) : (
                canWrite &&
                me.ai && (
                  <button data-testid="ai-suggest" onClick={() => run(`ai-${ev.id}`, () => ws.analyze(ev.id))} disabled={!!busy} className={`${btn} border border-slate-700 text-slate-200`}>
                    <Sparkles className="h-4 w-4" /> {busy === `ai-${ev.id}` ? t("Analysing…", "جارٍ التحليل…") : t("Suggest with AI", "اقتراح بالذكاء الاصطناعي")}
                  </button>
                )
              )}
            </div>
          ))}
        </div>
        {!me.ai && canWrite && <p className="mt-2 text-[11px] text-slate-500">{t("AI suggestions are off on this server (no Gemini key).", "اقتراحات الذكاء الاصطناعي متوقفة على هذا الخادم (لا يوجد مفتاح Gemini).")}</p>}
      </div>

      {/* New finding */}
      {canWrite && (
        <div className={card}>
          <h3 className="mb-3 text-sm font-bold text-white">
            {t("Record a finding", "تسجيل ملاحظة")}
            {finding.source === "ai-confirmed" && <span className="ms-2 rounded bg-cyan-900 px-2 py-0.5 text-[10px] text-cyan-200">{t("from AI suggestion", "من اقتراح الذكاء الاصطناعي")}</span>}
          </h3>
          <div className="grid gap-2 sm:grid-cols-3">
            <select className={input} value={finding.type} onChange={(e) => setFinding({ ...finding, type: e.target.value as (typeof DEFECTS)[number] })}>
              {DEFECTS.map((x) => (
                <option key={x} value={x}>
                  {label(x, isArabic)}
                </option>
              ))}
            </select>
            <select className={input} value={finding.severity} onChange={(e) => setFinding({ ...finding, severity: e.target.value as (typeof SEVERITIES)[number] })}>
              {SEVERITIES.map((x) => (
                <option key={x} value={x}>
                  {label(x, isArabic)}
                </option>
              ))}
            </select>
            <input data-testid="finding-area" className={input} placeholder={t("Area / location *", "المنطقة *")} value={finding.area} onChange={(e) => setFinding({ ...finding, area: e.target.value })} />
            <textarea className={`${input} sm:col-span-3`} rows={2} placeholder={t("Description", "الوصف")} value={finding.description} onChange={(e) => setFinding({ ...finding, description: e.target.value })} />
          </div>
          {d.evidence.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-300">
              {d.evidence.map((ev, i) => (
                <label key={ev.id} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={finding.evidenceIds.includes(ev.id)}
                    onChange={(e) =>
                      setFinding({ ...finding, evidenceIds: e.target.checked ? [...finding.evidenceIds, ev.id] : finding.evidenceIds.filter((x) => x !== ev.id) })
                    }
                  />
                  {t("Photo", "صورة")} {i + 1}
                </label>
              ))}
            </div>
          )}
          <div className="mt-3 flex gap-2">
            <button
              data-testid="save-finding"
              onClick={() =>
                run("finding", async () => {
                  await ws.createFinding(a.id, finding);
                  setFinding({ type: "Crack", severity: "Moderate", area: "", description: "", evidenceIds: [], source: "manual" });
                })
              }
              disabled={!finding.area || !!busy}
              className={`${btn} bg-emerald-500 text-slate-950`}
            >
              <Check className="h-4 w-4" /> {t("Save finding", "حفظ الملاحظة")}
            </button>
            {finding.source === "ai-confirmed" && (
              <button onClick={() => setFinding({ ...finding, source: "manual" })} className={`${btn} border border-slate-700 text-slate-300`}>
                {t("Treat as manual", "اعتبرها يدوية")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Findings */}
      <div className={card}>
        <h3 className="mb-3 text-sm font-bold text-white">
          {t("Findings", "الملاحظات")} ({d.findings.length})
        </h3>
        {d.findings.length === 0 ? (
          <p className="text-sm text-slate-400">{t("No findings recorded.", "لا توجد ملاحظات مسجلة.")}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-200">
              <thead className="text-slate-400">
                <tr>
                  {[t("Type", "النوع"), t("Severity", "الخطورة"), t("Area", "المنطقة"), t("Conf.", "الثقة"), t("Source", "المصدر"), t("Verified", "التحقق"), t("Resolved", "المعالجة"), ""].map((h) => (
                    <th key={h} className="p-2 text-start">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {d.findings.map((f: WsFinding) => (
                  <tr key={f.id} className="border-t border-slate-800">
                    <td className="p-2">{label(f.type, isArabic)}</td>
                    <td className="p-2">{label(f.severity, isArabic)}</td>
                    <td className="p-2">{f.area}</td>
                    <td className="p-2">{f.confidence === null ? "—" : `${f.confidence}%`}</td>
                    <td className="p-2">{f.source === "ai-confirmed" ? t("AI + inspector", "ذكاء اصطناعي + مفتش") : t("Inspector", "مفتش")}</td>
                    <td className="p-2">{f.verified ? `✓ ${f.verifiedBy}` : "—"}</td>
                    <td className="p-2">{f.resolved ? `✓ ${f.resolvedBy}` : "—"}</td>
                    <td className="p-2">
                      {canReview && (
                        <div className="flex gap-1">
                          <button data-testid="verify-finding" onClick={() => run(`v-${f.id}`, () => ws.review(f.id, "verify", !f.verified))} className="rounded border border-slate-700 px-2 py-1 hover:bg-white/10">
                            {f.verified ? t("Unverify", "إلغاء التحقق") : t("Verify", "تحقق")}
                          </button>
                          <button data-testid="resolve-finding" onClick={() => run(`r-${f.id}`, () => ws.review(f.id, "resolve", !f.resolved))} className="rounded border border-slate-700 px-2 py-1 hover:bg-white/10">
                            {f.resolved ? t("Reopen", "إعادة فتح") : t("Resolve", "معالجة")}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-2 text-[11px] text-slate-500">
          {t("\"Verified\" means verified by a MIRAAH reviewer account, not by a licensed authority.", "\"التحقق\" يعني تحقق حساب مراجع في مرآة، وليس اعتماد جهة مرخّصة.")}
        </p>
      </div>

      {/* Export */}
      {exp && (
        <div className={card}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white">{t("Passport export", "تصدير الجواز")}</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={downloadPdf} disabled={!!busy} className={`${btn} bg-cyan-500 text-slate-950`}>
                <FileDown className="h-4 w-4" /> {busy === "pdf" ? "…" : "PDF"}
              </button>
              <button onClick={downloadJson} className={`${btn} border border-slate-700 text-slate-200`}>
                <FileDown className="h-4 w-4" /> JSON
              </button>
              <button data-testid="verify-export" onClick={async () => { try { showVerify(await verifyExport(exp)); } catch (e) { setVerifyMsg(`✗ ${errorText(e, isArabic)}`); } }} className={`${btn} border border-slate-700 text-slate-200`}>
                <ShieldCheck className="h-4 w-4" /> {t("Verify", "تحقق")}
              </button>
              <label className={`${btn} cursor-pointer border border-slate-700 text-slate-200`}>
                {t("Verify a JSON file", "تحقق من ملف JSON")}
                <input type="file" accept="application/json,.json" className="hidden" onChange={(e) => { verifyFile(e.target.files?.[0]); e.target.value = ""; }} />
              </label>
            </div>
          </div>
          <p className="mb-2 text-[11px] text-amber-300">
            {t("Only the JSON export can be verified. The PDF is a rendering for reading; its signature text cannot be checked.", "ملف JSON وحده قابل للتحقق. ملف PDF نسخة للقراءة، ولا يمكن التحقق من نص التوقيع فيه.")}
          </p>
          {verifyMsg && <div data-testid="verify-msg" className="mb-2 text-xs text-slate-200">{verifyMsg}</div>}
          <div className="mb-2 flex flex-wrap gap-1">
            {PASSPORT_PAGE_TITLES.map((pt, i) => (
              <button key={pt.en} onClick={() => setPage((i + 1) as 1 | 2 | 3 | 4)} className={`rounded px-2 py-1 text-xs ${page === i + 1 ? "bg-cyan-900 text-cyan-100" : "text-slate-400 hover:bg-white/5"}`}>
                {i + 1}. {isArabic ? pt.ar : pt.en}
              </button>
            ))}
          </div>
          <div className="mx-auto max-w-[794px] overflow-hidden rounded-xl">
            <PassportDocument page={page} data={exp.passport as PassportData} exp={exp} isArabic={isArabic} signature={exp.signature ?? null} />
          </div>
          <div ref={pdfRef} aria-hidden="true" style={{ position: "fixed", left: -10000, top: 0, width: 794 }}>
            {([1, 2, 3, 4] as const).map((p) => (
              <div key={p} style={{ width: 794 }}>
                <PassportDocument page={p} data={exp.passport as PassportData} exp={exp} isArabic={isArabic} signature={exp.signature ?? null} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit */}
      <div className={card}>
        <h3 className="mb-2 text-sm font-bold text-white">{t("Audit log", "سجل التدقيق")}</h3>
        <ul className="max-h-60 space-y-1 overflow-y-auto font-mono text-[11px] text-slate-400" dir="ltr">
          {audit
            .slice()
            .reverse()
            .map((x) => (
              <li key={x.id}>
                {x.at.replace("T", " ").slice(0, 19)} · {x.actor} · {x.action}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
