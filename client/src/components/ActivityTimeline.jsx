import React from 'react';
import { Activity, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

export default function ActivityTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800 mb-6">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800">
        <Activity className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Agent Activity Timeline
        </h3>
        <span className="ml-auto text-[10px] text-slate-500 font-mono">High-Level Execution Status</span>
      </div>

      <div className="space-y-2.5">
        {timeline.map((item, idx) => {
          const isWarning = item.status === 'warning';
          const isPending = item.status === 'pending';

          return (
            <div
              key={item.id || idx}
              className={`flex items-start gap-3 p-2.5 rounded-lg text-xs transition ${
                isWarning
                  ? 'bg-amber-950/40 border border-amber-500/30 text-amber-300'
                  : isPending
                  ? 'bg-indigo-950/30 border border-indigo-500/20 text-indigo-300 animate-pulse'
                  : 'bg-slate-900/40 border border-slate-800/60 text-slate-300'
              }`}
            >
              <div className="mt-0.5">
                {isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : isPending ? (
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </div>
              <span className="font-mono text-slate-200">{item.message}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
