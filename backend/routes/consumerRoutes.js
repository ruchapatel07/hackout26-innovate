import express from 'express';
import { createRequest, getRequests } from '../controllers/consumerController.js';
import { validateRequired } from '../middleware/validate.js';

const router = express.Router();

router.post('/request', validateRequired(['requiredQuantity', 'minimumPurity']), createRequest);
router.get('/request', getRequests);

export default router;
