import React, { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw, ShieldCheck, Users, LogIn } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ws, ApiError, type Me, type Role, type WsAsset } from "../../lib/workspaceApi";
import { AssetWorkspace, label } from "./AssetWorkspace";

export const ASSET_TYPES: WsAsset["type"][] = ["Residential Villa", "Commercial Tower", "Residential Compound", "Logistics Warehouse"];

const card = "rounded-2xl border border-slate-800 bg-slate-950/70 p-5";
const input = "w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none";
const btn = "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold disabled:opacity-50";

export const errorText = (e: unknown, ar: boolean): string => {
  const code = e instanceof ApiError ? e.code : "network_error";
  const m: Record<string, [string, string]> = {
    auth_required: ["Please sign in.", "يرجى تسجيل الدخول."],
    invalid_token: ["Session expired. Sign in again.", "انتهت الجلسة. سجّل الدخول من جديد."],
    no_role: ["Your account has no role yet. Ask the administrator to assign one.", "حسابك بدون صلاحية بعد. اطلب من المسؤول تعيين دور لك."],
    forbidden: ["Your role does not allow this action.", "دورك لا يسمح بهذا الإجراء."],
    invalid_request: ["Some fields are missing or invalid.", "بعض الحقول ناقصة أو غير صحيحة."],
    file_too_large: ["File is larger than 8 MB.", "حجم الملف أكبر من 8 ميجابايت."],
    unsupported_file_type: ["Only JPEG, PNG or WebP images.", "الصور المقبولة: JPEG أو PNG أو WebP فقط."],
    ai_not_configured: ["AI analysis is not enabled on this server.", "التحليل بالذكاء الاصطناعي غير مفعّل على هذا الخادم."],
    model_unavailable: ["The AI model is unavailable. Try again later.", "النموذج غير متاح حالياً. حاول لاحقاً."],
    daily_limit: ["Daily AI limit reached.", "وصلت للحد اليومي للتحليل."],
    rate_limited: ["Too many requests. Wait a moment.", "طلبات كثيرة. انتظر قليلاً."],
    no_ai_suggestion_on_evidence: ["Run AI analysis on the image first.", "شغّل التحليل على الصورة أولاً."],
    already_analyzed: ["This photo was already analysed.", "هذه الصورة حُلّلت مسبقاً."],
    self_review: ["You cannot review a finding you recorded.", "لا يمكنك مراجعة ملاحظة سجّلتها بنفسك."],
    invalid_id: ["Invalid reference.", "مرجع غير صالح."],
    not_found: ["The live workspace is not enabled on this server.", "مساحة العمل غير مفعّلة على هذا الخادم."],
  };
  const v = m[code];
  return v ? v[ar ? 1 : 0] : `${ar ? "خطأ" : "Error"}: ${code}`;
};

const emptyAsset = { name: "", nameArabic: "", type: "Residential Villa" as WsAsset["type"], city: "", district: "", location: "", sizeSqm: "", buildYear: "", valuationSar: "", caseReference: "" };

