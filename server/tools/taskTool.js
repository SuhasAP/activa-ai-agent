import { db } from '../data/seedData.js';

export const taskTool = {
  getTasks: async () => {
    return db.getTasks();
  },
  createTask: async ({ title, description, dueDate, priority }) => {
    if (!title) throw new Error("Task title is required");
    return db.createTask(title, description, dueDate, priority);
  },
  updateTask: async ({ taskId, updates }) => {
    if (!taskId) throw new Error("taskId is required");
    const updated = db.updateTask(taskId, updates);
    if (!updated) throw new Error(`Task with id ${taskId} not found`);
    return updated;
  }
};
