import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Menu } from 'lucide-react';
import { BrandLogo } from './BrandLogo.jsx';

export const Navbar = () => {
  const { activePage, navigatePage } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleNavClick = (page, options) => {
    navigatePage(page, options);
    setIsMobileOpen(false);
    setIsDropdownOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 150);
  };

  return (
    <header className="navbar-dark border-b border-emerald-900/40 bg-[#07180e]/95 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      {/* Brand Logo */}
      <BrandLogo onClick={() => handleNavClick('home')} />

      {/* Nav Menu */}
      <nav className={`nav-menu-dark flex items-center gap-8 text-sm font-semibold ${isMobileOpen ? 'mobile-open' : ''}`}>
        <button
          onClick={() => handleNavClick('home')}
          className={`py-1 transition ${activePage === 'home' ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-emerald-400'}`}
        >
          Home
        </button>

        <button
          onClick={() => handleNavClick('about')}
          className={`py-1 transition ${activePage === 'about' ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-emerald-400'}`}
        >
          About
        </button>

        <button
          onClick={() => handleNavClick('how-it-works')}
          className={`py-1 transition ${(activePage === 'how-it-works' || activePage === 'howItWorks') ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-emerald-400'}`}
        >
          How it Works
        </button>

        <button
          onClick={() => handleNavClick('marketplace')}
          className={`py-1 transition ${activePage === 'marketplace' ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-emerald-400'}`}
        >
          Marketplace
        </button>

        {/* Login Dropdown with Zero-Gap Hover Protection */}
        <div
          className="relative py-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition duration-200"
          >
            <span>Login Workspace</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div
              className="absolute right-0 top-full pt-1.5 w-60 z-50 before:absolute before:-top-3 before:left-0 before:w-full before:h-4 before:content-['']"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="bg-[#0b2416] border border-emerald-500/40 rounded-2xl p-2 shadow-2xl space-y-1 backdrop-blur-xl">
                <button
                  onClick={() => handleNavClick('login', { role: 'buyer' })}
                  className="w-full text-left p-3 rounded-xl hover:bg-emerald-900/60 text-xs font-semibold text-white flex items-center gap-3 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">B</div>
                  <div>
                    <b className="block text-white">Buyer Portal</b>
                    <span className="text-[10px] text-slate-400">Purchase & Bid CO₂</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('login', { role: 'seller' })}
                  className="w-full text-left p-3 rounded-xl hover:bg-emerald-900/60 text-xs font-semibold text-white flex items-center gap-3 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-black">S</div>
                  <div>
                    <b className="block text-white">Seller Portal</b>
                    <span className="text-[10px] text-slate-400">List & Sell CO₂</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('login', { role: 'transporter' })}
                  className="w-full text-left p-3 rounded-xl hover:bg-emerald-900/60 text-xs font-semibold text-white flex items-center gap-3 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">T</div>
                  <div>
                    <b className="block text-white">Transporter Portal</b>
                    <span className="text-[10px] text-slate-400">CO₂ Logistics</span>
                  </div>
                </button>

                <button
                  onClick={() => handleNavClick('login', { role: 'admin' })}
                  className="w-full text-left p-3 rounded-xl hover:bg-emerald-900/60 text-xs font-semibold text-white flex items-center gap-3 transition"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">A</div>
                  <div>
                    <b className="block text-white">Admin Dashboard</b>
                    <span className="text-[10px] text-slate-400">Platform Management</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Toggle */}
      <button
        className="md:hidden p-2 text-slate-300 hover:text-white"
        onClick={() => setIsMobileOpen((prev) => !prev)}
      >
        <Menu className="w-6 h-6" />
      </button>
    </header>
  );
};
