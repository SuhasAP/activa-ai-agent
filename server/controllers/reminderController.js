import { db } from '../data/seedData.js';

export const reminderController = {
  getReminders: (req, res) => {
    res.json(db.getReminders());
  },

  createReminder: (req, res) => {
    try {
      const { title, dateTime, date, time, source } = req.body;
      
      if (!title || !title.trim()) {
        return res.status(400).json({ error: true, message: "Reminder title is required." });
      }

      // Format combined dateTime if date and time provided separately
      let finalDateTime = dateTime;
      let dateTimeLabel = "";

      if (date && time) {
        finalDateTime = `${date}T${time}:00`;
        dateTimeLabel = `${date} at ${time}`;
      } else if (date) {
        finalDateTime = `${date}T09:00:00`;
        dateTimeLabel = `${date} at 9:00 AM`;
      }

      // Check if dateTime is in the past
      if (finalDateTime) {
        const dt = new Date(finalDateTime.replace(' ', 'T'));
        if (!isNaN(dt.getTime()) && dt.getTime() < Date.now() - 60000) {
          return res.status(400).json({
            error: true,
            message: "Please choose a future date and time."
          });
        }
      }

      const result = db.createReminder({
        title,
        dateTime: finalDateTime,
        dateTimeLabel: dateTimeLabel || finalDateTime || "Scheduled",
        source: source || "MANUAL"
      });

      if (result.duplicate) {
        return res.status(200).json({
          success: true,
          created: false,
          duplicate: true,
          message: "An identical reminder already exists.",
          existingReminderId: result.existingReminderId,
          reminder: result.reminder
        });
      }

      return res.status(201).json({
        success: true,
        created: true,
        duplicate: false,
        reminder: result.reminder
      });
    } catch (err) {
      return res.status(400).json({ error: true, message: err.message });
    }
  },

  completeReminder: (req, res) => {
    const { id } = req.params;
    const updated = db.completeReminder(id);
    if (!updated) {
      return res.status(404).json({ error: true, message: `Reminder '${id}' not found.` });
    }
    return res.json({ success: true, reminder: updated });
  },

  cancelReminder: (req, res) => {
    const { id } = req.params;
    const updated = db.cancelReminder(id);
    if (!updated) {
      return res.status(404).json({ error: true, message: `Reminder '${id}' not found.` });
    }
    return res.json({ success: true, reminder: updated });
  }
};
