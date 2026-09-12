import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BrandLogo } from './BrandLogo.jsx';
import { ShieldCheck, Award } from 'lucide-react';

export const Footer = () => {
  const { navigatePage } = useAuth();

  return (
    <footer className="w-full bg-[#041208] text-white border-t border-emerald-900/40 select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        
        {/* 5-Column Grid Structure */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Column 1 (md:col-span-2): Carbon Connect Logo, Tagline & Badges */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo onClick={() => navigatePage('home')} />
            
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-100/70 leading-relaxed max-w-sm">
              CONNECTING CAPTURED CO<sub>2</sub> WITH SUSTAINABLE INDUSTRIES
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold bg-[#082213] px-3 py-1.5 rounded-xl border border-emerald-800/60 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO 14064
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-300 font-semibold bg-[#082213] px-3 py-1.5 rounded-xl border border-emerald-800/60 shadow-sm">
                <Award className="w-3.5 h-3.5 text-emerald-400" /> Gold Standard
              </span>
            </div>
          </div>

          {/* Column 3: Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
              Platform
            </h4>
            <ul className="space-y-3 text-sm text-emerald-100/70 font-medium">
              <li>
                <button onClick={() => navigatePage('home')} className="hover:text-emerald-300 transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => navigatePage('about')} className="hover:text-emerald-300 transition-colors">
                  Our Story
                </button>
              </li>
              <li>
                <button onClick={() => navigatePage('how-it-works')} className="hover:text-emerald-300 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => navigatePage('marketplace')} className="hover:text-emerald-300 transition-colors">
                  CO<sub>2</sub> Marketplace
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Workspaces */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
              Workspaces
            </h4>
            <ul className="space-y-3 text-sm text-emerald-100/70 font-medium">
              <li>
                <button onClick={() => navigatePage('login', { role: 'buyer' })} className="hover:text-emerald-300 transition-colors">
                  Buyer Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigatePage('login', { role: 'seller' })} className="hover:text-emerald-300 transition-colors">
                  Seller Portal
                </button>
              </li>
              <li>
                <button onClick={() => navigatePage('login', { role: 'transporter' })} className="hover:text-emerald-300 transition-colors">
                  Transporter Logistics
                </button>
              </li>
              <li>
                <button onClick={() => navigatePage('login', { role: 'admin' })} className="hover:text-emerald-300 transition-colors">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Resources & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4">
              Resources & Legal
            </h4>
            <ul className="space-y-3 text-sm text-emerald-100/70 font-medium">
              <li>
                <button onClick={() => navigatePage('marketplace')} className="hover:text-emerald-300 transition-colors">
                  AI Matchmaker
                </button>
              </li>
              <li>
                <button onClick={() => navigatePage('about')} className="hover:text-emerald-300 transition-colors">
                  Price Predictor
                </button>
              </li>
              <li>
                <button onClick={() => navigatePage('about')} className="hover:text-emerald-300 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigatePage('about')} className="hover:text-emerald-300 transition-colors">
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-900/50 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-emerald-100/60">
          <p>© 2026 Carbon Connect AI. All rights reserved.</p>

          <div className="flex items-center gap-2 text-emerald-400 font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]"></span>
            <span>CARBON CONNECT NETWORK</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

