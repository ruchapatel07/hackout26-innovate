import express from 'express';
import { getDashboardStats, seedDatabase } from '../controllers/adminController.js';

const router = express.Router();

router.get('/dashboard', getDashboardStats);
router.post('/seed', seedDatabase);

export default router;
