import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';
import { Marketplace3DCanvas } from '../components/Marketplace3DCanvas';
import { Search, Filter, Layers, MapPin, ShieldCheck, ArrowUpRight, DollarSign, TrendingUp, Gavel, CheckCircle2, X } from 'lucide-react';

const INITIAL_LISTINGS = [
  { id: '1', title: 'Food-Grade CO₂ (99.9% Pure)', seller: 'GreenSteel Captures Ltd', volume: '15,000 Tons', price: 42, purity: '99.9%', location: 'Mumbai, India', type: 'Pressurized Liquid Tanker', cert: 'ISO-14064 Audited' },
  { id: '2', title: 'Commercial Industrial CO₂', seller: 'EcoCement Global Plant', volume: '35,000 Tons', price: 38, purity: '98.5%', location: 'Rotterdam, Netherlands', type: 'Direct Pipeline / Tanker', cert: 'EU ETS Compliant' },
  { id: '3', title: 'High-Purity Bio-CO₂', seller: 'Bifuel Energy Bio-Refinery', volume: '22,000 Tons', price: 46, purity: '99.7%', location: 'Houston, Texas, USA', type: 'Cryogenic Tanker', cert: 'USDA BioPreferred' },
  { id: '4', title: 'Ultra-Pure Beverage CO₂', seller: 'Tokyo Clean Gas Corp', volume: '10,000 Tons', price: 50, purity: '99.99%', location: 'Tokyo, Japan', type: 'High-Pressure Cylinders', cert: 'Food Safety Verified' },
  { id: '5', title: 'Reclaimed Fertilizer CO₂', seller: 'Dubai Solar Synthetic Stream', volume: '18,000 Tons', price: 40, purity: '99.1%', location: 'Dubai, UAE', type: 'Pressurized Liquid Tanker', cert: 'Gold Standard Carbon' },
  { id: '6', title: 'Industrial Smelter CO₂', seller: 'Nordic Carbon Minerals', volume: '40,000 Tons', price: 34, purity: '97.8%', location: 'Oslo, Norway', type: 'Pipeline Transport', cert: 'Nordic Eco-Label' }
];

