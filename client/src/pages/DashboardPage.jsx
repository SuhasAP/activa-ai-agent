import React, { useState, useEffect } from 'react';
import CommandCenter from '../components/CommandCenter';
import ActivityTimeline from '../components/ActivityTimeline';
import ExecutionPlan from '../components/ExecutionPlan';
import ApprovalCard from '../components/ApprovalCard';
import ResultCard from '../components/ResultCard';
import DashboardCards from '../components/DashboardCards';
import { api } from '../services/api';
import { Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingApproval, setIsProcessingApproval] = useState(false);
  const [agentState, setAgentState] = useState(null);
  const [isHydrating, setIsHydrating] = useState(true);
  const [hydrationError, setHydrationError] = useState(null);
  
  // Real dashboard metrics
  const [dashboardData, setDashboardData] = useState({
    tasks: [],
    budget: {},
    expenses: [],
    reminders: []
  });

  const loadData = async (isMount = false) => {
    if (isMount) {
      setIsHydrating(true);
      setHydrationError(null);
    }
    try {
      const [tasks, expenseData, remindersData, latestExecution] = await Promise.all([
        api.getTasks(),
        api.getExpenses(),
        api.getReminders(),
        api.getLatestExecution()
      ]);

      setDashboardData({
        tasks: Array.isArray(tasks) ? tasks : [],
        budget: expenseData.budgetSummary || {},
        expenses: expenseData.expenses || [],
        reminders: Array.isArray(remindersData) ? remindersData : []
      });

      if (latestExecution && latestExecution.id) {
        setAgentState(latestExecution);
      }
    } catch (err) {
      console.error("Failed to load dashboard data from backend", err);
      if (isMount) {
        setHydrationError("Failed to restore latest execution state from backend.");
      }
    } finally {
      if (isMount) {
        setIsHydrating(false);
      }
    }
  };

  useEffect(() => {
    loadData(true);
  }, []);

  const handleExecuteGoal = async (goal) => {
    setIsLoading(true);
    try {
      const response = await api.executeGoal(goal);
      setAgentState(response);
      loadData(false);
    } catch (err) {
      alert(`Agent execution error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (pendingId) => {
    setIsProcessingApproval(true);
    try {
      const response = await api.approveAction(pendingId);
      setAgentState(response);
      loadData(false);
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const handleReject = async (pendingId) => {
    setIsProcessingApproval(true);
    try {
      const response = await api.rejectAction(pendingId);
      setAgentState(response);
      loadData(false);
    } catch (err) {
      alert(`Rejection error: ${err.message}`);
    } finally {
      setIsProcessingApproval(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>MISSION COMPLETE</span>
          </span>
        );
      case 'AWAITING_APPROVAL':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-950/80 text-amber-400 border border-amber-500/40 uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            <span>REQUIRES APPROVAL</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>CANCELLED</span>
          </span>
        );
      case 'FAILED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-950/80 text-red-400 border border-red-500/40 uppercase tracking-wider">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>FAILED</span>
          </span>
        );
      default:
        return null;
    }
  };

  const formatTimestamp = (isoStr) => {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner Identity */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight font-sans">
            Autonomous Agent Command Center
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Goal-oriented AI orchestrator with persistent execution history & human oversight.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs text-slate-300 font-mono">
            <span className="text-slate-500">Source of Truth: </span>
            <span className="text-emerald-400 font-semibold">Express Backend JSON Store</span>
          </div>
        </div>
      </div>

      {/* Goal Input Component */}
      <CommandCenter onExecuteGoal={handleExecuteGoal} isLoading={isLoading} />

      {/* Hydration Loading Indicator */}
      {isHydrating && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 mb-8 flex items-center gap-3 text-xs text-slate-400 font-mono animate-pulse">
          <div className="w-4 h-4 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin"></div>
          <span>Restoring execution state from backend history...</span>
        </div>
      )}

      {/* Hydration Error Alert */}
      {hydrationError && !isHydrating && (
        <div className="bg-red-950/40 border border-red-500/30 rounded-xl p-4 mb-8 flex items-center justify-between text-xs text-red-300 font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{hydrationError}</span>
          </div>
          <button
            onClick={() => loadData(true)}
            className="px-3 py-1 bg-red-900/60 hover:bg-red-800 text-white font-bold rounded-lg border border-red-700 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* LATEST MISSION CONTAINER */}
      {!isHydrating && agentState && (
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 font-mono">
                LATEST MISSION
              </h3>
              {getStatusBadge(agentState.status)}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Timestamp: {formatTimestamp(agentState.updatedAt || agentState.createdAt)}</span>
            </div>
          </div>

          {/* Goal Prompt */}
          {agentState.userGoal && (
            <div className="bg-slate-900/90 rounded-xl p-4 mb-6 border border-indigo-500/20">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                User Goal Input
              </span>
              <p className="text-sm font-semibold text-white italic">
                "{agentState.userGoal}"
              </p>
            </div>
          )}

          {/* Agent Activity Timeline */}
          {agentState.timeline && agentState.timeline.length > 0 && (
            <ActivityTimeline timeline={agentState.timeline} />
          )}

          {/* Approval Card (if approvalCard exists) */}
          {agentState.approvalCard && (
            <ApprovalCard
              cardData={agentState.approvalCard}
              executionStatus={agentState.status}
              onApprove={handleApprove}
              onReject={handleReject}
              isProcessing={isProcessingApproval}
            />
          )}

          {/* Execution Result (if COMPLETED or CANCELLED or FAILED) */}
          {agentState.status !== 'AWAITING_APPROVAL' && (agentState.resultVerification || agentState.summary) && (
            <ResultCard
              resultVerification={agentState.resultVerification}
              summary={agentState.summary}
              status={agentState.status}
              actionExecuted={agentState.actionExecuted}
            />
          )}

          {/* Structured Execution Plan */}
          {agentState.planSteps && agentState.planSteps.length > 0 && (
            <ExecutionPlan
              intent={agentState.intent}
              reasoning={agentState.reasoning}
              planSteps={agentState.planSteps}
            />
          )}
        </div>
      )}

      {/* Dashboard Overview Cards */}
      <DashboardCards
        tasks={dashboardData.tasks}
        budget={dashboardData.budget}
        expenses={dashboardData.expenses}
        reminders={dashboardData.reminders}
      />

    </div>
  );
}

