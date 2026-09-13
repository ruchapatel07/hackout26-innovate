import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Leaf, Handshake, Truck, Recycle, ShieldCheck, ArrowRight, Cpu, Zap } from 'lucide-react';
import { CarbonFlow3DCanvas } from '../components/CarbonFlow3DCanvas';

export const HowItWorks = () => {
  const { navigatePage } = useAuth();

  return (
    <section id="howItWorksPage" className="page page-enter bg-[#06150b] text-white min-h-screen relative overflow-hidden">
      
      {/* Atmosphere radial blur glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 space-y-20">
        
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-black text-emerald-400 tracking-widest uppercase bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/30 inline-block shadow-sm">
            THE CIRCULAR CO₂ ECOSYSTEM
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            How CarbonTrace Works
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            From industrial carbon capture to AI matchmaking, specialized logistics, and final industrial reuse — explore the complete 4-step CO<sub>2</sub> journey.
          </p>
        </div>

        {/* 3D Flow Canvas Container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <span>Interactive Ecosystem Flow</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Real-Time Flow Particle Simulation</span>
          </div>

          <CarbonFlow3DCanvas />
        </div>

        {/* 4 Detailed Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Step 1: Capture */}
          <div className="p-8 rounded-3xl bg-[#0a2214]/90 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-300 shadow-lg shadow-emerald-500/10">
                <Leaf className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-emerald-400 tracking-wider uppercase block">STEP 01</span>
              <h3 className="text-2xl font-bold text-white">Carbon Capture</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Industrial plants (cement, steel, power generation) capture CO<sub>2</sub> emissions and list verified volume, purity (99.9%), and location.
              </p>
            </div>
            
            <div className="pt-6 border-t border-emerald-900/40 mt-6 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>Verified Purity Ratings</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Step 2: Match */}
          <div className="p-8 rounded-3xl bg-[#0a2214]/90 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 group-hover:scale-110 transition duration-300 shadow-lg shadow-teal-500/10">
                <Handshake className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-teal-400 tracking-wider uppercase block">STEP 02</span>
              <h3 className="text-2xl font-bold text-white">AI Matchmaking</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Our AI algorithm calculates optimal buyer-seller pairings based on purity requirements, transport distance, price predictions, and ESG targets.
              </p>
            </div>

            <div className="pt-6 border-t border-emerald-900/40 mt-6 flex items-center justify-between text-xs font-semibold text-teal-400">
              <span>Smart Price Prediction</span>
              <Zap className="w-4 h-4" />
            </div>
          </div>

          {/* Step 3: Transport */}
          <div className="p-8 rounded-3xl bg-[#0a2214]/90 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition duration-300 shadow-lg shadow-emerald-500/10">
                <Truck className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-emerald-400 tracking-wider uppercase block">STEP 03</span>
              <h3 className="text-2xl font-bold text-white">Smart Logistics</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                Licensed CO<sub>2</sub> logistics providers pick up pressurized liquid or gaseous carbon with GPS tracking and safety monitoring.
              </p>
            </div>

            <div className="pt-6 border-t border-emerald-900/40 mt-6 flex items-center justify-between text-xs font-semibold text-emerald-400">
              <span>GPS Route Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Step 4: Reuse */}
          <div className="p-8 rounded-3xl bg-[#0a2214]/90 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-300 group-hover:scale-110 transition duration-300 shadow-lg shadow-green-500/10">
                <Recycle className="w-7 h-7" />
              </div>
              <span className="text-xs font-black text-green-300 tracking-wider uppercase block">STEP 04</span>
              <h3 className="text-2xl font-bold text-white">Industrial Reuse</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                CO<sub>2</sub> is transformed into green products: concrete mineralization, algae farming, synthetic e-fuels, and carbon credits.
              </p>
            </div>

            <div className="pt-6 border-t border-emerald-900/40 mt-6 flex items-center justify-between text-xs font-semibold text-green-300">
              <span>Carbon Credits Verified</span>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* CTA Banner */}
        <div className="p-10 rounded-3xl bg-gradient-to-r from-[#082a17] via-[#041a0e] to-[#072515] border border-emerald-500/40 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to join the circular carbon economy?</h3>
            <p className="text-sm text-slate-300">Connect your industrial plant or green manufacturing facility with verified CO<sub>2</sub> today.</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigatePage('signup')}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition"
            >
              Get Started
            </button>
            <button
              onClick={() => navigatePage('marketplace')}
              className="px-8 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 text-white font-bold text-sm border border-emerald-500/40 transition"
            >
              Explore Marketplace
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
