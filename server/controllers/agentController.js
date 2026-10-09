import { agentService } from '../services/agentService.js';
import { db } from '../data/seedData.js';

export const agentController = {
  executeGoal: async (req, res, next) => {
    try {
      const { goal } = req.body;
      if (!goal || typeof goal !== 'string' || !goal.trim()) {
        return res.status(400).json({
          error: true,
          message: "Goal input is required and cannot be empty."
        });
      }
      const result = await agentService.processGoal(goal.trim());
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  approveAction: async (req, res, next) => {
    try {
      const { pendingId } = req.body;
      if (!pendingId) {
        return res.status(400).json({ error: true, message: "pendingId is required for approval." });
      }
      const result = await agentService.approveAction(pendingId);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  rejectAction: async (req, res, next) => {
    try {
      const { pendingId } = req.body;
      if (!pendingId) {
        return res.status(400).json({ error: true, message: "pendingId is required for rejection." });
      }
      const result = await agentService.rejectAction(pendingId);
      return res.json(result);
    } catch (err) {
      next(err);
    }
  },

  resetStore: async (req, res) => {
    const freshData = db.resetStore();
    return res.json({ success: true, message: "Data store reset to seed state.", data: freshData });
  }
};
