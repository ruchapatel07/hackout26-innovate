import express from 'express';
import { getLogisticsEstimate } from '../controllers/logisticsController.js';

const router = express.Router();

router.get('/estimate', getLogisticsEstimate);
router.post('/estimate', getLogisticsEstimate);

export default router;
