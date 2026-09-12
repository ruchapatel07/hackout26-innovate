import React, { useState, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import {
  Search,
  Recycle,
  Gavel,
  FileText,
  Truck,
  Mail,
  PlusCircle,
  IndianRupee,
  Layers,
  ArrowLeftRight,
  Navigation,
  Car,
  Users,
  ShieldCheck,
  BarChart3,
  Key,
  Database
} from 'lucide-react';

const sectionIconMap = {
  search: <Search className="w-5 h-5 text-emerald-400" />,
  listings: <Recycle className="w-5 h-5 text-emerald-400" />,
  bids: <Gavel className="w-5 h-5 text-emerald-400" />,
  orders: <FileText className="w-5 h-5 text-emerald-400" />,
  transport: <Truck className="w-5 h-5 text-emerald-400" />,
  messages: <Mail className="w-5 h-5 text-emerald-400" />,
  "add-carbon": <PlusCircle className="w-5 h-5 text-emerald-400" />,
  earnings: <IndianRupee className="w-5 h-5 text-emerald-400" />,
  requests: <Layers className="w-5 h-5 text-emerald-400" />,
  trips: <ArrowLeftRight className="w-5 h-5 text-emerald-400" />,
  delivery: <Truck className="w-5 h-5 text-emerald-400" />,
  tracking: <Navigation className="w-5 h-5 text-emerald-400" />,
  vehicle: <Car className="w-5 h-5 text-emerald-400" />,
  users: <Users className="w-5 h-5 text-emerald-400" />,
  carbon: <Recycle className="w-5 h-5 text-emerald-400" />,
  adminbids: <Gavel className="w-5 h-5 text-emerald-400" />,
  payments: <IndianRupee className="w-5 h-5 text-emerald-400" />,
  reports: <BarChart3 className="w-5 h-5 text-emerald-400" />,
  security: <Key className="w-5 h-5 text-emerald-400" />
};

const sectionData = {
  search: { heading: "Search available CO₂", description: "Find CO₂ listings that match your requirements." },
  listings: { heading: "CO₂ Listings", description: "Manage available CO₂ listings and marketplace activity." },
  bids: { heading: "Bidding Management", description: "Review and manage your carbon credit bids." },
  orders: { heading: "Orders", description: "Track your current and previous orders." },
  transport: { heading: "Transportation", description: "Manage CO₂ transportation and delivery." },
  messages: { heading: "Messages", description: "Communicate with platform users." },
  "add-carbon": { heading: "Add New Carbon", description: "Create a new CO₂ listing." },
  earnings: { heading: "Earnings", description: "View your earnings and payment information." },
  requests: { heading: "Available Requests", description: "View transportation requests from buyers and sellers." },
  trips: { heading: "My Trips", description: "View all assigned transportation trips." },
  delivery: { heading: "Active Delivery", description: "Track your currently active CO₂ delivery." },
  tracking: { heading: "Route Tracking", description: "Monitor transportation routes and delivery progress." },
  vehicle: { heading: "My Vehicle", description: "Manage your registered transportation vehicle." },
  users: { heading: "Manage Users", description: "Manage buyers, sellers and transporters." },
  carbon: { heading: "CO₂ Listings", description: "Monitor all carbon listings on the platform." },
  adminbids: { heading: "Bidding Management", description: "Monitor platform-wide bidding activity." },
  payments: { heading: "Payments", description: "Monitor payments and transaction records." },
  reports: { heading: "Reports & Analytics", description: "View platform performance and analytics." },
  security: { heading: "Security", description: "Manage platform security and access controls." }
};

export const GenericSection = ({ section, title }) => {
  const { showToast } = useToast();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/marketplace/listings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRecords(data.listings);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [section]);

  const item = sectionData[section] || {
    heading: title || "Dashboard",
    description: "Manage this section."
  };

  const currentIcon = sectionIconMap[section] || <Database className="w-5 h-5 text-emerald-400" />;

  return (
    <div className="content-enter">
      <div className="section-heading">
        <h2>{item.heading}</h2>
        <p>{item.description}</p>
      </div>

      <div className="inner-grid">
        <div className="inner-card">
          <div className="inner-icon flex items-center justify-center">
            {currentIcon}
          </div>
          <h3>Active Records</h3>
          <p>{records.length} active records in database.</p>
        </div>

        <div className="inner-card">
          <div className="inner-icon flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h3>Real-time Sync</h3>
          <p>Real-time market data synced across nodes.</p>
        </div>

        <div className="inner-card">
          <div className="inner-icon flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
          </div>
          <h3>Quick Action</h3>
          <p>Create new listings or requests easily.</p>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">
          <h3>{item.heading} Records</h3>
          <button onClick={() => showToast('Refreshed database records.')}>Refresh</button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>ID / Producer</th>
              <th>Capture Method</th>
              <th>Volume / Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#6b7c72' }}>
                  Loading database records...
                </td>
              </tr>
            ) : records.length > 0 ? (
              records.map((r, i) => (
                <tr key={r.listingId || i}>
                  <td><b>{r.listingId || `#CC-${1000 + i}`}</b> - {r.producerName}</td>
                  <td>{r.captureMethod}</td>
                  <td>{r.availableCO2 ? `${r.availableCO2.toLocaleString()} Tons` : 'Recent'}</td>
                  <td>${r.pricePerTon || 55}/Ton</td>
                  <td><span className="status">{r.status || 'Active'}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#6b7c72' }}>
                  No active records found in database for this section.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
