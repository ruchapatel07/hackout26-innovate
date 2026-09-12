import React from 'react';
import { Activity, ShieldCheck, ArrowRight } from 'lucide-react';

const TICKER_ITEMS = [
  { code: 'MUM-998', grade: '99.8% Food Grade', volume: '1,500 Tons', price: '$42/Ton', status: 'MATCHED TO BEVERAGE BOTTLER', location: 'Mumbai Industrial Corridor' },
  { code: 'GUJ-985', grade: '98.5% E-Fuel Grade', volume: '4,200 Tons', price: '$38/Ton', status: 'DISPATCHED VIA TANKER', location: 'Gujarat Energy Hub' },
  { code: 'MH-999', grade: '99.9% Pharma Grade', volume: '800 Tons', price: '$52/Ton', status: 'ISO 14064 VERIFIED', location: 'Pune Biotech Park' },
  { code: 'RAJ-960', grade: '96.0% Concrete Grade', volume: '12,000 Tons', price: '$28/Ton', status: 'CONTRACT SIGNED', location: 'Rajasthan Cement Plant' },
  { code: 'KA-990', grade: '99.0% Agricultural Grade', volume: '2,800 Tons', price: '$35/Ton', status: 'MATCHED TO ALGAE BIO-FARM', location: 'Bengaluru Tech Corridor' },
];

export const MarketTicker = () => {
  return (
    <div className="w-full bg-[#040f08] border-y border-emerald-900/40 py-3 overflow-hidden relative">
      <div className="flex items-center gap-6 animate-marquee whitespace-nowrap">
        {TICKER_ITEMS.concat(TICKER_ITEMS).map((item, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-xl bg-[#092214]/90 border border-emerald-800/40 text-xs shadow-sm flex-shrink-0"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-extrabold text-white">{item.code}</span>
            <span className="text-slate-400">•</span>
            <span className="text-emerald-300 font-semibold">{item.grade}</span>
            <span className="text-slate-400">•</span>
            <span className="text-white font-bold">{item.volume}</span>
            <span className="text-emerald-400 font-black">@{item.price}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-[10px] text-emerald-400 border border-emerald-600/40 font-bold uppercase">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