export const WorkspaceView: React.FC<{ isArabic: boolean }> = ({ isArabic }) => {
  const t = (en: string, ar: string) => (isArabic ? ar : en);
  const { user, signIn } = useAuth();
  const [me, setMe] = useState<Me | null>(null);
  const [assets, setAssets] = useState<WsAsset[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState(emptyAsset);
  const [roleEmail, setRoleEmail] = useState("");
  const [roleValue, setRoleValue] = useState<Role | "none">("inspector");
  const [roles, setRoles] = useState<{ email: string; role: Role }[]>([]);

  const arRef = React.useRef(isArabic);
  arRef.current = isArabic;
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const m = await ws.me();
      setMe(m);
      if (m.role || m.isAdmin) setAssets(await ws.assets());
      if (m.isAdmin) setRoles(await ws.roles());
    } catch (e) {
      setError(errorText(e instanceof ApiError && e.status === 404 ? new ApiError(404, "not_found") : e, arRef.current));
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset everything when the signed-in user changes (sign-out / switch account).
  useEffect(() => {
    setSelected(null);
    setMe(null);
    setAssets([]);
    setRoles([]);
    if (user) load();
  }, [user?.uid, load]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) {
    return (
      <div className={`${card} mx-auto max-w-xl text-center`} dir={isArabic ? "rtl" : "ltr"}>
        <h2 className="mb-2 text-lg font-black text-white">{t("Live workspace", "مساحة العمل الفعلية")}</h2>
        <p className="mb-4 text-sm text-slate-300">
          {t(
            "Record real assets, upload inspection photos, get AI suggestions that an inspector confirms, review findings and export a signed passport. Sign in to continue.",
            "سجّل أصولاً حقيقية، وارفع صور المعاينة، واحصل على اقتراحات من الذكاء الاصطناعي يؤكدها المفتش، وراجع الملاحظات، وصدّر جوازاً موقّعاً. سجّل الدخول للمتابعة."
          )}
        </p>
        <button onClick={() => signIn()} className={`${btn} bg-cyan-500 text-slate-950 hover:bg-cyan-400`}>
          <LogIn className="h-4 w-4" /> {t("Sign in with Google", "تسجيل الدخول عبر Google")}
        </button>
      </div>
    );
  }

  if (selected && me) {
    return <AssetWorkspace assetId={selected} me={me} isArabic={isArabic} onBack={() => { setSelected(null); load(); }} />;
  }

  const canWrite = me?.role === "inspector" || me?.isAdmin;

  const create = async () => {
    setError("");
    try {
      const a = await ws.createAsset({
        name: form.name,
        nameArabic: form.nameArabic,
        type: form.type,
        city: form.city,
        district: form.district,
        location: form.location,
        sizeSqm: Number(form.sizeSqm),
        buildYear: Number(form.buildYear),
        valuationSar: form.valuationSar ? Number(form.valuationSar) : 0,
        caseReference: form.caseReference,
        coverageAreas: [],
      });
      setForm(emptyAsset);
      setShowNew(false);
      setSelected(a.id);
    } catch (e) {
      setError(errorText(e, isArabic));
    }
  };

  const assign = async () => {
    setError("");
    try {
      await ws.setRole(roleEmail, roleValue === "none" ? null : roleValue);
      setRoleEmail("");
      setRoles(await ws.roles());
    } catch (e) {
      setError(errorText(e, isArabic));
    }
  };

  return (
    <div className="space-y-5" dir={isArabic ? "rtl" : "ltr"}>
      <div className={`${card} flex flex-wrap items-center justify-between gap-3`}>
        <div>
          <h2 className="text-lg font-black text-white">{t("Live workspace", "مساحة العمل الفعلية")}</h2>
          <p className="text-xs text-slate-400">
            {t("Data here is entered by signed-in users and stored. It is not an official Infath system.", "البيانات هنا يُدخلها مستخدمون مسجلون وتُحفظ. ليست نظاماً رسمياً لإنفاذ.")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <ShieldCheck className="h-4 w-4 text-cyan-400" />
          <span>
            {me?.email} · {me?.isAdmin ? t("admin", "مسؤول") : me?.role ? t(me.role, { inspector: "مفتش", reviewer: "مراجع", viewer: "مطّلع" }[me.role]) : t("no role", "بدون دور")}
          </span>
          <button onClick={load} title={t("Refresh", "تحديث")} className="rounded p-1.5 hover:bg-white/10">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">{error}</div>}

      {me && !me.role && !me.isAdmin && (
        <div className={card}>
          <p className="text-sm text-slate-300">
            {t("Your account has no role yet. Send this email to the administrator:", "حسابك بدون دور بعد. أرسل هذا البريد للمسؤول:")}{" "}
            <b className="text-white">{me.email}</b>
          </p>
          {!me.emailVerified && <p className="mt-2 text-xs text-amber-300">{t("Your email is not verified; roles need a verified email.", "بريدك غير موثّق؛ الأدوار تتطلب بريداً موثّقاً.")}</p>}
        </div>
      )}

      {me?.isAdmin && (
        <div className={card}>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <Users className="h-4 w-4" /> {t("Roles", "الأدوار")}
          </h3>
          <div className="flex flex-wrap gap-2">
            <input data-testid="role-email" className={`${input} max-w-xs`} placeholder="email@example.com" value={roleEmail} onChange={(e) => setRoleEmail(e.target.value)} />
            <select data-testid="role-select" className={`${input} max-w-[160px]`} value={roleValue} onChange={(e) => setRoleValue(e.target.value as Role | "none")}>
              <option value="inspector">{t("Inspector", "مفتش")}</option>
              <option value="reviewer">{t("Reviewer", "مراجع")}</option>
              <option value="viewer">{t("Viewer", "مطّلع")}</option>
              <option value="none">{t("Remove role", "إزالة الدور")}</option>
            </select>
            <button data-testid="role-save" onClick={assign} disabled={!roleEmail} className={`${btn} bg-cyan-500 text-slate-950`}>
              {t("Save", "حفظ")}
            </button>
          </div>
          {roles.length > 0 && (
            <ul className="mt-3 space-y-1 text-xs text-slate-300">
              {roles.map((r) => (
                <li key={r.email}>
                  {r.email} — {r.role}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-[11px] text-slate-500">
            {t("Inspector: records assets, photos and findings. Reviewer: verifies and resolves findings. Viewer: read only.", "المفتش: يسجّل الأصول والصور والملاحظات. المراجع: يتحقق من الملاحظات ويغلقها. المطّلع: قراءة فقط.")}
          </p>
        </div>
      )}

      {(me?.role || me?.isAdmin) && (
        <div className={card}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">{t("Assets", "الأصول")} ({assets.length})</h3>
            {canWrite && (
              <button data-testid="new-asset" onClick={() => setShowNew((v) => !v)} className={`${btn} bg-cyan-500 text-slate-950 hover:bg-cyan-400`}>
                <Plus className="h-4 w-4" /> {t("New asset", "أصل جديد")}
              </button>
            )}
          </div>

          {showNew && (
            <div className="mb-4 grid gap-2 rounded-xl border border-slate-800 p-4 sm:grid-cols-2">
              <input className={input} placeholder={t("Name *", "الاسم *")} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={input} placeholder={t("Name (Arabic)", "الاسم بالعربي")} value={form.nameArabic} onChange={(e) => setForm({ ...form, nameArabic: e.target.value })} />
              <select className={input} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as WsAsset["type"] })}>
                {ASSET_TYPES.map((x) => (
                  <option key={x} value={x}>
                    {label(x, isArabic)}
                  </option>
                ))}
              </select>
              <input className={input} placeholder={t("City *", "المدينة *")} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              <input className={input} placeholder={t("District", "الحي")} value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              <input className={input} placeholder={t("Address / location", "العنوان")} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              <input className={input} type="number" placeholder={t("Built area m² *", "مساحة البناء م² *")} value={form.sizeSqm} onChange={(e) => setForm({ ...form, sizeSqm: e.target.value })} />
              <input className={input} type="number" placeholder={t("Build year *", "سنة البناء *")} value={form.buildYear} onChange={(e) => setForm({ ...form, buildYear: e.target.value })} />
              <input className={input} type="number" placeholder={t("Valuation SAR (as provided)", "القيمة بالريال (كما وردت)")} value={form.valuationSar} onChange={(e) => setForm({ ...form, valuationSar: e.target.value })} />
              <input className={input} placeholder={t("Case reference", "رقم القضية/الطلب")} value={form.caseReference} onChange={(e) => setForm({ ...form, caseReference: e.target.value })} />
              <div className="sm:col-span-2">
                <button data-testid="create-asset" onClick={create} disabled={!form.name || !form.city || !form.sizeSqm || !form.buildYear} className={`${btn} bg-emerald-500 text-slate-950`}>
                  {t("Create", "إنشاء")}
                </button>
              </div>
            </div>
          )}

          {assets.length === 0 ? (
            <p className="text-sm text-slate-400">{t("No assets yet.", "لا توجد أصول بعد.")}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-slate-400">
                  <tr>
                    <th className="p-2 text-start">{t("Asset", "الأصل")}</th>
                    <th className="p-2 text-start">{t("City", "المدينة")}</th>
                    <th className="p-2 text-start">{t("Findings", "الملاحظات")}</th>
                    <th className="p-2 text-start">{t("Readiness", "الجاهزية")}</th>
                    <th className="p-2 text-start">{t("Risk", "المخاطر")}</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a) => (
                    <tr data-testid="asset-row" key={a.id} onClick={() => setSelected(a.id)} className="cursor-pointer border-t border-slate-800 text-slate-200 hover:bg-white/5">
                      <td className="p-2 font-semibold">{isArabic ? a.nameArabic || a.name : a.name}</td>
                      <td className="p-2">{a.city}</td>
                      <td className="p-2">{a.findingsCount ?? 0}</td>
                      <td className="p-2">{a.liquidationReadiness ?? "—"}</td>
                      <td className="p-2">{a.riskLevel ? label(a.riskLevel, isArabic) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
