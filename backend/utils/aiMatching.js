import { calculateDistance, calculateLogisticsEstimate } from './distance.js';

/**
 * AI Weighted Matchmaker Algorithm for Carbon Marketplace
 * 
 * Formula:
 * Purity Weight: 40%
 * Distance Weight: 25%
 * Price Weight: 20%
 * Quantity Weight: 15%
 */
export function findBestMatches({ requiredQuantity, minimumPurity, maximumBudget, consumerLat, consumerLon }, listings) {
  const scoredListings = listings.map(listing => {
    // 1. Purity Score (40%)
    // If listing purity >= minimumPurity, score = 100%. If less, penalize exponentially.
    let purityScore = 0;
    if (listing.purity >= minimumPurity) {
      purityScore = 100;
    } else {
      const delta = minimumPurity - listing.purity;
      purityScore = Math.max(0, 100 - delta * 5);
    }

    // 2. Distance Score (25%)
    // Distance closer than 50km = 100%. Scale down up to 1000km.
    const dist = calculateDistance(consumerLat, consumerLon, listing.latitude, listing.longitude);
    let distanceScore = 0;
    if (dist <= 50) {
      distanceScore = 100;
    } else if (dist <= 1000) {
      distanceScore = Math.max(0, 100 - ((dist - 50) / 950) * 80);
    } else {
      distanceScore = Math.max(5, 100 - (dist / 20));
    }

    // 3. Price Score (20%)
    // Maximum budget vs listing price per ton
    let priceScore = 0;
    if (maximumBudget && maximumBudget > 0) {
      if (listing.pricePerTon <= maximumBudget) {
        // Price below budget gets bonus score up to 100
        const savingsPercent = (maximumBudget - listing.pricePerTon) / maximumBudget;
        priceScore = Math.min(100, 85 + savingsPercent * 30);
      } else {
        const overflowPercent = (listing.pricePerTon - maximumBudget) / maximumBudget;
        priceScore = Math.max(0, 70 - overflowPercent * 100);
      }
    } else {
      priceScore = Math.max(20, 100 - (listing.pricePerTon / 150) * 50);
    }

    // 4. Quantity Score (15%)
    // Match available CO2 against required quantity
    let quantityScore = 0;
    if (listing.availableCO2 >= requiredQuantity) {
      quantityScore = 100;
    } else {
      quantityScore = Math.round((listing.availableCO2 / requiredQuantity) * 100);
    }

    // Final Overall Weighted Score
    const overallScoreNum = (
      purityScore * 0.40 +
      distanceScore * 0.25 +
      priceScore * 0.20 +
      quantityScore * 0.15
    );

    const overallScore = Math.round(overallScoreNum);

    // Generate Dynamic Match Reasons
    const reasons = [];
    if (listing.purity >= minimumPurity) {
      reasons.push(`✔ High Purity Match (${listing.purity}% vs ${minimumPurity}% min)`);
    } else {
      reasons.push(`⚠ Sub-optimal Purity (${listing.purity}%)`);
    }

    if (dist <= 150) {
      reasons.push(`✔ Close Proximity (${dist} km away)`);
    } else {
      reasons.push(`🚚 Distance: ${dist} km`);
    }

    const logistics = calculateLogisticsEstimate(
      listing.latitude, listing.longitude,
      consumerLat, consumerLon,
      Math.min(requiredQuantity, listing.availableCO2)
    );

    if (logistics.totalLogisticsCost < 1500) {
      reasons.push(`✔ Low Logistics Cost ($${logistics.totalLogisticsCost})`);
    }

    if (listing.status === 'Available') {
      reasons.push(`✔ Available Immediately`);
    }

    if (maximumBudget && listing.pricePerTon <= maximumBudget) {
      reasons.push(`✔ Within Target Budget ($${listing.pricePerTon}/ton)`);
    }

    return {
      listing,
      overallScore,
      purityScore: Math.round(purityScore),
      distanceScore: Math.round(distanceScore),
      priceScore: Math.round(priceScore),
      quantityScore: Math.round(quantityScore),
      distanceKm: dist,
      logistics,
      reasons
    };
  });

  // Sort descending by overallScore and return top 5
  scoredListings.sort((a, b) => b.overallScore - a.overallScore);
  return scoredListings.slice(0, 5);
}
