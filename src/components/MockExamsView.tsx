import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Exam, Question, ExamResult } from '../types';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Flag,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Play,
  RotateCcw,
  Sparkles,
  Award,
  ChevronLeft,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const MockExamsView: React.FC = () => {
  const { exams, questions, submitExamResult, currentUser, activeExamToTake, setActiveExamToTake } = useApp();

  const [activeExam, setActiveExam] = useState<Exam | null>(activeExamToTake);
  const [examState, setExamState] = useState<'catalog' | 'taking' | 'result'>('catalog');

  // Taking state
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedIndices, setFlaggedIndices] = useState<number[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [examStartTime, setExamStartTime] = useState(Date.now());
  const [examResultData, setExamResultData] = useState<ExamResult | null>(null);

  // Sync if activeExamToTake changes from outside
  useEffect(() => {
    if (activeExamToTake) {
      startTakingExam(activeExamToTake);
      setActiveExamToTake(null);
    }
  }, [activeExamToTake]);

  // Timer countdown
  useEffect(() => {
    if (examState !== 'taking') return;
    if (secondsRemaining <= 0) {
      handleSubmitExam();
      return;
    }
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [examState, secondsRemaining]);

  const startTakingExam = (exam: Exam) => {
    setActiveExam(exam);
    setCurrentQIndex(0);
    setUserAnswers({});
    setFlaggedIndices([]);
    setSecondsRemaining(exam.durationMinutes * 60);
    setExamStartTime(Date.now());
    setExamState('taking');
  };

  const toggleFlag = (index: number) => {
    setFlaggedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleSelectOption = (optIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQIndex]: optIdx,
    }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;
    const timeSpent = Math.max(1, Math.round((Date.now() - examStartTime) / 1000));
    let correct = 0;

    const answerLogs = activeExam.questions.map((q, idx) => {
      const chosen = userAnswers[idx];
      const isCorrect = chosen === q.correctIndex;
      if (isCorrect) correct++;
      return {
        questionId: q.id,
        selectedOption: chosen ?? -1,
        isCorrect,
        timeSpentSeconds: Math.round(timeSpent / activeExam.questions.length),
        timestamp: new Date().toISOString(),
        skillCategory: q.skillCategory,
      };
    });

    const accuracyRate = activeExam.questions.length > 0 ? correct / activeExam.questions.length : 0;
    // Scale from 50 to 150
    const scaledScore = Math.min(150, Math.max(50, Math.round(50 + accuracyRate * 95 + 5)));

    const resultPayload: Omit<ExamResult, 'id'> = {
      studentId: currentUser?.id || 'usr_student_1',
      examId: activeExam.id,
      examTitle: activeExam.title,
      examType: activeExam.type,
      date: new Date().toISOString().split('T')[0],
      score: scaledScore,
      maxScore: 150,
      correctCount: correct,
      totalQuestions: activeExam.questions.length,
      timeSpentSeconds: timeSpent,
      skillsBreakdown: {
        vocabulary: Math.round(accuracyRate * 85 + 10),
        grammar: Math.round(accuracyRate * 80 + 15),
        reading: Math.round(accuracyRate * 90 + 5),
        restatement: Math.round(accuracyRate * 70 + 20),
        writing: 75,
      },
      weakAreas: accuracyRate < 0.7 ? ['نيسوح مخداش (إعادة الصياغة)', 'أفعال بنيان هفغيل'] : [],
      answers: answerLogs,
    };

    submitExamResult(resultPayload);
    setExamResultData({
      ...resultPayload,
      id: `res_local_${Date.now()}`,
    });
    setExamState('result');
  };

  // Format timer
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  // 1. Result View
  if (examState === 'result' && examResultData && activeExam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-right space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
                تقرير نتيجة الامتحان
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1">{activeExam.title}</h1>
            </div>
            <span className="text-xs text-slate-400">{examResultData.date}</span>
          </div>

          {/* Big Score Card */}
          <div className="bg-linear-to-tr from-indigo-900 via-indigo-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 text-center">
            <div className="text-xs uppercase tracking-widest text-indigo-300 font-bold mb-1">
              العلامة المحصلة (ציון יע"ל)
            </div>
            <div className="text-5xl sm:text-6xl font-black font-['Assistant'] my-2">
              {examResultData.score}
              <span className="text-xl font-normal text-indigo-200 font-sans"> / 150</span>
            </div>
            <p className="text-sm text-indigo-200 max-w-md mx-auto">
              أجبت بشكل صحيح على {examResultData.correctCount} من أصل {examResultData.totalQuestions} أسئلة
              (نسبة الدقة: {Math.round((examResultData.correctCount / examResultData.totalQuestions) * 100)}%)
            </p>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4 pt-4">
            <h2 className="text-base font-bold text-slate-900">مراجعة إجابات الأسئلة والشرح</h2>
            <div className="space-y-4">
              {activeExam.questions.map((q, idx) => {
                const chosen = userAnswers[idx];
                const isCorrect = chosen === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-600" />
                        )}
                        <span className="font-bold text-xs text-slate-800">
                          سؤال {idx + 1} ({q.subject})
                        </span>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {isCorrect ? 'إجابة صحيحة' : 'إجابة غير صحيحة'}
                      </span>
                    </div>

                    <p className="text-base font-bold text-slate-900 font-['Assistant'] mb-3">
                      {q.questionHebrew}
                    </p>

                    <div className="space-y-1.5 text-xs">
                      {q.options.map((opt, optIdx) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-xl flex items-center justify-between ${
                            optIdx === q.correctIndex
                              ? 'bg-emerald-100/80 text-emerald-950 font-bold border border-emerald-300'
                              : optIdx === chosen && !isCorrect
                              ? 'bg-rose-100/80 text-rose-950 font-bold border border-rose-300'
                              : 'text-slate-600 bg-white/70'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                              {optIdx + 1}
                            </span>
                            <span className="font-['Assistant']">{opt}</span>
                          </div>
                          {optIdx === q.correctIndex && (
                            <span className="text-[10px] text-emerald-800 font-bold">الإجابة الصحيحة</span>
                          )}
                          {optIdx === chosen && !isCorrect && (
                            <span className="text-[10px] text-rose-800 font-bold">إجابتك</span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Explanation */}
                    <div className="mt-3 p-3 bg-white/90 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800 block mb-0.5">الشرح:</span>
                      {q.explanationArabic}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setExamState('catalog')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-xs"
            >
              العودة إلى قائمة الامتحانات
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Exam In-Progress Mode (Clean, distraction-free)
  if (examState === 'taking' && activeExam) {
    const currentQ = activeExam.questions[currentQIndex];
    const isFlagged = flaggedIndices.includes(currentQIndex);

    return (
      <div className="max-w-5xl mx-auto px-4 py-6 text-right">
        {/* Top Sticky Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between mb-6">
          <div>
            <span className="text-xs text-slate-500 font-medium">{activeExam.title}</span>
            <div className="text-base font-bold text-slate-900">
              سؤال {currentQIndex + 1} من أصل {activeExam.questions.length}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown Clock */}
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-xl font-['Assistant'] font-bold text-indigo-700 text-base">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <button
              onClick={handleSubmitExam}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              id="exam-finish-submit-btn"
            >
              تسليم الامتحان
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Question Panel (3 cols) */}
          <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                الموضوع: {currentQ.subject}
              </span>
              <button
                onClick={() => toggleFlag(currentQIndex)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                  isFlagged
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${isFlagged ? 'fill-amber-600 text-amber-600' : ''}`} />
                <span>{isFlagged ? 'تمت الإشارة للمراجعة' : 'إشارة للمراجعة'}</span>
              </button>
            </div>

            {/* Reading Passage if any */}
            {currentQ.passageText && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-800 text-sm leading-relaxed max-h-56 overflow-y-auto font-['Assistant']">
                <div className="font-bold text-slate-900 mb-1">{currentQ.passageTitle}</div>
                <div className="whitespace-pre-line">{currentQ.passageText}</div>
              </div>
            )}

            {/* Stem */}
            <p className="text-xl font-bold text-slate-900 font-['Assistant'] leading-relaxed">
              {currentQ.questionHebrew}
            </p>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => {
                const isSelected = userAnswers[currentQIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className="text-base font-['Assistant']">{opt}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <button
                onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQIndex === 0}
                className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 ${
                  currentQIndex === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ArrowRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              <button
                onClick={() => {
                  if (currentQIndex < activeExam.questions.length - 1) {
                    setCurrentQIndex((prev) => prev + 1);
                  } else {
                    handleSubmitExam();
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center gap-2 shadow-xs"
              >
                <span>{currentQIndex === activeExam.questions.length - 1 ? 'تسليم الامتحان' : 'التالي'}</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Question Palette (1 col) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-xs text-slate-800">لوحة الأسئلة (Question Palette)</h3>

            <div className="grid grid-cols-5 gap-2">
              {activeExam.questions.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const isCurrent = currentQIndex === idx;
                const isFlg = flaggedIndices.includes(idx);

                let bg = 'bg-slate-100 text-slate-700';
                if (isCurrent) {
                  bg = 'ring-2 ring-indigo-600 bg-indigo-600 text-white font-bold';
                } else if (isFlg) {
                  bg = 'bg-amber-100 text-amber-900 border border-amber-400 font-bold';
                } else if (isAnswered) {
                  bg = 'bg-emerald-100 text-emerald-900 font-bold';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentQIndex(idx)}
                    className={`h-9 rounded-xl text-xs flex items-center justify-center transition-all ${bg}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-emerald-200" />
                <span>تمت الإجابة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-amber-200" />
                <span>مؤشر للمراجعة</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-md bg-slate-100 border" />
                <span>لم تتم الإجابة بعد</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Catalog View
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-right space-y-6">
      <div>
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
          الامتحانات والمحاكاة
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          امتحانات تجريبية كاملة وقصيرة بنظام יע"ל
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          تدرب في ظروف تحاكي الامتحان الحقيقي مع مؤقت زمني وسلم علامات من 50 إلى 150.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                  {exam.type === 'full_mock' ? 'محاكاة كاملة' : exam.type === 'mini_quiz' ? 'اختبار سريع' : 'اختبار موضوعي'}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold font-['Assistant']">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{exam.durationMinutes} دقيقة</span>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-900 mb-2">{exam.title}</h2>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">{exam.description}</p>

              <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl mb-6">
                <div>
                  <span className="text-slate-400 block text-[10px]">عدد الأسئلة</span>
                  <span className="font-bold text-slate-800">{exam.questions.length} أسئلة</span>
                </div>
                <div className="border-r border-slate-200 pr-4">
                  <span className="text-slate-400 block text-[10px]">السلم الأكاديمي</span>
                  <span className="font-bold text-slate-800">50 - 150 נק'</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => startTakingExam(exam)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              id={`btn-start-exam-${exam.id}`}
            >
              <Play className="w-4 h-4" />
              <span>بدء الامتحان الآن</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
