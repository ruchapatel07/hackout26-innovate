import React, { useState, useEffect } from 'react';
import { useAuth, roleNames } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { TrendingUp, Recycle, Gavel, Package, Truck } from 'lucide-react';

export const OverviewSection = () => {
  const { currentUser, setDashboardSection } = useAuth();
  const { showToast } = useToast();

  const [dashData, setDashData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetch live dashboard metrics
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDashData(data.stats);
        }
      })
      .catch(console.error);

    // Fetch live marketplace listings for active table
    fetch('/api/marketplace/listings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setListings(data.listings);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!currentUser) return null;

  const s = dashData || {};

  let stats = [];
  if (currentUser.role === 'buyer' || currentUser.role === 'consumer') {
    stats = [
      ['CO₂ Available', `${(s.totalCO2Available ?? 0).toLocaleString()} Tons`, 'Live Marketplace'],
      ['Total Requests', `${s.totalRequests ?? 0}`, 'Active Demands'],
      ['Completed Orders', `${s.totalTransactions ?? 0}`, 'Executed Contracts'],
      ['Market Traded', `$${(s.marketplaceVolume ?? 0).toLocaleString()}`, 'Total Volume']
    ];
  } else if (currentUser.role === 'seller' || currentUser.role === 'producer') {
    stats = [
      ['CO₂ Listed', `${(s.totalCO2Available ?? 0).toLocaleString()} Tons`, 'Available'],
      ['Total Producers', `${s.totalProducers ?? 0}`, 'Verified Sources'],
      ['Buyer Bids', `${s.totalRequests ?? 0}`, 'Pending Orders'],
      ['Platform GMV', `$${(s.marketplaceVolume ?? 0).toLocaleString()}`, 'Market Revenue']
    ];
  } else if (currentUser.role === 'transporter') {
    stats = [
      ['Active Routes', `${listings.length}`, 'Logistics Hubs'],
      ['Delivered', `${s.totalTransactions ?? 0}`, 'Completed Trips'],
      ['CO₂ Moved', `${(s.totalCO2Traded ?? 0).toLocaleString()} Tons`, 'Total Recycled'],
      ['Total GMV', `$${(s.marketplaceVolume ?? 0).toLocaleString()}`, 'Market Value']
    ];
  } else {
    stats = [
      ['Total Users', `${s.totalUsers ?? 0}`, 'Registered Accounts'],
      ['CO₂ Traded', `${(s.totalCO2Traded ?? 0).toLocaleString()} Tons`, 'Circulated'],
      ['Transactions', `${s.totalTransactions ?? 0}`, 'Executed'],
      ['CO₂ Available', `${(s.totalCO2Available ?? 0).toLocaleString()} Tons`, 'Supply Sinks']
    ];
  }

  const tableTitle =
    currentUser.role === 'seller' || currentUser.role === 'producer'
      ? 'Listing Overview'
      : currentUser.role === 'admin'
      ? 'Platform Overview'
      : 'Recent Marketplace Activity';

  return (
    <div className="content-enter">
      <div className="welcome-banner">
        <small>{(roleNames[currentUser.role] || currentUser.role).toUpperCase()} DASHBOARD</small>
        <h2>Welcome back, {currentUser.name}!</h2>
        <p>Manage your Carbon Connect activities with real-time marketplace data.</p>
      </div>

      <div className="stat-grid">
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <small>{stat[0]}</small>
            <strong>{stat[1]}</strong>
            <span className="flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> {stat[2]}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <div className="panel-title">
            <h3>{tableTitle}</h3>
            <button onClick={() => showToast('Refreshed live database listings.')}>View All</button>
          </div>

          <table className="data-table">
            <thead>
              <tr>
                <th>Producer / Item</th>
                <th>Method</th>
                <th>Quantity</th>
                <th>Price / Ton</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#6b7c72' }}>
                    Loading live market data...
                  </td>
                </tr>
              ) : listings.length > 0 ? (
                listings.map((l) => (
                  <tr key={l.listingId}>
                    <td><b>{l.producerName}</b></td>
                    <td>{l.captureMethod}</td>
                    <td>{l.availableCO2.toLocaleString()} Tons</td>
                    <td>${l.pricePerTon}</td>
                    <td><span className="status">{l.status}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#6b7c72' }}>
                    No active listings in database. Use <b>"List CO₂"</b> to add your first capture record!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="panel">
          <div className="panel-title">
            <h3>Quick Actions</h3>
          </div>

          <div className="quick-grid">
            <button
              className="quick-button"
              onClick={() => setDashboardSection('listings')}
            >
              <Recycle className="w-6 h-6 text-emerald-600 mb-1" />
              <b>CO₂ Listings</b>
              <small>View marketplace</small>
            </button>

            <button
              className="quick-button"
              onClick={() => setDashboardSection('bids')}
            >
              <Gavel className="w-6 h-6 text-brand-green mb-1" />
              <b>Manage Bids</b>
              <small>Review offers</small>
            </button>

            <button
              className="quick-button"
              onClick={() => setDashboardSection('orders')}
            >
              <Package className="w-6 h-6 text-indigo-600 mb-1" />
              <b>Orders</b>
              <small>Track orders</small>
            </button>

            <button
              className="quick-button"
              onClick={() => setDashboardSection('transport')}
            >
              <Truck className="w-6 h-6 text-blue-600 mb-1" />
              <b>Transportation</b>
              <small>Manage logistics</small>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
