import { db } from '../data/seedData.js';

export const noteController = {
  getNotes: (req, res) => {
    res.json(db.getNotes());
  },
  createNote: (req, res) => {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const newNote = db.createNote(title, content);
    res.status(201).json(newNote);
  }
};
