import { UserStore, ListingStore, TransactionStore, RequestStore } from '../models/dynamoTables.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const users = await UserStore.getAll();
    const listings = await ListingStore.getAll();
    const transactions = await TransactionStore.getAll();
    const requests = await RequestStore.getAll();

    const totalProducers = users.filter(u => u.role === 'producer').length;
    const totalConsumers = users.filter(u => u.role === 'consumer').length;

    const totalCO2Available = listings
      .filter(l => l.status === 'Available')
      .reduce((sum, l) => sum + (Number(l.availableCO2) || 0), 0);

    const totalTransactions = transactions.length;

    const marketplaceVolume = transactions
      .reduce((sum, t) => sum + (Number(t.price) || 0), 0);

    const totalCO2Traded = transactions
      .reduce((sum, t) => sum + (Number(t.quantity) || 0), 0);

    return res.json({
      success: true,
      stats: {
        totalProducers,
        totalConsumers,
        totalUsers: users.length,
        totalCO2Available,
        totalCO2Traded,
        totalTransactions,
        marketplaceVolume,
        totalRequests: requests.length
      },
      recentListings: listings.slice(0, 5),
      recentTransactions: transactions.slice(0, 5)
    });
  } catch (err) {
    next(err);
  }
};
