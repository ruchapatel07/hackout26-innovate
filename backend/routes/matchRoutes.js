import express from 'express';
import { findMatches } from '../controllers/matchController.js';

const router = express.Router();

router.post('/find', findMatches);

export default router;
