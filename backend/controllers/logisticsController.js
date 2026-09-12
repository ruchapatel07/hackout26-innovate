import { calculateLogisticsEstimate } from '../utils/distance.js';

export const getLogisticsEstimate = async (req, res, next) => {
  try {
    const producerLat = Number(req.query.producerLat || req.body.producerLat || 29.7604);
    const producerLon = Number(req.query.producerLon || req.body.producerLon || -95.3698);
    const consumerLat = Number(req.query.consumerLat || req.body.consumerLat || 29.9511);
    const consumerLon = Number(req.query.consumerLon || req.body.consumerLon || -90.0715);
    const quantity = Number(req.query.quantity || req.body.quantity || 1000);

    const estimate = calculateLogisticsEstimate(producerLat, producerLon, consumerLat, consumerLon, quantity);

    return res.json({
      success: true,
      input: {
        producerLocation: { lat: producerLat, lon: producerLon },
        consumerLocation: { lat: consumerLat, lon: consumerLon },
        quantityTons: quantity
      },
      estimate
    });
  } catch (err) {
    next(err);
  }
};
