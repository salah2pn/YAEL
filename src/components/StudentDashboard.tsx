import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Calendar,
  Clock,
  Target,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  FileText,
  GraduationCap,
  Play,
  RotateCcw,
  ChevronLeft,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    studyPlan,
    toggleTaskCompletion,
    examResults,
    vocabulary,
    setCurrentView,
    achievements,
    startExam,
    exams,
  } = useApp();

  if (!currentUser) return null;

  // Calculate days remaining
  const examDate = new Date(studyPlan.examDate || currentUser.examDate);
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Vocabulary needing review
  const vocabNeedReview = vocabulary.filter(
    (v) => v.masteryStatus === 'need_review' || v.masteryStatus === 'learning'
  );

  // Latest exam result
  const latestResult = examResults.length > 0 ? examResults[0] : null;

  // Skills Breakdown Data for Chart
  const skillsData = [
    {
      name: 'المفردات',
      hebrew: 'אוצר מילים',
      score: latestResult?.skillsBreakdown.vocabulary || 75,
      color: '#6366f1',
    },
    {
      name: 'القواعد',
      hebrew: 'דקדוק',
      score: latestResult?.skillsBreakdown.grammar || 82,
      color: '#3b82f6',
    },
    {
      name: 'فهم المقروء',
      hebrew: 'הבנת הנקרא',
      score: latestResult?.skillsBreakdown.reading || 88,
      color: '#10b981',
    },
    {
      name: 'إعادة الصياغة',
      hebrew: 'ניסוח מחדש',
      score: latestResult?.skillsBreakdown.restatement || 62,
      color: '#f59e0b',
    },
    {
      name: 'الكتابة',
      hebrew: 'כתיבה',
      score: latestResult?.skillsBreakdown.writing || 74,
      color: '#ec4899',
    },
  ];

  // Past Exam Results Chart
  const historyData = [...examResults].reverse().map((res, index) => ({
    name: `اختبار ${index + 1}`,
    title: res.examTitle,
    score: res.score,
    target: currentUser.targetScore,
    date: res.date,
  }));

  // Identify next task
  const nextTask = studyPlan.dailyTasks.find((t) => !t.completed) || studyPlan.dailyTasks[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Greeting & Primary Vital Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              مرحباً، {currentUser.name} 👋
            </h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-bold border border-indigo-200/50">
              المستوى {currentUser.level} • {currentUser.xp} XP
            </span>
          </div>
          <p className="text-slate-600 text-sm">
            أنت في الطريق الصحيح للوصول إلى علامتك المنشودة{' '}
            <span className="font-bold text-indigo-600">{currentUser.targetScore}/150</span> في امتحان יע"ל.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setCurrentView('diagnostic')}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5"
            id="dash-btn-retake-diagnostic"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            <span>إعادة تحديد المستوى</span>
          </button>

          <button
            onClick={() => {
              const fullMock = exams.find((e) => e.type === 'full_mock') || exams[0];
              startExam(fullMock);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center gap-2"
            id="dash-btn-start-full-mock"
          >
            <Play className="w-4 h-4" />
            <span>بدء امتحان تجريبي كامل</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Score & Target */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">المستوى والنتيجة الحالية</span>
            <Target className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-['Assistant']">
              {currentUser.currentScore}
            </span>
            <span className="text-xs text-slate-400 font-['Assistant']">
              / 150 (الهدف: {currentUser.targetScore})
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentUser.currentScore / 150) * 100}%` }}
            />
          </div>
        </div>

        {/* Countdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">موعد الامتحان</span>
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-blue-600 font-['Assistant']">
              {daysRemaining}
            </span>
            <span className="text-xs text-slate-500 font-medium">يوماً متبقياً</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span>التاريخ المحدد:</span>
            <span className="font-semibold text-slate-600">{studyPlan.examDate}</span>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">سلسلة الالتزام (Streak)</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-['Assistant']">
              {currentUser.streakDays}
            </span>
            <span className="text-xs text-slate-500 font-medium">أيام متتالية 🔥</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            استمر بالدراسة اليوم للحفاظ على الشعلة!
          </p>
        </div>

        {/* Daily Study Goal */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">الهدف اليومي</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600 font-['Assistant']">
              {currentUser.studiedMinutesToday}
            </span>
            <span className="text-xs text-slate-400 font-['Assistant']">
              / {currentUser.dailyGoalMinutes} دقيقة
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(
                  100,
                  (currentUser.studiedMinutesToday / currentUser.dailyGoalMinutes) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* 3. Next Task Banner / AI Adaptive Notification */}
      {studyPlan.adaptiveNotes.length > 0 && (
        <div className="bg-linear-to-r from-indigo-900 via-indigo-800 to-blue-900 rounded-3xl p-5 sm:p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Sparkles className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  توجيه ذكي من منظومة YAEL AI
                </span>
                <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  متكيف تلقائياً
                </span>
              </div>
              <p className="text-sm font-medium mt-1 leading-relaxed text-slate-100">
                {studyPlan.adaptiveNotes[0]}
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentView('error_analysis')}
            className="px-4 py-2 rounded-xl bg-white text-indigo-900 text-xs sm:text-sm font-bold hover:bg-indigo-50 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
            id="dash-view-error-analysis-btn"
          >
            <span>فحص تفاصيل الأخطاء</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 Cols): Skills Radar / Bar & Performance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Breakdown Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  مستوى الإتقان حسب مجالات امتحان יע"ל
                </h2>
                <p className="text-xs text-slate-500">
                  تحليل بياني محدّث مستند إلى آخر الاختبارات والتمارين
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
                מאלו"ו יע"ל
              </span>
            </div>

            {/* Visual Recharts Bar Graph */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, 'نسبة الإتقان']}
                    labelFormatter={(label) => `مجال: ${label}`}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {skillsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Strengths & Weaknesses Split */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>نقاط القوة لديك (חוזקות)</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-center justify-between">
                    <span>הבנת הנקרא (فهم المقروء)</span>
                    <span className="font-bold text-emerald-700 font-['Assistant']">88%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>דקדוק ותחביר (القواعد وبناء الجمل)</span>
                    <span className="font-bold text-emerald-700 font-['Assistant']">82%</span>
                  </li>
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>نقاط تحتاج إلى تقوية (נקודות לשיפור)</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li className="flex items-center justify-between">
                    <span>ניסוח מחדש (إعادة صياغة الجمل)</span>
                    <span className="font-bold text-amber-700 font-['Assistant']">62%</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>חיבור - מילות קישור עשירות</span>
                    <span className="font-bold text-amber-700 font-['Assistant']">74%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Past Exam Progress Trend */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  تطور العلامة عبر الامتحانات السابقة
                </h2>
                <p className="text-xs text-slate-500">
                  مقارنة تقدمك من أول اختبار تشخيصي حتى اليوم
                </p>
              </div>
              <TrendingUp className="w-5 h-5 text-indigo-600" />
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} />
                  <YAxis domain={[50, 150]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} />
                  <Tooltip
                    formatter={(value: any) => [`${value} / 150`, 'العلامة']}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ fill: '#4f46e5', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Daily Study Plan Checklist & Vocab Review */}
        <div className="space-y-6">
          {/* Daily Study Plan Tasks */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">خطة الدراسة اليومية</h2>
                <p className="text-xs text-slate-500">مهامك الموصى بها لليوم</p>
              </div>
              <button
                onClick={() => setCurrentView('study_plan')}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
              >
                تعدיל الخطة
              </button>
            </div>

            <div className="space-y-3">
              {studyPlan.dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    task.completed
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-emerald-500 text-white'
                          : 'border-2 border-slate-300 hover:border-indigo-500'
                      }`}
                      id={`check-task-${task.id}`}
                    >
                      {task.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs font-bold ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {task.estimatedMinutes} د
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {task.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                if (nextTask?.category === 'vocabulary') {
                  setCurrentView('vocab_trainer');
                } else if (nextTask?.category === 'writing') {
                  setCurrentView('writing_lab');
                } else {
                  setCurrentView('practice');
                }
              }}
              className="mt-4 w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-colors text-center"
              id="dash-start-next-task-btn"
            >
              الانتقال إلى المهمة التالية الآن
            </button>
          </div>

          {/* Smart Vocabulary Need Review Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <h2 className="text-base font-bold text-slate-900">مفردات بانتظار المراجعة</h2>
              </div>
              <span className="bg-purple-50 text-purple-700 text-[11px] px-2 py-0.5 rounded-full font-bold">
                {vocabNeedReview.length} كلمات
              </span>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              كلمات أخطأت فيها مؤخراً وتحتاج إلى تثبيت عبر التكرار المتباعد:
            </p>

            <div className="space-y-2">
              {vocabNeedReview.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="text-right">
                    <span className="font-extrabold text-slate-900 font-['Assistant'] text-sm">
                      {item.wordHebrew}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {item.meaningArabic}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/50">
                    مراجعة
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setCurrentView('vocab_trainer')}
              className="mt-4 w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
              id="dash-open-flashcards-btn"
            >
              فتح البطاقات التعليمية Flashcards
            </button>
          </div>

          {/* Motivation & Achievements Teaser */}
          <div className="bg-linear-to-tr from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-3xl border border-amber-200/60">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>إنجازاتك ونقاط التحفيز</span>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {achievements.slice(0, 2).map((ach) => (
                <div
                  key={ach.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/80 border border-amber-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{ach.icon}</span>
                    <div>
                      <div className="font-bold text-slate-800">{ach.title}</div>
                      <div className="text-[10px] text-slate-500">{ach.description}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700">+{ach.xpReward} XP</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
