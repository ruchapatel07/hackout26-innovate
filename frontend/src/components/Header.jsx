import React from 'react';
import { Activity, Sparkles, MapPin, Calculator, TrendingUp, BarChart3, Trophy, ShieldCheck, User, LogOut, Layers } from 'lucide-react';
import { BrandLogo } from './BrandLogo.jsx';

export const Header = ({ activeTab, setActiveTab, openAiMatchmaker, openAuthModal, user, logout }) => {
  const navItems = [
    { id: 'marketplace', label: 'Marketplace', icon: Layers },
    { id: 'map', label: 'Interactive Map', icon: MapPin },
    { id: 'impact', label: 'Impact Calculator', icon: Calculator },
    { id: 'pricing', label: 'Price AI', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'admin', label: 'Admin Panel', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 bg-dark-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <BrandLogo onClick={() => setActiveTab('marketplace')} />

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5 bg-dark-900/60 p-1.5 rounded-2xl border border-slate-800/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-green/20 to-brand-cyan/20 text-white border border-brand-green/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-green' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & User Control */}
          <div className="flex items-center gap-3">
            {/* AI Matchmaker Button */}
            <button
              onClick={openAiMatchmaker}
              className="relative group overflow-hidden rounded-xl p-[1px] font-semibold text-xs transition-all duration-300 shadow-lg shadow-brand-green/20 hover:shadow-brand-green/40"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-brand-green via-brand-cyan to-brand-indigo animate-pulse-slow"></span>
              <span className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dark-950 text-white group-hover:bg-opacity-90 transition">
                <Sparkles className="w-4 h-4 text-brand-green animate-spin-slow" />
                <span>AI Matchmaker</span>
              </span>
            </button>

            {/* Auth status */}
            {user ? (
              <div className="flex items-center gap-3 bg-dark-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-green to-brand-cyan flex items-center justify-center font-bold text-dark-950 text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-200 leading-none">{user.name}</p>
                  <p className="text-[10px] text-brand-green capitalize font-semibold mt-0.5">{user.role}</p>
                </div>
                <button
                  onClick={logout}
                  title="Logout"
                  className="text-slate-400 hover:text-rose-400 p-1.5 rounded-lg hover:bg-slate-800/50 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex xl:hidden overflow-x-auto pb-3 gap-2 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap border ${
                  isActive
                    ? 'bg-brand-green/20 text-brand-green border-brand-green/30'
                    : 'bg-dark-900 text-slate-400 border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
