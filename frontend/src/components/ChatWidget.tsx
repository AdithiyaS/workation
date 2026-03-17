import { useState, useRef, useEffect } from "react";
import { sendChat, ChatMessage } from "@/utils/api";
import { Send, Bot, User, Loader2, MessageCircle } from "lucide-react";
import clsx from "clsx";

const WELCOME = "Hi! I'm Workation AI 🌴 I can help you estimate travel costs, compare destinations, or plan your budget. What kind of trip are you dreaming of?";

export default function ChatWidget() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const allMessages: ChatMessage[] = [...messages, userMsg];
      const reply = await sendChat(allMessages);
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Sorry, I couldn't connect to the server. Please check that the backend is running.",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="card flex flex-col h-[600px] p-0 overflow-hidden">
      {/* Header */}
      <div className="bg-hero-gradient px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
          <MessageCircle size={18} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-white text-sm">Workation AI</p>
          <p className="text-white/60 text-xs">Travel cost advisor • Powered by GPT-4o mini</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
          <span className="text-white/70 text-xs">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={clsx("flex gap-2.5", msg.role === "user" ? "justify-end" : "justify-start")}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-ocean/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={14} className="text-ocean" />
              </div>
            )}
            <div className={clsx(
              "max-w-[80%] px-4 py-2.5 text-sm leading-relaxed",
              msg.role === "user" ? "chat-bubble-user" : "chat-bubble-bot"
            )}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-sand/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={14} className="text-sand-dark" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-ocean/10 flex items-center justify-center">
              <Bot size={14} className="text-ocean" />
            </div>
            <div className="chat-bubble-bot px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-slate-400" />
              <span className="text-slate-400 text-sm">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 px-4 py-3 flex gap-2">
        <textarea
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask about travel costs, destinations, seasons…"
          className="flex-1 resize-none input-field py-2.5 text-sm"
          style={{ minHeight: 44, maxHeight: 100 }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          className="btn-primary px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
