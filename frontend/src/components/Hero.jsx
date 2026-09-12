import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Factory, Recycle, Activity } from 'lucide-react';

export const Hero = ({ openAiMatchmaker, setActiveTab }) => {
  return (
    <div className="relative overflow-hidden bg-dark-950 pt-8 pb-16 border-b border-slate-800/60">
      
      {/* Radial Gradient Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Ticker Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark-900/90 border border-slate-700/60 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-ping"></span>
          <span className="text-xs font-semibold text-slate-300">
            Circular Economy Engine: <span className="text-brand-green font-bold">18,500+ Tons CO₂ Recycled</span>
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-xs text-slate-400">AI Matchmaking Protocol</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Turn Industrial <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-brand-cyan to-indigo-400">CO₂ Capture</span> Into Tradeable Value
            </h1>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl font-normal leading-relaxed">
              Intelligently connect cement plants, steel mills, and power plants capturing CO₂ with algae farms, greenhouses, e-fuel synthesis, and concrete manufacturers using multi-factor AI scoring.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={openAiMatchmaker}
                className="flex items-center gap-3 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-green to-brand-emerald text-dark-950 font-extrabold text-sm shadow-xl shadow-brand-green/20 hover:shadow-brand-green/40 hover:scale-[1.02] transition duration-200"
              >
                <Sparkles className="w-5 h-5 text-dark-950" />
                <span>Launch AI Matchmaker</span>
                <ArrowRight className="w-4 h-4 text-dark-950" />
              </button>

              <button
                onClick={() => setActiveTab('marketplace')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-dark-900 hover:bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700/80 transition"
              >
                <span>Browse CO₂ Marketplace</span>
              </button>
            </div>

            {/* Micro Specs */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-xl">
              <div>
                <p className="text-2xl font-black text-white">99.8%</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Purity Matching</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand-green">40%</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Purity AI Weight</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand-cyan">25%</p>
                <p className="text-xs text-slate-400 font-medium mt-0.5">Logistics Weight</p>
              </div>
            </div>
          </div>

          {/* Right Visual Graphic Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-brand-green/30">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-brand-green" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Live AI Match Matrix</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-brand-green/20 text-brand-green font-bold">ACTIVE</span>
              </div>

              {/* Orbital Diagram Visual */}
              <div className="py-8 flex items-center justify-center relative">
                
                {/* Central CO2 Sphere */}
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-emerald via-brand-green to-brand-cyan p-1 shadow-2xl shadow-brand-green/30 flex items-center justify-center animate-pulse-slow">
                  <div className="w-full h-full bg-dark-950 rounded-full flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-white">CO₂</span>
                    <span className="text-[9px] text-brand-green font-bold">RECYCLED</span>
                  </div>
                </div>

                {/* Satellite Floating Cards */}
                <div className="absolute top-2 left-2 bg-dark-900/90 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 flex items-center gap-2 shadow-lg">
                  <Factory className="w-3.5 h-3.5 text-brand-green" />
                  <span>Cement Plant (3,500T)</span>
                </div>

                <div className="absolute bottom-2 right-2 bg-dark-900/90 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 flex items-center gap-2 shadow-lg">
                  <Recycle className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Algae Bio-Farm</span>
                </div>
              </div>

              <div className="bg-dark-900/80 rounded-xl p-3.5 border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Match Accuracy:</span>
                  <span className="text-brand-green">97.4% High Purity</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-400">Avg Transport Cost:</span>
                  <span className="text-white">$1,240 / Truckload</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
