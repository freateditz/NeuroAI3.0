import { useState, useRef, useEffect } from "react";
import { PromptInput } from "../Components/ui/PromptInput";
import { Bot, Brain, Sparkles } from "lucide-react";
import { API_URL } from "../url/base";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0">
        <Brain className="w-4 h-4 text-indigo-300" />
      </div>
      <div className="rounded-2xl rounded-tl-sm px-4 py-3 border border-white/8 backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-1.5 h-5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Chatbot() {
  const { isAuthenticated } = useAuth();
  const { darkMode } = useTheme();
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "assistant",
      content: "Hi! I'm your NeuroAI speech companion. I'm here to help you practice pronunciation, build confidence, and answer questions about your learning journey. What would you like to work on today?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages, isLoading]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/test/statistics`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.data) setUserStats(d.data); })
      .catch(() => {});
  }, [isAuthenticated]);

  const handleSubmit = async (value) => {
    if (!value.trim()) return;
    const userMsg = { id: Date.now(), role: "user", content: value, timestamp: new Date() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }));

      const body = { messages: apiMessages };
      if (userStats) {
        body.userContext = {
          totalTests: userStats.totalTests,
          completedTests: userStats.completedTests,
          averageAccuracy: userStats.averageOverallAccuracy,
          bestLetter: userStats.bestLetter?.letter,
          worstLetter: userStats.worstLetter?.letter,
        };
      }

      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      const reply = data.success ? data.content : "I'm having trouble connecting right now. Please try again in a moment!";

      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: reply, timestamp: new Date() },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: "Connection issue. Please check your internet and try again.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex flex-col pt-16"
      style={{
        minHeight: '100vh',
        background: darkMode
          ? 'linear-gradient(135deg, #050714 0%, #070b1a 60%, #050714 100%)'
          : 'linear-gradient(135deg, #f4efe8 0%, #ede7dd 60%, #f4efe8 100%)',
        color: darkMode ? '#f8fafc' : '#1c1308',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

      {/* Header */}
      <div
        className="sticky top-0 z-30 border-b backdrop-blur-xl px-6 py-4"
        style={{
          borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.15)',
          background: darkMode ? 'rgba(5, 7, 20, 0.85)' : 'rgba(244,239,232,0.94)',
        }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center">
              <Brain className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h1 className="font-inter font-semibold text-white text-sm tracking-wide">NeuroAI Chat</h1>
              <p className="text-white/30 font-inter text-xs">Speech Learning Companion</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-teal-500/20" style={{ background: 'rgba(0,255,192,0.05)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-teal-400 font-inter text-xs font-medium">Connected</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto chat-scrollbar px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Suggested prompts (shown when only 1 message) */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {[
                "Help me practice the /r/ sound",
                "What is a phoneme?",
                "Create a pronunciation exercise",
                "Tips for fluency building",
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSubmit(prompt)}
                  className="px-3 py-1.5 rounded-full border border-white/8 text-white/40 font-inter text-xs hover:border-indigo-500/40 hover:text-indigo-300 hover:bg-indigo-500/5 transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 mb-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "user"
                  ? "bg-indigo-600/40 border border-indigo-500/40"
                  : "bg-indigo-600/30 border border-indigo-500/30"
              }`}>
                {msg.role === "user"
                  ? <Sparkles className="w-4 h-4 text-indigo-200" />
                  : <Brain className="w-4 h-4 text-indigo-300" />
                }
              </div>

              {/* Bubble */}
              <div className={`max-w-[80%] sm:max-w-[75%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div
                  className={`px-4 py-3 rounded-2xl font-inter text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-tr-sm text-white border border-indigo-500/30"
                      : "rounded-tl-sm text-white/85 border border-white/8 backdrop-blur-sm"
                  }`}
                  style={
                    msg.role === "user"
                      ? { background: 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(139,92,246,0.25))' }
                      : { background: 'rgba(255,255,255,0.05)' }
                  }
                >
                  {msg.content}
                </div>
                <span className="text-white/20 font-inter text-xs px-1">{formatTime(msg.timestamp)}</span>
              </div>
            </div>
          ))}

          {isLoading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div
        className="border-t px-4 pb-6 pt-4 backdrop-blur-xl"
        style={{
          borderColor: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(99,102,241,0.15)',
          background: darkMode ? 'rgba(5, 7, 20, 0.7)' : 'rgba(244,239,232,0.90)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-3 text-center text-white/15 font-inter text-xs">
            NeuroAI Speech Engine &nbsp;•&nbsp; Port 8501 &nbsp;
            <a href={CHATBOT_URL} target="_blank" rel="noopener noreferrer" className="text-white/25 hover:text-indigo-400 transition-colors underline underline-offset-2">
              Open full interface ↗
            </a>
          </div>
          <div className="flex justify-center">
            <PromptInput
              onSubmit={handleSubmit}
              placeholder="Ask about pronunciation, practice words, or your progress..."
              models={["NeuroAI Pro", "Speech Model", "Phoneme AI"]}
              efforts={["Conversational", "Detailed", "Deep Analysis"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
