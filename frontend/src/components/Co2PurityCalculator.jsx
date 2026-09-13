import React, { useState, useMemo } from 'react';
import { FlaskConical, CheckCircle2, XCircle, AlertTriangle, Droplets, Thermometer, Wind, Award, RefreshCw } from 'lucide-react';

// CO2 Purity Grade Standards
const GRADES = [
  {
    name: 'Food & Beverage Grade',
    minPurity: 99.9,
    color: '#10b981',
    glow: 'rgba(16,185,129,0.6)',
    bg: '#0b2615',
    border: 'rgba(16,185,129,0.4)',
    uses: ['Carbonated drinks', 'Food packaging', 'Brewery & winery', 'Dry ice production'],
    icon: '🥤',
    certReq: 'FDA / EU Food Safety Required'
  },
  {
    name: 'Medical / Pharmaceutical Grade',
    minPurity: 99.5,
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.6)',
    bg: '#071922',
    border: 'rgba(6,182,212,0.4)',
    uses: ['Medical gas (surgical)', 'Pharmaceutical processing', 'Cryotherapy', 'Laparoscopy'],
    icon: '🏥',
    certReq: 'USP / ISO 8573 Required'
  },
  {
    name: 'Industrial Grade A',
    minPurity: 99.0,
    color: '#8b5cf6',
    glow: 'rgba(139,92,246,0.6)',
    bg: '#130d20',
    border: 'rgba(139,92,246,0.4)',
    uses: ['Chemical synthesis', 'Enhanced oil recovery', 'Welding & metal cutting', 'pH control'],
    icon: '⚗️',
    certReq: 'ISO 8573-1 Class 1'
  },
  {
    name: 'Industrial Grade B',
    minPurity: 95.0,
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.6)',
    bg: '#1a1205',
    border: 'rgba(245,158,11,0.4)',
    uses: ['Concrete curing', 'Water treatment', 'Greenhouse enrichment', 'Fire suppression'],
    icon: '🏭',
    certReq: 'ISO 8573-1 Class 2'
  },
  {
    name: 'Raw / Utility Grade',
    minPurity: 85.0,
    color: '#6b7280',
    glow: 'rgba(107,114,128,0.4)',
    bg: '#111827',
    border: 'rgba(107,114,128,0.3)',
    uses: ['Landfill gas processing', 'Pre-purification feedstock', 'Soil remediation'],
    icon: '🔧',
    certReq: 'No certification required'
  }
];

const IMPURITIES = [
  { key: 'water', label: 'Water Vapor (H₂O)', unit: 'ppm', max: 20, impact: 0.003 },
  { key: 'o2', label: 'Oxygen (O₂)', unit: 'ppm', max: 30, impact: 0.002 },
  { key: 'n2', label: 'Nitrogen (N₂)', unit: 'ppm', max: 200, impact: 0.001 },
  { key: 'h2s', label: 'Hydrogen Sulfide (H₂S)', unit: 'ppb', max: 100, impact: 0.01 },
  { key: 'co', label: 'Carbon Monoxide (CO)', unit: 'ppm', max: 10, impact: 0.005 },
  { key: 'oil', label: 'Oil & Hydrocarbons', unit: 'ppm', max: 5, impact: 0.008 },
];

const getGrade = (purity) => {
  for (const g of GRADES) {
    if (purity >= g.minPurity) return g;
  }
  return { name: 'Below Minimum Standard', color: '#ef4444', glow: 'rgba(239,68,68,0.4)', bg: '#1f0707', border: 'rgba(239,68,68,0.3)', uses: ['Not suitable for commercial use'], icon: '❌', certReq: 'Fails all grade standards' };
};

