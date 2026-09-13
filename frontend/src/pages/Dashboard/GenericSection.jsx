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
  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [minVolume, setMinVolume] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    setLoading(true);
    fetch('/api/marketplace/listings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.listings && Array.isArray(data.listings)) {
          setRecords(data.listings);
          setFilteredRecords(data.listings);
        } else {
          setRecords([]);
          setFilteredRecords([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching listings:', err);
        setRecords([]);
        setFilteredRecords([]);
        setLoading(false);
      });
  }, [section]);
  const item = sectionData[section] || {
    heading: title || "Dashboard",
    description: "Manage this section."
  };


  // Apply search and filters for 'search' section
  const applySearchFilters = () => {
    console.log('=== SEARCH FILTER START ===');
    console.log('State:', {
      recordsLength: records.length,
      searchQuery,
      minVolume,
      maxPrice,
      selectedMethod,
      selectedStatus
    });

    // If no filters and no search, show all
    if (!searchQuery.trim() && !minVolume && !maxPrice && selectedMethod === 'ALL' && selectedStatus === 'ALL') {
      console.log('✓ No filters - showing ALL records');
      setFilteredRecords(records);
      console.log('TOTAL LISTINGS:', records.length);
      showToast(`Showing all ${records.length} listing(s).`, 'info');
      return;
    }

    let filtered = [...records];
    console.log('Starting with', filtered.length, 'records');

    // Search across producer name, capture method, and location
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      console.log('Searching for:', query);
      const beforeSearch = filtered.length;
      filtered = filtered.filter(r => {
        const producerName = String(r.producerName ?? '').toLowerCase();
        const captureMethod = String(r.captureMethod ?? '').toLowerCase();
        const location = String(r.location ?? '').toLowerCase();
        
        const match = producerName.includes(query) || captureMethod.includes(query) || location.includes(query);
        if (match) {
          console.log('  ✓ MATCH:', r.producerName);
        }
        return match;
      });
      console.log('After search: ', filtered.length, '(was', beforeSearch, ')');
    }

    // Filter by minimum volume
    if (minVolume && minVolume !== '') {
      const minVol = Number(minVolume);
      console.log('Min volume filter:', minVol);
      const beforeVol = filtered.length;
      filtered = filtered.filter(r => {
        const vol = Number(r.availableCO2 ?? 0);
        return vol >= minVol;
      });
      console.log('After volume: ', filtered.length, '(was', beforeVol, ')');
    }

    // Filter by maximum price
    if (maxPrice && maxPrice !== '') {
      const maxPr = Number(maxPrice);
      console.log('Max price filter:', maxPr);
      const beforePrice = filtered.length;
      filtered = filtered.filter(r => {
        const price = Number(r.pricePerTon ?? 0);
        return price <= maxPr;
      });
      console.log('After price: ', filtered.length, '(was', beforePrice, ')');
    }

    // Filter by capture method
    if (selectedMethod !== 'ALL') {
      console.log('Capture method filter:', selectedMethod);
      const beforeMethod = filtered.length;
      filtered = filtered.filter(r => {
        const method = String(r.captureMethod ?? '').toLowerCase();
        return method.includes(selectedMethod.toLowerCase());
      });
      console.log('After method: ', filtered.length, '(was', beforeMethod, ')');
    }

    // Filter by status
    if (selectedStatus !== 'ALL') {
      console.log('Status filter:', selectedStatus);
      const beforeStatus = filtered.length;
      filtered = filtered.filter(r => {
        const status = String(r.status ?? '').toLowerCase();
        return status === selectedStatus.toLowerCase();
      });
      console.log('After status: ', filtered.length, '(was', beforeStatus, ')');
    }

    console.log('FILTERED RESULTS:', filtered.length);
    setFilteredRecords(filtered);
    
    if (filtered.length === 0) {
      showToast('No CO₂ listings match your search.', 'info');
    } else {
      showToast(`Found ${filtered.length} listing(s).`, 'success');
    }
    console.log('=== SEARCH FILTER END ===');
  };

  const clearFilters = () => {
    setSearchQuery('');
    setMinVolume('');
    setMaxPrice('');
    setSelectedMethod('ALL');
    setSelectedStatus('ALL');
    setFilteredRecords(records);
    showToast('Filters cleared.', 'info');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetch('/api/marketplace/listings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRecords(data.listings);
          setFilteredRecords(data.listings);
          showToast('Listings refreshed.', 'success');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error refreshing listings:', err);
        showToast('Error refreshing listings.', 'error');
        setLoading(false);
      });
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
          <button onClick={handleRefresh}>Refresh</button>
        </div>

        {/* Search & Filter Section (only for 'search' section) */}
        {section === 'search' && (
          <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#0a1a0f', borderRadius: '8px', border: '1px solid #1a6b50' }}>
            {/* Search Input */}
            <div style={{ marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Search by producer, capture method or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#05120a',
                  border: '1px solid #1a6b50',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}
                onKeyPress={(e) => e.key === 'Enter' && applySearchFilters()}
              />
            </div>

            {/* Filters Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '12px' }}>
              {/* Min Volume */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#6b7c72', marginBottom: '4px', fontWeight: 'bold' }}>
                  Min Volume (Tons)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 1000"
                  value={minVolume}
                  onChange={(e) => setMinVolume(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: '#05120a',
                    border: '1px solid #1a6b50',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Max Price */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#6b7c72', marginBottom: '4px', fontWeight: 'bold' }}>
                  Max Price ($/Ton)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: '#05120a',
                    border: '1px solid #1a6b50',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Capture Method */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#6b7c72', marginBottom: '4px', fontWeight: 'bold' }}>
                  Capture Method
                </label>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: '#05120a',
                    border: '1px solid #1a6b50',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="ALL">All Methods</option>
                  <option value="Cement Plant">Cement Plant</option>
                  <option value="Steel Plant">Steel Plant</option>
                  <option value="Power Plant">Power Plant</option>
                  <option value="Direct Air Capture">Direct Air Capture</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: '#6b7c72', marginBottom: '4px', fontWeight: 'bold' }}>
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    backgroundColor: '#05120a',
                    border: '1px solid #1a6b50',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '12px',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="ALL">All Status</option>
                  <option value="Available">Available</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Sold">Sold</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={applySearchFilters}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
              >
                🔍 Search
              </button>
              <button
                onClick={clearFilters}
                style={{
                  padding: '9px 16px',
                  backgroundColor: '#6b7c72',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#576b62'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7c72'}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

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
            {(() => {
              const displayRecords = section === 'search' ? filteredRecords : records;
              return loading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#6b7c72' }}>
                    Loading database records...
                  </td>
                </tr>
              ) : displayRecords.length > 0 ? (
                displayRecords.map((r, i) => (
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
                    {section === 'search' ? 'No CO₂ listings match your search.' : 'No active records found in database for this section.'}
                  </td>
                </tr>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );
};
