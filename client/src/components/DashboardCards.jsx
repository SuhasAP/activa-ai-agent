import React from 'react';
import { Calendar, Wallet, CheckSquare, ShieldCheck, AlertCircle, TrendingUp, Bell, CheckCircle2 } from 'lucide-react';

export default function DashboardCards({ tasks = [], budget = {}, expenses = [], reminders = [] }) {
  const committedBill = expenses.find(e => e.type === 'committed') || { title: 'Electricity Bill', amount: 650, dueDateLabel: 'Tomorrow' };
  
  const available = budget.totalAvailable || 2000;
  const committed = budget.committedExpenses || 650;
  const planned = budget.plannedExpenses || 1000;
  const buffer = budget.emergencyBuffer || 350;

  // Reminders metrics
  const activeReminders = reminders.filter(r => r.status === 'ACTIVE');
  const dueSoonReminders = reminders.filter(r => r.status === 'DUE');
  const overdueReminders = reminders.filter(r => r.status === 'OVERDUE');
  const completedReminders = reminders.filter(r => r.status === 'COMPLETED');

  return (
    <div className="space-y-6 mb-8">
      
      {/* 3 Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TODAY'S PRIORITIES */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              <span>TODAY'S PRIORITIES</span>
            </div>

            <div className="space-y-3">
              {tasks.slice(0, 3).map((task) => {
                const isHigh = task.priority === 'HIGH';
                return (
                  <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div>
                      <h5 className="text-xs font-bold text-white">{task.title}</h5>
                      <p className="text-[11px] text-slate-400">Due {task.dueDateLabel || 'Soon'}</p>
                    </div>
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isHigh ? 'bg-red-950/80 text-red-400 border border-red-800' : 'bg-indigo-950/80 text-indigo-300 border border-indigo-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>Total Active Tasks: {tasks.length}</span>
            <span className="text-cyan-400 font-semibold">Priority Sorted</span>
          </div>
        </div>

        {/* UPCOMING EXPENSE */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>UPCOMING EXPENSE</span>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">{committedBill.title}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30 uppercase">
                  Committed
                </span>
              </div>
              <div className="text-2xl font-black text-white font-mono mb-1">
                ₹{committedBill.amount}
              </div>
              <p className="text-xs text-amber-400 font-medium">Due: {committedBill.dueDateLabel || 'Tomorrow'}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Payment scheduled before deadline</span>
          </div>
        </div>

        {/* BUDGET CARD */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>BUDGET OVERVIEW</span>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-900">
                <span className="text-slate-400">Available</span>
                <span className="font-bold font-mono text-white">₹{available}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-900">
                <span className="text-slate-400">Committed (Bills)</span>
                <span className="font-bold font-mono text-amber-400">₹{committed}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded bg-slate-900">
                <span className="text-slate-400">Planned (Food/Travel)</span>
                <span className="font-bold font-mono text-indigo-400">₹{planned}</span>
              </div>
              <div className="flex items-center justify-between text-xs p-2.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                <span className="text-emerald-300 font-semibold">Emergency Buffer</span>
                <span className="font-black font-mono text-emerald-400">₹{buffer}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-emerald-400 font-medium flex items-center justify-between">
            <span>Discretionary Spend Risk: Low</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* PART 4: DASHBOARD REMINDER SUMMARY CARD */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>REMINDERS STATUS SUMMARY</span>
          </div>

          {completedReminders.length > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>✓ {completedReminders.length} completed</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 font-mono text-center">
          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
            <div className="text-xl font-black text-indigo-300">{activeReminders.length}</div>
            <span className="text-[10px] text-indigo-400 uppercase font-bold">Active</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30">
            <div className="text-xl font-black text-amber-300">{dueSoonReminders.length}</div>
            <span className="text-[10px] text-amber-400 uppercase font-bold">Due Soon</span>
          </div>
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30">
            <div className="text-xl font-black text-red-400">{overdueReminders.length}</div>
            <span className="text-[10px] text-red-400 uppercase font-bold">Overdue</span>
          </div>
        </div>
      </div>

    </div>
  );
}
