import Link from "next/link";
import { ArrowRight, BarChart2, MessageCircle, Package, TrendingUp, Zap, Shield } from "lucide-react";

const STATS = [
  { label: "Prediction Accuracy", value: "~85%", color: "text-ocean" },
  { label: "ML Models Used",      value: "2",     color: "text-sand-dark" },
  { label: "Destinations",        value: "12+",   color: "text-ocean" },
  { label: "Data Points",         value: "2,000", color: "text-sand-dark" },
];

const FEATURES = [
  {
    icon: BarChart2, title: "ML Price Prediction",
    desc: "XGBoost + Linear Regression ensemble with feature engineering delivers ~85% accuracy on real-world travel data.",
    href: "/predict", cta: "Try Predictor",
  },
  {
    icon: MessageCircle, title: "AI Chat Advisor",
    desc: "OpenAI GPT-4o mini powered chatbot gives personalized travel cost breakdowns in natural language.",
    href: "/chat", cta: "Chat Now",
  },
  {
    icon: Package, title: "Curated Packages",
    desc: "Browse expert-curated travel packages with transparent pricing, filterable by destination and budget.",
    href: "/packages", cta: "Browse Packages",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-hero-gradient text-white pt-20 pb-28 px-4 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 text-white/90 text-sm px-4 py-1.5 rounded-full mb-6">
            <Zap size={13} className="text-sand" />
            ML-Powered Travel Budgeting
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Know Your Trip Cost
            <br />
            <span className="text-sand">Before You Book</span>
          </h1>
          <p className="text-white/75 text-lg max-w-2xl mx-auto mb-10">
            Predict travel package prices with machine learning. Built on XGBoost and Linear Regression
            with real-world feature engineering — no guesswork, just data.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/predict" className="inline-flex items-center gap-2 bg-white text-ocean font-semibold px-7 py-3.5 rounded-xl hover:bg-sand-light transition-all shadow-float">
              Predict My Trip Cost <ArrowRight size={16} />
            </Link>
            <Link href="/chat" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-all">
              Talk to AI Advisor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 mb-16">
        <div className="grid grid-cols-4 gap-4">
          {STATS.map(({ label, value, color }) => (
            <div key={label} className="card text-center shadow-float">
              <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
              <p className="text-slate-500 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-bold text-slate-800 mb-3">Everything You Need to Budget Your Trip</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Combining ML predictions, AI conversation, and curated packages in one platform.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc, href, cta }) => (
            <div key={title} className="card group hover:shadow-float transition-all duration-300 hover:-translate-y-1">
              <div className="w-10 h-10 bg-ocean/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-ocean group-hover:text-white transition-all">
                <Icon size={18} className="text-ocean group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-slate-800 text-lg mb-2">{title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">{desc}</p>
              <Link href={href} className="inline-flex items-center gap-1 text-ocean font-semibold text-sm hover:gap-2 transition-all">
                {cta} <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* Tech stack */}
        <div className="mt-12 card bg-slate-50 border-slate-200">
          <h3 className="font-display font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Shield size={16} className="text-ocean" /> Tech Stack
          </h3>
          <div className="flex flex-wrap gap-2">
            {["Python", "Flask", "XGBoost", "scikit-learn", "pandas", "NumPy",
              "Next.js", "React", "TypeScript", "Tailwind CSS", "Recharts", "OpenAI API"].map(t => (
              <span key={t} className="chip bg-ocean/10 text-ocean">{t}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
