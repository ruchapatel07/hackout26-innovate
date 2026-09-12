import { ListingStore } from '../models/dynamoTables.js';

export const createListing = async (req, res, next) => {
  try {
    const { availableCO2, unit, purity, pricePerTon, captureMethod, latitude, longitude } = req.body;

    const listingId = 'lst-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

    const newListing = {
      listingId,
      producerId: req.user ? req.user.userId : 'usr-p1',
      producerName: req.user ? req.user.companyName : 'Apex Cement Industries',
      availableCO2: Number(availableCO2),
      unit: unit || 'Tons',
      purity: Number(purity),
      pricePerTon: Number(pricePerTon),
      captureMethod: captureMethod || 'Cement Plant',
      status: 'Available',
      latitude: latitude ? Number(latitude) : (req.user?.latitude || 29.7604),
      longitude: longitude ? Number(longitude) : (req.user?.longitude || -95.3698),
      createdAt: new Date().toISOString()
    };

    await ListingStore.create(newListing);

    return res.status(201).json({
      success: true,
      message: 'Carbon listing created successfully',
      listing: newListing
    });
  } catch (err) {
    next(err);
  }
};

export const getProducerListings = async (req, res, next) => {
  try {
    const allListings = await ListingStore.getAll();
    const producerId = req.user ? req.user.userId : null;

    if (producerId && req.user.role === 'producer') {
      const myListings = allListings.filter(l => l.producerId === producerId);
      return res.json({ success: true, count: myListings.length, listings: myListings });
    }

    return res.json({ success: true, count: allListings.length, listings: allListings });
  } catch (err) {
    next(err);
  }
};

export const updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existing = await ListingStore.findById(id);

    if (!existing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const updated = await ListingStore.update(id, req.body);
    return res.json({
      success: true,
      message: 'Listing updated successfully',
      listing: updated
    });
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await ListingStore.delete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Listing not found or already deleted' });
    }

    return res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};
