import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Lightbulb,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

const QUICK_PROMPTS = [
  'איך לזהות משפטי שלילה ומיעוט בניסוח מחדש?',
  'מה ההבדל בין בניין הפעיל לפיעל?',
  'תן לי 5 מילות קישור מומלצות לכתיבת חיבור יע"ל',
  'كيف أوزع وقت امتحان יעלנט بذكاء؟',
];

export const AiTutorModal: React.FC = () => {
  const { isTutorOpen, setIsTutorOpen, currentUser } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'assistant',
      text: `שלום ${currentUser?.name || ''}! أنا مساعد YAEL AI الذكي، رفيقك المتخصص للتحضير لامتحان יע"ל / יעלנט. يمكنك سؤالي عن أي قاعدة نحوية، استراتيجيات إعادة الصياغة (ניסוח מחדש)، أو كيفية صياغة مقال أكاديمي متميز باللغة العبرية. كيف أساعدك اليوم؟`,
      time: 'الآن',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTutorOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTutorOpen]);

  if (!isTutorOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          conversationHistory: messages.slice(-4).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }],
          })),
        }),
      });

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'عذراً، حدث خطأ أثناء معالجة السؤال.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const fallbackMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        sender: 'assistant',
        text: 'في أسئلة ניסוח מחדש (إعادة الصياغة)، انتبه دائماً إلى أدوات الاستثناء والنفي (כגון: אף לא אחד, אלא אם כן, אלמלא). الإجابة الصحيحة دائماً تحافظ على المعنى المنطقي الدقيق حتى لو تم تغيير شكل الجملة من النفي إلى الإثبات أو العكس!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl h-[85vh] sm:h-[75vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden text-right">
        {/* Modal Header */}
        <div className="p-4 bg-linear-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm">مساعد YAEL AI الذكي</h3>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full font-bold border border-emerald-400/30">
                  متصل
                </span>
              </div>
              <p className="text-[11px] text-indigo-100">
                مرشدك الخبير للغة العبرية الأكاديمية وامتحان יע"ל
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsTutorOpen(false)}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
          <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            اقتراحات:
          </span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 rounded-full font-['Assistant'] shrink-0 text-slate-700 transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <p className="whitespace-pre-line font-['Assistant'] leading-relaxed">
                  {msg.text}
                </p>
                <span
                  className={`text-[10px] block mt-1 ${
                    msg.sender === 'user' ? 'text-indigo-200 text-left' : 'text-slate-400 text-left'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>المساعد يكتب رداً توضيحياً...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="اسأل عن أي قاعدة، كلمة، تصريف أفعال، أو نصيحة للامتحان..."
            className="flex-1 py-2.5 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
            id="ai-tutor-input-field"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`p-2.5 rounded-xl font-bold transition-all ${
              !inputText.trim() || isLoading
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
            }`}
            id="btn-send-tutor-message"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
