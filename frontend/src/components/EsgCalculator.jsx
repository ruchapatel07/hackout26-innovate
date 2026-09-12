import React, { useState } from 'react';
import { Trees, Car, CircleDollarSign, Award, ArrowRight } from 'lucide-react';

export const EsgCalculator = () => {
  const [tons, setTons] = useState(5000);

  // ESG Calculation Logic:
  // 1 Ton CO2 approx equals 45.4 trees grown over 10 years
  const trees = Math.round(tons * 45.4);

  // 1 Ton CO2 approx equals 3,900 km driven by average passenger car
  const kmDriven = (tons * 3900).toLocaleString();

  // Average commercial recycled CO2 value (~$45 per ton)
  const estimatedRevenue = (tons * 45).toLocaleString();

  // Tokens / ISO 14064 Credits (1 Ton = 1 Token)
  const creditTokens = tons.toLocaleString();

  return (
    <div className="bg-[#081d10] border border-emerald-800/50 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
          INTERACTIVE ESG & REVENUE CALCULATOR
        </span>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
          Calculate Your Environmental & Economic Impact
        </h3>
        <p className="text-sm text-slate-300">
          See the tangible ecological and commercial value of recycling captured industrial CO₂.
        </p>
      </div>

      {/* Interactive Slider Input */}
      <div className="bg-[#05140b] p-6 rounded-2xl border border-emerald-900/60 max-w-2xl mx-auto space-y-4 shadow-inner mb-10">
        <div className="flex justify-between items-center text-sm font-bold">
          <span className="text-slate-300">Captured CO₂ Volume:</span>
          <span className="text-emerald-400 text-2xl font-black">{tons.toLocaleString()} <span className="text-sm text-slate-400 font-normal">Tons</span></span>
        </div>

        <input
          type="range"
          min="200"
          max="50000"
          step="200"
          value={tons}
          onChange={(e) => setTons(Number(e.target.value))}
          className="w-full h-3 bg-emerald-950 rounded-lg appearance-none cursor-pointer accent-emerald-400 border border-emerald-800/40"
        />

        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          <span>200 Tons (Small Pilot)</span>
          <span>25,000 Tons (Mid Industrial)</span>
          <span>50,000 Tons (Enterprise Mega-Plant)</span>
        </div>
      </div>

      {/* Impact Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0b2615] border border-emerald-800/40 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Trees className="w-5 h-5" />
          </div>
          <strong className="text-2xl font-black text-white block">{trees.toLocaleString()}</strong>
          <span className="text-xs text-slate-400 font-semibold block">Tree Equivalent Planted</span>
          <p className="text-[11px] text-slate-500">10-year photosynthetic absorption equivalent.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b2615] border border-emerald-800/40 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Car className="w-5 h-5" />
          </div>
          <strong className="text-2xl font-black text-white block">{kmDriven} km</strong>
          <span className="text-xs text-slate-400 font-semibold block">Vehicle Emissions Offset</span>
          <p className="text-[11px] text-slate-500">Passenger car km removed from roads.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b2615] border border-emerald-800/40 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <CircleDollarSign className="w-5 h-5" />
          </div>
          <strong className="text-2xl font-black text-emerald-400 block">${estimatedRevenue}</strong>
          <span className="text-xs text-slate-400 font-semibold block">Market Value Generated</span>
          <p className="text-[11px] text-slate-500">Based on average $45/Ton marketplace index.</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0b2615] border border-emerald-800/40 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <strong className="text-2xl font-black text-white block">{creditTokens}</strong>
          <span className="text-xs text-slate-400 font-semibold block">ISO 14064 Tokens</span>
          <p className="text-[11px] text-slate-500">Verifiable carbon reduction credits.</p>
        </div>
      </div>

    </div>
  );
};
