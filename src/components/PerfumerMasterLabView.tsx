import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Droplet,
  Beaker,
  Send,
  Volume2,
  Check,
  FlaskConical,
  Copy,
  Trash2,
  Layers,
  ArrowRight,
  Maximize2,
  Minimize2,
  BookmarkPlus,
  DollarSign,
  Printer,
  ChevronDown,
  Download,
  Clock,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import perfumerImg from '../assets/images/master_perfumer_compounding_1791693212967.jpg';
import { extractFormulaFromAIMessage, ExtractedAIPerfume } from '../utils/aiFormulaExtractor';
import {
  ChatMessage,
  loadStoredChatSession,
  saveChatSession,
  clearChatSession,
  exportChatTranscriptToFile,
  DEFAULT_WELCOME_MESSAGE,
} from '../utils/chatStorage';

interface PerfumerMasterLabViewProps {
  onApplyToConcentrationCalculator: (formula: ExtractedAIPerfume) => void;
  onApplyToPyramidCalculator: (formula: ExtractedAIPerfume) => void;
  onRecordToRecipeLibrary: (formula: ExtractedAIPerfume) => void;
  onCalculateCosting: (formula: ExtractedAIPerfume) => void;
  onPrintSpecSheet: (formula: ExtractedAIPerfume) => void;
}

const MASTER_PROMPTS = [
  'تمام تقترح عليا انهى تركيبة بالظبط ونسب المكونات قد اية',
  'طبق هذه التركيبة في حاسبة التركيب والمعمل',
  'كيف أضاعف ثبات وفوحان العطر لأكثر من 24 ساعة؟',
  'العطر أصبح حليبياً ومتعكراً بعد إضافة الماء، كيف أصفّيه؟',
  'ما النسبة الذهبية لعطر صيفي منعش وفواح؟',
];

