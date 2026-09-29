export type UserRole = 'student' | 'teacher' | 'admin';

export type SkillCategory = 'vocabulary' | 'grammar' | 'reading' | 'restatement' | 'writing';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type QuestionType =
  | 'sentence_completion'
  | 'restatement'
  | 'reading_comprehension'
  | 'vocabulary'
  | 'grammar';

export interface User {
  id: string;
  name: string;
  nameHebrew?: string;
  email: string;
  role: UserRole;
  avatar: string;
  currentScore: number; // typically 50 - 150
  targetScore: number;
  examDate: string;
  streakDays: number;
  xp: number;
  level: number;
  dailyGoalMinutes: number;
  studiedMinutesToday: number;
  assignedTeacherId?: string;
  joinedDate?: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  skillCategory: SkillCategory;
  passageTitle?: string;
  passageText?: string;
  questionHebrew: string;
  questionArabic: string;
  options: string[];
  correctIndex: number;
  explanationHebrew: string;
  explanationArabic: string;
  difficulty: DifficultyLevel;
  subject: string;
  createdBy?: 'system' | 'teacher' | 'ai_approved';
  approvedByTeacher?: boolean;
  tags?: string[];
}

export interface Exam {
  id: string;
  title: string;
  titleHebrew: string;
  type: 'diagnostic' | 'quick_quiz' | 'topic_quiz' | 'full_mock';
  category?: SkillCategory;
  durationMinutes: number;
  questions: Question[];
  totalQuestions: number;
  description?: string;
}

export interface AnswerLog {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string;
  skillCategory: SkillCategory;
}

export interface ExamResult {
  id: string;
  studentId: string;
  examId: string;
  examTitle: string;
  examType: string;
  date: string;
  score: number; // 50 to 150
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  skillsBreakdown: Record<SkillCategory, number>; // percentage 0 - 100
  weakAreas: string[];
  answers: AnswerLog[];
}

export interface VocabularyItem {
  id: string;
  wordHebrew: string;
  root?: string;
  rootHebrew?: string;
  meaningArabic: string;
  meaningEnglish: string;
  partOfSpeech: string;
  exampleSentenceHebrew?: string;
  exampleSentenceArabic?: string;
  exampleHebrew?: string;
  exampleArabic?: string;
  synonyms?: string[];
  category?: string;
  difficulty: DifficultyLevel;
  timesReviewed: number;
  correctCount: number;
  incorrectCount: number;
  masteryStatus: 'need_review' | 'learning' | 'mastered';
  lastReviewed?: string;
}

export interface StudyTask {
  id: string;
  title: string;
  titleHebrew?: string;
  category: SkillCategory;
  estimatedMinutes: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  description: string;
  targetCount?: number;
  completedCount?: number;
}

export interface StudyPlan {
  studentId: string;
  examDate: string;
  availableHoursPerDay: number;
  studyDaysPerWeek: string[];
  targetScore: number;
  dailyTasks: StudyTask[];
  adaptiveNotes: string[];
  weeklyFocus: string;
}

export interface WritingCorrection {
  original: string;
  corrected?: string;
  suggestion?: string;
  explanation: string;
}

export interface WritingSubmission {
  id: string;
  studentId: string;
  topic?: string;
  promptTopic?: string;
  targetWords?: number;
  actualWords?: number;
  wordCount?: number;
  content?: string;
  essayText?: string;
  submittedAt: string;
  score: number; // 50 - 150
  criteria?: {
    grammar: { score: number; feedback: string };
    vocabulary: { score: number; feedback: string };
    structure: { score: number; feedback: string };
    coherence: { score: number; feedback: string };
  };
  criteriaScores?: {
    grammar: number;
    vocabulary: number;
    structure: number;
    coherence: number;
  };
  feedbackArabic?: string;
  feedbackHebrew?: string;
  summaryFeedbackArabic?: string;
  summaryFeedbackHebrew?: string;
  sentenceCorrections?: WritingCorrection[];
  keyCorrections?: WritingCorrection[];
  recommendedAction?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'task' | 'exam' | 'vocab' | 'teacher' | 'system';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  xpReward: number;
  unlockedAt?: string;
}

export interface ErrorPattern {
  skillCategory: SkillCategory;
  subject: string;
  errorCount: number;
  totalAttempts: number;
  errorRate: number;
  descriptionArabic: string;
  descriptionHebrew: string;
  suggestedDrillId: string;
}
