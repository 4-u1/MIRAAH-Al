import React, { useState, useRef, useEffect, useCallback } from "react";
import Markdown from "react-markdown";
import { AssetRecord } from "../../types";
import { ScoreResults } from "../../utils/scoring";
import { auth } from "../../lib/firebase";
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  RotateCcw,
} from "lucide-react";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: AssetRecord;
  scores: ScoreResults;
  isArabic?: boolean;
}

interface Message {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  engine?: string;
  quickActions?: { label: string; query: string }[];
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  asset,
  scores,
  isArabic = false,
}) => {
  const getInitialMessage = useCallback(
    (isAr: boolean, a: AssetRecord, s: ScoreResults): Message => {
      const assetTitle = isAr ? (a.nameArabic || a.name) : a.name;
      const sizeFormatted = a.sizeSqm ? a.sizeSqm.toLocaleString() : "—";
      const valMillions = a.valuationSar
        ? (a.valuationSar / 1000000).toFixed(1)
        : "—";

      return {
        id: "m1",
        sender: "ai",
        text: isAr
          ? `أهلاً بك، أنا **مساعد مرآة**. أجيب عن بيانات أصل **«${assetTitle}»** (رقم #${a.id}) المعروضة في المنصة:\n* **المساحة المبنية:** ${sizeFormatted} م²\n* **القيمة المدخلة:** ${valMillions} مليون ريال سعودي\n* **مؤشر الجاهزية للتصفية:** **${s.liquidationReadiness} من 100**\n* **نسبة التغطية:** **${s.coveragePct}%**\n\n_البيانات توضيحية (نموذج تجريبي)، وإجاباتي ليست استشارة هندسية أو قانونية أو تقييماً معتمداً._`
          : `Welcome, I am the **MIRAAH assistant**. I answer questions about the displayed data for **"${assetTitle}"** (#${a.id}):\n* **Gross Built Area:** ${sizeFormatted} sq m\n* **Entered valuation:** ${valMillions}M SAR\n* **Liquidation Readiness Index:** **${s.liquidationReadiness}/100**\n* **Coverage:** **${s.coveragePct}%**\n\n_Demo data (prototype). My answers are not engineering, legal or certified valuation advice._`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        quickActions: isAr
          ? [
              {
                label: "🔍 ما هي العيوب المؤثرة على التصفية؟",
                query: "ما هي العيوب التي تخفض درجة جاهزية التصفية في هذا الأصل وكيف نعالجها؟",
              },
              {
                label: "📊 ما الذي يرفع مؤشر الجاهزية؟",
                query: "حسب المعادلة، ما الملاحظات أو البيانات الناقصة التي ترفع مؤشر جاهزية التصفية أكثر إذا عولجت؟",
              },
              {
                label: "📜 أجزاء كود البناء المرتبطة بالملاحظات",
                query: "ما أجزاء كود البناء السعودي المرتبطة بالملاحظات المسجلة، وما الذي يجب أن يتحقق منه مهندس مرخّص؟",
              },
            ]
          : [
              {
                label: "🔍 What defects impact liquidation?",
                query: "What defects lower the liquidation score and how to fix them?",
              },
              {
                label: "📊 What raises the readiness score?",
                query: "Using the formula, which findings or missing fields would raise the readiness score most if resolved?",
              },
              {
                label: "📜 Building-code parts behind the findings",
                query: "Which Saudi Building Code parts relate to the recorded findings, and what should a licensed engineer check?",
              },
            ],
      };
    },
    []
  );

  const [messages, setMessages] = useState<Message[]>([
    getInitialMessage(isArabic, asset, scores),
  ]);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize language and asset changes cleanly
  useEffect(() => {
    setMessages((prev) => {
      // If the conversation is fresh or has only 1 initial message, regenerate it in the selected language
      if (prev.length <= 1) {
        return [getInitialMessage(isArabic, asset, scores)];
      }
      return prev;
    });
  }, [isArabic, asset, scores, getInitialMessage]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || inputQuery;
    if (!q.trim() || isTyping) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: q,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    if (!textToSend) setInputQuery("");
    setIsTyping(true);

    const now = () =>
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const pushAi = (text: string, engine: string) =>
      setMessages((prev) => [...prev, { id: `ai-${Date.now()}`, sender: "ai", text, timestamp: now(), engine }]);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      const token = await auth.currentUser?.getIdToken().catch(() => undefined);
      if (token) headers.Authorization = `Bearer ${token}`;

      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: q,
          // Earlier user questions only (the server ignores assistant turns); the current one goes in `message`.
          history: messages
            .filter((m) => m.sender === "user")
            .slice(-6)
            .map((m) => ({ sender: m.sender, text: m.text.slice(0, 4000) })),
          asset: {
            id: asset.id,
            name: asset.name,
            nameArabic: asset.nameArabic,
            type: asset.type,
            sizeSqm: asset.sizeSqm,
            valuationSar: asset.valuationSar,
            findings: asset.findings.map((f) => ({
              id: f.id,
              type: f.type,
              severity: f.severity,
              area: f.area,
              verified: f.verified,
              isResolved: f.isResolved,
            })),
          },
          scores: {
            liquidationReadiness: scores.liquidationReadiness,
            coveragePct: scores.coveragePct,
            inspectionConfidence: scores.inspectionConfidence,
            conditionIndex: scores.conditionIndex,
          },
          isArabic,
        }),
      });

      if (response.status === 401) {
        pushAi(
          isArabic
            ? "يلزم تسجيل الدخول لاستخدام المساعد الذكي. سجّل الدخول من زر الحساب في الأعلى ثم أعد المحاولة."
            : "Please sign in to use the AI assistant (account button at the top), then try again.",
          isArabic ? "النظام" : "System"
        );
        return;
      }
      if (response.status === 429) {
        pushAi(
          isArabic ? "تم تجاوز حد الطلبات المسموح. حاول بعد قليل." : "Request limit reached. Please try again later.",
          isArabic ? "النظام" : "System"
        );
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const engine =
        data.source === "model" && data.model
          ? `Gemini · ${data.model}`
          : isArabic
          ? "ملخص ثابت (الذكاء الاصطناعي غير مفعّل)"
          : "Fixed summary (AI not enabled)";
      pushAi(String(data.reply || ""), engine);
    } catch (err) {
      console.warn("AI assistant request failed:", err);
      pushAi(
        isArabic
          ? "تعذّر الوصول إلى المساعد الذكي حالياً. لم يتم توليد أي إجابة؛ حاول مرة أخرى لاحقاً."
          : "The AI assistant is unavailable right now. No answer was generated; please try again later.",
        isArabic ? "النظام" : "System"
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([getInitialMessage(isArabic, asset, scores)]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`relative w-full max-w-2xl h-[640px] max-h-[92vh] rounded-xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100 ${
          isArabic ? "font-arabic" : "font-sans"
        }`}
        dir={isArabic ? "rtl" : "ltr"}
      >
        {/* Clean & Refined Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/80 bg-slate-900/90 select-none">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {isArabic ? "مساعد مرآة" : "MIRAAH Assistant"}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  {isArabic ? "بيانات توضيحية" : "Demo data"}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isArabic
                  ? "أسئلة عن بيانات الأصل والملاحظات والمؤشرات المحسوبة"
                  : "Questions about the asset data, findings and computed scores"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleClearHistory}
              title={isArabic ? "بدء محادثة جديدة" : "Clear conversation"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title={isArabic ? "إغلاق" : "Close"}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-950/60">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "user" ? "items-end" : "items-start"
              }`}
            >
              {/* Message Meta Info */}
              <div className="flex items-center gap-2 mb-1 px-1">
                {m.sender === "ai" ? (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 font-semibold">
                    <Bot className="w-3.5 h-3.5" />
                    <span>{isArabic ? "مستشار مرآة" : "MIRAAH AI"}</span>
                    {m.engine && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                        {m.engine}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 font-semibold">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{isArabic ? "أنت" : "You"}</span>
                  </div>
                )}
                <span className="text-[10px] text-slate-500 font-mono">{m.timestamp}</span>
              </div>

              {/* Message Content with Markdown Parsing & Consistent Bold Styling */}
              <div
                className={`p-3.5 sm:p-4 rounded-xl max-w-[92%] sm:max-w-[88%] text-sm leading-relaxed ${
                  m.sender === "user"
                    ? "bg-cyan-600 text-white rounded-br-none shadow-sm font-medium"
                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm"
                }`}
              >
                {m.sender === "user" ? (
                  <p className="whitespace-pre-wrap">{m.text}</p>
                ) : (
                  <div className="space-y-2 prose-invert text-slate-200 text-sm leading-relaxed font-normal">
                    <Markdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0 leading-relaxed text-slate-200">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-extrabold text-white decoration-cyan-500/40">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-slate-300">{children}</em>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-base font-bold text-white my-2 pb-1 border-b border-slate-800">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-sm font-bold text-cyan-300 my-2">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-sm font-bold text-cyan-400 my-1.5 flex items-center gap-1.5">
                            {children}
                          </h3>
                        ),
                        ul: ({ children }) => (
                          <ul className={`space-y-1.5 my-2 text-slate-200 ${isArabic ? "list-disc pr-4" : "list-disc pl-4"}`}>
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className={`space-y-1.5 my-2 text-slate-200 ${isArabic ? "list-decimal pr-4" : "list-decimal pl-4"}`}>
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="leading-relaxed text-slate-300">
                            {children}
                          </li>
                        ),
                        code: ({ children }) => (
                          <code className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-mono text-xs">
                            {children}
                          </code>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className={`my-2 text-slate-300 italic ${isArabic ? "border-r-2 border-cyan-500 pr-3" : "border-l-2 border-cyan-500 pl-3"}`}>
                            {children}
                          </blockquote>
                        ),
                        hr: () => <hr className="border-slate-800 my-3" />,
                      }}
                    >
                      {m.text}
                    </Markdown>
                  </div>
                )}
              </div>

              {/* Quick Action Suggestion Chips */}
              {m.quickActions && m.quickActions.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[92%]">
                  {m.quickActions.map((qa, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSend(qa.query)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all text-start cursor-pointer select-none font-medium shadow-xs"
                    >
                      {qa.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono p-2">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse delay-100" />
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse delay-200" />
              <span className={isArabic ? "font-arabic" : "font-sans"}>
                {isArabic
                  ? "مستشار مرآة يحلل السجل المكاني والهندسي..."
                  : "MIRAAH Intelligence is analyzing telemetry..."}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Refined Input Bar */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-900/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                isArabic
                  ? "اسأل مستشار مرآة عن جاهزية التصفية، كود البناء، أو تكلفة المعالجة..."
                  : "Ask MIRAAH Advisor about liquidation readiness, SBC code, or repairs..."
              }
              className={`flex-1 bg-slate-950 border border-slate-800 focus:border-cyan-500/80 rounded-lg px-3.5 py-2 text-sm text-white placeholder:text-slate-500 outline-none transition-colors ${
                isArabic ? "font-arabic" : "font-sans"
              }`}
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-slate-950 font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer font-mono"
            >
              <Send className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
              <span>{isArabic ? "إرسال" : "Send"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

