import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VocabularyItem } from '../types';
import {
  Layers,
  RotateCw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  Filter,
  Plus,
  Volume2,
  BookOpen,
  Award,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const VocabularyTrainer: React.FC = () => {
  const { vocabulary, updateVocabReview } = useApp();

  const [activeTab, setActiveTab] = useState<'flashcards' | 'wordlist'>('flashcards');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Flashcard state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Filtered words
  const filteredWords = vocabulary.filter((item) => {
    if (filterStatus !== 'all' && item.masteryStatus !== filterStatus) return false;
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.wordHebrew.toLowerCase().includes(q) ||
        item.meaningArabic.includes(q) ||
        item.meaningEnglish.toLowerCase().includes(q) ||
        (item.root && item.root.includes(q))
      );
    }
    return true;
  });

  const currentItem: VocabularyItem | undefined = filteredWords[currentCardIndex];

  const handleCardFeedback = (isCorrect: boolean) => {
    if (!currentItem) return;
    updateVocabReview(currentItem.id, isCorrect);
    setIsFlipped(false);
    if (currentCardIndex < filteredWords.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  // Pronounce word using Web Speech API (Hebrew)
  const speakHebrew = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      window.speechSynthesis.speak(utterance);
    }
  };

  const masteredCount = vocabulary.filter((v) => v.masteryStatus === 'mastered').length;
  const learningCount = vocabulary.filter((v) => v.masteryStatus === 'learning').length;
  const reviewCount = vocabulary.filter((v) => v.masteryStatus === 'need_review').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-right space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
            بنك المفردات والبطاقات الذكية
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            אוצר מילים אקדמי ליע"ל
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            تثبيت الكلمات الأكثر تكراراً في الامتحان عبر التكرار المتباعد الذكي
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'flashcards'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            بطاقات الاستذكار Flashcards
          </button>
          <button
            onClick={() => setActiveTab('wordlist')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'wordlist'
                ? 'bg-white text-indigo-700 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            قائمة الكلمات الكاملة ({vocabulary.length})
          </button>
        </div>
      </div>

      {/* Stats Counter Strip */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block">متقنة بالكامل (מילים שהוטמעו)</span>
          <span className="text-2xl font-black text-emerald-600 font-['Assistant']">
            {masteredCount}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block">قيد التعلم (בתהליך למידה)</span>
          <span className="text-2xl font-black text-indigo-600 font-['Assistant']">
            {learningCount}
          </span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
          <span className="text-xs text-slate-500 block">تحتاج مراجعة (דורש חזרה)</span>
          <span className="text-2xl font-black text-amber-600 font-['Assistant']">
            {reviewCount}
          </span>
        </div>
      </div>

      {/* Flashcards View */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">عرض:</span>
              {[
                { id: 'all', label: 'الكل' },
                { id: 'need_review', label: 'تحتاج مراجعة' },
                { id: 'learning', label: 'قيد التعلم' },
                { id: 'mastered', label: 'متقنة' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setFilterStatus(f.id);
                    setCurrentCardIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1 rounded-xl transition-colors font-medium ${
                    filterStatus === f.id
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-slate-400">
              بطاقة {filteredWords.length > 0 ? currentCardIndex + 1 : 0} من {filteredWords.length}
            </span>
          </div>

          {filteredWords.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
              <p className="text-slate-500 text-sm">لا توجد بطاقات في هذا التصنيف حالياً.</p>
              <button
                onClick={() => setFilterStatus('all')}
                className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
              >
                عرض كل الكلمات
              </button>
            </div>
          ) : currentItem && (
            <div className="space-y-6">
              {/* The Interactive Flippable Card */}
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className="min-h-[300px] sm:min-h-[340px] bg-white rounded-3xl border-2 border-indigo-100 hover:border-indigo-300 shadow-md p-8 cursor-pointer flex flex-col justify-between relative transition-all select-none group"
                id="vocab-flashcard"
              >
                {/* Top Card Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-3 py-1 rounded-xl bg-slate-100 font-semibold text-slate-700 font-['Assistant']">
                      {currentItem.partOfSpeech}
                    </span>
                    {((currentItem as any).root || currentItem.rootHebrew) && (
                      <span className="text-xs px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-bold font-['Assistant']">
                        שורש: {(currentItem as any).root || currentItem.rootHebrew}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        speakHebrew(currentItem.wordHebrew);
                      }}
                      className="p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="استماع للنطق العبري"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <span className="text-xs text-slate-400 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>{isFlipped ? 'عرض الكلمة' : 'اقلب البطاقة للترجمة والمثال'}</span>
                    </span>
                  </div>
                </div>

                {/* Center Content */}
                {!isFlipped ? (
                  /* FRONT: Word in Hebrew */
                  <div className="text-center py-6 space-y-2">
                    <div className="text-4xl sm:text-5xl font-black text-slate-900 font-['Assistant'] tracking-wide">
                      {currentItem.wordHebrew}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">
                      اضغط في أي مكان على البطاقة للكشف عن المعنى والسياق الأكاديمي
                    </div>
                  </div>
                ) : (
                  /* BACK: Meaning & Sentence */
                  <div className="py-4 space-y-4 text-right animate-in fade-in">
                    <div className="border-b border-slate-100 pb-3">
                      <div className="text-2xl font-black text-indigo-700">
                        {currentItem.meaningArabic}
                      </div>
                      <div className="text-xs text-slate-400 font-medium mt-0.5">
                        English: {currentItem.meaningEnglish}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                      <span className="text-[11px] font-bold text-indigo-900 block">
                        مثال استخدام من امتحان יע"ל (משפט לדוגמה):
                      </span>
                      <p className="text-base font-bold text-slate-900 font-['Assistant'] leading-relaxed">
                        "{currentItem.exampleSentenceHebrew || currentItem.exampleHebrew || ''}"
                      </p>
                      <p className="text-xs text-slate-600 leading-normal">
                        الترجمة: "{currentItem.exampleSentenceArabic || currentItem.exampleArabic || ''}"
                      </p>
                    </div>

                    {currentItem.synonyms && currentItem.synonyms.length > 0 && (
                      <div className="text-xs text-slate-500 font-['Assistant'] flex items-center gap-2">
                        <span className="font-bold text-slate-700">مترادفات (מילים נרדפות):</span>
                        <span>{currentItem.synonyms.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Status Info */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                  <span>تمت المراجعة: {currentItem.timesReviewed} مرات</span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-md text-[11px] ${
                      currentItem.masteryStatus === 'mastered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : currentItem.masteryStatus === 'need_review'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {currentItem.masteryStatus === 'mastered'
                      ? 'متقنة'
                      : currentItem.masteryStatus === 'need_review'
                      ? 'تحتاج مراجعة'
                      : 'قيد التعلم'}
                  </span>
                </div>
              </div>

              {/* Feedback Actions: "عرفتها" vs "لم أعرفها" */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleCardFeedback(false)}
                  className="py-3.5 px-4 bg-white hover:bg-amber-50 border-2 border-amber-200 text-amber-900 font-bold text-sm rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2"
                  id="btn-vocab-need-review"
                >
                  <XCircle className="w-5 h-5 text-amber-600" />
                  <span>لم أعرفها (أحتاج مراجعة)</span>
                </button>

                <button
                  onClick={() => handleCardFeedback(true)}
                  className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
                  id="btn-vocab-mastered"
                >
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>عرفت الكلمة (أتقنتها)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Wordlist View */}
      {activeTab === 'wordlist' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كلمة بالعبرية، المعنى بالعربية، أو الجذر (שורש)..."
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-hidden focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {filteredWords.map((word) => (
              <div key={word.id} className="py-3.5 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900 font-['Assistant']">
                      {word.wordHebrew}
                    </span>
                    {word.root && (
                      <span className="text-[10px] text-slate-400 font-['Assistant']">
                        ({word.root})
                      </span>
                    )}
                  </div>
                  <span className="text-slate-600 block">{word.meaningArabic}</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => speakHebrew(word.wordHebrew)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600"
                    title="نطق الكلمة"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${
                      word.masteryStatus === 'mastered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : word.masteryStatus === 'need_review'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    {word.masteryStatus === 'mastered'
                      ? 'متقنة'
                      : word.masteryStatus === 'need_review'
                      ? 'مراجعة'
                      : 'قيد التعلم'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
