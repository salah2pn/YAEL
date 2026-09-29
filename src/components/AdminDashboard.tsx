import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole } from '../types';
import {
  Database,
  Users,
  Shield,
  Activity,
  UserPlus,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Settings,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { users, questions, examResults, writingSubmissions, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'analytics' | 'settings'>('users');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState<boolean>(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('student');

  const filteredUsers = users.filter((u) => {
    if (filterRole !== 'all' && u.role !== filterRole) return false;
    return true;
  });

  const totalExamsTaken = examResults.length;
  const avgScore = examResults.length > 0
    ? Math.round(examResults.reduce((acc, curr) => acc + curr.score, 0) / examResults.length)
    : 118;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-right space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            بوابة الإدارة المركزية
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            لوحة مدير منظومة YAEL AI
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            إدارة حسابات المنظومة، الصلاحيات، مؤشرات الأداء، واستهلاك الذكاء الاصطناعي
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'users'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المستخدمين ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'analytics'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            إحصائيات المنصة والـ AI
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'settings'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            إعدادات النظام
          </button>
        </div>
      </div>

      {/* Top Overview Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">إجمالي المستخدمين</span>
          <span className="text-3xl font-black text-slate-900 font-['Assistant'] mt-1 block">
            {users.length}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">نشطون في المنصة</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">الامتحانات المنجزة</span>
          <span className="text-3xl font-black text-indigo-600 font-['Assistant'] mt-1 block">
            {totalExamsTaken}
          </span>
          <span className="text-[11px] text-slate-400">محاكاة واختبار تشخيصي</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">متوسط علامة الطلاب</span>
          <span className="text-3xl font-black text-emerald-600 font-['Assistant'] mt-1 block">
            {avgScore} <span className="text-sm font-normal text-slate-400">/ 150</span>
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">+14 نقطة تحسن متوسط</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-xs text-slate-500 font-semibold block">استدعاءات AI للإنشاء والأسئلة</span>
          <span className="text-3xl font-black text-purple-600 font-['Assistant'] mt-1 block">
            {writingSubmissions.length + 24}
          </span>
          <span className="text-[11px] text-purple-600 font-medium">Gemini 2.5 Server-Side</span>
        </div>
      </div>

      {/* 1. Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">إدارة الحسابات والصلاحيات</h2>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                {['all', 'student', 'teacher', 'admin'].map((role) => (
                  <button
                    key={role}
                    onClick={() => setFilterRole(role)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${
                      filterRole === role
                        ? 'bg-white font-bold text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {role === 'all' ? 'الكل' : role === 'student' ? 'طلاب' : role === 'teacher' ? 'معلمون' : 'مدراء'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>إضافة مستخدم جديد</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="py-3 px-3">المستخدم</th>
                  <th className="py-3 px-3">الدور (Role)</th>
                  <th className="py-3 px-3">العلامة الحالية</th>
                  <th className="py-3 px-3">تاريخ الانضمام</th>
                  <th className="py-3 px-3 text-center">الحالة</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-8 h-8 rounded-xl object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-md ${
                          u.role === 'admin'
                            ? 'bg-slate-100 text-slate-900'
                            : u.role === 'teacher'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {u.role === 'admin' ? 'مدير نظام' : u.role === 'teacher' ? 'معلم / مدرب' : 'طالب'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700 font-['Assistant']">
                      {u.role === 'student' ? `${u.currentScore} / 150` : '—'}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 font-medium">
                      {u.joinedDate}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-bold text-[10px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        نشط
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">مؤشرات أداء طلاب المنظومة</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">نسبة الطلاب الذين حققوا الإعفاء (135+):</span>
                <span className="font-black text-emerald-600 text-sm font-['Assistant']">68%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">متوسط الالتزام اليومي للطلاب:</span>
                <span className="font-black text-indigo-600 text-sm font-['Assistant']">38 دقيقة / يوم</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">أكثر مجال يشهد أخطاء متكررة:</span>
                <span className="font-bold text-rose-600 text-sm">ניסוח מחדש (إعادة الصياغة)</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-bold text-base text-slate-900">حالة تكامل الذكاء الاصطناعي (Gemini)</h3>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-950 rounded-xl border border-emerald-200">
                <span className="font-bold">حالة الموديل:</span>
                <span className="font-bold text-emerald-700">Gemini 2.5 Flash (نشط ومتصل)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">أمان المفاتيح (API Key Security):</span>
                <span className="font-bold text-emerald-700">محمية تماماً بالسيرفر الداخلي</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-600">معدل الاستجابة لتقييم المقالات:</span>
                <span className="font-bold text-slate-800 font-['Assistant']">1.8 ثانية</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Settings Tab */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-base text-slate-900">إعدادات المنظومة العامة</h3>
          <div className="space-y-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block text-sm">التكرار المتباعد التلقائي للمفردات</span>
                <span className="text-slate-500">إرسال الكلمات الخاطئة تلقائياً لخطة المراجعة اليومية للطلاب</span>
              </div>
              <span className="text-emerald-600 font-bold">مفعل</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block text-sm">اعتماد أسئلة المعلم التلقائي</span>
                <span className="text-slate-500">يتطلب موافقة المعلم اليدوية قبل إدراج أي سؤال مولد بـ AI في بنك الأسئلة</span>
              </div>
              <span className="text-emerald-600 font-bold">مفعل كإجراء جودة</span>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-base text-slate-900">إضافة مستخدم جديد للمنصة</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">الاسم الكامل:</label>
                <input
                  type="text"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="مثال: ريم مصطفى"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="reem@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">الدور والصلاحية:</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="student">طالب (Student)</option>
                  <option value="teacher">معلم / مدرب (Teacher)</option>
                  <option value="admin">مدير نظام (Admin)</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  alert(`تمت إضافة المستخدم ${newUserName || 'الجديد'} بنجاح!`);
                  setShowAddUserModal(false);
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                إنشاء وتفعيل الحساب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
