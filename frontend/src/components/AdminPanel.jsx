import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Factory, Recycle, DollarSign, Layers, Activity } from 'lucide-react';

export const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-xs text-slate-400 py-12 text-center">Loading platform administration metrics...</p>;

  const s = stats?.stats || {};

  return (
    <div className="space-y-8">
      
      <div className="glass-panel p-6 rounded-2xl border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-green" />
            <span>Platform Administration Panel</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Global system overview, total user registration breakdown, and transaction volumes.</p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          System Healthy • Carbon Network Active
        </span>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <p className="text-[11px] text-slate-400 font-semibold">Total Producers</p>
          <p className="text-3xl font-black text-white mt-1">{s.totalProducers ?? 0}</p>
          <p className="text-[10px] text-brand-green mt-1">Cement, Steel, Power</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <p className="text-[11px] text-slate-400 font-semibold">Total Consumers</p>
          <p className="text-3xl font-black text-white mt-1">{s.totalConsumers ?? 0}</p>
          <p className="text-[10px] text-brand-cyan mt-1">Algae, BioFuel, Concrete</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <p className="text-[11px] text-slate-400 font-semibold">Available CO₂ Volume</p>
          <p className="text-3xl font-black text-brand-green mt-1">{(s.totalCO2Available ?? 0).toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 mt-1">Tons Ready to Dispatch</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <p className="text-[11px] text-slate-400 font-semibold">Total Transactions</p>
          <p className="text-3xl font-black text-white mt-1">{s.totalTransactions ?? 0}</p>
          <p className="text-[10px] text-slate-400 mt-1">Executed Contracts</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-slate-800">
          <p className="text-[11px] text-slate-400 font-semibold">Marketplace Volume</p>
          <p className="text-3xl font-black text-emerald-400 mt-1">${(s.marketplaceVolume ?? 0).toLocaleString()}</p>
          <p className="text-[10px] text-slate-400 mt-1">Gross GMV Traded</p>
        </div>

      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Listings */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Platform Listings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase bg-dark-900 text-slate-400">
                <tr>
                  <th className="p-3">Producer</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Purity</th>
                  <th className="p-3">Price/T</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(stats?.recentListings || []).map(l => (
                  <tr key={l.listingId}>
                    <td className="p-3 font-semibold text-white">{l.producerName}</td>
                    <td className="p-3">{l.captureMethod}</td>
                    <td className="p-3 text-brand-green font-bold">{l.purity}%</td>
                    <td className="p-3 font-bold">${l.pricePerTon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Executed Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[10px] uppercase bg-dark-900 text-slate-400">
                <tr>
                  <th className="p-3">Tx ID</th>
                  <th className="p-3">Volume</th>
                  <th className="p-3">Total Cost</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {(stats?.recentTransactions || []).map(t => (
                  <tr key={t.transactionId}>
                    <td className="p-3 font-mono text-slate-400">{t.transactionId}</td>
                    <td className="p-3 font-bold text-white">{t.quantity} Tons</td>
                    <td className="p-3 text-brand-green font-bold">${t.price.toLocaleString()}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
