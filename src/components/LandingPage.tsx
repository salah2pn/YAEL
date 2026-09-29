import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BrainCircuit,
  Target,
  Sparkles,
  BookOpen,
  GraduationCap,
  Layers,
  FileText,
  LineChart,
  ShieldCheck,
  CheckCircle2,
  Users,
  ArrowLeft,
  Flame,
  Clock,
  Compass,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { switchRole, setCurrentView, setIsAuthModalOpen } = useApp();

  const handleStartDiagnostic = () => {
    switchRole('student');
    setCurrentView('diagnostic');
  };

  const handleEnterDashboard = () => {
    switchRole('student');
    setCurrentView('student_dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200/80 bg-linear-to-b from-indigo-50/50 via-white to-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
            <span>المنظومة الأذكى للتحضير لامتحان יע"ל / יעלנט في البلاد</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight sm:leading-none max-w-4xl">
            استعد لامتحان <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-600">יע"ל</span> بطريقة أذكى
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl leading-relaxed">
            منصة متكاملة ترافقك منذ اليوم الأول: تحدد مستواك، تحلل أخطاءك المتكررة، وتنشئ لك خطة دراسية تتكيف تلقائياً مع أدائك لضمان تحقيق هدفك الأكاديمي.
          </p>

          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={handleStartDiagnostic}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-base sm:text-lg shadow-lg shadow-indigo-600/25 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
              id="hero-start-diagnostic-btn"
            >
              <span>ابدأ الآن بتحديد مستواك</span>
              <ArrowLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleEnterDashboard}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base sm:text-lg border border-slate-200/80 shadow-xs flex items-center gap-2 transition-all"
              id="hero-demo-dashboard-btn"
            >
              <span>تجربة لوحة الطالب مباشرة</span>
            </button>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-3.5 rounded-xl text-slate-600 hover:text-indigo-600 font-semibold text-sm transition-colors"
              id="hero-login-modal-btn"
            >
              تسجيل الدخول / حساب جديد
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm max-w-4xl">
            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 font-['Assistant']">105 - 135+</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-0.5">معدل الإعفاء والقبول الجامعي</div>
            </div>
            <div className="text-right border-r border-slate-100 pr-4">
              <div className="text-2xl sm:text-3xl font-black text-slate-800 font-['Assistant']">5</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-0.5">محاور الامتحان الأساسية</div>
            </div>
            <div className="text-right border-r border-slate-100 pr-4">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-['Assistant']">AI Driven</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-0.5">تحليل أخطاء وتقييم إنشاء فوري</div>
            </div>
            <div className="text-right border-r border-slate-100 pr-4">
              <div className="text-2xl sm:text-3xl font-black text-purple-600 font-['Assistant']">3 Roles</div>
              <div className="text-xs sm:text-sm text-slate-500 mt-0.5">طالب + معلم + إدارة</div>
            </div>
          </div>
        </div>
      </section>

      {/* How the Closed-Loop Cycle Works */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            المبدأ الجوهري للمنظومة
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            ليست مجرد موقع أسئلة، بل منظومة تعليمية تفاعلية متكاملة
          </p>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            المنظومة تتعلم باستمرار من أداء الطالب وتكيّف خطته وأسئلته لتحقيق أكبر قفزة في العلامة:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">اختبار تشخيصي دقيق</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              تحديد نقطة البداية للطالب عبر 5 مجالات: المفردات، القواعد، فهم المقروء، إعادة الصياغة، والإنشاء.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">تحليل الأخطاء والضعف</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              رصد الأنماط المتكررة (مثل صعوبة أدوات النفي أو حروف الجر بالعبرية) واقتراح تمارين نوعية فورية.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">خطة دراسية متكيفة</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              تعديل الجدول اليومي تلقائياً: تقليل المواضيع المتقنة ومضاعفة التدريبات على نقاط الضعف النشطة.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs relative">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-bold text-base text-slate-900 mb-1.5">امتحان ومقارنة تطور</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              امتحانات تجريبية كاملة ومحاكاة حقيقية مع مؤقت زمني ورسوم بيانية ترصد ارتفاع مستواك أسبوعياً.
            </p>
          </div>
        </div>
      </section>

      {/* Main Feature Pillars */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              قدرات وميزات متقدمة
            </h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              كل ما يلزمك للتميز في امتحان יע"ל במקום אחד
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">مختبر كتابة الإنشاء الذكي (חיבור)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                اكتب مقالك العبري في بيئة تشبه الامتحان، واحصل على تقييم معتمد بالذكاء الاصطناعي يحلل القواعد، المترادفات، بنية الجمل، والترابط مع أمثلة للتصحيح.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">نظام المفردات والبطاقات (Flashcards)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                قاعدة بيانات لأهم المفردات الأكاديمية العبرية مع الجذور، المعاني بالعربية والإنجليزية، وأمثلة الاستخدام، مدمجة بنظام التكرار المتباعد الذكي.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">شرح الأخطاء الفوري للأسئلة</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                عند الخطأ في أي سؤال، يوضح لك الذكاء الاصطناعي فوراً لماذا كان خيارك غير دقيق وكيف تميز الإجابة الصحيحة باللغتين العربية والعبرية.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">امتحانات تجريبية كاملة وقصيرة</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                اختبارات موضوعية، اختبارات سريعة، ومحاكاة للامتحان الكامل بمؤقت دقيق، وحساب النتيجة من 50 إلى 150 وفق سلم علامات المركز القطري (מאלו"ו).
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <LineChart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">تحليلات وإحصائيات متقدمة</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                رسوم بيانية تتابع تطورك مع الوقت، مؤشر الالتزام (Streak)، نقاط XP، وتصنيف نقاط القوة والضعف لتوجيه مجهودك بدقة.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">أدوات المعلم وتوليد الأسئلة بـ AI</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                يمكن للمعلمين متابعة طلابهم خطوة بخطوة، واستخدام الذكاء الاصطناعي لإنشاء أسئلة جديدة ومراجعتها واعتمادها قبل نشرها للطلاب.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Showcase */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
            منظومة مهيأة للجميع
          </h2>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            3 بوابات وصلاحيات متكاملة
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Tier */}
          <div className="bg-white p-6 rounded-2xl border-2 border-indigo-500/30 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-indigo-600 font-bold text-lg">
                <span>👨‍🎓 بوابة الطالب</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                لوحة تحكم ذكية، خطة دراسية يومية، امتحانات تجريبية، تدريبات تخصصية، بنك كلمات، وتقييم الإنشاء.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>تحديد المستوى وخطة شخصية تتكيف تلقائياً</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>مساعد AI للإجابة عن أسئلة القواعد والمفردات</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>نظام التحفيز: Streak و XP ونقاط الإنجاز</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('student');
                setCurrentView('student_dashboard');
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors text-center"
            >
              الدخول كطالب (أحمد)
            </button>
          </div>

          {/* Teacher Tier */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-purple-600 font-bold text-lg">
                <span>👨‍🏫 بوابة المعلم</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                متابعة طلاب الصف، فحص تطور كل طالب، إدارة بنك الأسئلة، وتوليد أسئلة جديدة بالذكاء الاصطناعي مع مراجعتها واعتمادها.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>متابعة تفصيلية لنقاط ضعف كل طالب</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>مولد أسئلة ذكي مع نظام المراجعة والاعتماد</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>إرسال المهام والواجبات للطلاب</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('teacher');
                setCurrentView('teacher_dashboard');
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700 transition-colors text-center"
            >
              الدخول كمعلم (د. سارة)
            </button>
          </div>

          {/* Admin Tier */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3 text-slate-800 font-bold text-lg">
                <span>👨‍💼 بوابة مدير النظام</span>
              </div>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                إدارة شاملة للمستخدمين، الصلاحيات، بنك الأسئلة، الاختبارات، المواد التعليمية، ومراقبة مؤشرات أداء المنصة.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>إدارة حسابات الطلاب والمعلمين والصلاحيات</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>إدارة محتوى بنك الأسئلة والمواد</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>إحصائيات المنظومة واستهلاك الذكاء الاصطناعي</span>
                </li>
              </ul>
            </div>
            <button
              onClick={() => {
                switchRole('admin');
                setCurrentView('admin_dashboard');
              }}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 text-white font-semibold text-sm hover:bg-slate-900 transition-colors text-center"
            >
              الدخول كمدير (أ. يوسف)
            </button>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mt-10 max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-tr from-indigo-900 via-indigo-800 to-blue-900 text-white shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">
            جاهز لرفع علامتك في יע"ל إلى المستوى المطلوب؟
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            انضم الآن وابدأ باختبار تحديد المستوى مجاناً لتحصل على تشخيص فوري وخطة مخصصة لك بالكامل.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleStartDiagnostic}
              className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-bold hover:bg-indigo-50 shadow-md transition-colors"
            >
              ابدأ الاختبار التشخيصي
            </button>
            <button
              onClick={handleEnterDashboard}
              className="px-6 py-3 rounded-xl bg-indigo-700/80 text-white font-semibold hover:bg-indigo-700 border border-indigo-500/40 transition-colors"
            >
              استكشف لوحة التحكم
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
