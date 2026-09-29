import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question, SkillCategory, DifficultyLevel } from '../types';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  Bookmark,
  ChevronLeft,
  Filter,
  Layers,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Lightbulb,
} from 'lucide-react';

export const PracticeSystem: React.FC = () => {
  const { questions, currentUser } = useApp();

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [onlyWeakDrills, setOnlyWeakDrills] = useState<boolean>(false);

  // Filtered pool
  const filteredQuestions = questions.filter((q) => {
    if (selectedCategory !== 'all' && q.skillCategory !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (onlyWeakDrills && q.skillCategory !== 'restatement' && q.skillCategory !== 'grammar') return false;
    return true;
  });

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasChecked, setHasChecked] = useState<boolean>(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // AI Deep Explanation State
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  const currentQ: Question | undefined = filteredQuestions[currentIndex];

  const handleSelect = (idx: number) => {
    if (!hasChecked) {
      setSelectedOption(idx);
    }
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;
    setHasChecked(true);
  };

  const handleNextQuestion = () => {
    setHasChecked(false);
    setSelectedOption(null);
    setAiExplanation(null);
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAskAiDeepExplanation = async () => {
    if (!currentQ || selectedOption === null) return;
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/explain-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionHebrew: currentQ.questionHebrew,
          options: currentQ.options,
          correctOptionIndex: currentQ.correctIndex,
          userSelectedOptionIndex: selectedOption,
          category: currentQ.skillCategory,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation('لم نتمكن من جلب الشرح الإضافي في الوقت الحالي.');
      }
    } catch (err) {
      setAiExplanation('عذراً، حدث خطأ أثناء الاتصال بالمساعد الذكي.');
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 text-right">
      {/* Header & Topic Selector */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
              التدريب التفاعلي المركز
            </span>
            <h1 className="text-2xl font-black text-slate-900 mt-0.5">
              تدريبات أسئلة الامتحان مع الشرح الذكي
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyWeakDrills(!onlyWeakDrills)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                onlyWeakDrills
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>تركيز على نقاط الضعف النشطة</span>
            </button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium">المجال:</span>
          {[
            { id: 'all', label: 'الكل (جميع الأسئلة)' },
            { id: 'restatement', label: 'ניסוח מחדש (إعادة الصياغة)' },
            { id: 'vocabulary', label: 'אוצר מילים (المفردات)' },
            { id: 'grammar', label: 'דקדוק (القواعد)' },
            { id: 'reading', label: 'הבנת הנקרא (فهم المقروء)' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setCurrentIndex(0);
                setHasChecked(false);
                setSelectedOption(null);
                setAiExplanation(null);
              }}
              className={`px-3 py-1.5 rounded-xl transition-colors font-medium ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* No questions fallback */}
      {!currentQ ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
          <p className="text-slate-500 text-sm">لا توجد أسئلة تطابق الفلاتر المحددة حالياً.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setOnlyWeakDrills(false);
            }}
            className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      ) : (
        /* Question Card */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-500">
                سؤال {currentIndex + 1} من {filteredQuestions.length}
              </span>
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-semibold">
                {currentQ.subject}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(currentQ.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  bookmarkedIds.includes(currentQ.id)
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'border-slate-200 text-slate-400 hover:text-slate-600'
                }`}
                title="حفظ للمراجعة"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-bold font-['Assistant']">
                {currentQ.difficulty === 'hard' ? 'רמה גבוהה' : 'רמה רגילה'}
              </span>
            </div>
          </div>

          {/* Reading passage if applicable */}
          {currentQ.passageText && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 text-sm leading-relaxed max-h-56 overflow-y-auto font-['Assistant']">
              <div className="font-bold text-slate-900 mb-1">{currentQ.passageTitle}</div>
              <div className="whitespace-pre-line">{currentQ.passageText}</div>
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <p className="text-xl sm:text-2xl font-black text-slate-900 font-['Assistant'] leading-relaxed">
              {currentQ.questionHebrew}
            </p>
            <p className="text-xs text-slate-500">
              السياق / الشرح المساعد بالعربية: {currentQ.questionArabic}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 text-slate-800';
              if (hasChecked) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-50/80 text-emerald-950 font-bold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-50/80 text-rose-950 font-bold';
                } else {
                  optionStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={hasChecked}
                  onClick={() => handleSelect(idx)}
                  className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${optionStyle}`}
                  id={`practice-opt-${idx}`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        hasChecked && isCorrect
                          ? 'bg-emerald-600 text-white'
                          : hasChecked && isSelected && !isCorrect
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-base font-['Assistant'] font-medium">{option}</span>
                  </div>

                  {hasChecked && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  )}
                  {hasChecked && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Check or Next */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            {!hasChecked ? (
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOption === null}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs ${
                  selectedOption === null
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105'
                }`}
                id="btn-check-practice"
              >
                تأكيد وفحص الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-all flex items-center gap-2"
                id="btn-next-practice"
              >
                <span>السؤال التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Detailed Explanation Box (Revealed after check) */}
          {hasChecked && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-xs uppercase tracking-wide text-indigo-900">
                  توضيح الحل النموذجي والقاعدة المطبقة
                </h3>
              </div>

              <div className="space-y-2 text-xs leading-relaxed">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">الشرح بالعربية:</span>
                  <p className="text-slate-600">{currentQ.explanationArabic}</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 text-right">
                  <span className="font-bold text-slate-800 block mb-1 font-['Assistant']">
                    הסבר בעברית (תחביר ומשמעות):
                  </span>
                  <p className="text-slate-700 font-['Assistant'] text-sm">
                    {currentQ.explanationHebrew}
                  </p>
                </div>
              </div>

              {/* AI Explain Error Button */}
              {selectedOption !== currentQ.correctIndex && (
                <div className="pt-2">
                  {!aiExplanation ? (
                    <button
                      onClick={handleAskAiDeepExplanation}
                      disabled={isLoadingAi}
                      className="px-4 py-2 rounded-xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
                      id="btn-ask-ai-deep-explanation"
                    >
                      {isLoadingAi ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>جاري توليد شرح إضافي مخصص من المساعد الذكي...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>لماذا كان خياري غير دقيق؟ (طلب تحليل تفصيلي من YAEL AI)</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-200 space-y-1.5 animate-in fade-in">
                      <div className="flex items-center gap-1.5 font-bold text-purple-900 text-xs">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span>تحليل المساعد الذكي YAEL AI:</span>
                      </div>
                      <p className="text-xs text-purple-950 leading-relaxed">{aiExplanation}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
