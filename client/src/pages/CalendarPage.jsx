import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, BookOpen, UserCheck, Sparkles } from 'lucide-react';
import { api } from '../services/api';

export default function CalendarPage() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    api.getCalendar().then(data => setSchedule(data || []));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-2 mb-1">
          <CalendarIcon className="w-6 h-6 text-indigo-400" />
          <h1 className="text-2xl font-extrabold text-white font-sans">Academic & Study Calendar</h1>
        </div>
        <p className="text-sm text-slate-400">View upcoming classes, lectures, and autonomous study blocks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Schedule List */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Tomorrow's Schedule
          </h2>

          {schedule.map(event => (
            <div key={event.id} className="glass-card rounded-xl p-5 border border-slate-800 flex items-start justify-between">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400 mt-0.5">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{event.title}</h3>
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{event.timeLabel}</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {event.type || 'Event'}
              </span>
            </div>
          ))}
        </div>

        {/* Free Time Detection Card */}
        <div>
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 glow-cyan">
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-cyan-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Available Focus Blocks</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              ACTIVA inspects your calendar automatically to detect free focus blocks for priority assignments.
            </p>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex justify-between">
                <span>08:00 - 09:30 AM</span>
                <span className="text-emerald-400 font-bold">1.5 hrs Free</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex justify-between">
                <span>15:00 - 17:30 PM</span>
                <span className="text-emerald-400 font-bold">2.5 hrs Free</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 flex justify-between">
                <span>20:30 - 22:00 PM</span>
                <span className="text-emerald-400 font-bold">1.5 hrs Free</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