export const PerfumerMasterLabView: React.FC<PerfumerMasterLabViewProps> = ({
  onApplyToConcentrationCalculator,
  onApplyToPyramidCalculator,
  onRecordToRecipeLibrary,
  onCalculateCosting,
  onPrintSpecSheet,
}) => {
  // Load persisted session with 30-day (1 month) expiration check
  const [sessionData, setSessionData] = useState(() => loadStoredChatSession());
  const [messages, setMessages] = useState<ChatMessage[]>(() => sessionData.messages);
  const [daysRemaining, setDaysRemaining] = useState(sessionData.daysRemaining);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scaleWeight, setScaleWeight] = useState(14.85);
  const [dripping, setDripping] = useState(false);
  const [compoundingStep, setCompoundingStep] = useState(0);

  // Copy & clear state trackers
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [recordedId, setRecordedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Persist messages whenever changed & broadcast to sync floating window
  useEffect(() => {
    saveChatSession(messages);
    window.dispatchEvent(new CustomEvent('miyaar-chat-updated', { detail: messages }));
  }, [messages]);

  // Sync with updates from floating chat window
  useEffect(() => {
    const handleSync = (e: any) => {
      if (Array.isArray(e.detail)) {
        setMessages(e.detail);
      }
    };
    window.addEventListener('miyaar-chat-updated', handleSync);
    return () => window.removeEventListener('miyaar-chat-updated', handleSync);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isLoading) {
      interval = setInterval(() => {
        setCompoundingStep((prev) => (prev + 1) % 4);
        setScaleWeight((prev) => +(prev + 0.35).toFixed(2));
      }, 1100);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const compoundingPhrases = [
    'الخبير شاهين يقطر الزيوت الخام في المخبار بدقة الميزان...',
    'يفحص الكثافة النوعية وتجانس النوتات العطرية...',
    'يمزج مركب العطر ويتحقق من توازن الهرم العطري...',
    'يصيغ لك خلاصة سر التركيبة من واقع خبرة 35 عاماً في المعمل...',
  ];

  const handleSend = async (customText?: string) => {
    const text = (customText || input).trim();
    if (!text || isLoading) return;

    // Check if user requested an immediate interactive action by text command
    const lower = text.toLowerCase();
    if (
      (lower.includes('طبق') || lower.includes('حول') || lower.includes('انقل')) &&
      (lower.includes('حاسبة') || lower.includes('تركيب'))
    ) {
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === 'assistant') {
          const formula = extractFormulaFromAIMessage(messages[i].text);
          if (formula) {
            onApplyToConcentrationCalculator(formula);
            return;
          }
        }
      }
    }

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setDripping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({ role: m.role, text: m.text })),
        }),
      });
      const data = await res.json();
      const reply = data.reply || 'معذرة، أعد المحاولة بعد قليل.';

      setMessages((prev) => [
        ...prev,
        {
          id: 'b-' + Date.now(),
          role: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          text: 'أهلاً بك يا صديقي، لضمان أعلى ثبات ننصح بمثبت DPG بنسبة 1%، والتعتيق 30 يوماً في زجاج عسلي محكم.',
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
      setDripping(false);
    }
  };

  const handleCopySingle = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCopyEntireChat = () => {
    const transcript = messages
      .map((m) => `[${m.role === 'user' ? 'السؤال' : 'الخبير شاهين'} - ${m.timestamp}]:\n${m.text}`)
      .join('\n\n' + '─'.repeat(40) + '\n\n');

    navigator.clipboard.writeText(transcript);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  const handleClearHistory = () => {
    clearChatSession();
    setMessages([DEFAULT_WELCOME_MESSAGE]);
    setDaysRemaining(30);
    setShowClearConfirm(false);
  };

  const handleManualDrop = () => {
    setDripping(true);
    setScaleWeight((prev) => +(prev + 0.22).toFixed(2));
    setTimeout(() => setDripping(false), 800);
  };

  return (
    <div className="space-y-4">
      {/* 1. Compact Slim Header with Expiry Info & Controls */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-600 shrink-0">
            <img
              src={perfumerImg}
              alt="الخبير شاهين"
              className="w-full h-full object-cover object-top"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 font-serif-luxury">
                مجلس الخبير شاهين · شيخ العطارين
              </h2>
              {/* 30-Day Auto-Purge Persistence Badge */}
              <div
                className="flex items-center gap-1 text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-medium"
                title="يتم حفظ المحادثة كاملة في جهازك وتُمسح تلقائياً بعد 30 يوماً من بدئها"
              >
                <Clock className="w-3 h-3 text-emerald-700" />
                <span>محفوظة بالكامل (تُمسح بعد {daysRemaining} يوماً)</span>
              </div>
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              {isLoading ? (
                <span className="text-amber-800 font-medium animate-pulse">
                  🧪 {compoundingPhrases[compoundingStep]}
                </span>
              ) : (
                'تفاعل مباشر وحفظ تلقائي لكامل الجلسة لمدة شهر كامل مع إمكانية التصدير'
              )}
            </div>
          </div>
        </div>

        {/* Workbench Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Scale Display */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-mono-numbers">
            <span className="text-stone-400 text-[10px]">الميزان:</span>
            <span className="text-amber-400 font-bold">{scaleWeight} g</span>
          </div>

          <button
            onClick={handleManualDrop}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
            title="إضافة قطرة عطرية للمركب"
          >
            <Droplet className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">إضافة قطرة</span>
          </button>

          {/* Download TXT Transcript */}
          <button
            onClick={() => exportChatTranscriptToFile(messages, daysRemaining)}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            title="تنزيل نسخة احتياطية من المحادثة كملف نصي TXT"
          >
            <Download className="w-3.5 h-3.5 text-amber-800" />
            <span className="hidden sm:inline">تنزيل نسخة TXT</span>
          </button>

          <button
            onClick={handleCopyEntireChat}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
            title="نسخ المحادثة بالكامل"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedAll ? 'تم النسخ' : 'نسخ الكل'}</span>
          </button>

          {/* Manual Clear Session Button */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="مسح سجل المحادثة الآن"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal to Clear Chat Manually */}
      {showClearConfirm && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-xs text-rose-900 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            <span>
              هل ترغب في مسح سجل المحادثة بالكامل الآن؟ (تُمسح تلقائياً بعد {daysRemaining} يوماً).
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-2.5 py-1 bg-white border border-stone-200 rounded text-stone-600 hover:bg-stone-50 cursor-pointer"
            >
              إلغاء
            </button>
            <button
              onClick={handleClearHistory}
              className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white font-semibold rounded cursor-pointer"
            >
              تأكيد المسح
            </button>
          </div>
        </div>
      )}

      {/* 2. Expanded Chat Board Container */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-md flex flex-col h-[760px] overflow-hidden">
        
        {/* Messages Stream Board */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50/50">
          {messages.map((m) => {
            const extractedFormula = m.role === 'assistant' ? extractFormulaFromAIMessage(m.text) : null;

            return (
              <div
                key={m.id}
                className={`flex items-start gap-3 sm:gap-4 ${
                  m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs ${
                    m.role === 'user'
                      ? 'bg-amber-900 text-amber-200'
                      : 'overflow-hidden border border-amber-700/60'
                  }`}
                >
                  {m.role === 'user' ? (
                    'أنت'
                  ) : (
                    <img
                      src={perfumerImg}
                      alt="شاهين"
                      className="w-full h-full object-cover object-top"
                    />
                  )}
                </div>

                {/* Message Content Bubble */}
                <div
                  className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 ${
                    m.role === 'user'
                      ? 'bg-amber-900 text-white rounded-tl-xs'
                      : 'bg-white text-stone-900 border border-stone-200 rounded-tr-xs'
                  }`}
                >
                  {/* Text Payload */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans break-words space-y-2">
                    {m.text}
                  </div>

                  {/* SMART INTERACTION BAR: Transfer Chat Data to App Modules */}
                  {extractedFormula && (
                    <div className="mt-3 p-3.5 bg-amber-50/90 border border-amber-200/90 rounded-2xl space-y-2.5 text-xs text-amber-950 animate-in fade-in">
                      <div className="flex items-center justify-between font-bold text-amber-900">
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-700" />
                          <span>تحويل بيانات هذه الخلطة لأيقونات وحاسبات التطبيق:</span>
                        </span>
                        <span className="text-[10px] font-mono-numbers bg-white px-2 py-0.5 rounded border border-amber-200">
                          {extractedFormula.concentrationPercent}% {extractedFormula.concentrationType.toUpperCase()}
                        </span>
                      </div>

                      {/* Interactive Transfer Buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                        <button
                          onClick={() => onApplyToConcentrationCalculator(extractedFormula)}
                          className="p-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                          title="تطبيق مقادير هذه الخلطة في حاسبة التركيب وتعبئة الزجاجة"
                        >
                          <FlaskConical className="w-3.5 h-3.5 text-amber-400" />
                          <span>حاسبة التركيب</span>
                        </button>

                        <button
                          onClick={() => onApplyToPyramidCalculator(extractedFormula)}
                          className="p-2 bg-white hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                          title="نقل النوتات العطرية إلى حاسبة الهرم العطري"
                        >
                          <Layers className="w-3.5 h-3.5 text-amber-700" />
                          <span>الهرم العطري</span>
                        </button>

                        <button
                          onClick={() => {
                            onRecordToRecipeLibrary(extractedFormula);
                            setRecordedId(m.id);
                            setTimeout(() => setRecordedId(null), 3000);
                          }}
                          className="p-2 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                          title="تدوين وحفظ هذه الخلطة فوراً في مكتبة الوصفات والتشغيلات"
                        >
                          {recordedId === m.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">تم التدوين!</span>
                            </>
                          ) : (
                            <>
                              <BookmarkPlus className="w-3.5 h-3.5 text-emerald-600" />
                              <span>تدوين الخلطة</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onCalculateCosting(extractedFormula)}
                          className="p-2 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                          title="حساب تكلفة إنتاج وسعر بيع هذه التركيبة"
                        >
                          <DollarSign className="w-3.5 h-3.5 text-amber-800" />
                          <span>حساب التكلفة</span>
                        </button>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[11px] text-amber-900/80 border-t border-amber-200/60">
                        <span>التركيبة جاهزة للتصنيع والمعمل:</span>
                        <button
                          onClick={() => onPrintSpecSheet(extractedFormula)}
                          className="text-amber-900 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3 h-3 text-amber-800" />
                          <span>طباعة بطاقة التشغيلة الرسمية ➔</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bottom Action Strip Under EVERY message */}
                  <div
                    className={`pt-2.5 mt-2 border-t flex flex-wrap items-center justify-between gap-2 text-[11px] ${
                      m.role === 'user'
                        ? 'border-amber-800/80 text-amber-200'
                        : 'border-stone-100 text-stone-500'
                    }`}
                  >
                    <span className="font-mono-numbers">{m.timestamp}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopySingle(m.id, m.text)}
                        className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer font-medium text-xs ${
                          m.role === 'user'
                            ? 'bg-amber-800/80 hover:bg-amber-700 text-white'
                            : 'bg-stone-100 hover:bg-amber-50 hover:text-amber-900 text-stone-700 border border-stone-200/70'
                        }`}
                        title={m.role === 'user' ? 'نسخ هذا السؤال' : 'نسخ هذه الإجابة والتركيبة'}
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-semibold">تم النسخ بنجاح!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{m.role === 'user' ? 'نسخ السؤال' : 'نسخ الإجابة والتركيبة'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Active Compounding Loading Status */}
          {isLoading && (
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-amber-600 shrink-0">
                <img
                  src={perfumerImg}
                  alt="شاهين"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="bg-amber-50 border border-amber-200/90 p-4 sm:p-5 rounded-2xl text-xs sm:text-sm text-amber-950 space-y-2 shadow-xs max-w-[85%]">
                <div className="font-semibold flex items-center gap-2 text-amber-900">
                  <span className="animate-spin text-base">🧪</span>
                  <span>الخبير شاهين يقطر الزيوت ويزن النوتات بالميزان...</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {compoundingPhrases[compoundingStep]}
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 3. Fast Suggestion Strip */}
        <div className="p-3 bg-stone-100 border-t border-stone-200 overflow-x-auto flex items-center gap-2 text-xs no-scrollbar shrink-0">
          <span className="text-[11px] font-bold text-stone-500 whitespace-nowrap">
            أوامر وتفاعلات سريعة:
          </span>
          {MASTER_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              disabled={isLoading}
              className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white hover:bg-amber-50 border border-stone-200 text-stone-700 hover:text-amber-900 text-xs transition-colors cursor-pointer shrink-0 shadow-2xs font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* 4. Large Interactive Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3.5 sm:p-4 bg-white border-t border-stone-200 flex items-center gap-3 shrink-0"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="اسأل الخبير شاهين أو اطلب تطبيق الخلطة (مثال: تمام تقترح عليا انهى تركيبة بالظبط ونسب المكونات قد اية)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-amber-800 hover:bg-amber-900 disabled:opacity-40 text-white rounded-xl font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-xs"
          >
            <span>إرسال</span>
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>

      </div>
    </div>
  );
};
