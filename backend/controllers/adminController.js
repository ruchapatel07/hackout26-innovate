import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { UserStore, ListingStore, TransactionStore, RequestStore } from '../models/dynamoTables.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const seedDatabase = async (req, res, next) => {
  try {
    const localDbPath = path.join(__dirname, '../../localdb.json');
    if (!fs.existsSync(localDbPath)) {
      return res.status(404).json({ success: false, error: 'localdb.json not found' });
    }

    const data = JSON.parse(fs.readFileSync(localDbPath, 'utf8'));

    if (Array.isArray(data.Users)) {
      for (const u of data.Users) {
        try { await UserStore.create(u); } catch (e) { /* ignore duplicate */ }
      }
    }
    if (Array.isArray(data.CarbonListings)) {
      for (const l of data.CarbonListings) {
        try { await ListingStore.create(l); } catch (e) { /* ignore duplicate */ }
      }
    }
    if (Array.isArray(data.Requests)) {
      for (const r of data.Requests) {
        try { await RequestStore.create(r); } catch (e) { /* ignore duplicate */ }
      }
    }
    if (Array.isArray(data.Transactions)) {
      for (const t of data.Transactions) {
        try { await TransactionStore.create(t); } catch (e) { /* ignore duplicate */ }
      }
    }

    return res.json({
      success: true,
      message: 'Database successfully seeded with enterprise data!'
    });
  } catch (err) {
    next(err);
  }
};
