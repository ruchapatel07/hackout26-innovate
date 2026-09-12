import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Recycle, Gavel, Truck, ShieldCheck, Leaf, TrendingUp, Users, Award } from 'lucide-react';

export const About = () => {
  const { navigatePage } = useAuth();

  return (
    <section id="aboutPage" className="page page-enter bg-[#06150b] text-white min-h-screen relative overflow-hidden">
      
      {/* Background Radial Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 relative z-10 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-extrabold text-emerald-400 tracking-widest uppercase bg-emerald-950/80 px-4 py-1.5 rounded-full border border-emerald-500/30 inline-block shadow-sm">
            ABOUT CARBON CONNECT
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            Building a Smarter & Cleaner <span className="text-emerald-400">CO<sub>2</sub></span> Economy
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            Carbon Connect is the digital marketplace connecting industrial carbon capture facilities with sustainable buyers and specialized CO<sub>2</sub> logistics providers in one transparent digital ecosystem.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-[#0a2214]/90 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition duration-300 shadow-lg shadow-emerald-500/10">
              <Recycle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">CO<sub>2</sub> Marketplace</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Discover verified carbon listings, analyze purity specifications, and participate in transparent commercial carbon trading.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a2214]/90 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition duration-300 shadow-lg shadow-teal-500/10">
              <Gavel className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Transparent Bidding</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Buyers and sellers participate in real-time competitive market auctions backed by automated smart price recommendations.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#0a2214]/90 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition duration-300 group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition duration-300 shadow-lg shadow-emerald-500/10">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Smart Transportation</h3>
            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Direct connection with licensed CO<sub>2</sub> logistics providers for pressurized tanker transport, live route tracking, and safety compliance.
            </p>
          </div>

        </div>

        {/* Impact Stat Highlights */}
        <div className="p-10 rounded-3xl bg-[#082314]/80 border border-emerald-800/40 backdrop-blur-md grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <strong className="text-4xl font-extrabold text-white block">25,000+</strong>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Tons CO₂ Reused</span>
          </div>

          <div className="space-y-1">
            <strong className="text-4xl font-extrabold text-white block">120+</strong>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Verified Suppliers</span>
          </div>

          <div className="space-y-1">
            <strong className="text-4xl font-extrabold text-white block">85+</strong>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Industrial Buyers</span>
          </div>

          <div className="space-y-1">
            <strong className="text-4xl font-extrabold text-white block">100%</strong>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Audited Carbon Credits</span>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6 pt-6">
          <h2 className="text-3xl font-extrabold text-white">Join the Circular Carbon Revolution</h2>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => navigatePage('signup')}
              className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition"
            >
              Get Started
            </button>
            <button
              onClick={() => navigatePage('how-it-works')}
              className="px-8 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 text-white font-bold text-sm border border-emerald-500/40 transition"
            >
              See How It Works
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
