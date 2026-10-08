import { db } from '../data/seedData.js';

export const reminderTool = {
  getReminders: async () => {
    return db.getReminders();
  },
  createReminder: async (params) => {
    return db.createReminder(params);
  }
};
