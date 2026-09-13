import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ProcessLoopGraphic } from '../components/ProcessLoopGraphic';
import { Hero3DCanvas } from '../components/Hero3DCanvas';
import { ThreeRadarCanvas } from '../components/ThreeRadarCanvas';
import { ThreeGlobeCanvas } from '../components/ThreeGlobeCanvas';
import { ThreeShieldCanvas } from '../components/ThreeShieldCanvas';
import { MarketTicker } from '../components/MarketTicker';
import { EsgCalculator } from '../components/EsgCalculator';
import { InteractiveMap } from '../components/InteractiveMap';
import {
  Building2,
  Zap,
  Sprout,
  FlaskConical,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Factory,
  Recycle,
  Truck,
  Sparkles,
  Activity,
  Cpu,
  Lock
} from 'lucide-react';

export const Home = () => {
  const { navigatePage } = useAuth();

  return (
    <section id="homePage" className="page page-enter bg-[#06150b] text-white min-h-screen relative overflow-hidden">
      
      {/* Background Radial Atmosphere */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Turn Captured <span className="text-emerald-400 inline-block whitespace-nowrap">CO<sub>2</sub></span><br />
              into Valuable Products
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-medium">
              Connect CO₂ suppliers with industries that can reuse captured carbon through one transparent digital ecosystem.
            </p>

            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => navigatePage('signup')}
                className="px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] transition duration-200"
              >
                Find CO₂
              </button>

              <button
                onClick={() => navigatePage('signup')}
                className="px-8 py-3.5 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900/80 text-white font-bold text-sm border border-emerald-500/40 backdrop-blur-md transition"
              >
                List CO₂
              </button>
            </div>
          </div>

          {/* Right Circular Loop Graphic */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <ProcessLoopGraphic />
          </div>

        </div>

        {/* Bottom Stat Cards Bar (Matching Mockup) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16 pt-8 border-t border-emerald-900/40">
          
          <div className="p-6 rounded-2xl bg-[#0a1f12]/80 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition">
            <strong className="text-3xl font-black text-white block">25,000+</strong>
            <span className="text-xs text-slate-400 font-semibold mt-1 block">Tons CO₂ saved</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a1f12]/80 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition">
            <strong className="text-3xl font-black text-white block">120+</strong>
            <span className="text-xs text-slate-400 font-semibold mt-1 block">Suppliers</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a1f12]/80 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition">
            <strong className="text-3xl font-black text-white block">85+</strong>
            <span className="text-xs text-slate-400 font-semibold mt-1 block">Buyers</span>
          </div>

          <div className="p-6 rounded-2xl bg-[#0a1f12]/80 border border-emerald-800/40 backdrop-blur-md hover:border-emerald-500/50 transition">
            <strong className="text-3xl font-black text-white block">340+</strong>
            <span className="text-xs text-slate-400 font-semibold mt-1 block">Successful Matches</span>
          </div>

        </div>

      </div>

      {/* Why Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-emerald-900/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-extrabold text-emerald-400 tracking-wider uppercase block mb-3">WHY CARBONTRACE</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              One connected platform for the complete CO₂ journey.
            </h2>
            <p className="text-sm text-slate-400 mt-4 leading-relaxed">
              From carbon capture and listing to bidding, transportation and final delivery, CarbonTrace keeps the complete circular ecosystem connected.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#0a1f12]/90 border border-emerald-800/40">
              <span className="text-emerald-400 font-extrabold text-xs">01</span>
              <h3 className="font-bold text-white text-base mt-2">Capture</h3>
              <p className="text-xs text-slate-400 mt-1">Connect verified industrial CO₂ sources.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a1f12]/90 border border-emerald-800/40">
              <span className="text-emerald-400 font-extrabold text-xs">02</span>
              <h3 className="font-bold text-white text-base mt-2">Match</h3>
              <p className="text-xs text-slate-400 mt-1">AI-powered buyer and seller matchmaking.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a1f12]/90 border border-emerald-800/40">
              <span className="text-emerald-400 font-extrabold text-xs">03</span>
              <h3 className="font-bold text-white text-base mt-2">Bid</h3>
              <p className="text-xs text-slate-400 mt-1">Transparent commercial market pricing.</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0a1f12]/90 border border-emerald-800/40">
              <span className="text-emerald-400 font-extrabold text-xs">04</span>
              <h3 className="font-bold text-white text-base mt-2">Transport</h3>
              <p className="text-xs text-slate-400 mt-1">Managed end-to-end CO₂ logistics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STEP-BY-STEP ALTERNATING 3D FEATURE SHOWCASE */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-emerald-900/40 space-y-24">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-widest bg-emerald-950 px-3.5 py-1 rounded-full border border-emerald-700/40">
            STEP-BY-STEP PLATFORM WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            End-to-End Circular CO₂ Lifecycle
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Experience our 4-stage digital carbon pipeline driven by real-time WebGL spatial engines.
          </p>
        </div>

        {/* STEP 1: LEFT 3D ANIMATION -> RIGHT CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 bg-[#081f11]/80 rounded-3xl border border-emerald-800/40 p-4 shadow-2xl backdrop-blur-xl">
            <Hero3DCanvas />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs">
              <span>STEP 01</span>
              <span className="text-emerald-500">•</span>
              <span>CAPTURE & SPECIFICATION</span>
            </div>

            <h3 className="text-3xl font-extrabold text-white leading-tight">
              Industrial CO₂ Stream Capture & Verification
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Cement plants, steel smelters, and chemical refineries register their captured flue-gas CO₂ streams into CarbonTrace. Every batch is certified with precise chemical purity grades (96.0% to 99.99%).
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Supports Food Grade (99.9%+), Beverage, and Industrial streams</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Automated continuous emissions telemetry telemetry logging</span>
              </div>
            </div>
          </div>

        </div>

        {/* STEP 2: LEFT CONTENT -> RIGHT 3D ANIMATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-5 lg:order-1 order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 font-extrabold text-xs">
              <span>STEP 02</span>
              <span className="text-teal-500">•</span>
              <span>AI MATCHMAKING ENGINE</span>
            </div>

            <h3 className="text-3xl font-extrabold text-white leading-tight">
              4-Factor AI Multi-Criterion Matchmaker
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Our spatial AI engine calculates optimal match scores by weighting Purity Alignment ($40\%$), Haulage Distance ($25\%$), Unit Price ($20\%$), and Batch Quantity ($15\%$).
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#092414] border border-emerald-800/40 flex justify-between items-center text-xs">
                <span className="text-slate-300">Purity Alignment Weight</span>
                <span className="text-emerald-400 font-extrabold">40% Priority</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#092414] border border-emerald-800/40 flex justify-between items-center text-xs">
                <span className="text-slate-300">Distance & Transport Efficiency</span>
                <span className="text-emerald-400 font-extrabold">25% Priority</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#081f11]/80 rounded-3xl border border-emerald-800/40 p-4 shadow-2xl backdrop-blur-xl lg:order-2 order-1">
            <ThreeRadarCanvas />
          </div>

        </div>

        {/* STEP 3: LEFT 3D ANIMATION -> RIGHT CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 bg-[#081f11]/80 rounded-3xl border border-emerald-800/40 p-4 shadow-2xl backdrop-blur-xl">
            <ThreeGlobeCanvas />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs">
              <span>STEP 03</span>
              <span className="text-emerald-500">•</span>
              <span>CIRCULAR RE-USE PRODUCTS</span>
            </div>

            <h3 className="text-3xl font-extrabold text-white leading-tight">
              High-Value Industrial Carbon Off-taking
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Off-takers utilize captured CO₂ for green concrete mineralization, sustainable aviation e-fuels (SAF), photobioreactor algae cultivation, and carbonate chemical manufacturing.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#092414] border border-emerald-800/40 space-y-1">
                <span className="text-emerald-400 font-black text-sm">Green Concrete</span>
                <p className="text-[11px] text-slate-400">+35% compressive strength</p>
              </div>
              <div className="p-4 rounded-2xl bg-[#092414] border border-emerald-800/40 space-y-1">
                <span className="text-emerald-400 font-black text-sm">E-Fuels & SAF</span>
                <p className="text-[11px] text-slate-400">-80% lifecycle emissions</p>
              </div>
            </div>
          </div>

        </div>

        {/* STEP 4: LEFT CONTENT -> RIGHT 3D ANIMATION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-5 lg:order-1 order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-extrabold text-xs">
              <span>STEP 04</span>
              <span className="text-emerald-500">•</span>
              <span>ISO 14064 & TELEMETRY</span>
            </div>

            <h3 className="text-3xl font-extrabold text-white leading-tight">
              ISO 14064 Certified Audit & Telemetry
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Every completed transaction generates an immutable ISO 14064 carbon credit certificate tokenized on-chain with GPS telemetry for cryogenic tanker haulage.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Audited carbon reduction digital certificates</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-200">
                <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Real-time cryogenic tanker temperature & pressure monitoring</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-[#081f11]/80 rounded-3xl border border-emerald-800/40 p-4 shadow-2xl backdrop-blur-xl lg:order-2 order-1">
            <ThreeShieldCanvas />
          </div>

        </div>

      </section>

      {/* Live Market Marquee Ticker */}
      <MarketTicker />

      {/* Interactive ESG & Revenue Calculator */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <EsgCalculator />
      </section>

      {/* Ecosystem Stakeholder Callouts */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-emerald-900/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-8 rounded-3xl bg-[#092213] border border-emerald-800/50 space-y-4">
            <Factory className="w-8 h-8 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">For CO₂ Producers</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Monetize captured carbon from cement, steel, or chemical facilities. List available volumes and receive competitive buyer bids.
            </p>
            <button
              onClick={() => navigatePage('signup')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition flex items-center gap-2"
            >
              <span>Register as Seller</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-[#092213] border border-emerald-800/50 space-y-4">
            <Recycle className="w-8 h-8 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">For CO₂ Off-takers</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Source high-purity industrial CO₂ with verified chemical specifications for green building, e-fuels, algae, or carbonation.
            </p>
            <button
              onClick={() => navigatePage('signup')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition flex items-center gap-2"
            >
              <span>Register as Buyer</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-8 rounded-3xl bg-[#092213] border border-emerald-800/50 space-y-4">
            <Truck className="w-8 h-8 text-emerald-400" />
            <h3 className="text-xl font-bold text-white">For Transporters</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Provide specialized cryogenic tanker transport for industrial CO₂ shipments. Track routes and fulfill delivery contracts.
            </p>
            <button
              onClick={() => navigatePage('signup')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition flex items-center gap-2"
            >
              <span>Register Transporter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* ── Live Carbon Map Section ──────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            🗺️ Live Geospatial Network
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Track Carbon Flows in <span className="text-emerald-400">Real Time</span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto">
            Interact directly with live industrial CO₂ capture sources, buyer facilities, and inter-state logistics corridors across India.
          </p>
        </div>

        {/* Real Live Interactive Map Card */}
        <div className="bg-[#07190e] rounded-3xl p-4 sm:p-6 border border-emerald-800/40 shadow-2xl shadow-emerald-950/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-emerald-900/40">
            <div>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE INDUSTRIAL CARBON GRID TELEMETRY
              </span>
              <p className="text-xs text-slate-400 mt-0.5">Click any marker to inspect verified capture volume, purity, and pricing.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigatePage('map')}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 hover:scale-[1.02] transition duration-200 flex items-center gap-2"
              >
                <span>Fullscreen Live Map & Routing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <InteractiveMap />
        </div>
      </section>

    </section>
  );
};
