import { ListingStore, UserStore } from '../models/dynamoTables.js';

export const getMarketplaceListings = async (req, res, next) => {
  try {
    const { minPurity, captureMethod, maxPrice, status } = req.query;
    let listings = await ListingStore.getAll();

    if (status) {
      listings = listings.filter(l => l.status.toLowerCase() === status.toLowerCase());
    }

    if (minPurity) {
      listings = listings.filter(l => l.purity >= Number(minPurity));
    }

    if (captureMethod) {
      listings = listings.filter(l => l.captureMethod.toLowerCase().includes(captureMethod.toLowerCase()));
    }

    if (maxPrice) {
      listings = listings.filter(l => l.pricePerTon <= Number(maxPrice));
    }

    return res.json({
      success: true,
      count: listings.length,
      listings
    });
  } catch (err) {
    next(err);
  }
};

export const getListingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await ListingStore.findById(id);

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    const producer = await UserStore.findById(listing.producerId);

    return res.json({
      success: true,
      listing,
      producer: producer ? {
        name: producer.name,
        companyName: producer.companyName,
        email: producer.email,
        location: producer.location
      } : null
    });
  } catch (err) {
    next(err);
  }
};
