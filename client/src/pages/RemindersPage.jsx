import React, { useState, useEffect } from 'react';
import { Bell, Plus, CheckCircle, Clock, AlertTriangle, XCircle, Check, Shield, Filter } from 'lucide-react';
import { api } from '../services/api';
import DateTimePickerModal from '../components/DateTimePickerModal';
import { formatReminderDateTime } from '../utils/formatters';

export default function RemindersPage() {
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState('ACTIVE'); // ALL, ACTIVE, DUE, COMPLETED, OVERDUE, CANCELLED
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Cancel Confirmation Modal State
  const [cancelTarget, setCancelTarget] = useState(null);

  const loadReminders = async () => {
    try {
      const data = await api.getReminders();
      setReminders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load reminders", err);
    }
  };

  useEffect(() => {
    loadReminders();
  }, []);

  const handleCreateReminderSubmit = async (params) => {
    try {
      const result = await api.createReminder(params);
      loadReminders();
      return result;
    } catch (err) {
      return { error: true, message: err.message };
    }
  };

  const handleMarkComplete = async (id) => {
    try {
      const res = await fetch(`/api/reminders/${id}/complete`, { method: 'PUT' });
      if (res.ok) {
        loadReminders();
      }
    } catch (err) {
      alert("Failed to mark reminder complete.");
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    try {
      const res = await fetch(`/api/reminders/${cancelTarget.id}/cancel`, { method: 'PUT' });
      if (res.ok) {
        setCancelTarget(null);
        loadReminders();
      }
    } catch (err) {
      alert("Failed to cancel reminder.");
    }
  };

  // Filter count counts
  const counts = {
    ALL: reminders.length,
    ACTIVE: reminders.filter(r => r.status === 'ACTIVE').length,
    DUE: reminders.filter(r => r.status === 'DUE').length,
    COMPLETED: reminders.filter(r => r.status === 'COMPLETED').length,
    OVERDUE: reminders.filter(r => r.status === 'OVERDUE').length,
    CANCELLED: reminders.filter(r => r.status === 'CANCELLED').length,
  };

  const filteredReminders = reminders.filter(r => {
    if (activeTab === 'ALL') return true;
    return r.status === activeTab;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-black bg-indigo-950 text-indigo-300 border border-indigo-800 uppercase tracking-wider">
            <Bell className="w-3 h-3 text-indigo-400" />
            <span>ACTIVE</span>
          </span>
        );
      case 'DUE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-800 uppercase tracking-wider animate-pulse">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>DUE NOW</span>
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase tracking-wider">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>COMPLETED</span>
          </span>
        );
      case 'OVERDUE':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-black bg-red-950 text-red-400 border border-red-800 uppercase tracking-wider">
            <AlertTriangle className="w-3 h-3 text-red-400" />
            <span>OVERDUE</span>
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-black bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">
            <XCircle className="w-3 h-3 text-slate-500" />
            <span>CANCELLED</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-6 h-6 text-amber-400" />
            <h1 className="text-2xl font-extrabold text-white font-sans">Reminders & Notifications</h1>
          </div>
          <p className="text-sm text-slate-400">Time-sensitive execution alerts created by ACTIVA or by you.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-extrabold transition shadow-lg shadow-amber-900/30 hover:scale-[1.01]"
        >
          <Plus className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        <Filter className="w-4 h-4 text-slate-500 shrink-0" />
        {['ACTIVE', 'ALL', 'DUE', 'COMPLETED', 'OVERDUE', 'CANCELLED'].map((tab) => {
          const count = counts[tab] || 0;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <span>{tab.charAt(0) + tab.slice(1).toLowerCase()}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isActive ? 'bg-amber-500/30 text-amber-200' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Reminders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReminders.map((rem) => {
          const isCompleted = rem.status === 'COMPLETED';
          const isCancelled = rem.status === 'CANCELLED';
          const isAgentCreated = rem.source === 'ACTIVA AGENT' || rem.sourceExecutionId;

          return (
            <div
              key={rem.id}
              className={`glass-card rounded-xl p-5 border transition flex flex-col justify-between ${
                isCompleted
                  ? 'opacity-70 border-slate-800'
                  : isCancelled
                  ? 'opacity-50 border-slate-800 bg-slate-950/40'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Card Top Header */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  {getStatusBadge(rem.status)}

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-mono ${
                    isAgentCreated
                      ? 'bg-indigo-950 text-indigo-300 border-indigo-800'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {isAgentCreated ? 'ACTIVA AGENT' : 'MANUAL'}
                  </span>
                </div>

                {/* Title */}
                <h3 className={`text-base font-bold mb-1.5 ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                  {rem.title}
                </h3>

                {/* Timing Label */}
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4 font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {isCompleted
                      ? `Completed today · ${rem.completedAt ? new Date(rem.completedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : '6:45 PM'}`
                      : isCancelled
                      ? `Cancelled`
                      : rem.status === 'OVERDUE'
                      ? `Was due · ${formatReminderDateTime(rem.dateTime, rem.dateTimeLabel)}`
                      : formatReminderDateTime(rem.dateTime, rem.dateTimeLabel)}
                  </span>
                </div>
              </div>

              {/* Action Buttons for Active/Due/Overdue */}
              {!isCompleted && !isCancelled && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => setCancelTarget(rem)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleMarkComplete(rem.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition shadow-sm"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark Complete</span>
                  </button>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {filteredReminders.length === 0 && (
        <div className="glass-card rounded-xl p-8 text-center border border-slate-800">
          <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-400">No reminders found in this category.</p>
        </div>
      )}

      {/* Interactive New Reminder Modal */}
      <DateTimePickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateReminder={handleCreateReminderSubmit}
      />

      {/* Cancel Confirmation Modal */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 border border-slate-700 max-w-sm w-full">
            <h4 className="text-base font-bold text-white mb-2">Cancel this reminder?</h4>
            <p className="text-xs text-slate-400 mb-6 font-mono">
              "{cancelTarget.title}" ({cancelTarget.dateTimeLabel})
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700"
              >
                Keep Reminder
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500"
              >
                Cancel Reminder
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
