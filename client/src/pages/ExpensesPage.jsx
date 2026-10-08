import React, { useState, useEffect } from 'react';
import { Wallet, ShieldCheck, AlertCircle, TrendingDown, DollarSign } from 'lucide-react';
import { api } from '../services/api';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [budget, setBudget] = useState({});

  useEffect(() => {
    api.getExpenses().then(data => {
      setExpenses(data.expenses || []);
      setBudget(data.budgetSummary || {});
    });
  }, []);

  const available = budget.totalAvailable || 2000;
  const committed = budget.committedExpenses || 650;
  const planned = budget.plannedExpenses || 1000;
  const buffer = budget.emergencyBuffer || 350;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-extrabold text-white font-sans">Expense & Budget Guardrails</h1>
        </div>
        <p className="text-sm text-slate-400">Deterministic budget analysis & emergency fund preservation.</p>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase">Available Budget</span>
          <div className="text-2xl font-black text-white font-mono mt-1">₹{available}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Monthly Total</span>
        </div>

        <div className="glass-card rounded-xl p-5 border border-amber-500/30">
          <span className="text-xs font-semibold text-amber-400 uppercase">Committed (Bills)</span>
          <div className="text-2xl font-black text-amber-300 font-mono mt-1">₹{committed}</div>
          <span className="text-[11px] text-amber-500/80 mt-1 block">Electricity Bill</span>
        </div>

        <div className="glass-card rounded-xl p-5 border border-slate-800">
          <span className="text-xs font-semibold text-indigo-400 uppercase">Planned Essentials</span>
          <div className="text-2xl font-black text-indigo-300 font-mono mt-1">₹{planned}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Groceries & Transport</span>
        </div>

        <div className="glass-card rounded-xl p-5 border border-emerald-500/40 bg-emerald-950/20 glow-cyan">
          <span className="text-xs font-bold text-emerald-400 uppercase">Protected Emergency Buffer</span>
          <div className="text-2xl font-black text-emerald-300 font-mono mt-1">₹{buffer}</div>
          <span className="text-[11px] text-emerald-400/80 mt-1 block">Ring-fenced (Untouched)</span>
        </div>

      </div>

      {/* Expense Item List */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
          Expense Breakdown
        </h2>

        <div className="space-y-3">
          {expenses.map(exp => (
            <div key={exp.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Category: {exp.category} • Due: {exp.dueDateLabel || exp.dueDate}
                </p>
              </div>
              <div className="text-right">
                <div className="text-base font-black text-white font-mono">₹{exp.amount}</div>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  exp.type === 'committed'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                    : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                }`}>
                  {exp.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