export const Co2PurityCalculator = () => {
  const [rawPurity, setRawPurity] = useState(99.5);
  const [impurities, setImpurities] = useState({ water: 8, o2: 10, n2: 50, h2s: 20, co: 3, oil: 1 });
  const [pressureBar, setPressureBar] = useState(50);
  const [tempC, setTempC] = useState(20);

  const effectivePurity = useMemo(() => {
    let deduction = 0;
    for (const imp of IMPURITIES) {
      const val = impurities[imp.key] || 0;
      deduction += (val / imp.max) * imp.impact * 100;
    }
    // Temperature penalty (deviation from 20°C)
    const tempPenalty = Math.abs(tempC - 20) * 0.001;
    // Pressure bonus/penalty
    const pressureEffect = pressureBar > 100 ? -0.02 : 0;
    return Math.max(0, Math.min(100, rawPurity - deduction - tempPenalty + pressureEffect));
  }, [rawPurity, impurities, pressureBar, tempC]);

  const grade = getGrade(effectivePurity);
  const marketValue = effectivePurity >= 99.9 ? 85 : effectivePurity >= 99.5 ? 70 : effectivePurity >= 99.0 ? 55 : effectivePurity >= 95 ? 40 : 20;

  const reset = () => {
    setRawPurity(99.5);
    setImpurities({ water: 8, o2: 10, n2: 50, h2s: 20, co: 3, oil: 1 });
    setPressureBar(50);
    setTempC(20);
  };

  return (
    <div className="content-enter space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FlaskConical className="w-6 h-6 text-emerald-400" />
            <span>CO₂ Purity Calculator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Enter your CO₂ batch parameters to determine grade, market value, and commercial eligibility.</p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition">
          <RefreshCw className="w-4 h-4" /> Reset
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Inputs Column ── */}
        <div className="xl:col-span-2 space-y-4">

          {/* Raw CO2 Purity Slider */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-emerald-400" /> Base CO₂ Concentration
              </label>
              <span className="text-2xl font-black text-emerald-400">{rawPurity.toFixed(1)}<span className="text-sm text-slate-400 font-normal">%</span></span>
            </div>
            <input type="range" min="80" max="100" step="0.1" value={rawPurity}
              onChange={e => setRawPurity(Number(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-emerald-400 bg-slate-800" />
            <div className="flex justify-between text-[10px] text-slate-500 mt-1.5">
              <span>80% (Raw)</span><span>95% (Industrial)</span><span>99% (Pharma)</span><span>100% (Pure)</span>
            </div>
          </div>

          {/* Process Conditions */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" /> Process Conditions
            </h4>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-slate-400">Storage Pressure</span>
                  <span className="text-sm font-bold text-cyan-400">{pressureBar} bar</span>
                </div>
                <input type="range" min="1" max="200" step="1" value={pressureBar}
                  onChange={e => setPressureBar(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-cyan-400 bg-slate-800" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-slate-400">Temperature</span>
                  <span className="text-sm font-bold text-orange-400">{tempC}°C</span>
                </div>
                <input type="range" min="-30" max="60" step="1" value={tempC}
                  onChange={e => setTempC(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-orange-400 bg-slate-800" />
              </div>
            </div>
          </div>

          {/* Impurity Inputs */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h4 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Wind className="w-4 h-4 text-purple-400" /> Contaminant Levels
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {IMPURITIES.map(imp => {
                const val = impurities[imp.key];
                const pct = val / imp.max;
                const color = pct > 0.8 ? '#ef4444' : pct > 0.5 ? '#f59e0b' : '#10b981';
                return (
                  <div key={imp.key}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs text-slate-400">{imp.label}</span>
                      <span className="text-xs font-bold" style={{ color }}>{val} {imp.unit}</span>
                    </div>
                    <input type="range" min="0" max={imp.max} step={imp.max > 50 ? 5 : 1} value={val}
                      onChange={e => setImpurities(prev => ({ ...prev, [imp.key]: Number(e.target.value) }))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-800"
                      style={{ accentColor: color }} />
                    <div className="flex justify-between text-[9px] text-slate-600 mt-0.5">
                      <span>0</span><span>Max allowed: {imp.max} {imp.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Results Column ── */}
        <div className="space-y-4">

          {/* Effective Purity Result */}
          <div className="rounded-2xl p-6 border text-center relative overflow-hidden"
            style={{ background: grade.bg, borderColor: grade.border, boxShadow: `0 0 40px ${grade.glow}` }}>
            <div className="text-4xl mb-2">{grade.icon}</div>
            <div className="text-5xl font-black mb-1" style={{ color: grade.color }}>
              {effectivePurity.toFixed(2)}<span className="text-xl text-slate-400 font-normal">%</span>
            </div>
            <div className="text-xs text-slate-400 mb-4">Effective CO₂ Purity</div>
            <div className="font-bold text-sm mb-1" style={{ color: grade.color }}>{grade.name}</div>
            <div className="text-[10px] text-slate-500">{grade.certReq}</div>

            {/* Purity Bar */}
            <div className="mt-4 h-3 bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${effectivePurity}%`, background: `linear-gradient(90deg, ${grade.color}, ${grade.color}aa)` }} />
            </div>
            <div className="flex justify-between text-[9px] text-slate-600 mt-1">
              <span>0%</span><span>95%</span><span>99%</span><span>100%</span>
            </div>
          </div>

          {/* Market Value */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 text-center">
            <Award className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-black text-emerald-400">${marketValue}/Ton</div>
            <div className="text-xs text-slate-400 mt-1">Estimated Market Price</div>
            <div className="mt-3 text-xs text-slate-500 leading-relaxed">
              Based on current CarbonTrace marketplace index for {grade.name}.
            </div>
          </div>

          {/* Eligible Applications */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Eligible Applications</h4>
            <div className="space-y-2">
              {grade.uses.map((use, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: grade.color }} />
                  {use}
                </div>
              ))}
            </div>
          </div>

          {/* Grade Ladder */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Purity Ladder</h4>
            <div className="space-y-1.5">
              {GRADES.map(g => (
                <div key={g.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: g.color, boxShadow: effectivePurity >= g.minPurity ? `0 0 6px ${g.color}` : 'none' }} />
                  <span className="text-[10px] flex-1" style={{ color: effectivePurity >= g.minPurity ? g.color : '#4b5563' }}>
                    {g.name}
                  </span>
                  <span className="text-[9px] text-slate-600">≥{g.minPurity}%</span>
                  {effectivePurity >= g.minPurity
                    ? <CheckCircle2 className="w-3 h-3" style={{ color: g.color }} />
                    : <XCircle className="w-3 h-3 text-slate-700" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
