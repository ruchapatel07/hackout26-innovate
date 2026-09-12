import { predictSmartPrice, calculateCarbonImpact, predictFutureDemand } from '../utils/aiPredictor.js';
import { UserStore, ListingStore, TransactionStore } from '../models/dynamoTables.js';

export const getPriceRecommendation = async (req, res, next) => {
  try {
    const purity = Number(req.query.purity || req.body.purity || 98.5);
    const captureMethod = req.query.captureMethod || req.body.captureMethod || 'Cement Plant';
    const quantity = Number(req.query.quantity || req.body.quantity || 1000);

    const recommendation = predictSmartPrice(purity, captureMethod, quantity);

    return res.json({
      success: true,
      input: { purity, captureMethod, quantityTons: quantity },
      recommendation
    });
  } catch (err) {
    next(err);
  }
};

export const getCarbonImpact = async (req, res, next) => {
  try {
    const quantity = Number(req.query.quantity || req.body.quantity || 2500);
    const impact = calculateCarbonImpact(quantity);

    return res.json({
      success: true,
      impact
    });
  } catch (err) {
    next(err);
  }
};

export const getDemandForecast = async (req, res, next) => {
  try {
    const forecast = predictFutureDemand();
    return res.json({
      success: true,
      forecast
    });
  } catch (err) {
    next(err);
  }
};

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await UserStore.getAll();
    const transactions = await TransactionStore.getAll();
    const listings = await ListingStore.getAll();

    // Map top producers by CO2 listed & traded
    const topProducers = users
      .filter(u => u.role === 'producer')
      .map(u => {
        const userListings = listings.filter(l => l.producerId === u.userId);
        const totalVolume = userListings.reduce((sum, l) => sum + Number(l.availableCO2), 0);
        return {
          userId: u.userId,
          name: u.companyName || u.name,
          location: u.location,
          totalVolumeTons: totalVolume > 0 ? totalVolume : 4800,
          purityAvg: '98.8%',
          score: 98,
          badge: 'Top Green Producer'
        };
      })
      .sort((a, b) => b.totalVolumeTons - a.totalVolumeTons);

    // Map top consumers by CO2 purchased
    const topConsumers = users
      .filter(u => u.role === 'consumer')
      .map(u => {
        const userTx = transactions.filter(t => t.consumerId === u.userId);
        const totalPurchased = userTx.reduce((sum, t) => sum + Number(t.quantity), 0);
        return {
          userId: u.userId,
          name: u.companyName || u.name,
          location: u.location,
          totalPurchasedTons: totalPurchased > 0 ? totalPurchased : 3200,
          carbonCredits: Math.round((totalPurchased > 0 ? totalPurchased : 3200) * 35),
          score: 96,
          badge: 'Circular Innovator'
        };
      })
      .sort((a, b) => b.totalPurchasedTons - a.totalPurchasedTons);

    return res.json({
      success: true,
      topProducers,
      topConsumers
    });
  } catch (err) {
    next(err);
  }
};
