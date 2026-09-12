import { db } from '../config/dynamodb.js';

export const UserStore = {
  async findByEmail(email) {
    const users = await db.scan('Users', u => u.email.toLowerCase() === email.toLowerCase());
    return users[0] || null;
  },
  async findById(userId) {
    return db.get('Users', { userId });
  },
  async create(user) {
    return db.put('Users', user);
  },
  async getAll() {
    return db.scan('Users');
  },
  async delete(userId) {
    return db.delete('Users', { userId });
  }
};

export const ListingStore = {
  async create(listing) {
    return db.put('CarbonListings', listing);
  },
  async findById(listingId) {
    return db.get('CarbonListings', { listingId });
  },
  async getAll() {
    return db.scan('CarbonListings');
  },
  async getAvailable() {
    return db.scan('CarbonListings', l => l.status === 'Available');
  },
  async update(listingId, updateData) {
    const existing = await this.findById(listingId);
    if (!existing) return null;
    const updated = { ...existing, ...updateData };
    return db.put('CarbonListings', updated);
  },
  async delete(listingId) {
    return db.delete('CarbonListings', { listingId });
  }
};

export const RequestStore = {
  async create(request) {
    return db.put('Requests', request);
  },
  async findById(requestId) {
    return db.get('Requests', { requestId });
  },
  async getAll() {
    return db.scan('Requests');
  },
  async getByConsumerId(consumerId) {
    return db.scan('Requests', r => r.consumerId === consumerId);
  },
  async delete(requestId) {
    return db.delete('Requests', { requestId });
  }
};

export const MatchStore = {
  async create(match) {
    return db.put('MatchHistory', match);
  },
  async getAll() {
    return db.scan('MatchHistory');
  },
  async delete(matchId) {
    return db.delete('MatchHistory', { matchId });
  }
};

export const TransactionStore = {
  async create(transaction) {
    return db.put('Transactions', transaction);
  },
  async findById(transactionId) {
    return db.get('Transactions', { transactionId });
  },
  async getAll() {
    return db.scan('Transactions');
  },
  async updateStatus(transactionId, status) {
    const existing = await this.findById(transactionId);
    if (!existing) return null;
    const updated = { ...existing, status };
    return db.put('Transactions', updated);
  },
  async delete(transactionId) {
    return db.delete('Transactions', { transactionId });
  }
};
