/**
 * Calculate distance between two lat/lng points using Haversine Formula (km)
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance * 10) / 10;
}

/**
 * Logistics Estimate Calculator
 */
export function calculateLogisticsEstimate(producerLat, producerLon, consumerLat, consumerLon, quantityTons) {
  const distanceKm = calculateDistance(producerLat, producerLon, consumerLat, consumerLon);
  
  // Fuel rate per km per ton
  const fuelRatePerKmPerTon = 1.25; // USD/km/ton
  const baseTruckCost = 350; // Base dispatch fee
  const perKmTruckCost = 2.10;

  const estimatedFuelCost = Math.round(distanceKm * fuelRatePerKmPerTon * (quantityTons / 50));
  const estimatedTruckCost = Math.round(baseTruckCost + (distanceKm * perKmTruckCost));
  const totalLogisticsCost = estimatedFuelCost + estimatedTruckCost;

  // Delivery time in hours (avg 60 km/h truck speed + 2 hours loading/unloading)
  const deliveryHours = Math.round((distanceKm / 60) + 2);
  const deliveryTime = deliveryHours > 24 
    ? `${Math.floor(deliveryHours / 24)} days ${deliveryHours % 24} hrs`
    : `${deliveryHours} hrs`;

  return {
    distanceKm,
    estimatedFuelCost,
    estimatedTruckCost,
    totalLogisticsCost,
    deliveryTime
  };
}
