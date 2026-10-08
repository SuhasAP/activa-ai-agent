import express from 'express';
import { executionController } from '../controllers/executionController.js';

const router = express.Router();

router.get('/latest', executionController.getLatestExecution);
router.get('/', executionController.getAllExecutions);
router.get('/:id', executionController.getExecutionById);

export default router;
