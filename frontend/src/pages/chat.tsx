import ChatWidget from "@/components/ChatWidget";
import { Lightbulb } from "lucide-react";

const PROMPTS = [
  "How much does a 7-day Bali trip for 2 cost?",
  "What's the cheapest time to visit Paris?",
  "Compare Dubai vs Maldives for honeymoon budget",
  "What's included in a typical travel package?",
];

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="font-display text-4xl font-bold text-slate-800 mb-3">AI Travel Advisor</h1>
        <p className="text-slate-500">Ask anything about travel costs — our OpenAI-powered assistant gives real estimates.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChatWidget />
        </div>
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2 mb-3">
              <Lightbulb size={14} className="text-sand-dark" /> Try asking…
            </h3>
            <div className="space-y-2">
              {PROMPTS.map(p => (
                <div key={p} className="bg-slate-50 hover:bg-ocean/5 rounded-lg px-3 py-2 text-xs text-slate-600 cursor-default transition-colors">
                  "{p}"
                </div>
              ))}
            </div>
          </div>
          <div className="card bg-ocean/5 border-ocean/20">
            <p className="text-xs text-ocean font-semibold mb-1">Pro Tip</p>
            <p className="text-xs text-slate-600">
              Mention your destination, travel dates, number of travelers, and hotel preference
              for the most accurate cost estimate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
