import express from 'express';
import { calendarController } from '../controllers/calendarController.js';

const router = express.Router();

router.get('/', calendarController.getSchedule);

export default router;
