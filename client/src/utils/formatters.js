/**
 * ACTIVA Human-Readable Date & Time Formatter
 * Converts raw ISO datetimes (e.g. 2026-10-15T20:00:00) into user-friendly strings
 * Example outputs: "Tomorrow · 7:00 PM", "Thu, Oct 15 · 8:00 PM", "Today · 6:45 PM"
 */
export function formatReminderDateTime(dateTimeStr, labelFallback = '') {
  if (!dateTimeStr) return labelFallback || 'Scheduled';

  try {
    // Standardize ISO format
    const isoClean = String(dateTimeStr).trim().replace(' ', 'T');
    const dateObj = new Date(isoClean);
    
    // If not a valid ISO date, return labelFallback if available or original string
    if (isNaN(dateObj.getTime())) {
      if (labelFallback && !labelFallback.includes('T')) return labelFallback;
      return dateTimeStr;
    }

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const isToday = dateObj.toDateString() === today.toDateString();
    const isTomorrow = dateObj.toDateString() === tomorrow.toDateString();

    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const timeStr = dateObj.toLocaleTimeString([], timeOptions);

    if (isToday) {
      return `Today · ${timeStr}`;
    }
    if (isTomorrow) {
      return `Tomorrow · ${timeStr}`;
    }

    const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateStr = dateObj.toLocaleDateString([], dateOptions);

    return `${dateStr} · ${timeStr}`;
  } catch (e) {
    return labelFallback || dateTimeStr;
  }
}
