import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Question,
  Exam,
  VocabularyItem,
  StudyPlan,
  WritingSubmission,
  NotificationItem,
  Achievement,
  ExamResult,
  ErrorPattern,
  SkillCategory,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_QUESTIONS,
  INITIAL_EXAMS,
  INITIAL_VOCABULARY,
  INITIAL_STUDY_PLAN,
  INITIAL_WRITING_SUBMISSIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_STUDENT_RESULTS,
} from '../data/initialData';

export type AppView =
  | 'landing'
  | 'student_dashboard'
  | 'diagnostic'
  | 'practice'
  | 'mock_exams'
  | 'vocab_trainer'
  | 'writing_lab'
  | 'study_plan'
  | 'error_analysis'
  | 'teacher_dashboard'
  | 'admin_dashboard';

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  currentUser: User | null;
  users: User[];
  setCurrentUser: (user: User | null) => void;
  switchRole: (role: UserRole) => void;
  questions: Question[];
  addQuestion: (question: Omit<Question, 'id'>) => void;
  deleteQuestion: (id: string) => void;
  exams: Exam[];
  examResults: ExamResult[];
  activeExamToTake: Exam | null;
  setActiveExamToTake: (exam: Exam | null) => void;
  startExam: (exam: Exam) => void;
  submitExamResult: (result: Omit<ExamResult, 'id'>) => void;
  vocabulary: VocabularyItem[];
  updateVocabReview: (id: string, isCorrect: boolean) => void;
  studyPlan: StudyPlan;
  toggleTaskCompletion: (taskId: string) => void;
  updateStudyPlanConfig: (params: {
    examDate: string;
    availableHoursPerDay: number;
    targetScore: number;
    studyDaysPerWeek: string[];
  }) => void;
  writingSubmissions: WritingSubmission[];
  addWritingSubmission: (sub: Omit<WritingSubmission, 'id'>) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  achievements: Achievement[];
  errorPatterns: ErrorPattern[];
  isTutorOpen: boolean;
  setIsTutorOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state with localStorage fallback
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('yael_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('yael_current_user');
    return saved ? JSON.parse(saved) : INITIAL_USERS[0];
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    return currentUser ? (currentUser.role === 'teacher' ? 'teacher_dashboard' : currentUser.role === 'admin' ? 'admin_dashboard' : 'student_dashboard') : 'landing';
  });

  const [questions, setQuestions] = useState<Question[]>(() => {
    const saved = localStorage.getItem('yael_questions');
    return saved ? JSON.parse(saved) : INITIAL_QUESTIONS;
  });

  const [exams, setExams] = useState<Exam[]>(() => {
    const saved = localStorage.getItem('yael_exams');
    return saved ? JSON.parse(saved) : INITIAL_EXAMS;
  });

  const [examResults, setExamResults] = useState<ExamResult[]>(() => {
    const saved = localStorage.getItem('yael_exam_results');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_RESULTS;
  });

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(() => {
    const saved = localStorage.getItem('yael_vocab');
    return saved ? JSON.parse(saved) : INITIAL_VOCABULARY;
  });

  const [studyPlan, setStudyPlan] = useState<StudyPlan>(() => {
    const saved = localStorage.getItem('yael_study_plan');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_PLAN;
  });

  const [writingSubmissions, setWritingSubmissions] = useState<WritingSubmission[]>(() => {
    const saved = localStorage.getItem('yael_writing');
    return saved ? JSON.parse(saved) : INITIAL_WRITING_SUBMISSIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('yael_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('yael_achievements');
    return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
  });

  const [activeExamToTake, setActiveExamToTake] = useState<Exam | null>(null);
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('yael_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('yael_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('yael_questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('yael_exams', JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem('yael_exam_results', JSON.stringify(examResults));
  }, [examResults]);

  useEffect(() => {
    localStorage.setItem('yael_vocab', JSON.stringify(vocabulary));
  }, [vocabulary]);

  useEffect(() => {
    localStorage.setItem('yael_study_plan', JSON.stringify(studyPlan));
  }, [studyPlan]);

  useEffect(() => {
    localStorage.setItem('yael_writing', JSON.stringify(writingSubmissions));
  }, [writingSubmissions]);

  useEffect(() => {
    localStorage.setItem('yael_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('yael_achievements', JSON.stringify(achievements));
  }, [achievements]);

  // Role Switcher helper
  const switchRole = (role: UserRole) => {
    const matched = users.find((u) => u.role === role) || users[0];
    setCurrentUser(matched);
    if (role === 'teacher') {
      setCurrentView('teacher_dashboard');
    } else if (role === 'admin') {
      setCurrentView('admin_dashboard');
    } else {
      setCurrentView('student_dashboard');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const addQuestion = (newQ: Omit<Question, 'id'>) => {
    const q: Question = {
      ...newQ,
      id: `q_custom_${Date.now()}`,
    };
    setQuestions((prev) => [q, ...prev]);

    // Add notification for admin/teacher
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        userId: currentUser?.id || 'usr_teacher_1',
        title: 'تمت إضافة سؤال جديد بنجاح',
        message: `أضيف السؤال: "${q.questionHebrew.slice(0, 35)}..." إلى بنك الأسئلة.`,
        date: 'الآن',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const startExam = (exam: Exam) => {
    setActiveExamToTake(exam);
    // If the exam is diagnostic, route to diagnostic; otherwise generic exam engine
    if (exam.type === 'diagnostic') {
      setCurrentView('diagnostic');
    } else {
      setCurrentView('mock_exams');
    }
  };

  const submitExamResult = (resData: Omit<ExamResult, 'id'>) => {
    const newResult: ExamResult = {
      ...resData,
      id: `res_${Date.now()}`,
    };

    setExamResults((prev) => [newResult, ...prev]);

    // Update student level, score, XP
    if (currentUser && currentUser.role === 'student') {
      const xpGained = Math.round(newResult.score * 1.5) + (newResult.correctCount * 10);
      const updatedUser: User = {
        ...currentUser,
        currentScore: Math.round((currentUser.currentScore + newResult.score) / 2),
        xp: currentUser.xp + xpGained,
        level: Math.floor((currentUser.xp + xpGained) / 400) + 1,
        studiedMinutesToday: currentUser.studiedMinutesToday + Math.round(newResult.timeSpentSeconds / 60),
      };

      setCurrentUser(updatedUser);
      setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));

      // Check achievements
      setAchievements((prev) =>
        prev.map((ach) => {
          if (ach.id === 'ach_first_exam' && !ach.unlocked) {
            return { ...ach, unlocked: true, progress: 1, unlockedAt: new Date().toISOString() };
          }
          return ach;
        })
      );

      // Dynamically adapt study plan based on weak areas
      if (newResult.weakAreas && newResult.weakAreas.length > 0) {
        setStudyPlan((prev) => {
          const adaptiveNote = `تحديث ذكي بناءً على نتيجة ${newResult.examTitle}: وُجد تراجع في [${newResult.weakAreas.join('، ')}]. تم توجيه تمارين علاجية فورية.`;
          return {
            ...prev,
            weeklyFocus: `تقوية ${newResult.weakAreas[0]} بناءً على آخر اختبار`,
            adaptiveNotes: [adaptiveNote, ...prev.adaptiveNotes.slice(0, 3)],
          };
        });
      }

      // Add a notification
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          userId: currentUser.id,
          title: `اكتمل الاختبار: ${newResult.examTitle}`,
          message: `حصلت على نتيجة ${newResult.score}/150 (${newResult.correctCount}/${newResult.totalQuestions} صحيحة). تم تحديث تحليلاتك!`,
          date: 'الآن',
          read: false,
          type: 'exam',
        },
        ...prev,
      ]);
    }
  };

  const updateVocabReview = (id: string, isCorrect: boolean) => {
    setVocabulary((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const timesReviewed = item.timesReviewed + 1;
          const correctCount = isCorrect ? item.correctCount + 1 : item.correctCount;
          const incorrectCount = !isCorrect ? item.incorrectCount + 1 : item.incorrectCount;
          
          let masteryStatus = item.masteryStatus;
          if (correctCount >= 4 && incorrectCount === 0) {
            masteryStatus = 'mastered';
          } else if (incorrectCount > 1) {
            masteryStatus = 'need_review';
          } else {
            masteryStatus = 'learning';
          }

          return {
            ...item,
            timesReviewed,
            correctCount,
            incorrectCount,
            masteryStatus,
            lastReviewed: new Date().toISOString(),
          };
        }
        return item;
      })
    );

    // Update study task for vocabulary if not complete
    if (currentUser) {
      setStudyPlan((prev) => ({
        ...prev,
        dailyTasks: prev.dailyTasks.map((task) =>
          task.category === 'vocabulary'
            ? {
                ...task,
                completedCount: (task.completedCount || 0) + 1,
                completed: (task.completedCount || 0) + 1 >= (task.targetCount || 8),
              }
            : task
        ),
      }));
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setStudyPlan((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  const updateStudyPlanConfig = ({
    examDate,
    availableHoursPerDay,
    targetScore,
    studyDaysPerWeek,
  }: {
    examDate: string;
    availableHoursPerDay: number;
    targetScore: number;
    studyDaysPerWeek: string[];
  }) => {
    setStudyPlan((prev) => ({
      ...prev,
      examDate,
      availableHoursPerDay,
      targetScore,
      studyDaysPerWeek,
      adaptiveNotes: [
        `تم تحديث خطتك للدراسة بمعدل ${availableHoursPerDay} ساعة يومياً نحو الهدف ${targetScore}/150.`,
        ...prev.adaptiveNotes,
      ],
    }));

    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        examDate,
        targetScore,
      });
    }
  };

  const addWritingSubmission = (sub: Omit<WritingSubmission, 'id'>) => {
    const item: WritingSubmission = {
      ...sub,
      id: `sub_${Date.now()}`,
    };
    setWritingSubmissions((prev) => [item, ...prev]);

    // Notify teacher
    setNotifications((prev) => [
      {
        id: `notif_teacher_${Date.now()}`,
        userId: 'usr_teacher_1',
        title: 'تسليم مقال عبر YAEL AI',
        message: `سلّم الطالب ${currentUser?.name || 'أحمد'} موضوع إنشاء جديد، التقييم التقديري: ${item.score}/150.`,
        date: 'الآن',
        read: false,
        type: 'exam',
      },
      ...prev,
    ]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Derive Error Patterns from question performance and exam results
  const errorPatterns: ErrorPattern[] = [
    {
      skillCategory: 'restatement',
      subject: 'ניסוח מחדש (משפטי שלילה ומיעוט)',
      errorCount: 6,
      totalAttempts: 14,
      errorRate: 43,
      descriptionArabic: 'صعوبة متكررة في تحديد المعنى المقابل للجمل التي تحتوي على أدوات النفي والاستثناء مثل (אף לא אחד, אלא אם כן, אלמלא).',
      descriptionHebrew: 'קושי חוזר בזיהוי משמעות שקולה במשפטי שלילה ומיעוט עם מילות יחס מורכבות.',
      suggestedDrillId: 'drill_restatement',
    },
    {
      skillCategory: 'vocabulary',
      subject: 'אוצר מילים - פעלים בבניין הפעיל',
      errorCount: 4,
      totalAttempts: 18,
      errorRate: 22,
      descriptionArabic: 'خلط بين معاني الأفعال المجردة والمزيدة (مثل לאשש / לערער / להפריך).',
      descriptionHebrew: 'בלבול בין פעלים אקדמיים דומים בבניין הפעיל ומשמעויות סמנטיות מופשטות.',
      suggestedDrillId: 'drill_vocab',
    },
    {
      skillCategory: 'grammar',
      subject: 'אותיות יחס (ב-, ל-, מ-, על)',
      errorCount: 3,
      totalAttempts: 12,
      errorRate: 25,
      descriptionArabic: 'ترجمة حرفية لحروف الجر من اللغة العربية (مثل استخدام "על" بدلاً من "ב-" مع פועל התעניין).',
      descriptionHebrew: 'השפעת שפת אם בבחירת אותיות יחס תקינות לאחר פעלים (התעניין ב- ולא התעניין על).',
      suggestedDrillId: 'drill_grammar',
    },
  ];

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        currentUser,
        users,
        setCurrentUser,
        switchRole,
        questions,
        addQuestion,
        deleteQuestion,
        exams,
        examResults,
        activeExamToTake,
        setActiveExamToTake,
        startExam,
        submitExamResult,
        vocabulary,
        updateVocabReview,
        studyPlan,
        toggleTaskCompletion,
        updateStudyPlanConfig,
        writingSubmissions,
        addWritingSubmission,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        achievements,
        errorPatterns,
        isTutorOpen,
        setIsTutorOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
