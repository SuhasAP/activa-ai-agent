import { db } from '../data/seedData.js';

export const expenseController = {
  getExpenses: (req, res) => {
    const expenses = db.getExpenses();
    const budgetSummary = db.calculateBudget();
    res.json({ expenses, budgetSummary });
  }
};
