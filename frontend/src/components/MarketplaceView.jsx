import React, { useState, useEffect } from 'react';
import { Search, Filter, Factory, CheckCircle, ShieldCheck, MapPin, DollarSign, Layers, PlusCircle, ArrowRight } from 'lucide-react';

export const MarketplaceView = ({ openAiMatchmaker, user }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('ALL');
  const [minPurityFilter, setMinPurityFilter] = useState(90);

  const [selectedListing, setSelectedListing] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(500);

  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [newAvailableCO2, setNewAvailableCO2] = useState(3000);
  const [newPurity, setNewPurity] = useState(99.0);
  const [newPrice, setNewPrice] = useState(65);
  const [newMethod, setNewMethod] = useState('Cement Plant');

  const fetchListings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/marketplace/listings');
      const data = await res.json();
      if (data.success) {
        setListings(data.listings);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleCreateListing = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/producer/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          availableCO2: Number(newAvailableCO2),
          purity: Number(newPurity),
          pricePerTon: Number(newPrice),
          captureMethod: newMethod
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsNewListingModalOpen(false);
        fetchListings();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredListings = listings.filter((l) => {
    const matchesSearch = l.producerName.toLowerCase().includes(search.toLowerCase()) ||
                          l.captureMethod.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = selectedMethod === 'ALL' || l.captureMethod.toLowerCase().includes(selectedMethod.toLowerCase());
    const matchesPurity = l.purity >= minPurityFilter;
    return matchesSearch && matchesMethod && matchesPurity;
  });

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Filter Toolbar */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-brand-green" />
            <span>CO₂ Supply Marketplace</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Verified industrial carbon capture listings ready for commercial dispatch.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAiMatchmaker}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-cyan text-dark-950 font-bold text-xs shadow-lg shadow-brand-green/20 hover:scale-105 transition"
          >
            <span>Run AI Matcher</span>
          </button>

          <button
            onClick={() => setIsNewListingModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 text-brand-green" />
            <span>List Captured CO₂</span>
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
        
        {/* Search */}
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by producer name or capture method..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-brand-green outline-none"
          />
        </div>

        {/* Capture Method Selector */}
        <div className="sm:col-span-4 flex items-center gap-2 bg-dark-900 border border-slate-800 rounded-xl px-3 py-1">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="bg-transparent text-xs text-slate-200 font-semibold w-full outline-none py-1.5"
          >
            <option value="ALL" className="bg-dark-950">All Capture Methods</option>
            <option value="Cement Plant" className="bg-dark-950">Cement Plant</option>
            <option value="Steel Plant" className="bg-dark-950">Steel Plant</option>
            <option value="Power Plant" className="bg-dark-950">Power Plant</option>
            <option value="Direct Air Capture" className="bg-dark-950">Direct Air Capture</option>
          </select>
        </div>

        {/* Min Purity Slider */}
        <div className="sm:col-span-3 flex flex-col justify-center bg-dark-900 border border-slate-800 rounded-xl px-3.5 py-2">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
            <span>Min Purity:</span>
            <span className="text-brand-green">{minPurityFilter}%</span>
          </div>
          <input
            type="range"
            min="85"
            max="99.9"
            step="0.5"
            value={minPurityFilter}
            onChange={(e) => setMinPurityFilter(Number(e.target.value))}
            className="accent-brand-green cursor-pointer"
          />
        </div>

      </div>

      {/* Grid of Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-xs text-slate-400 col-span-full py-12 text-center">Loading live carbon marketplace listings...</p>
        ) : filteredListings.length > 0 ? (
          filteredListings.map((listing) => (
            <div
              key={listing.listingId}
              className="glass-panel glass-panel-hover rounded-2xl p-6 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20">
                    {listing.captureMethod}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    listing.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {listing.status}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mt-4">{listing.producerName}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>Gulf Coast Industrial Hub</span>
                </p>

                {/* Listing Metrics */}
                <div className="grid grid-cols-2 gap-3 my-5 bg-dark-900/80 p-3.5 rounded-xl border border-slate-800/80">
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Available Supply</p>
                    <p className="text-lg font-black text-white">{listing.availableCO2.toLocaleString()} <span className="text-xs font-normal text-slate-400">Tons</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">Purity Grade</p>
                    <p className="text-lg font-black text-brand-green">{listing.purity}%</p>
                  </div>
                </div>
              </div>

              {/* Price & Booking Button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold">Listing Price</p>
                  <p className="text-xl font-black text-white">${listing.pricePerTon} <span className="text-xs text-slate-400 font-normal">/ Ton</span></p>
                </div>

                <button
                  onClick={() => {
                    setSelectedListing(listing);
                    setIsOrderModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-brand-green text-slate-200 hover:text-dark-950 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <span>Request CO₂</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 col-span-full py-12 text-center">No carbon listings match your current filters.</p>
        )}
      </div>

      {/* New Listing Modal */}
      {isNewListingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel rounded-2xl p-6 border border-brand-green/30 space-y-4">
            <h3 className="text-lg font-bold text-white">Create New CO₂ Listing</h3>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Capture Method</label>
                <select
                  value={newMethod}
                  onChange={(e) => setNewMethod(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="Cement Plant">Cement Plant</option>
                  <option value="Steel Plant">Steel Plant</option>
                  <option value="Power Plant">Power Plant</option>
                  <option value="Direct Air Capture">Direct Air Capture</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Available CO₂ Volume (Tons)</label>
                <input
                  type="number"
                  value={newAvailableCO2}
                  onChange={(e) => setNewAvailableCO2(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">CO₂ Purity (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newPurity}
                  onChange={(e) => setNewPurity(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Price Per Ton ($)</label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewListingModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-brand-green text-dark-950 font-extrabold text-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Reservation Modal */}
      {isOrderModalOpen && selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel rounded-2xl p-6 border border-brand-green/30 space-y-4">
            <h3 className="text-lg font-bold text-white">Reserve CO₂ Supply</h3>
            <p className="text-xs text-slate-400">Supplier: <span className="text-white font-bold">{selectedListing.producerName}</span> ({selectedListing.purity}% Purity)</p>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Requested Quantity (Tons)</label>
              <input
                type="number"
                max={selectedListing.availableCO2}
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(e.target.value)}
                className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div className="bg-dark-900 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Unit Price:</span>
                <span className="text-white">${selectedListing.pricePerTon} / ton</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Est. Logistics Fee:</span>
                <span className="text-white">$1,120</span>
              </div>
              <div className="flex justify-between font-bold text-brand-green pt-1 border-t border-slate-800">
                <span>Total Estimated Cost:</span>
                <span>${(orderQuantity * selectedListing.pricePerTon + 1120).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Successfully placed reservation for ${orderQuantity} Tons from ${selectedListing.producerName}!`);
                  setIsOrderModalOpen(false);
                }}
                className="w-1/2 py-2.5 rounded-xl bg-brand-green text-dark-950 font-extrabold text-xs"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
