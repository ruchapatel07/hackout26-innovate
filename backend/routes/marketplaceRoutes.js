import express from 'express';
import { getMarketplaceListings, getListingById } from '../controllers/marketplaceController.js';

const router = express.Router();

router.get('/listings', getMarketplaceListings);
router.get('/listings/:id', getListingById);

export default router;
