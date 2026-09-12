import React, { useState, useEffect } from 'react';
import { Trophy, Award, ShieldCheck, CheckCircle2, Factory, Recycle, ArrowUpRight } from 'lucide-react';

export const Leaderboard = () => {
  const [producers, setProducers] = useState([]);
  const [consumers, setConsumers] = useState([]);

  useEffect(() => {
    fetch('/api/ai/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducers(data.topProducers);
          setConsumers(data.topConsumers);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-brand-green" />
          <span>Circular Ecosystem Leaderboard</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Recognizing top industrial carbon capture suppliers and innovative utilization buyers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top Producers */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Factory className="w-4 h-4 text-brand-green" />
              <span>Top Carbon Producers (Emitters)</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-green/20 text-brand-green">Ranked by Volume</span>
          </div>

          <div className="space-y-3">
            {producers.length > 0 ? (
              producers.map((p, idx) => (
                <div key={p.userId || idx} className="bg-dark-900/90 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green border border-brand-green/20 flex items-center justify-center font-extrabold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {p.name}
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                      </h4>
                      <p className="text-[11px] text-slate-400">{p.location} • Purity Avg: {p.purityAvg}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-white">{p.totalVolumeTons.toLocaleString()} <span className="text-xs font-normal text-slate-400">Tons</span></p>
                    <span className="text-[10px] font-bold text-brand-green">{p.badge}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">Loading top producers...</p>
            )}
          </div>
        </div>

        {/* Top Consumers */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Recycle className="w-4 h-4 text-brand-cyan" />
              <span>Top Carbon Consumers (Utilization)</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">Ranked by Recycled CO₂</span>
          </div>

          <div className="space-y-3">
            {consumers.length > 0 ? (
              consumers.map((c, idx) => (
                <div key={c.userId || idx} className="bg-dark-900/90 border border-slate-800/80 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 flex items-center justify-center font-extrabold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {c.name}
                        <ShieldCheck className="w-3.5 h-3.5 text-brand-cyan" />
                      </h4>
                      <p className="text-[11px] text-slate-400">{c.location} • Est Carbon Credits: ${c.carbonCredits.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-white">{c.totalPurchasedTons.toLocaleString()} <span className="text-xs font-normal text-slate-400">Tons</span></p>
                    <span className="text-[10px] font-bold text-brand-cyan">{c.badge}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">Loading top consumers...</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
