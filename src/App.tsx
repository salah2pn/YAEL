import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { DiagnosticTest } from './components/DiagnosticTest';
import { PracticeSystem } from './components/PracticeSystem';
import { MockExamsView } from './components/MockExamsView';
import { VocabularyTrainer } from './components/VocabularyTrainer';
import { WritingLab } from './components/WritingLab';
import { PersonalStudyPlan } from './components/PersonalStudyPlan';
import { ErrorAnalysisView } from './components/ErrorAnalysisView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AiTutorModal } from './components/AiTutorModal';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-['Tajawal','sans-serif']">
      <Navbar />

      <main className="flex-1">
        {currentView === 'landing' && <LandingPage />}
        {currentView === 'student_dashboard' && <StudentDashboard />}
        {currentView === 'diagnostic' && <DiagnosticTest />}
        {currentView === 'practice' && <PracticeSystem />}
        {currentView === 'mock_exams' && <MockExamsView />}
        {currentView === 'vocab_trainer' && <VocabularyTrainer />}
        {currentView === 'writing_lab' && <WritingLab />}
        {currentView === 'study_plan' && <PersonalStudyPlan />}
        {currentView === 'error_analysis' && <ErrorAnalysisView />}
        {currentView === 'teacher_dashboard' && <TeacherDashboard />}
        {currentView === 'admin_dashboard' && <AdminDashboard />}
      </main>

      {/* Persistent Modals */}
      <AiTutorModal />
      <AuthModal />

      {/* Global Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            منظومة <strong className="text-slate-800 font-['Assistant']">YAEL AI</strong> للتحضير الأكاديمي لامتحان יע"ל / יעלנט © {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>مطابق لمعايير מאלו"ו</span>
            <span>•</span>
            <span>تقييم كتابة بالذكاء الاصطناعي</span>
            <span>•</span>
            <span>خطة دراسية متكيفة</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
