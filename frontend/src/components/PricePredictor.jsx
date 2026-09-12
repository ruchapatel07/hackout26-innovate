import React, { useState, useEffect } from 'react';
import { TrendingUp, Sparkles, AlertCircle, CheckCircle, Shield } from 'lucide-react';

export const PricePredictor = () => {
  const [purity, setPurity] = useState(98.5);
  const [captureMethod, setCaptureMethod] = useState('Cement Plant');
  const [quantity, setQuantity] = useState(1500);

  const [resData, setResData] = useState(null);

  const fetchPrice = async () => {
    try {
      const res = await fetch('/api/ai/price-recommendation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purity, captureMethod, quantity })
      });
      const data = await res.json();
      if (data.success) {
        setResData(data.recommendation);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrice();
  }, [purity, captureMethod, quantity]);

  return (
    <div className="space-y-8">
      
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-brand-cyan" />
          <span>AI Smart Price Recommendation Engine</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Predict optimal commercial carbon pricing based on capture source, purity grade, and regional demand dynamics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Parameters */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Input Pricing Parameters</h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Capture Source Type</label>
            <select
              value={captureMethod}
              onChange={(e) => setCaptureMethod(e.target.value)}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
            >
              <option value="Cement Plant">Cement Plant</option>
              <option value="Steel Plant">Steel Plant</option>
              <option value="Power Plant">Power Plant</option>
              <option value="Direct Air Capture">Direct Air Capture</option>
              <option value="Chemical Refinery">Chemical Refinery</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">CO₂ Purity ({purity}%)</label>
            <input
              type="range"
              min="85.0"
              max="99.9"
              step="0.1"
              value={purity}
              onChange={(e) => setPurity(Number(e.target.value))}
              className="w-full accent-brand-cyan cursor-pointer h-2 bg-dark-900 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Batch Volume (Tons)</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full bg-dark-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white"
            />
          </div>
        </div>

        {/* AI Output Display */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border-brand-cyan/30 space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> AI Price Recommendation
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
                Confidence: {resData?.confidenceScore || '96.4%'}
              </span>
            </div>

            <div className="py-6 text-center space-y-2">
              <p className="text-xs text-slate-400 font-medium">Recommended Listing Price</p>
              <p className="text-5xl font-black text-white">${resData?.recommendedPrice || 68} <span className="text-lg text-slate-400 font-normal">/ Ton</span></p>
              <p className="text-xs text-brand-cyan font-semibold">Grade Classification: {resData?.purityGrade || 'Industrial Grade'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-dark-900/80 p-4 rounded-xl border border-slate-800">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Min Recommended Fair Price</p>
                <p className="text-lg font-bold text-white">${resData?.minMarketPrice || 58} / Ton</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold">Max Premium Price Cap</p>
                <p className="text-lg font-bold text-brand-green">${resData?.maxMarketPrice || 82} / Ton</p>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-dark-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <Shield className="w-4 h-4 text-brand-cyan flex-shrink-0" />
            <span>{resData?.marketSentiment || 'High Demand — 14% MoM Surge in Algae & Synthetic Fuel Buying'}</span>
          </div>

        </div>

      </div>

    </div>
  );
};
