import React from 'react';
import { Leaf } from 'lucide-react';

export const BrandLogo = ({ onClick, className = "" }) => {
  return (
    <div className={`brand flex items-center gap-2.5 cursor-pointer ${className}`} onClick={onClick}>
      {/* Clean Navbar Logo Badge (Matching User Mockup) */}
      <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 flex-shrink-0">
        <Leaf className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
      </div>
      <div className="brand-name flex items-center gap-1 text-lg select-none">
        <b className="font-extrabold text-white !text-white text-lg leading-none">Carbon</b>
<<<<<<< HEAD
        <span className="font-bold text-emerald-400 text-lg leading-none">Connect</span>
=======
        <span className="font-bold text-emerald-400 text-lg leading-none">Trace</span>
>>>>>>> 90445d9 (Update Carbon Connect full stack application)
      </div>
    </div>
  );
};

export default BrandLogo;
