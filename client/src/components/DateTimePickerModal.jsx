import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, X, AlertCircle, Check, Bell, Shield } from 'lucide-react';

export default function DateTimePickerModal({ isOpen, onClose, onCreateReminder }) {
  const today = new Date();
  
  // State (top-level hooks)
  const [title, setTitle] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  
  const [hour, setHour] = useState('07');
  const [minute, setMinute] = useState('00');
  const [ampm, setAmPm] = useState('PM');
  
  const [errorMessage, setErrorMessage] = useState('');
  const [duplicateWarning, setDuplicateWarning] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Month Navigation
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Quick Chips
  const setQuickDate = (type) => {
    const d = new Date();
    if (type === 'today') {
      setSelectedDate(d);
    } else if (type === 'tomorrow') {
      d.setDate(d.getDate() + 1);
      setSelectedDate(d);
    } else if (type === 'weekend') {
      const day = d.getDay();
      const diff = d.getDate() + (6 - day + (day === 6 ? 7 : 0));
      d.setDate(diff);
      setSelectedDate(d);
    }
    setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const setQuickTime = (type) => {
    const d = new Date();
    if (type === 'in1h') {
      d.setHours(d.getHours() + 1);
      setSelectedDate(d);
      let h = d.getHours();
      setAmPm(h >= 12 ? 'PM' : 'AM');
      h = h % 12 || 12;
      setHour(String(h).padStart(2, '0'));
      setMinute(String(d.getMinutes()).padStart(2, '0'));
    } else if (type === 'in3h') {
      d.setHours(d.getHours() + 3);
      setSelectedDate(d);
      let h = d.getHours();
      setAmPm(h >= 12 ? 'PM' : 'AM');
      h = h % 12 || 12;
      setHour(String(h).padStart(2, '0'));
      setMinute(String(d.getMinutes()).padStart(2, '0'));
    } else if (type === 'tom9am') {
      d.setDate(d.getDate() + 1);
      setSelectedDate(d);
      setHour('09');
      setMinute('00');
      setAmPm('AM');
    } else if (type === 'tom7pm') {
      d.setDate(d.getDate() + 1);
      setSelectedDate(d);
      setHour('07');
      setMinute('00');
      setAmPm('PM');
    }
  };

  // Build Calendar Days
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Mon=0
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(new Date(year, month, d));
  }

  // Format Date ISO & Label
  const formatISO = () => {
    const yyyy = selectedDate.getFullYear();
    const mm = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const dd = String(selectedDate.getDate()).padStart(2, '0');

    let h24 = parseInt(hour, 10) || 12;
    if (ampm === 'PM' && h24 < 12) h24 += 12;
    if (ampm === 'AM' && h24 === 12) h24 = 0;
    const hhStr = String(h24).padStart(2, '0');
    const minStr = String(minute).padStart(2, '0');

    return `${yyyy}-${mm}-${dd}T${hhStr}:${minStr}:00`;
  };

  const formattedDateLabel = () => {
    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const dStr = selectedDate.toLocaleDateString(undefined, dateOptions);
    return `${dStr} at ${hour}:${minute} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setDuplicateWarning(null);

    if (!title.trim()) {
      setErrorMessage('Reminder title is required.');
      return;
    }

    const isoStr = formatISO();
    const selectedTimeMs = new Date(isoStr).getTime();
    if (isNaN(selectedTimeMs) || selectedTimeMs < Date.now() - 60000) {
      setErrorMessage('Please choose a future date and time.');
      return;
    }

    const result = await onCreateReminder({
      title: title.trim(),
      dateTime: isoStr,
      dateTimeLabel: formattedDateLabel(),
      source: "MANUAL"
    });

    if (result?.duplicate) {
      setDuplicateWarning(result.message || "An identical reminder already exists.");
    } else if (result?.error) {
      setErrorMessage(result.message || "Failed to create reminder.");
    } else {
      onClose();
    }
  };

  const monthYearLabel = currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-reminder-modal-title"
        className="glass-card rounded-2xl p-6 border border-slate-700 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 id="create-reminder-modal-title" className="text-lg font-bold text-white">
                Create New Reminder
              </h3>
              <p className="text-xs text-slate-400">Set interactive date, time, and guardrails</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Title Input */}
          <div>
            <label htmlFor="reminder-title-input" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Reminder Title
            </label>
            <input
              id="reminder-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete DBMS Assignment"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>

          {/* Quick Date Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Date Selection</span>
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setQuickDate('today')}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate('tomorrow')}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 rounded-lg transition"
                >
                  Tomorrow
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDate('weekend')}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                >
                  Weekend
                </button>
              </div>
            </div>

            {/* Custom Calendar Month Grid */}
            <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-white font-mono">
                <span>{monthYearLabel}</span>
                <div className="flex gap-1">
                  <button type="button" onClick={prevMonth} aria-label="Previous month" className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={nextMonth} aria-label="Next month" className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-500 uppercase mb-2">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {daysArray.map((dayDate, idx) => {
                  if (!dayDate) return <div key={idx} />;
                  const isSelected = selectedDate.toDateString() === dayDate.toDateString();
                  const isToday = today.toDateString() === dayDate.toDateString();
                  const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());

                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={isPast}
                      onClick={() => setSelectedDate(dayDate)}
                      className={`p-2 rounded-lg font-mono text-xs transition ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30'
                          : isToday
                          ? 'border border-cyan-400 text-cyan-300 font-bold bg-slate-900'
                          : isPast
                          ? 'text-slate-700 cursor-not-allowed'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {dayDate.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Time Selection (12-Hour)</span>
              </span>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() => setQuickTime('in1h')}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  +1h
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTime('tom9am')}
                  className="px-2 py-0.5 text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                >
                  9 AM
                </button>
                <button
                  type="button"
                  onClick={() => setQuickTime('tom7pm')}
                  className="px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 border border-amber-800 rounded font-bold"
                >
                  7 PM
                </button>
              </div>
            </div>

            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-center gap-3">
              {/* Hour Input */}
              <div className="flex flex-col items-center">
                <input
                  id="reminder-hour-input"
                  aria-label="Hour (1 to 12)"
                  type="number"
                  min="1"
                  max="12"
                  value={hour}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 1;
                    if (val > 12) val = 12;
                    if (val < 1) val = 1;
                    setHour(String(val).padStart(2, '0'));
                  }}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-base font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
                <label htmlFor="reminder-hour-input" className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                  Hour
                </label>
              </div>

              <span className="text-xl font-mono text-slate-400 font-bold">:</span>

              {/* Minute Input */}
              <div className="flex flex-col items-center">
                <input
                  id="reminder-minute-input"
                  aria-label="Minute (0 to 59)"
                  type="number"
                  min="0"
                  max="59"
                  value={minute}
                  onChange={(e) => {
                    let val = parseInt(e.target.value, 10);
                    if (isNaN(val)) val = 0;
                    if (val > 59) val = 59;
                    if (val < 0) val = 0;
                    setMinute(String(val).padStart(2, '0'));
                  }}
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg p-2 text-center text-base font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
                <label htmlFor="reminder-minute-input" className="text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                  Minute
                </label>
              </div>

              {/* AM/PM Toggle */}
              <div className="flex flex-col items-center ml-2">
                <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setAmPm('AM')}
                    className={`px-2.5 py-1 text-xs font-bold rounded ${
                      ampm === 'AM' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => setAmPm('PM')}
                    className={`px-2.5 py-1 text-xs font-bold rounded ${
                      ampm === 'PM' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    PM
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 uppercase font-semibold">Period</span>
              </div>
            </div>
          </div>

          {/* Validation & Duplicate Errors */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {duplicateWarning && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          {/* REMINDER PREVIEW CARD */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] font-extrabold uppercase text-slate-500 tracking-wider block mb-1">
              REMINDER PREVIEW
            </span>
            <p className="text-sm font-bold text-white mb-1">"{title || 'DBMS Assignment'}"</p>
            <p className="text-xs font-mono text-cyan-400">{formattedDateLabel()}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-md shadow-amber-900/30 transition hover:scale-[1.01]"
            >
              Create Reminder
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
