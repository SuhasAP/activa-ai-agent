import { executionStore } from '../data/executionStore.js';

export const executionController = {
  getLatestExecution: (req, res) => {
    const latest = executionStore.getLatestExecution();
    return res.json(latest || null);
  },

  getAllExecutions: (req, res) => {
    const all = executionStore.getAllExecutions();
    return res.json(all);
  },

  getExecutionById: (req, res) => {
    const { id } = req.params;
    const item = executionStore.getExecutionById(id);
    if (!item) {
      return res.status(404).json({ error: true, message: `Execution '${id}' not found` });
    }
    return res.json(item);
  }
};
