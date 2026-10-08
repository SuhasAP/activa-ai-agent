import express from 'express';
import { noteController } from '../controllers/noteController.js';

const router = express.Router();

router.get('/', noteController.getNotes);
router.post('/', noteController.createNote);

export default router;
