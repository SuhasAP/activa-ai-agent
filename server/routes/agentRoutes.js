import express from 'express';
import { agentController } from '../controllers/agentController.js';
import { validateGoalInput, validateApprovalInput } from '../middleware/validateInput.js';
import { agentRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/execute', agentRateLimiter, validateGoalInput, agentController.executeGoal);
router.post('/approve', validateApprovalInput, agentController.approveAction);
router.post('/reject', validateApprovalInput, agentController.rejectAction);
router.post('/reset', agentController.resetStore);

export default router;
