import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ErrorPattern } from '../types';
import {
  Sparkles,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Play,
  Lightbulb,
  Layers,
  ChevronLeft,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export const ErrorAnalysisView: React.FC = () => {
  const { errorPatterns, setCurrentView } = useApp();
  const [selectedPattern, setSelectedPattern] = useState<ErrorPattern>(errorPatterns[0]);

  const chartData = errorPatterns.map((p) => ({
    name: p.subject.slice(0, 22) + '...',
    rate: p.errorRate,
    count: p.errorCount,
    attempts: p.totalAttempts,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-right space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
          التحليل الذكي لأنماط الأخطاء
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
          رصد الأخطاء المتكررة والتمارين العلاجية
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
          يقوم الذكاء الاصطناعي بتحليل إجاباتك السابقة واكتشاف الأسباب الجذرية وراء فقدان العلامات، بدلاً من مجرد عرض النتيجة.
        </p>
      </div>

      {/* Pattern Chart & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Interactive Pattern Detail & Drill (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPattern && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200/60">
                    نمط متكرر مرصود
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 mt-2 font-['Assistant']">
                    {selectedPattern.subject}
                  </h2>
                </div>
                <div className="text-left">
                  <span className="text-3xl font-black text-rose-600 font-['Assistant'] block">
                    {selectedPattern.errorRate}%
                  </span>
                  <span className="text-[11px] text-slate-400">معدل الخطأ في هذا الموضوع</span>
                </div>
              </div>

              {/* Diagnosis Box */}
              <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60 space-y-2 text-xs leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>التشخيص الدقيق للخطأ:</span>
                </div>
                <p className="text-slate-800">{selectedPattern.descriptionArabic}</p>
                <p className="text-slate-600 font-['Assistant'] text-xs pt-1 border-t border-amber-200/40">
                  הגדרה לשונית: {selectedPattern.descriptionHebrew}
                </p>
              </div>

              {/* Stats pill */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">مرات الخطأ</span>
                  <span className="text-base font-bold text-slate-800 font-['Assistant']">
                    {selectedPattern.errorCount} مرات
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">إجمالي المحاولات</span>
                  <span className="text-base font-bold text-slate-800 font-['Assistant']">
                    {selectedPattern.totalAttempts} محاولة
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">مستوى الأولوية</span>
                  <span className="text-base font-bold text-rose-600">عالية (تأثير مباشر)</span>
                </div>
              </div>

              {/* Remedial Advice & Action Button */}
              <div className="p-5 bg-indigo-50/80 rounded-2xl border border-indigo-200 space-y-3">
                <div className="flex items-center gap-2 font-bold text-xs text-indigo-900">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>التوصية العلاجية الفورية من YAEL AI:</span>
                </div>
                <p className="text-xs text-indigo-950 leading-relaxed">
                  تفريغ 15 دقيقة يومياً لحل تمارين موجهة حول هذا الموضوع، والتركيز على مفاتيح الجمل ونفي النفي، سيضمن لك رفع علامتك التقديرية بـ 8-12 نقطة.
                </p>

                <button
                  onClick={() => setCurrentView('practice')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  id="btn-start-remedial-drill"
                >
                  <Play className="w-4 h-4" />
                  <span>بدء تمرين علاجي مكثف لهذا النمط الآن</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Patterns Selector List (1 col) */}
        <div className="space-y-4">
          <h3 className="font-bold text-xs text-slate-500 uppercase tracking-wide">
            الأنماط النشطة الأكثر تكراراً
          </h3>

          <div className="space-y-3">
            {errorPatterns.map((pattern, idx) => {
              const isSelected = selectedPattern.subject === pattern.subject;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedPattern(pattern)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-50'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 font-['Assistant']">
                      {pattern.subject}
                    </span>
                    <span className="text-xs font-black text-rose-600 font-['Assistant']">
                      {pattern.errorRate}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {pattern.descriptionArabic}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Quick Chart Comparison */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <span className="text-xs font-bold text-slate-700 block">نسب الأخطاء حسب النمط:</span>
            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 9 }} />
                  <YAxis domain={[0, 60]} tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(val: any) => [`${val}%`, 'نسبة الخطأ']} />
                  <Bar dataKey="rate" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
