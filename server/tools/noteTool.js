import { db } from '../data/seedData.js';

export const noteTool = {
  getNotes: async () => {
    return db.getNotes();
  },
  createNote: async ({ title, content }) => {
    if (!title) throw new Error("Note title is required");
    return db.createNote(title, content);
  }
};
