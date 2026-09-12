import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, Truck, DollarSign, Target, MapPin, ArrowRight } from 'lucide-react';

export const AiMatchMakerModal = ({ isOpen, onClose, onBookMatch }) => {
  const [quantity, setQuantity] = useState(2500);
  const [purity, setPurity] = useState(98.0);
  const [budget, setBudget] = useState(70);
  const [lat, setLat] = useState(29.9511);
  const [lon, setLon] = useState(-90.0715);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  if (!isOpen) return null;

  const handleRunAiMatch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/match/find', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requiredQuantity: Number(quantity),
          minimumPurity: Number(purity),
          maximumBudget: Number(budget),
          consumerLat: Number(lat),
          consumerLon: Number(lon)
        })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setResults(data.matches);
      }
    } catch (err) {
      setLoading(false);
      console.error('Match error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl p-6 sm:p-8 border border-brand-green/30 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-green/10 text-brand-green border border-brand-green/30">
              <Sparkles className="w-6 h-6 animate-pulse-slow" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">AI Carbon Matchmaking Engine</h2>
              <p className="text-xs text-slate-400">Multi-Factor Weighted Scoring: Purity (40%) • Distance (25%) • Price (20%) • Quantity (15%)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleRunAiMatch} className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6 border-b border-slate-800/80">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Required Quantity (Tons)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-green outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Minimum Purity (%)</label>
            <input
              type="number"
              step="0.1"
              value={purity}
              onChange={(e) => setPurity(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-green outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Max Budget ($/Ton)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:border-brand-green outline-none"
              required
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-green to-brand-emerald text-dark-950 font-extrabold text-sm shadow-lg shadow-brand-green/20 hover:scale-[1.02] transition"
            >
              {loading ? 'Analyzing Listings...' : 'Find Best Matches'}
            </button>
          </div>
        </form>

        {/* Results List */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Top Recommended Matches</h3>
          
          {results && results.length > 0 ? (
            results.map((match, idx) => (
              <div
                key={match.listing.listingId}
                className="bg-dark-900/90 border border-slate-800 rounded-2xl p-5 hover:border-brand-green/40 transition duration-200"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/60">
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green border border-brand-green/20 flex items-center justify-center font-black text-sm">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{match.listing.producerName}</h4>
                      <p className="text-xs text-slate-400">{match.listing.captureMethod} • {match.listing.availableCO2} Tons Available</p>
                    </div>
                  </div>

                  {/* Overall Score Badge */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 font-semibold">Overall Match Score</p>
                      <p className="text-2xl font-black text-brand-green">{match.overallScore}%</p>
                    </div>
                    <button
                      onClick={() => onBookMatch(match)}
                      className="px-4 py-2 rounded-xl bg-brand-green/20 hover:bg-brand-green text-brand-green hover:text-dark-950 font-bold text-xs border border-brand-green/30 transition flex items-center gap-1.5"
                    >
                      <span>Reserve CO₂</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

                {/* Score Breakdown Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-b border-slate-800/40 text-xs">
                  <div>
                    <span className="text-slate-400">Purity (40%): </span>
                    <span className="text-white font-bold">{match.listing.purity}% ({match.purityScore} pts)</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Distance (25%): </span>
                    <span className="text-white font-bold">{match.distanceKm} km ({match.distanceScore} pts)</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Price (20%): </span>
                    <span className="text-white font-bold">${match.listing.pricePerTon}/ton ({match.priceScore} pts)</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Logistics Est: </span>
                    <span className="text-brand-cyan font-bold">${match.logistics.totalLogisticsCost} ({match.logistics.deliveryTime})</span>
                  </div>
                </div>

                {/* Reasons Badges */}
                <div className="flex flex-wrap gap-2 pt-3">
                  {match.reasons.map((r, rIdx) => (
                    <span
                      key={rIdx}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-dark-950 text-slate-300 border border-slate-800"
                    >
                      {r}
                    </span>
                  ))}
                </div>

              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">Click "Find Best Matches" to run the AI scoring algorithm against live marketplace listings.</p>
          )}
        </div>

      </div>
    </div>
  );
};
