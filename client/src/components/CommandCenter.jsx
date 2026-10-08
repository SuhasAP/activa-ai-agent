import React, { useState } from 'react';
import { Sparkles, ArrowRight, Loader2, Compass } from 'lucide-react';

export default function CommandCenter({ onExecuteGoal, isLoading }) {
  const [goalInput, setGoalInput] = useState('');

  const suggestedGoals = [
    {
      id: 1,
      tag: "PRIMARY DEMO",
      text: "I have an assignment due tomorrow, an exam next week, and only ₹2,000 left this month. Help me organize everything without overspending."
    },
    {
      id: 2,
      tag: "EVENING PLANNER",
      text: "Plan my evening so I can finish my assignment and prepare for tomorrow's class."
    },
    {
      id: 3,
      tag: "BUDGET GUARD",
      text: "Help me avoid overspending this month."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalInput.trim() || isLoading) return;
    onExecuteGoal(goalInput.trim());
  };

  const handleSelectSuggested = (text) => {
    setGoalInput(text);
    onExecuteGoal(text);
  };

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8 border border-indigo-500/20 relative overflow-hidden glow-indigo">
      {/* Background Accent Gradients */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Goal Command Center</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          What do you want to get done?
        </h2>
        <p className="text-slate-400 text-sm mb-6 max-w-2xl">
          Enter your goal below. ACTIVA will analyze intent, calculate constraints, select backend tools, and execute verified workflows with human oversight.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Tell ACTIVA what you want to accomplish... (e.g., Organize my deadlines and protect my budget)"
              rows={3}
              disabled={isLoading}
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-slate-100 placeholder-slate-500 text-base focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition resize-none shadow-inner"
            />

            <div className="flex justify-end mt-3">
              <button
                type="submit"
                disabled={!goalInput.trim() || isLoading}
                className="flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-indigo-600 via-cyan-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>REASONING & PLANNING...</span>
                  </>
                ) : (
                  <>
                    <span>PLAN & EXECUTE</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Suggested Goals */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Suggested Hackathon Scenarios</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {suggestedGoals.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelectSuggested(item.text)}
                disabled={isLoading}
                className="text-left p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/40 transition group flex flex-col justify-between"
              >
                <span className="text-[10px] font-bold tracking-wider text-cyan-400 bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded-md mb-2 w-fit">
                  {item.tag}
                </span>
                <p className="text-xs text-slate-300 font-medium group-hover:text-white transition line-clamp-2">
                  "{item.text}"
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
