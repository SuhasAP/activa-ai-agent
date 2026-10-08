import express from 'express';
import { taskController } from '../controllers/taskController.js';
import { validateTaskInput } from '../middleware/validateInput.js';

const router = express.Router();

router.get('/', taskController.getTasks);
router.post('/', validateTaskInput, taskController.createTask);
router.put('/:id', taskController.updateTask);

export default router;
