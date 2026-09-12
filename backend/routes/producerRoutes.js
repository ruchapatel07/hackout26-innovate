import express from 'express';
import { createListing, getProducerListings, updateListing, deleteListing } from '../controllers/producerController.js';
import { validateRequired } from '../middleware/validate.js';

const router = express.Router();

router.post('/listings', validateRequired(['availableCO2', 'purity', 'pricePerTon']), createListing);
router.get('/listings', getProducerListings);
router.put('/listings/:id', updateListing);
router.delete('/listings/:id', deleteListing);

export default router;
