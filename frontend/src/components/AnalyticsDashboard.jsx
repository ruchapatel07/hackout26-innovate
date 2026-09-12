import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart, Layers, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';

export const AnalyticsDashboard = () => {
  const [demandData, setDemandData] = useState([]);

  useEffect(() => {
    fetch('/api/ai/demand-forecast')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setDemandData(data.forecast);
        }
      })
      .catch(console.error);
  }, []);

  const sampleCaptureDistribution = [
    { name: 'Cement Plants', volume: 38500 },
    { name: 'Steel Mills', volume: 29200 },
    { name: 'Power Plants', volume: 44100 },
    { name: 'Direct Air Capture', volume: 12800 }
  ];

  return (
    <div className="space-y-8">
      
      <div className="glass-panel p-6 rounded-2xl border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-brand-green" />
          <span>Market Intelligence & Analytics</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">Real-time marketplace transaction metrics, demand trends, and pricing analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Demand Forecast Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-green" />
              <span>6-Month Forecasted CO₂ Demand (Tons)</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-green/20 text-brand-green">+24.5% Growth</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Bar dataKey="demandTons" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Average Market Price Trend */}
        <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-cyan" />
              <span>Average Price Per Ton Trend ($/Ton)</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">Bullish Demand</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem' }}
                  itemStyle={{ color: '#06b6d4' }}
                />
                <Line type="monotone" dataKey="priceAvg" stroke="#06b6d4" strokeWidth={3} dot={{ fill: '#06b6d4' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
