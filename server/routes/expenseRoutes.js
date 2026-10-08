import express from 'express';
import { expenseController } from '../controllers/expenseController.js';

const router = express.Router();

router.get('/', expenseController.getExpenses);

export default router;
