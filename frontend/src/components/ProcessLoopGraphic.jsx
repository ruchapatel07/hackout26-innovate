import React from 'react';
import { Leaf, Handshake, Recycle, Truck } from 'lucide-react';

export const ProcessLoopGraphic = () => {
  return (
    <div className="relative w-[480px] h-[480px] flex items-center justify-center select-none">
      
      {/* Dynamic Ambient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 via-emerald-500/10 to-teal-500/20 rounded-full blur-3xl animate-pulse pointer-events-none"></div>

      {/* SVG Connecting Paths & Animated Flowing Dots */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 480 480" fill="none">
        <defs>
          <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          <marker id="arrowhead" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
          </marker>

          {/* Filter for SVG element glow */}
          <filter id="svgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Flow Path (Background track) */}
        <circle cx="240" cy="240" r="165" stroke="#064e3b" strokeWidth="2" strokeDasharray="6 6" opacity="0.4" />

        {/* Transport -> Capture Curved Path */}
        <path
          id="path-trans-cap"
          d="M 120,230 A 150,150 0 0,1 220,100"
          stroke="url(#glowGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
          filter="url(#svgGlow)"
        />

        {/* Capture -> Reuse Curved Path */}
        <path
          id="path-cap-reuse"
          d="M 260,100 A 150,150 0 0,1 360,230"
          stroke="url(#glowGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
          filter="url(#svgGlow)"
        />

        {/* Reuse -> Transport Curved Path (Bottom) */}
        <path
          id="path-reuse-trans"
          d="M 345,275 A 150,150 0 0,1 135,275"
          stroke="url(#glowGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          markerEnd="url(#arrowhead)"
          filter="url(#svgGlow)"
        />

        {/* Radial dashed connecting lines to center */}
        <line x1="240" y1="205" x2="240" y2="125" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <line x1="200" y1="250" x2="135" y2="250" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />
        <line x1="280" y1="250" x2="345" y2="250" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

        {/* Animated Glowing Light Orbs traveling along the paths */}
        <circle r="4" fill="#6ee7b7">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 120,230 A 150,150 0 0,1 220,100" />
        </circle>
        <circle r="4" fill="#6ee7b7">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 260,100 A 150,150 0 0,1 360,230" />
        </circle>
        <circle r="4" fill="#6ee7b7">
          <animateMotion dur="3s" repeatCount="indefinite" path="M 345,275 A 150,150 0 0,1 135,275" />
        </circle>
      </svg>

      {/* TOP NODE: Capture (Three.js Flipping 3D Leaf) */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center group cursor-pointer">
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-1 rounded-full bg-emerald-500/40 blur-md group-hover:bg-emerald-400/60 transition duration-300"></div>
          <div className="relative w-[110px] h-[110px] rounded-full bg-[#072414] border-[2.5px] border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] group-hover:scale-105 transition duration-300">
            <Leaf className="w-11 h-11 text-emerald-400 fill-emerald-400/20" />
          </div>
          {/* Prominent High-Contrast Text Badge */}
          <span className="mt-2 text-white font-black text-xs tracking-widest uppercase bg-[#082b17] px-3.5 py-1 rounded-full border border-emerald-400/60 shadow-lg shadow-emerald-950/80">
            Capture
          </span>
        </div>
      </div>

      {/* CENTER NODE: Match (Marketplace Agreement) */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer">
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-2 rounded-full bg-emerald-400/40 blur-xl animate-pulse"></div>
          <div className="relative w-[120px] h-[120px] rounded-full bg-gradient-to-b from-[#0a331c] to-[#041a0d] border-[3px] border-emerald-400 flex flex-col items-center justify-center shadow-[0_0_45px_rgba(16,185,129,0.5)] group-hover:scale-105 transition duration-300">
            <Handshake className="w-11 h-11 text-emerald-400" />
            <span className="text-white font-extrabold text-xs tracking-wider uppercase mt-1">Match</span>
          </div>
        </div>
      </div>

      {/* LEFT NODE: Transport */}
      <div className="absolute left-2 top-[52%] -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer">
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md group-hover:bg-emerald-400/50 transition duration-300"></div>
          <div className="relative w-[110px] h-[110px] rounded-full bg-[#072414] border-[2.5px] border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.35)] group-hover:scale-105 transition duration-300">
            <Truck className="w-11 h-11 text-emerald-400" />
          </div>
          {/* Prominent High-Contrast Text Badge */}
          <span className="mt-2 text-white font-black text-xs tracking-widest uppercase bg-[#082b17] px-3.5 py-1 rounded-full border border-emerald-400/60 shadow-lg shadow-emerald-950/80">
            Transport
          </span>
        </div>
      </div>

      {/* RIGHT NODE: Reuse */}
      <div className="absolute right-2 top-[52%] -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer">
        <div className="relative flex flex-col items-center">
          <div className="absolute -inset-1 rounded-full bg-emerald-500/30 blur-md group-hover:bg-emerald-400/50 transition duration-300"></div>
          <div className="relative w-[110px] h-[110px] rounded-full bg-[#072414] border-[2.5px] border-emerald-400 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.35)] group-hover:scale-105 transition duration-300">
            <Recycle className="w-11 h-11 text-emerald-400" />
          </div>
          {/* Prominent High-Contrast Text Badge */}
          <span className="mt-2 text-white font-black text-xs tracking-widest uppercase bg-[#082b17] px-3.5 py-1 rounded-full border border-emerald-400/60 shadow-lg shadow-emerald-950/80">
            Reuse
          </span>
        </div>
      </div>

    </div>
  );
};
