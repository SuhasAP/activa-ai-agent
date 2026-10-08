import React from 'react';
import { Target, Lightbulb, ListOrdered } from 'lucide-react';

export default function ExecutionPlan({ intent, reasoning, planSteps = [] }) {
  if (!planSteps || planSteps.length === 0) return null;

  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base font-bold text-white tracking-wide">
          YOUR EXECUTION PLAN
        </h3>
        <span className="ml-auto text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
          {planSteps.length} Steps
        </span>
      </div>

      {/* Intent & Reasoning */}
      {intent && (
        <div className="bg-slate-900/80 rounded-xl p-4 mb-6 border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
            <Lightbulb className="w-3.5 h-3.5 text-cyan-400" />
            <span>Understood Intent</span>
          </div>
          <p className="text-sm text-slate-200 font-medium mb-2">{intent}</p>
          {reasoning && (
            <p className="text-xs text-slate-400 border-t border-slate-800/80 pt-2 mt-2">
              <span className="text-slate-500 font-semibold">Reasoning:</span> {reasoning}
            </p>
          )}
        </div>
      )}

      {/* Numbered Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {planSteps.map((step, index) => {
          const stepNumStr = String(step.stepNumber || index + 1).padStart(2, '0');
          const isHighPriority = step.priority === 'HIGH';

          return (
            <div
              key={index}
              className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 hover:border-slate-700 transition relative flex gap-4"
            >
              <div className="text-2xl font-black text-slate-600 font-mono tracking-tighter shrink-0 select-none">
                {stepNumStr}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white">{step.title}</h4>
                  {step.priority && (
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isHighPriority
                          ? 'bg-red-950/60 border border-red-500/40 text-red-400'
                          : 'bg-indigo-950/60 border border-indigo-500/40 text-indigo-300'
                      }`}
                    >
                      {step.priority}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
