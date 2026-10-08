import express from 'express';
import { reminderController } from '../controllers/reminderController.js';
import { validateReminderInput } from '../middleware/validateInput.js';

const router = express.Router();

router.get('/', reminderController.getReminders);
router.post('/', validateReminderInput, reminderController.createReminder);
router.put('/:id/complete', reminderController.completeReminder);
router.put('/:id/cancel', reminderController.cancelReminder);

export default router;
