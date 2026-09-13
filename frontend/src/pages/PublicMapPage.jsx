import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { InteractiveMap } from '../components/InteractiveMap';
import { TransportationMap } from '../components/TransportationMap';
import { MapPin, Route, ArrowRight, ShieldCheck, Activity, Zap } from 'lucide-react';

export const PublicMapPage = () => {
  const { navigatePage } = useAuth();
  const [activeTab, setActiveTab] = useState('grid'); // 'grid' | 'transport'

  return (
    <div className="min-h-screen bg-[#040d07] text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-900/40 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Live Geospatial Telemetry
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              CarbonTrace <span className="text-emerald-400">Live Maps & Routing</span>
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Real-time geospatial distribution of verified CO₂ capture facilities, commercial buyer sinks, and Dijkstra-optimized inter-state transportation corridors across India.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-2xl p-1.5 shadow-xl">
            <button
              onClick={() => setActiveTab('grid')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 ${
                activeTab === 'grid'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Carbon Grid (Emitters & Sinks)</span>
            </button>

            <button
              onClick={() => setActiveTab('transport')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 ${
                activeTab === 'transport'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Route className="w-4 h-4" />
              <span>Transport Route Planner</span>
            </button>
          </div>
        </div>

        {/* Quick telemetry statistics bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#07190e] border border-emerald-500/20 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Active Producers
            </div>
            <div className="text-2xl font-black text-white mt-1">8 Facilities</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">flue-gas & biogenic capture</div>
          </div>

          <div className="bg-[#07190e] border border-cyan-500/20 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Commercial Sinks
            </div>
            <div className="text-2xl font-black text-white mt-1">5 Plants</div>
            <div className="text-[10px] text-cyan-400 mt-0.5">curing, biotech & synfuel</div>
          </div>

          <div className="bg-[#07190e] border border-emerald-500/20 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> Transit Hubs
            </div>
            <div className="text-2xl font-black text-white mt-1">13 Hubs</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Dijkstra shortest path</div>
          </div>

          <div className="bg-[#07190e] border border-amber-500/20 rounded-2xl p-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Route className="w-3.5 h-3.5 text-amber-400" /> Total Listed CO₂
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">42,800 Tons</div>
            <div className="text-[10px] text-slate-400 mt-0.5">available across India</div>
          </div>
        </div>

        {/* Map View Display */}
        <div className="bg-[#06140b] border border-emerald-500/20 rounded-3xl p-4 sm:p-6 shadow-2xl">
          {activeTab === 'grid' ? (
            <InteractiveMap />
          ) : (
            <TransportationMap />
          )}
        </div>

        {/* Call to action footer */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-[#071f11] to-[#0a2f1a]">
          <div>
            <h3 className="text-lg font-black text-white">Ready to trade or transport captured carbon?</h3>
            <p className="text-xs text-slate-300 mt-1">
              Join enterprise buyers, emitters, and certified cryogenic fleet operators on CarbonTrace.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigatePage('marketplace')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition"
            >
              Browse Marketplace
            </button>
            <button
              onClick={() => navigatePage('signup')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/30 transition flex items-center gap-1.5"
            >
              Get Started <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
