import { RequestStore } from '../models/dynamoTables.js';

export const createRequest = async (req, res, next) => {
  try {
    const { requiredQuantity, minimumPurity, maximumBudget, latitude, longitude } = req.body;

    const requestId = 'req-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    const newRequest = {
      requestId,
      consumerId: req.user ? req.user.userId : 'usr-c1',
      consumerName: req.user ? req.user.companyName : 'BioFuel Synthetics Co',
      requiredQuantity: Number(requiredQuantity),
      minimumPurity: Number(minimumPurity),
      maximumBudget: Number(maximumBudget),
      status: 'Pending',
      latitude: latitude ? Number(latitude) : (req.user?.latitude || 29.9511),
      longitude: longitude ? Number(longitude) : (req.user?.longitude || -90.0715),
      createdAt: new Date().toISOString()
    };

    await RequestStore.create(newRequest);

    return res.status(201).json({
      success: true,
      message: 'Carbon request submitted successfully',
      request: newRequest
    });
  } catch (err) {
    next(err);
  }
};

export const getRequests = async (req, res, next) => {
  try {
    const allRequests = await RequestStore.getAll();
    const consumerId = req.user ? req.user.userId : null;

    if (consumerId && req.user.role === 'consumer') {
      const myRequests = allRequests.filter(r => r.consumerId === consumerId);
      return res.json({ success: true, count: myRequests.length, requests: myRequests });
    }

    return res.json({ success: true, count: allRequests.length, requests: allRequests });
  } catch (err) {
    next(err);
  }
};
