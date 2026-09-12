import { ListingStore, MatchStore } from '../models/dynamoTables.js';
import { findBestMatches } from '../utils/aiMatching.js';

export const findMatches = async (req, res, next) => {
  try {
    const { requiredQuantity, minimumPurity, maximumBudget, consumerLat, consumerLon } = req.body;

    const qty = Number(requiredQuantity) || 1000;
    const pur = Number(minimumPurity) || 95.0;
    const budget = maximumBudget ? Number(maximumBudget) : null;
    const lat = consumerLat ? Number(consumerLat) : (req.user?.latitude || 29.9511);
    const lon = consumerLon ? Number(consumerLon) : (req.user?.longitude || -90.0715);

    const availableListings = await ListingStore.getAvailable();

    const matches = findBestMatches(
      {
        requiredQuantity: qty,
        minimumPurity: pur,
        maximumBudget: budget,
        consumerLat: lat,
        consumerLon: lon
      },
      availableListings
    );

    // Save match record in MatchHistory
    if (matches.length > 0) {
      const topMatch = matches[0];
      const matchId = 'mtch-' + Date.now().toString(36);
      await MatchStore.create({
        matchId,
        listingId: topMatch.listing.listingId,
        requestId: req.body.requestId || 'req-instant',
        score: topMatch.overallScore,
        distance: topMatch.distanceKm,
        estimatedCost: topMatch.logistics.totalLogisticsCost,
        createdAt: new Date().toISOString()
      });
    }

    return res.json({
      success: true,
      query: {
        requiredQuantity: qty,
        minimumPurity: pur,
        maximumBudget: budget,
        consumerLat: lat,
        consumerLon: lon
      },
      count: matches.length,
      algorithmWeights: {
        purityWeight: '40%',
        distanceWeight: '25%',
        priceWeight: '20%',
        quantityWeight: '15%'
      },
      matches
    });
  } catch (err) {
    next(err);
  }
};
