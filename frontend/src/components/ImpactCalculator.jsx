import React, { useState, useEffect } from 'react';
import { Calculator, Trees, Car, Home, DollarSign, Award, ArrowUpRight } from 'lucide-react';

export const ImpactCalculator = () => {
  const [tons, setTons] = useState(2500);
  const [impact, setImpact] = useState(null);

  const calculate = async (qty) => {
    try {
      const res = await fetch('/api/ai/impact-calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: qty })
      });
      const data = await res.json();
      if (data.success) {
        setImpact(data.impact);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    calculate(tons);
  }, [tons]);

  return (
    <div className="space-y-8">
      
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calculator className="w-6 h-6 text-brand-green" />
          <span>Carbon Impact & Credit Estimator</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Quantify environmental net emission reductions, equivalent carbon credits, and ESG ratings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Controls */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white">Carbon Capture Input</h3>
          
          <div>
            <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
              <span>Recycled CO₂ Volume:</span>
              <span className="text-brand-green font-extrabold text-base">{Number(tons).toLocaleString()} Tons</span>
            </div>
            <input
              type="range"
              min="100"
              max="25000"
              step="100"
              value={tons}
              onChange={(e) => setTons(Number(e.target.value))}
              className="w-full accent-brand-green cursor-pointer h-2 bg-dark-900 rounded-lg"
            />
          </div>

          <div className="bg-dark-900/80 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Gross Carbon Offsets:</span>
              <span className="text-white font-bold">{Number(tons).toLocaleString()} MT CO₂e</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Market Carbon Credit Rate:</span>
              <span className="text-brand-green font-bold">$35.00 / Credit Token</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Verification Standard:</span>
              <span className="text-white font-bold">Verra / Gold Standard (VCS)</span>
            </div>
          </div>
        </div>

        {/* Impact Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="glass-panel p-5 rounded-2xl border-brand-green/30 space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-brand-green/10 text-brand-green">
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 font-semibold">Carbon Credit Value (USD)</p>
            <p className="text-3xl font-black text-white">${impact?.carbonCreditValueUSD ? impact.carbonCreditValueUSD.toLocaleString() : '0'}</p>
            <p className="text-[11px] text-brand-green flex items-center gap-1 font-medium pt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Direct Tradable Asset Revenue</span>
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-brand-cyan/10 text-brand-cyan">
              <Car className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 font-semibold">Cars Removed From Road / Yr</p>
            <p className="text-3xl font-black text-white">{impact?.carsRemovedYearly ? impact.carsRemovedYearly.toLocaleString() : '0'}</p>
            <p className="text-[11px] text-slate-400 font-medium pt-1">Based on avg 4.6 MT CO₂e per vehicle</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-emerald-500/10 text-emerald-400">
              <Trees className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 font-semibold">Forest Tree Acres Equivalent</p>
            <p className="text-3xl font-black text-white">{impact?.treeAcresPlanted ? impact.treeAcresPlanted.toLocaleString() : '0'}</p>
            <p className="text-[11px] text-slate-400 font-medium pt-1">Mature forest sequestration power</p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border-slate-800 space-y-2">
            <div className="p-2.5 w-fit rounded-xl bg-indigo-500/10 text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <p className="text-xs text-slate-400 font-semibold">ESG Rating Score Uplift</p>
            <p className="text-3xl font-black text-indigo-400">{impact?.esgRatingContribution || '+4.8 ESG Points'}</p>
            <p className="text-[11px] text-slate-400 font-medium pt-1">Corporate Sustainability Index</p>
          </div>

        </div>

      </div>

    </div>
  );
};
