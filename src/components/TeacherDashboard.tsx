import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Question, SkillCategory, DifficultyLevel } from '../types';
import {
  Users,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Send,
  Loader2,
  BookOpen,
  Target,
  Clock,
  Search,
  Filter,
} from 'lucide-react';

export const TeacherDashboard: React.FC = () => {
  const { users, questions, addQuestion, deleteQuestion } = useApp();

  const students = users.filter((u) => u.role === 'student');

  const [activeTab, setActiveTab] = useState<'roster' | 'ai_generator' | 'bank'>('roster');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);

  // AI Question Generation Form State
  const [genCategory, setGenCategory] = useState<SkillCategory>('restatement');
  const [genDifficulty, setGenDifficulty] = useState<DifficultyLevel>('medium');
  const [genSubject, setGenSubject] = useState<string>('שלילה כפולה ומיעוט');
  const [genCount, setGenCount] = useState<number>(2);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDrafts, setGeneratedDrafts] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Trigger Gemini AI generation
  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setSuccessMessage(null);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: genCategory,
          difficulty: genDifficulty,
          subject: genSubject,
          count: genCount,
        }),
      });

      const data = await res.json();
      if (data.questions && Array.isArray(data.questions)) {
        setGeneratedDrafts(data.questions);
      } else {
        alert('لم نتمكن من توليد أسئلة في الوقت الحالي.');
      }
    } catch (err) {
      console.error('Error generating questions:', err);
      // Fallback draft
      setGeneratedDrafts([
        {
          questionHebrew: 'איש מהנוכחים באולם לא הופתע מתוצאות הבחירות, שכן הסקרים חזו אותן בדיוק רב.',
          questionArabic: 'لم يتفاجأ أي من الحاضرين في القاعة من نتائج الانتخابات، إذ أن استطلاعات الرأي توقعتها بدقة بالغة.',
          options: [
            'כל הנוכחים באולם היו מופתעים למדי מתוצאות הבחירות.',
            'תוצאות הבחירות היו צפויות לחלוטין בעיני כל מי שנכח באולם.',
            'הסקרים לא הצליחו לחזות את תוצאות הבחירות עבור הנוכחים.',
            'אף אחד לא ציפה לתוצאות הבחירות מלבד מנסחי הסקרים.',
          ],
          correctIndex: 1,
          explanationHebrew: 'המשפט המקורי מציין שאיש לא הופתע מפני שהתוצאות נחזו, ולכן הן היו צפויות לחלוטין לכל הנוכחים.',
          explanationArabic: 'الخيار 2 يعيد صياغة المعنى بدقة تامة: "איש לא הופתע" تعني أنها كانت متوقعة للجميع.',
          difficulty: genDifficulty,
          skillCategory: genCategory,
          subject: genSubject,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Approve draft question into real question bank
  const handleApproveDraft = (draft: any, index: number) => {
    addQuestion({
      ...draft,
      approvedByTeacher: true,
      tags: ['توليد_معلم_AI', draft.subject],
    });
    setGeneratedDrafts((prev) => prev.filter((_, i) => i !== index));
    setSuccessMessage('تم اعتماد السؤال بنجاح وإضافته إلى بنك الأسئلة المتاح لجميع الطلاب!');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleDiscardDraft = (index: number) => {
    setGeneratedDrafts((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-right space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
            بوابة المعلم والمدرب الأكاديمي
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            لوحة متابعة الطلاب وتوليد المحتوى بـ AI
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            رصد مستوى طلابك، فحص نقاط الضعف الفردية والجماعية، واعتماد أسئلة جديدة بالذكاء الاصطناعي
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'roster'
                ? 'bg-white text-purple-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            سجل الطلاب ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('ai_generator')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'ai_generator'
                ? 'bg-white text-purple-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>توليد أسئلة بالذكاء الاصطناعي</span>
          </button>
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'bank'
                ? 'bg-white text-purple-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            بنك الأسئلة الحالي ({questions.length})
          </button>
        </div>
      </div>

      {/* 1. Student Roster Tab */}
      {activeTab === 'roster' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">قائمة الطلاب المنتسبين</h2>
            <span className="text-xs text-slate-400">محدث مع كل اختبار ينجزه الطالب</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="py-3 px-3">الطالب</th>
                  <th className="py-3 px-3">العلامة الحالية</th>
                  <th className="py-3 px-3">الهدف</th>
                  <th className="py-3 px-3">سلسلة الالتزام</th>
                  <th className="py-3 px-3">نقاط الضعف الأساسية</th>
                  <th className="py-3 px-3 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-8 h-8 rounded-xl object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{student.name}</span>
                          <span className="text-[10px] text-slate-400">{student.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-black text-sm text-indigo-600 font-['Assistant']">
                        {student.currentScore} / 150
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-slate-700 font-['Assistant']">
                      {student.targetScore}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold">
                        {student.streakDays} أيام 🔥
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
                        ניסוח מחדש (إعادة الصياغة)
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors flex items-center gap-1 mx-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>فحص شامل</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. AI Question Generator Tab */}
      {activeTab === 'ai_generator' && (
        <div className="space-y-6">
          {/* Generator Controls Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span>توليد أسئلة امتحان جديدة ومطابقة لمعايير المركز القطري (מאלו"ו)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">نوع السؤال:</label>
                <select
                  value={genCategory}
                  onChange={(e) => setGenCategory(e.target.value as SkillCategory)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                >
                  <option value="restatement">ניסוח מחדש (إعادة صياغة)</option>
                  <option value="vocabulary">השלמת משפטים (إكمال جمل / مفردات)</option>
                  <option value="grammar">דקדוק ותחביר (قواعد)</option>
                  <option value="reading">הבנת הנקרא (فهم مقروء)</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">مستوى الصعوبة:</label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                >
                  <option value="easy">קל (أساسي - 80-100)</option>
                  <option value="medium">בינוני (متوسط - 105-125)</option>
                  <option value="hard">קשה (متقدم - 130-150)</option>
                </select>
              </div>

              {/* Subject topic */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">الموضوع اللغوي:</label>
                <input
                  type="text"
                  value={genSubject}
                  onChange={(e) => setGenSubject(e.target.value)}
                  placeholder="مثال: מילות ניגוד, פעלים, אותיות יחס..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                />
              </div>

              {/* Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">عدد الأسئلة:</label>
                <select
                  value={genCount}
                  onChange={(e) => setGenCount(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden"
                >
                  <option value={1}>1 سؤال</option>
                  <option value={2}>2 أسئلة</option>
                  <option value={3}>3 أسئلة</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-400">
                الذكاء الاصطناعي لا ينشر الأسئلة تلقائياً، بل يضعها في مسودة لمراجعتك وتعديلك.
              </span>
              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                id="btn-trigger-ai-gen"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري توليد الأسئلة بواسطة YAEL AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>توليد مسودات الأسئلة الآن</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Drafts Review Section */}
          {generatedDrafts.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-800">
                مسودات الأسئلة المولدة بانتظار اعتماد المعلم ({generatedDrafts.length}):
              </h3>

              <div className="space-y-4">
                {generatedDrafts.map((draft, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-3xl border-2 border-purple-200 shadow-sm space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                        مسودة سؤال {idx + 1} ({draft.subject})
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDiscardDraft(idx)}
                          className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium"
                        >
                          تجاهل / رفض
                        </button>
                        <button
                          onClick={() => handleApproveDraft(draft, idx)}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>اعتماد ونشر في بنك الأسئلة</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-base font-bold text-slate-900 font-['Assistant'] leading-relaxed">
                      {draft.questionHebrew}
                    </p>
                    <p className="text-xs text-slate-500">الترجمة: {draft.questionArabic}</p>

                    <div className="space-y-1.5 text-xs">
                      {draft.options.map((opt: string, optIdx: number) => (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border flex items-center justify-between ${
                            optIdx === draft.correctIndex
                              ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                              {optIdx + 1}
                            </span>
                            <span className="font-['Assistant']">{opt}</span>
                          </div>
                          {optIdx === draft.correctIndex && (
                            <span className="text-[10px] text-emerald-700 font-bold">
                              الإجابة النموذجية
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 text-xs text-slate-600">
                      <span className="font-bold text-purple-900 block mb-0.5">الشرح التعليمي:</span>
                      {draft.explanationArabic}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. Question Bank Tab */}
      {activeTab === 'bank' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              بنك الأسئلة الرسمي المعتمد ({questions.length} أسئلة)
            </h2>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {questions.map((q) => (
              <div key={q.id} className="py-4 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                      {q.subject}
                    </span>
                    <span className="text-slate-400">
                      {q.difficulty === 'hard' ? 'صعب' : q.difficulty === 'medium' ? 'متوسط' : 'سهل'}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="text-rose-500 hover:text-rose-700 p-1"
                    title="حذف من البنك"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-900 font-['Assistant']">
                  {q.questionHebrew}
                </p>
                <div className="text-[11px] text-slate-500">
                  الإجابة الصحيحة ({q.correctIndex + 1}): {q.options[q.correctIndex]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Inspector Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="font-black text-base text-slate-900">{selectedStudent.name}</h3>
                  <span className="text-xs text-slate-400">{selectedStudent.email}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">العلامة الحالية</span>
                <span className="text-xl font-black text-indigo-600 font-['Assistant']">
                  {selectedStudent.currentScore} / 150
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">العلامة المستهدفة</span>
                <span className="text-xl font-black text-slate-800 font-['Assistant']">
                  {selectedStudent.targetScore} / 150
                </span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1 text-xs text-amber-950">
              <span className="font-bold block">تحليل الأخطاء الملحوظ:</span>
              <p className="leading-relaxed">
                يعاني الطالب من ارتباك في أسئلة إعادة الصياغة عند ورود استثناءات ونفي متكرر. يوصى بإسناد تدريب علاجي مكثف له عبر المنصة.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  alert(`تم إرسال مهمة تدريبية علاجية للطالب ${selectedStudent.name} بنجاح!`);
                  setSelectedStudent(null);
                }}
                className="w-full py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-700 transition-colors"
              >
                إرسال مهمة تدريبية علاجية للطالب
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
