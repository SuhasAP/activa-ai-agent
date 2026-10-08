import { db } from '../data/seedData.js';

export const expenseTool = {
  getExpenses: async () => {
    return db.getExpenses();
  },
  calculateBudget: async () => {
    return db.calculateBudget();
  },
  createBudgetPlan: async ({ categories } = {}) => {
    return db.createBudgetPlan(categories);
  }
};
