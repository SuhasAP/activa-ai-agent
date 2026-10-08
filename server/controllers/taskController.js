import { db } from '../data/seedData.js';

export const taskController = {
  getTasks: (req, res) => {
    res.json(db.getTasks());
  },
  createTask: (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
    const newTask = db.createTask(title, description, dueDate, priority);
    res.status(201).json(newTask);
  },
  updateTask: (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const updated = db.updateTask(id, updates);
    if (!updated) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updated);
  }
};
