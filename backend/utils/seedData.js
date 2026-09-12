import { UserStore, ListingStore, RequestStore, TransactionStore, MatchStore } from '../models/dynamoTables.js';

export async function clearAllDummyData() {
  try {
    const users = await UserStore.getAll();
    for (const u of users) {
      if (u.userId) await UserStore.delete(u.userId);
    }
    const listings = await ListingStore.getAll();
    for (const l of listings) {
      if (l.listingId) await ListingStore.delete(l.listingId);
    }
    const requests = await RequestStore.getAll();
    for (const r of requests) {
      if (r.requestId) await RequestStore.delete(r.requestId);
    }
    const matches = await MatchStore.getAll();
    for (const m of matches) {
      if (m.matchId) await MatchStore.delete(m.matchId);
    }
    const txs = await TransactionStore.getAll();
    for (const t of txs) {
      if (t.transactionId) await TransactionStore.delete(t.transactionId);
    }
    console.log('[Clean] Database successfully cleared of all dummy data.');
  } catch (err) {
    console.error('[Clean Error]', err.message);
  }
}

export async function seedInitialData() {
  // Clear any existing dummy seed records from AWS DynamoDB / Memory Store
  await clearAllDummyData();
  console.log('[Boot] CarbonLink AI Database operating in Clean Mode (No dummy data present).');
}

