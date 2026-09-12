import express from 'express';
import { getPriceRecommendation, getCarbonImpact, getDemandForecast, getLeaderboard } from '../controllers/aiController.js';

const router = express.Router();

router.get('/price-recommendation', getPriceRecommendation);
router.post('/price-recommendation', getPriceRecommendation);
router.get('/impact-calculator', getCarbonImpact);
router.post('/impact-calculator', getCarbonImpact);
router.get('/demand-forecast', getDemandForecast);
router.get('/leaderboard', getLeaderboard);

export default router;
