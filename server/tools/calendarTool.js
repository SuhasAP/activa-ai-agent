import { db } from '../data/seedData.js';

export const calendarTool = {
  getSchedule: async () => {
    return db.getSchedule();
  },
  findFreeTime: async ({ date, duration }) => {
    return db.findFreeTime(date, duration);
  },
  createCalendarDraft: async ({ title, startTime, endTime }) => {
    if (!title) throw new Error("Event title is required");
    return db.createCalendarDraft(title, startTime, endTime);
  }
};