export const MarketplacePage = () => {
  const { navigatePage, user } = useAuth();
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  const [searchTerm, setSearchTerm] = useState('');
  const [minPurity, setMinPurity] = useState('all');
  const [selectedListingForBid, setSelectedListingForBid] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidVolume, setBidVolume] = useState('');

  const filteredListings = INITIAL_LISTINGS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (minPurity === 'food') return matchesSearch && parseFloat(item.purity) >= 99.9;
    if (minPurity === 'commercial') return matchesSearch && parseFloat(item.purity) >= 98.5;
    return matchesSearch;
  });

  const handlePlaceBidSubmit = (e) => {
    e.preventDefault();
    if (!bidAmount || !bidVolume) {
      showToast('Please enter a valid bid price and required volume.', 'error');
      return;
    }

    const titleMsg = '🏢 New Buyer Bid Submitted';
    const bodyMsg = `Bid of $${bidAmount}/Ton for ${bidVolume} Tons placed on ${selectedListingForBid.title}.`;
    
    addNotification(titleMsg, bodyMsg, 'bid');
    showToast(`Bid submitted successfully! Offer of $${bidAmount}/Ton for ${bidVolume} Tons placed on ${selectedListingForBid.title}.`, 'success');
    
    setSelectedListingForBid(null);
    setBidAmount('');
    setBidVolume('');
  };

  return (
    <section id="marketplacePage" className="page page-enter bg-[#06150b] text-white min-h-screen relative overflow-hidden">
      
      {/* Background Radial Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 space-y-16">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black text-emerald-400 tracking-widest uppercase bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/30 inline-block shadow-sm">
            COMMERCIAL CARBON TRADING
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Global CO<sub>2</sub> Supply Marketplace
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            Discover verified industrial carbon capture listings, participate in real-time auctions, and secure pressurized CO<sub>2</sub> supply with transparent market pricing.
          </p>
        </div>

        {/* 3D Global Trading Globe Canvas */}
        <Marketplace3DCanvas />

        {/* Search & Filter Controls Bar */}
        <div className="p-6 rounded-3xl bg-[#082414]/90 border border-emerald-800/40 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-emerald-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by supplier, location or grade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#04170d] border border-emerald-700/50 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition"
            />
          </div>

          {/* Purity Filter Tabs */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setMinPurity('all')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${minPurity === 'all' ? 'bg-emerald-500 text-dark-950 shadow-md shadow-emerald-500/30' : 'bg-[#04170d] text-slate-300 hover:text-white border border-emerald-900/40'}`}
            >
              All Grades
            </button>
            <button
              onClick={() => setMinPurity('food')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${minPurity === 'food' ? 'bg-emerald-500 text-dark-950 shadow-md shadow-emerald-500/30' : 'bg-[#04170d] text-slate-300 hover:text-white border border-emerald-900/40'}`}
            >
              Food Grade (99.9%+)
            </button>
            <button
              onClick={() => setMinPurity('commercial')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition ${minPurity === 'commercial' ? 'bg-emerald-500 text-dark-950 shadow-md shadow-emerald-500/30' : 'bg-[#04170d] text-slate-300 hover:text-white border border-emerald-900/40'}`}
            >
              Industrial Grade (98.5%+)
            </button>
          </div>

        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="p-8 rounded-3xl bg-[#0a2214]/90 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/60 transition duration-300 flex flex-col justify-between group shadow-xl hover:scale-[1.01]"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {item.purity} Purity
                  </span>
                  <strong className="text-2xl font-black text-white">${item.price} <span className="text-xs text-slate-400 font-medium">/ Ton</span></strong>
                </div>

                <div>
                  <h3 className="text-xl font-extrabold text-white group-hover:text-emerald-300 transition duration-200">{item.title}</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{item.location} • {item.seller}</span>
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#05170d] border border-emerald-900/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Available Quantity:</span>
                    <strong className="text-white font-black">{item.volume}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Logistics Mode:</span>
                    <span className="text-emerald-400 font-semibold">{item.type}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-emerald-900/40 mt-6 flex items-center gap-3">
                <button
                  onClick={() => setSelectedListingForBid(item)}
                  className="flex-1 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 transition"
                >
                  <Gavel className="w-4 h-4" />
                  <span>Place Bid</span>
                </button>

                <button
                  onClick={() => {
                    addNotification(
                      '🎉 Instant Order Created',
                      `Order of ${item.volume} from ${item.seller} ($${item.price}/Ton) confirmed.`,
                      'bid'
                    );
                    showToast(`Order initiated for ${item.title}! Proceeding to checkout.`, 'success');
                  }}
                  className="px-4 py-3 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 text-white font-bold text-xs border border-emerald-500/40 transition"
                >
                  Instant Buy
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Place Bid Modal */}
      {selectedListingForBid && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#082615] border border-emerald-500/50 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 relative animate-fade-in">
            
            <button
              onClick={() => setSelectedListingForBid(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-emerald-900/40 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">SUBMIT COMMERCIAL BID</span>
              <h3 className="text-2xl font-black text-white">{selectedListingForBid.title}</h3>
              <p className="text-xs text-slate-400">Seller: {selectedListingForBid.seller} • Listed at ${selectedListingForBid.price}/Ton</p>
            </div>

            <form onSubmit={handlePlaceBidSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Your Bid Offer ($ / Ton)</label>
                <input
                  type="number"
                  placeholder={`e.g. ${selectedListingForBid.price + 2}`}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  className="w-full bg-[#04170d] border border-emerald-700/50 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Required Quantity (Tons)</label>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  value={bidVolume}
                  onChange={(e) => setBidVolume(e.target.value)}
                  className="w-full bg-[#04170d] border border-emerald-700/50 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs uppercase tracking-wider shadow-xl shadow-emerald-500/25 transition mt-2"
              >
                Submit Binding Bid
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
