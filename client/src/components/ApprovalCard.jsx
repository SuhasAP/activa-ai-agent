import React from 'react';
import { ShieldAlert, CheckCircle2, XCircle, Loader2, Info, Check } from 'lucide-react';

export default function ApprovalCard({ cardData, executionStatus, onApprove, onReject, isProcessing }) {
  if (!cardData) return null;

  const { pendingId, actionType, title, description, reason, status: cardStatus } = cardData;

  const isAlreadyExecuted = executionStatus === 'COMPLETED' || cardStatus === 'EXECUTED';
  const isRejected = executionStatus === 'CANCELLED' || cardStatus === 'REJECTED';
  const isDisabled = isProcessing || isAlreadyExecuted || isRejected;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 mb-8 border-2 border-amber-500/40 glow-amber relative overflow-hidden bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950">
      
      {/* Top Banner Alert */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/30">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
          <ShieldAlert className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
              Human Oversight Required
            </span>
            {isAlreadyExecuted && (
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                Action Executed
              </span>
            )}
            {isRejected && (
              <span className="text-xs font-black uppercase tracking-wider text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-500/40">
                Decision: Rejected
              </span>
            )}
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
            {isAlreadyExecuted ? "✓ ACTION APPROVED & EXECUTED" : isRejected ? "✖ ACTION REJECTED & CANCELLED" : "⚠ ACTION REQUIRES YOUR APPROVAL"}
          </h3>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="bg-slate-900/90 rounded-xl p-5 border border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            The Agent Wants To Perform:
          </p>
          <div className="text-base font-bold text-cyan-300 mb-1 flex items-center gap-2">
            <span>{actionType || 'Consequential Tool Execution'}</span>
          </div>
          <p className="text-sm font-semibold text-white mb-3">"{title || description}"</p>
          {description && description !== title && (
            <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono">
              {description}
            </p>
          )}
        </div>

        {reason && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-300">
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-indigo-300">Reason: </span>
              <span>{reason}</span>
            </div>
          </div>
        )}
      </div>

      {/* Decision Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={() => onApprove(pendingId)}
          disabled={isDisabled}
          className={`w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-extrabold text-sm transition ${
            isAlreadyExecuted
              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50 cursor-not-allowed opacity-90'
              : 'text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50'
          }`}
        >
          {isProcessing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isAlreadyExecuted ? (
            <>
              <Check className="w-5 h-5 text-emerald-400" />
              <span>APPROVED & EXECUTED</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>APPROVE ACTION</span>
            </>
          )}
        </button>

        <button
          onClick={() => onReject(pendingId)}
          disabled={isDisabled}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition ${
            isRejected
              ? 'bg-red-950/80 text-red-400 border border-red-500/50 cursor-not-allowed opacity-90'
              : 'text-slate-300 hover:text-white bg-slate-800/80 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/40 disabled:opacity-50'
          }`}
        >
          <XCircle className="w-5 h-5 text-slate-400" />
          <span>{isRejected ? "REJECTED" : "REJECT & CANCEL"}</span>
        </button>
      </div>

    </div>
  );
}
