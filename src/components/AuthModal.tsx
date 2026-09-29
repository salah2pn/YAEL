import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, User, Lock, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, users, setCurrentUser, setCurrentView } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = (selectedRole: UserRole) => {
    const matched = users.find((u) => u.role === selectedRole) || users[0];
    setCurrentUser(matched);
    setIsAuthModalOpen(false);
    if (selectedRole === 'teacher') setCurrentView('teacher_dashboard');
    else if (selectedRole === 'admin') setCurrentView('admin_dashboard');
    else setCurrentView('student_dashboard');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newUser = {
      id: `usr_custom_${Date.now()}`,
      name,
      email,
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      currentScore: 105,
      targetScore: 135,
      examDate: '2026-10-15',
      streakDays: 1,
      xp: 150,
      level: 1,
      studiedMinutesToday: 0,
      dailyGoalMinutes: 45,
      joinedDate: '2026-09-08',
    };

    setCurrentUser(newUser);
    setIsAuthModalOpen(false);
    if (role === 'teacher') setCurrentView('teacher_dashboard');
    else if (role === 'admin') setCurrentView('admin_dashboard');
    else setCurrentView('diagnostic'); // new student routes directly to diagnostic!
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 text-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-lg text-slate-900">
              {mode === 'login' ? 'تسجيل الدخول إلى YAEL AI' : 'إنشاء حساب طالب / معلم جديد'}
            </h3>
            <p className="text-xs text-slate-500">منظومة الاستعداد الذكية لامتحان יע"ל</p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
          <span className="text-xs font-bold text-slate-700 block">
            دخول فوري بحسابات تجريبية جاهزة:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('student')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-xs font-semibold text-slate-800 transition-colors shadow-2xs text-center"
            >
              👨‍🎓 طالب (أحمد)
            </button>
            <button
              onClick={() => handleQuickLogin('teacher')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-purple-400 text-xs font-semibold text-slate-800 transition-colors shadow-2xs text-center"
            >
              👨‍🏫 معلم (د. سارة)
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-400 text-xs font-semibold text-slate-800 transition-colors shadow-2xs text-center"
            >
              👨‍💼 مدير (يوسف)
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
          {mode === 'register' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">الاسم الكامل:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="مثال: ياسمين خليل"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
          )}

          <div>
            <label className="font-bold text-slate-700 block mb-1">البريد الإلكتروني:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">كلمة المرور:</label>
            <input
              type="password"
              defaultValue="password123"
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="font-bold text-slate-700 block mb-1">الدور:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="student">طالب (Student)</option>
                <option value="teacher">معلم / مدرب (Teacher)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors mt-2"
          >
            {mode === 'login' ? 'دخول' : 'إنشاء الحساب وبدء التشخيص'}
          </button>
        </form>

        <div className="text-center pt-2">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            {mode === 'login'
              ? 'ليس لديك حساب بعد؟ سجل مجاناً الآن'
              : 'لديك حساب بالفعل؟ تسجيل الدخول'}
          </button>
        </div>
      </div>
    </div>
  );
};
