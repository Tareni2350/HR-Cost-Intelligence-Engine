import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, HelpCircle, ArrowRight, User } from "lucide-react";

interface AiCopilotProps {
  onSendMessage: (msg: string) => Promise<string>;
}

interface Message {
  sender: "user" | "copilot";
  text: string;
}

const TEMPLATE_QUESTIONS = [
  "Which project consumed the highest budget this month?",
  "Why did NextGen Mobile Client rewrite costs increase?",
  "Which team spends the most time in meetings?",
  "Show cost trend overview for the last 30 days."
];

export default function AiCopilotView({ onSendMessage }: AiCopilotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "copilot",
      text: "Welcome, Executive. I am your HR Cost Intelligence Advisor. Ask me details regarding budget overruns, leakage vectors, and project metrics in your corporate database."
    }
  ]);
  const [prompt, setPrompt] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text }]);
    setPrompt("");
    setIsTyping(true);

    try {
      const response = await onSendMessage(text);
      setMessages((prev) => [...prev, { sender: "copilot", text: response }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "copilot", text: "Communication timeout. Please verify you have configured GEMINI_API_KEY in the Secrets panel." }
      ]);
    }
    setIsTyping(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-slate-100 h-[calc(100vh-220px)] flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          FinOps Senior AI Analyst <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
        </h2>
        <p className="text-sm text-slate-400">
          Inquire about resource allocations, team meeting densities, and compliance actions in natural language
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Chat Board Box */}
        <div className="lg:col-span-3 bg-slate-800/40 rounded-2xl border border-slate-700/40 flex flex-col justify-between overflow-hidden">
          {/* Scrollable messages listing */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.map((m, idx) => {
              const isUser = m.sender === "user";
              return (
                <div key={idx} className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
                  {/* Avatar wrapper */}
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isUser
                        ? "bg-indigo-600 text-white rounded-br-none font-sans"
                        : "bg-slate-900/80 text-slate-200 border border-slate-700/50 rounded-bl-none font-mono"
                    }`}
                  >
                    {m.text}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-900/80 text-slate-400 border border-slate-700/50 rounded-2xl rounded-bl-none px-4 py-3 text-xs flex items-center gap-2 font-mono">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-200" />
                  <span>Querying ledger database context...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Submission Input Bar */}
          <div className="p-4 border-t border-slate-700/50 bg-slate-950/20 flex gap-3">
            <input
              type="text"
              placeholder="Query corporate spending patterns (e.g., why is project cost increasing?)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend(prompt)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-slate-500"
            />
            <button
              onClick={() => handleSend(prompt)}
              className="p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition-all cursor-pointer shadow shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Templates Panel Sidebar */}
        <div className="lg:col-span-1 space-y-4 flex flex-col">
          <div className="bg-slate-800/40 rounded-2xl p-5 border border-slate-700/40 space-y-4 flex-1">
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" /> Suggested Templates
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Click any of the structured prompt scenarios below to trace costs:
            </p>

            <div className="space-y-3">
              {TEMPLATE_QUESTIONS.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  className="w-full text-left p-3 bg-slate-950/40 hover:bg-slate-900 border border-slate-700/60 transition-all rounded-xl hover:border-slate-500 cursor-pointer flex justify-between items-center gap-2 text-[11px] text-slate-300 leading-normal group"
                >
                  <span className="truncate">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0 transition-all" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
