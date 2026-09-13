import React, { useState, useEffect } from 'react';
import { Leaf } from 'lucide-react';

export const ThreeLeafFlip = () => {
  const [rotationY, setRotationY] = useState(0);

  useEffect(() => {
    // Flip 180° every 1.5 seconds (1500ms)
    const interval = setInterval(() => {
      setRotationY((prev) => prev + 180);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full h-full flex items-center justify-center pointer-events-none select-none"
      style={{ perspective: '800px' }}
    >
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateY(${rotationY}deg)`
        }}
      >
        {/* Exact CarbonTrace Logo Leaf Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute -inset-2 rounded-full bg-emerald-400/30 blur-md animate-pulse"></div>
          <Leaf className="w-12 h-12 text-emerald-400 fill-emerald-400/30 filter drop-shadow-[0_0_15px_rgba(52,211,153,0.9)]" />
        </div>
      </div>
    </div>
  );
};

export default ThreeLeafFlip;
