import { db } from '../data/seedData.js';

export const calendarController = {
  getSchedule: (req, res) => {
    res.json(db.getSchedule());
  }
};
