import React, { useState } from 'react';
import { useApp, AppView } from '../context/AppContext';
import { UserRole } from '../types';
import {
  GraduationCap,
  BookOpen,
  Target,
  FileText,
  BarChart3,
  Sparkles,
  Layers,
  Bell,
  LogOut,
  UserCheck,
  CheckCircle2,
  BrainCircuit,
  MessageSquareCode,
  Users,
  Database,
  CalendarDays,
  Menu,
  X,
  Flame,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    currentUser,
    switchRole,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsTutorOpen,
    setIsAuthModalOpen,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNavClick = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleNavClick(currentUser ? (currentUser.role === 'teacher' ? 'teacher_dashboard' : currentUser.role === 'admin' ? 'admin_dashboard' : 'student_dashboard') : 'landing')}
              className="flex items-center gap-2.5 text-right focus:outline-hidden group"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900 font-['Assistant','sans-serif']">
                    YAEL <span className="text-indigo-600">AI</span>
                  </span>
                  <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded-sm border border-indigo-200/50">
                    יע"ל / יעלנט
                  </span>
                </div>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  المنظومة الذكية للتحضير لاختبار العبرية
                </span>
              </div>
            </button>
          </div>

          {/* Center Navigation Links based on role */}
          {currentUser && (
            <nav className="hidden lg:flex items-center gap-1">
              {currentUser.role === 'student' && (
                <>
                  <button
                    onClick={() => handleNavClick('student_dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'student_dashboard'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-student-dashboard"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>الرئيسية</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('diagnostic')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'diagnostic'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-diagnostic"
                  >
                    <Target className="w-4 h-4" />
                    <span>تحديد المستوى</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('practice')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'practice'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-practice"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>التدريبات</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('mock_exams')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'mock_exams'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-mock-exams"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>الامتحانات</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('vocab_trainer')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'vocab_trainer'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-vocab"
                  >
                    <Layers className="w-4 h-4" />
                    <span>المفردات</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('writing_lab')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'writing_lab'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-writing"
                  >
                    <FileText className="w-4 h-4" />
                    <span>الكتابة والإنشاء</span>
                  </button>

                  <button
                    onClick={() => handleNavClick('error_analysis')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'error_analysis'
                        ? 'bg-amber-50 text-amber-800 font-semibold border border-amber-200/50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-error-analysis"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>تحليل الأخطاء</span>
                  </button>
                </>
              )}

              {currentUser.role === 'teacher' && (
                <>
                  <button
                    onClick={() => handleNavClick('teacher_dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'teacher_dashboard'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-teacher-dashboard"
                  >
                    <Users className="w-4 h-4" />
                    <span>لوحة المعلم ومتابعة الطلاب</span>
                  </button>
                  <button
                    onClick={() => handleNavClick('practice')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'practice'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-teacher-questions"
                  >
                    <Database className="w-4 h-4" />
                    <span>معاينة بنك الأسئلة</span>
                  </button>
                </>
              )}

              {currentUser.role === 'admin' && (
                <>
                  <button
                    onClick={() => handleNavClick('admin_dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      currentView === 'admin_dashboard'
                        ? 'bg-indigo-50 text-indigo-700 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                    id="nav-admin-dashboard"
                  >
                    <Database className="w-4 h-4" />
                    <span>إدارة المنظومة والمستخدمين</span>
                  </button>
                </>
              )}
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher Pill for reviewer/demoing all 3 personas */}
            <div className="hidden sm:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs">
              <span className="text-slate-400 font-medium px-2 hidden xl:inline">تبديل الدور:</span>
              <button
                onClick={() => switchRole('student')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentUser?.role === 'student'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="الدخول كطالب"
                id="role-switch-student"
              >
                👨‍🎓 طالب
              </button>
              <button
                onClick={() => switchRole('teacher')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentUser?.role === 'teacher'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="الدخول كمعلم"
                id="role-switch-teacher"
              >
                👨‍🏫 معلم
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                  currentUser?.role === 'admin'
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="الدخول كمدير"
                id="role-switch-admin"
              >
                👨‍💼 مدير
              </button>
            </div>

            {/* AI Tutor Assistant Trigger */}
            <button
              onClick={() => setIsTutorOpen(true)}
              className="relative px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:from-indigo-600 hover:to-purple-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              title="تحدث مع المساعد الذكي لامتحان ياعيل"
              id="btn-open-ai-tutor"
            >
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="hidden sm:inline">مساعد YAEL الذكي</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Notifications Bell */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition-colors"
                  id="notifications-bell-btn"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 p-4 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">الإشعارات</span>
                        {unreadCount > 0 && (
                          <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                            {unreadCount} جديدة
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          تحديد الكل كمقروء
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-4">لا توجد إشعارات حالياً</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-2.5 rounded-xl cursor-pointer text-right transition-colors ${
                              n.read ? 'bg-slate-50/70 hover:bg-slate-100/80' : 'bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-semibold text-xs text-slate-900">{n.title}</span>
                              <span className="text-[10px] text-slate-400 shrink-0">{n.date}</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-1 border-r border-slate-200 pr-2 mr-1">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20"
                />
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {currentUser.role === 'student' ? 'طالب' : currentUser.role === 'teacher' ? 'معلم' : 'مدير'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="تسجيل الخروج"
                  id="btn-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                id="btn-login-header"
              >
                تسجيل الدخول
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 px-2 space-y-1 animate-in slide-in-from-top-2">
            {currentUser ? (
              <>
                <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl mb-3 text-xs">
                  <span className="font-semibold text-slate-600">الدور النشط:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => switchRole('student')}
                      className={`px-2 py-1 rounded-md ${currentUser.role === 'student' ? 'bg-white font-bold text-indigo-700' : 'text-slate-600'}`}
                    >
                      طالب
                    </button>
                    <button
                      onClick={() => switchRole('teacher')}
                      className={`px-2 py-1 rounded-md ${currentUser.role === 'teacher' ? 'bg-white font-bold text-indigo-700' : 'text-slate-600'}`}
                    >
                      معلم
                    </button>
                    <button
                      onClick={() => switchRole('admin')}
                      className={`px-2 py-1 rounded-md ${currentUser.role === 'admin' ? 'bg-white font-bold text-indigo-700' : 'text-slate-600'}`}
                    >
                      مدير
                    </button>
                  </div>
                </div>

                {currentUser.role === 'student' && (
                  <>
                    <button
                      onClick={() => handleNavClick('student_dashboard')}
                      className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <BarChart3 className="w-4 h-4 text-indigo-600" />
                      الرئيسية
                    </button>
                    <button
                      onClick={() => handleNavClick('diagnostic')}
                      className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Target className="w-4 h-4 text-indigo-600" />
                      اختبار تحديد المستوى
                    </button>
                    <button
                      onClick={() => handleNavClick('practice')}
                      className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      التدريبات
                    </button>
                    <button
                      onClick={() => handleNavClick('mock_exams')}
                      className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      الامتحانات التجريبية
                    </button>
                    <button
                      onClick={() => handleNavClick('vocab_trainer')}
                      className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4 text-indigo-600" />
                      المفردات والبطاقات الذكية
                    </button>
                    <button
                      onClick={() => handleNavClick('writing_lab')}
                      className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-indigo-600" />
                      كتابة الإنشاء وتصحيح AI
                    </button>
                    <button
                      onClick={() => handleNavClick('error_analysis')}
                      className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      نظام تحليل الأخطاء
                    </button>
                    <button
                      onClick={() => handleNavClick('study_plan')}
                      className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                    >
                      <CalendarDays className="w-4 h-4 text-indigo-600" />
                      الخطة الدراسية الشخصية
                    </button>
                  </>
                )}

                {currentUser.role === 'teacher' && (
                  <button
                    onClick={() => handleNavClick('teacher_dashboard')}
                    className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-indigo-600" />
                    لوحة متابعة الطلاب والأسئلة
                  </button>
                )}

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => handleNavClick('admin_dashboard')}
                    className="w-full text-right px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <Database className="w-4 h-4 text-indigo-600" />
                    لوحة مدير النظام
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl text-center"
              >
                تسجيل الدخول / إنشاء حساب
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
