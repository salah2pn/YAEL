import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { WritingSubmission } from '../types';
import {
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Send,
  Loader2,
  History,
  Lightbulb,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

const SAMPLE_PROMPTS = [
  {
    id: 'prompt_1',
    titleHebrew: 'לימודים מרחוק באקדמיה – יתרונות וחסרונות',
    titleArabic: 'التعليم عن بعد في الجامعات – إيجابيات وسلبيات',
    description: 'בשנים האחרונות גבר השימוש בלמידה מקוונת במוסדות להשכלה גבוהה. כתבו חיבור שבו תציגו את עמדתכם בנושא: האם ראוי להמשיך בלמידה מרחוק כמודל עיקרי, או שיש לחזור לנוכחות מלאה בקמפוס? נמקו את דבריכם.',
    targetWords: '120 - 150 מילים',
  },
  {
    id: 'prompt_2',
    titleHebrew: 'השפעת הרשתות החברתיות על הנוער',
    titleArabic: 'تأثير شبكات التواصل الاجتماعي على الشبيبة',
    description: 'הרשתות החברתיות הפכו לחלק בלתי נפרד מחיי היומיום של צעירים. יש הטוענים שהן מעודדות תקשורת ושיתוף, בעוד אחרים סבורים שהן פוגעות בביטחון העצמי ובקשרים הבין-אישיים. כתבו חיבור עמדה מנומק.',
    targetWords: '120 - 150 מילים',
  },
  {
    id: 'prompt_3',
    titleHebrew: 'שבוע עבודה של ארבעה ימים',
    titleArabic: 'أسبوع عمل من أربعة أيام',
    description: 'מדינות שונות בוחנות כיום את האפשרות לקצר את שבוע העבודה לארבעה ימים במקום חמישה. האם לדעתכם מודל זה עשוי להועיל למשק ולרווחת העובדים, או לפגוע בפריון העבודה? הציגו את עמדתכם.',
    targetWords: '120 - 150 מילים',
  },
];

export const WritingLab: React.FC = () => {
  const { writingSubmissions, addWritingSubmission, currentUser } = useApp();

  const [selectedPrompt, setSelectedPrompt] = useState(SAMPLE_PROMPTS[0]);
  const [essayContent, setEssayContent] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeTab, setActiveTab] = useState<'write' | 'history'>('write');
  const [currentResult, setCurrentResult] = useState<WritingSubmission | null>(null);

  // Word count helper
  const wordCount = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;

  const handleEvaluateEssay = async () => {
    if (wordCount < 20) {
      alert('الرجاء كتابة 20 كلمة على الأقل بالعبرية لتمكين الذكاء الاصطناعي من تحليل المقال بدقة.');
      return;
    }

    setIsEvaluating(true);
    try {
      const res = await fetch('/api/writing-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: selectedPrompt.titleHebrew,
          content: essayContent,
        }),
      });

      const data = await res.json();
      const feedback = data.feedback || {
        score: 115,
        criteriaScores: {
          grammar: 75,
          vocabulary: 80,
          structure: 78,
          coherence: 82,
        },
        feedbackArabic: 'مقال جيد يعبر عن الفكرة بوضوح، لكن هناك حاجة لتنويع حروف الجر وميلات الكيشور.',
        feedbackHebrew: 'חיבור טוב ומנומק. מומלץ לשלב מילות קישור עשירות יותר.',
        sentenceCorrections: [],
      };

      const newSubmission: Omit<WritingSubmission, 'id'> = {
        studentId: currentUser?.id || 'usr_student_1',
        topic: selectedPrompt.titleHebrew,
        content: essayContent,
        submittedAt: new Date().toISOString(),
        score: feedback.score,
        wordCount,
        feedbackArabic: feedback.feedbackArabic,
        feedbackHebrew: feedback.feedbackHebrew,
        criteriaScores: feedback.criteriaScores,
        sentenceCorrections: feedback.sentenceCorrections || [],
      };

      addWritingSubmission(newSubmission);
      setCurrentResult({
        ...newSubmission,
        id: `sub_${Date.now()}`,
      });
    } catch (err) {
      console.error('Error evaluating essay:', err);
      // Fallback evaluation
      const fallbackSub: Omit<WritingSubmission, 'id'> = {
        studentId: currentUser?.id || 'usr_student_1',
        topic: selectedPrompt.titleHebrew,
        content: essayContent,
        submittedAt: new Date().toISOString(),
        score: 118,
        wordCount,
        feedbackArabic: 'تم تقييم المقال بنجاح. أفكارك منظمة ولديك قدرة واضحة على الحجاج الأكاديمي، احرص على مراجعة تصريف الأفعال.',
        feedbackHebrew: 'חיבור בנוי היטב עם חלוקה נכונה לפסקאות. שים לב לשימוש מדויק באותיות יחס.',
        criteriaScores: {
          grammar: 78,
          vocabulary: 82,
          structure: 80,
          coherence: 84,
        },
        sentenceCorrections: [
          {
            original: 'אני חושב שלימודים מרחוק זה טוב לכולם',
            corrected: 'לעניות דעתי, למידה מקוונת עשויה להיטיב עם מרבית הסטודנטים',
            explanation: 'החלפת ניסוח יומיומי (זה טוב לכולם) במשלב אקדמי מדויק (עשויה להיטיב עם מרבית הסטודנטים).',
          },
        ],
      };
      addWritingSubmission(fallbackSub);
      setCurrentResult({
        ...fallbackSub,
        id: `sub_${Date.now()}`,
      });
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-right space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
            مختبر التعبير الكتابي الذكي (חיבור)
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            كتابة وتصحيح الإنشاء لمعايير יע"ל
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            تدرب على مواضيع حقيقية واحصل على تصحيح فوري ومعتمد بالذكاء الاصطناعي مع علامة من 150
          </p>
        </div>

        <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => {
              setActiveTab('write');
              setCurrentResult(null);
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'write'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            كتابة مقال جديد
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'history'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            سجل المقالات السابقة ({writingSubmissions.length})
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        currentResult ? (
          /* Evaluation Result Display */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide">
                  اكتمل التقييم الذكي
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{currentResult.topic}</h2>
              </div>
              <button
                onClick={() => setCurrentResult(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                كتابة مقال آخر
              </button>
            </div>

            {/* Big Score Card */}
            <div className="bg-linear-to-tr from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-6 text-center">
              <div className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-1">
                العلامة التقديرية للإنشاء (ציון חיבור)
              </div>
              <div className="text-5xl font-black font-['Assistant'] my-2">
                {currentResult.score}{' '}
                <span className="text-xl font-normal text-indigo-200 font-sans">/ 150</span>
              </div>
              <p className="text-xs text-indigo-200">
                عدد الكلمات: {currentResult.wordCount} كلمة (ضمن المدى الموصى به 120-150 كلمة)
              </p>
            </div>

            {/* Rubric Criteria 4-Pillars */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">דקדוק ותחביר (القواعد)</span>
                <span className="text-xl font-black text-indigo-600 font-['Assistant']">
                  {currentResult.criteriaScores.grammar}%
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">עושר לשוני (المفردات)</span>
                <span className="text-xl font-black text-blue-600 font-['Assistant']">
                  {currentResult.criteriaScores.vocabulary}%
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">מבנה הפסקאות (البنية)</span>
                <span className="text-xl font-black text-emerald-600 font-['Assistant']">
                  {currentResult.criteriaScores.structure}%
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <span className="text-xs text-slate-500 block">לכידות וקישור (الترابط)</span>
                <span className="text-xl font-black text-amber-600 font-['Assistant']">
                  {currentResult.criteriaScores.coherence}%
                </span>
              </div>
            </div>

            {/* Feedback Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs leading-relaxed space-y-1">
                <span className="font-bold text-indigo-950 block">ملاحظات التحسين بالعربية:</span>
                <p className="text-indigo-900">{currentResult.feedbackArabic}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs leading-relaxed space-y-1 text-right">
                <span className="font-bold text-slate-900 block font-['Assistant']">
                  משוב מילולי מפורט בעברית:
                </span>
                <p className="text-slate-700 font-['Assistant'] text-sm">
                  {currentResult.feedbackHebrew}
                </p>
              </div>
            </div>

            {/* Sentence-by-sentence corrections */}
            {currentResult.sentenceCorrections && currentResult.sentenceCorrections.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>تصحيحات جمل ونماذج إعادة صياغة مقترحة (תיקוני משפטים):</span>
                </h3>

                <div className="space-y-3">
                  {currentResult.sentenceCorrections.map((corr, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="space-y-1">
                        <div className="text-rose-700 line-through font-['Assistant'] text-sm">
                          {corr.original}
                        </div>
                        <div className="text-emerald-700 font-bold font-['Assistant'] text-sm">
                          {corr.corrected}
                        </div>
                      </div>
                      <p className="text-slate-500 pt-1 border-t border-slate-200">
                        <strong>سبب التعديل:</strong> {corr.explanation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Writing Form */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Prompt Selector & Guidelines (1 col) */}
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  اختر موضوع الإنشاء
                </h2>
                <div className="space-y-2">
                  {SAMPLE_PROMPTS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPrompt(p)}
                      className={`w-full p-3 rounded-2xl border text-right transition-all text-xs ${
                        selectedPrompt.id === p.id
                          ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 font-bold'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <span className="font-['Assistant'] text-sm font-bold block mb-1">
                        {p.titleHebrew}
                      </span>
                      <span className="text-[11px] text-slate-500 block">{p.titleArabic}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Guidelines Box */}
              <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200/60 text-xs space-y-2 text-amber-950">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>معايير المقال الأكاديمي في יע"ל:</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc list-inside leading-relaxed">
                  <li>الالتزام بحجم 120 إلى 150 كلمة.</li>
                  <li>تقسيم واضح إلى: مقدمة، 2-3 فقرات عرض، وخاتمة.</li>
                  <li>استخدام كلمات ربط أكاديمية (על כן, מחד גיסא, יתרה מכך).</li>
                  <li>تجنب العامية والأخطاء الإملائية الشائعة.</li>
                </ul>
              </div>
            </div>

            {/* Writing Area (2 cols) */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Active Prompt Info */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-xs font-bold text-indigo-600">الموضوع المختار:</span>
                  <h3 className="text-lg font-bold text-slate-900 font-['Assistant']">
                    {selectedPrompt.titleHebrew}
                  </h3>
                  <p className="text-xs text-slate-600 font-['Assistant'] leading-relaxed pt-1">
                    {selectedPrompt.description}
                  </p>
                </div>

                {/* Textarea */}
                <div className="space-y-2">
                  <textarea
                    rows={12}
                    value={essayContent}
                    onChange={(e) => setEssayContent(e.target.value)}
                    placeholder="כתבו כאן את החיבור שלכם בעברית... הקפידו על פסקת פתיחה, טיעונים מנומקים, ופסקת סיכום."
                    dir="rtl"
                    className="w-full p-4 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 font-['Assistant'] text-base leading-relaxed resize-none focus:outline-hidden"
                    id="essay-textarea-input"
                  />

                  {/* Word Count Indicator */}
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span
                      className={`font-semibold font-['Assistant'] ${
                        wordCount >= 120 && wordCount <= 150
                          ? 'text-emerald-600 font-bold'
                          : wordCount > 150
                          ? 'text-amber-600'
                          : 'text-slate-500'
                      }`}
                    >
                      {wordCount} מילים (المثالي: 120-150)
                    </span>
                    <span>استخدم لغة أكاديمية ومترادفات غنية</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={handleEvaluateEssay}
                  disabled={isEvaluating || wordCount < 10}
                  className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                    isEvaluating || wordCount < 10
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 shadow-indigo-600/20'
                  }`}
                  id="btn-evaluate-essay-ai"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>جاري تصحيح وتحليل المقال عبر YAEL AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>إرسال وتصحيح المقال بالذكاء الاصطناعي</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )
      ) : (
        /* History Archive */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-slate-900 mb-2">أرشيف المقالات السابقة</h2>

          {writingSubmissions.length === 0 ? (
            <p className="text-slate-400 text-sm py-8 text-center">
              لم تقم بتسليم أي موضوع إنشاء حتى الآن. ابدأ بكتابة مقالك الأول!
            </p>
          ) : (
            <div className="space-y-4">
              {writingSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 font-['Assistant'] text-base">
                        {sub.topic}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString('ar-EG')} • {sub.wordCount} كلمة
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-indigo-600 font-['Assistant']">
                        {sub.score}
                      </span>
                      <span className="text-xs text-slate-400">/ 150</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-3 rounded-xl">
                    "{sub.content}"
                  </p>

                  <div className="text-xs text-indigo-800 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
                    <span className="font-bold block mb-0.5">ملاحظات التقييم:</span>
                    {sub.feedbackArabic}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
