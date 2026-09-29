import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  Target,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Save,
  RotateCcw,
  Sliders,
  ChevronLeft,
} from 'lucide-react';

const DAYS_OF_WEEK = [
  { id: 'الأحد', label: 'الأحد' },
  { id: 'الإثنين', label: 'الإثنين' },
  { id: 'الثلاثاء', label: 'الثلاثاء' },
  { id: 'الأربعاء', label: 'الأربعاء' },
  { id: 'الخميس', label: 'الخميس' },
  { id: 'الجمعة', label: 'الجمعة' },
  { id: 'السبت', label: 'السبت' },
];

export const PersonalStudyPlan: React.FC = () => {
  const { studyPlan, updateStudyPlanConfig, toggleTaskCompletion, currentUser, setCurrentView } = useApp();

  const [examDate, setExamDate] = useState(studyPlan.examDate);
  const [hoursPerDay, setHoursPerDay] = useState(studyPlan.availableHoursPerDay);
  const [targetScore, setTargetScore] = useState(studyPlan.targetScore);
  const [selectedDays, setSelectedDays] = useState<string[]>(studyPlan.studyDaysPerWeek);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const toggleDay = (dayId: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
    );
  };

  const handleSaveConfig = () => {
    updateStudyPlanConfig({
      examDate,
      availableHoursPerDay: hoursPerDay,
      targetScore,
      studyDaysPerWeek: selectedDays,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-right space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
          الخطة الدراسية المتكيفة
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          خطة دراسية شخصية تتكيف مع أدائك
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          الخطة ليست قالباً ثابتاً، بل نظام ديناميكي يراقب تقدمك ويعيد توزيع المهام تلقائياً لتركيز وقتك على ما يرفع علامتك بأسرع وقت.
        </p>
      </div>

      {/* Adaptive AI Alerts Banner */}
      <div className="bg-indigo-50/80 rounded-3xl p-6 border border-indigo-200/80 space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>تعديلات الخطة التلقائية بواسطة المنظومة (Adaptive Rebalancing):</span>
        </div>
        <div className="space-y-2">
          {studyPlan.adaptiveNotes.map((note, idx) => (
            <div key={idx} className="p-3 bg-white rounded-2xl border border-indigo-100 text-xs text-indigo-950 flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
              <p className="leading-relaxed">{note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Daily Schedule & Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">مهام الخطة لليوم</h2>
                <p className="text-xs text-slate-500">
                  التركيز الأسبوعي: <strong className="text-indigo-600">{studyPlan.weeklyFocus}</strong>
                </p>
              </div>
              <span className="text-xs bg-slate-100 px-3 py-1 rounded-xl text-slate-600 font-semibold">
                {studyPlan.dailyTasks.filter((t) => t.completed).length} من {studyPlan.dailyTasks.length} مكتملة
              </span>
            </div>

            <div className="space-y-3">
              {studyPlan.dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 opacity-80'
                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`mt-0.5 w-6 h-6 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                          task.completed
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-slate-300 hover:border-indigo-500'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4" />}
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                            }`}
                          >
                            {task.title}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                            {task.estimatedMinutes} دقيقة
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{task.description}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (task.category === 'vocabulary') setCurrentView('vocab_trainer');
                        else if (task.category === 'writing') setCurrentView('writing_lab');
                        else if (task.category === 'mock') setCurrentView('mock_exams');
                        else setCurrentView('practice');
                      }}
                      className="text-xs text-indigo-600 hover:text-indigo-800 font-bold shrink-0 flex items-center gap-1"
                    >
                      <span>بدء</span>
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Plan Settings & Calibration */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>إعدادات الخطة وتخصيصها</span>
            </div>

            {/* Target Score */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">العلامة المستهدفة (من 150):</label>
              <input
                type="number"
                min={80}
                max={150}
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:border-indigo-500 font-['Assistant']"
              />
              <span className="text-[11px] text-slate-400 block">
                معدل الإعفاء الأكاديمي في معظم الجامعات: 135+
              </span>
            </div>

            {/* Exam Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">موعد الامتحان القادم:</label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {/* Available Hours */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>ساعات الدراسة اليومية:</span>
                <span className="text-indigo-600 font-extrabold font-['Assistant']">
                  {hoursPerDay} ساعة
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={5}
                step={0.5}
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Study Days */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">أيام الدراسة الأسبوعية:</label>
              <div className="flex flex-wrap gap-1.5">
                {DAYS_OF_WEEK.map((day) => {
                  const isChecked = selectedDays.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        isChecked
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handleSaveConfig}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              id="btn-save-plan-config"
            >
              <Save className="w-4 h-4" />
              <span>حفظ وتحديث الخطة</span>
            </button>

            {saveSuccess && (
              <p className="text-xs text-emerald-600 font-bold text-center">
                تم حفظ وتكييف خطتك الدراسية بنجاح!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
