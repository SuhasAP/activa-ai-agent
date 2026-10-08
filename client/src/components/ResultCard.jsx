import React from 'react';
import { Award, CheckCircle2, AlertCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatReminderDateTime } from '../utils/formatters';

export default function ResultCard({ resultVerification, summary, status }) {
  if (!resultVerification && !summary) return null;

  const { whatIDid = [], whatNeedsAttention = [] } = resultVerification || {};

  const isFailed = status === 'FAILED';
  const isCancelled = status === 'CANCELLED';

  return (
    <div className={`glass-card rounded-2xl p-6 sm:p-8 mb-8 border relative overflow-hidden bg-slate-900/90 ${
      isFailed
        ? 'border-red-500/40'
        : isCancelled
        ? 'border-slate-700'
        : 'border-emerald-500/30 glow-cyan'
    }`}>
      
      {/* Banner */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
          isFailed
            ? 'bg-red-500/20 border-red-500/40 text-red-400'
            : isCancelled
            ? 'bg-slate-800 border-slate-700 text-slate-400'
            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
        }`}>
          {isFailed ? <AlertTriangle className="w-6 h-6" /> : isCancelled ? <XCircle className="w-6 h-6" /> : <Award className="w-6 h-6" />}
        </div>
        <div>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${
            isFailed
              ? 'text-red-400 bg-red-950 border-red-800'
              : isCancelled
              ? 'text-slate-400 bg-slate-800 border-slate-700'
              : 'text-emerald-400 bg-emerald-950 border-emerald-800'
          }`}>
            {isFailed ? 'Execution Failure' : isCancelled ? 'Action Cancelled' : 'Verified Execution'}
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
            {isFailed ? 'EXECUTION FAILED' : isCancelled ? 'MISSION CANCELLED' : 'MISSION COMPLETE'}
          </h3>
        </div>
      </div>

      {summary && (
        <p className={`text-sm p-4 rounded-xl border mb-6 font-medium leading-relaxed ${
          isFailed
            ? 'text-red-300 bg-red-950/40 border-red-900/60'
            : 'text-slate-200 bg-slate-950 border-slate-800'
        }`}>
          {summary}
        </p>
      )}

      {/* Existing Reminder Preserved Card */}
      {resultVerification?.existingReminderPreserved && (
        <div className="mb-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-200">
          <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 tracking-wider inline-block mb-1.5">
            EXISTING REMINDER PRESERVED
          </span>
          <p className="text-sm font-bold text-white mb-1">
            "{resultVerification.existingReminderPreserved.title}"
          </p>
          <p className="text-xs font-mono text-amber-300">
            {formatReminderDateTime(resultVerification.existingReminderPreserved.dateTime, resultVerification.existingReminderPreserved.dateTimeLabel)} ({resultVerification.existingReminderPreserved.status})
          </p>
        </div>
      )}

      {/* Two Column Summary */}
      {(whatIDid.length > 0 || whatNeedsAttention.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* WHAT I DID */}
          <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>WHAT I DID</span>
            </div>
            <ul className="space-y-2.5">
              {whatIDid.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* WHAT STILL NEEDS YOUR ATTENTION */}
          <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>WHAT STILL NEEDS YOUR ATTENTION</span>
            </div>
            <ul className="space-y-2.5">
              {whatNeedsAttention.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                  <span className="text-amber-400 font-bold">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
