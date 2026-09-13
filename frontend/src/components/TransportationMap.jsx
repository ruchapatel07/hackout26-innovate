import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  Truck, MapPin, Navigation, Route, Zap, AlertTriangle,
  CheckCircle2, ArrowRight, RefreshCw, Info
} from 'lucide-react';

// ─── City/Plant Graph Nodes ────────────────────────────────────────────────
const NODES = {
  DEL: { id: 'DEL', name: 'Delhi NCR Hub', lat: 28.6139, lng: 77.2090, type: 'hub', icon: '🏙️' },
  MUM: { id: 'MUM', name: 'Mumbai Port', lat: 19.0760, lng: 72.8777, type: 'hub', icon: '🏙️' },
  AHM: { id: 'AHM', name: 'Ahmedabad Plant', lat: 23.0225, lng: 72.5714, type: 'plant', icon: '🏭' },
  BAN: { id: 'BAN', name: 'Bangalore Tech', lat: 12.9716, lng: 77.5946, type: 'hub', icon: '🏙️' },
  HYD: { id: 'HYD', name: 'Hyderabad Lab', lat: 17.3850, lng: 78.4867, type: 'lab', icon: '🔬' },
  CHE: { id: 'CHE', name: 'Chennai Port', lat: 13.0827, lng: 80.2707, type: 'port', icon: '⚓' },
  PUN: { id: 'PUN', name: 'Pune Pharma', lat: 18.5204, lng: 73.8567, type: 'plant', icon: '💊' },
  JAM: { id: 'JAM', name: 'Jamshedpur Steel', lat: 22.8046, lng: 86.2029, type: 'plant', icon: '⚙️' },
  JIP: { id: 'JIP', name: 'Jaipur Depot', lat: 26.9124, lng: 75.7873, type: 'depot', icon: '📦' },
  NAG: { id: 'NAG', name: 'Nagpur Junction', lat: 21.1458, lng: 79.0882, type: 'hub', icon: '🔀' },
  SUR: { id: 'SUR', name: 'Surat CO₂ Hub', lat: 21.1702, lng: 72.8311, type: 'plant', icon: '🏭' },
  LUC: { id: 'LUC', name: 'Lucknow Depot', lat: 26.8467, lng: 80.9462, type: 'depot', icon: '📦' },
  KOL: { id: 'KOL', name: 'Kolkata Docks', lat: 22.5726, lng: 88.3639, type: 'port', icon: '⚓' },
};

// ─── Road Edges (bidirectional, distance in km) ────────────────────────────
const EDGES = [
  { u: 'DEL', v: 'JIP', d: 280 },
  { u: 'DEL', v: 'LUC', d: 555 },
  { u: 'DEL', v: 'JAM', d: 1100 },
  { u: 'JIP', v: 'AHM', d: 660 },
  { u: 'JIP', v: 'DEL', d: 280 },
  { u: 'AHM', v: 'MUM', d: 530 },
  { u: 'AHM', v: 'SUR', d: 265 },
  { u: 'AHM', v: 'JIP', d: 660 },
  { u: 'SUR', v: 'MUM', d: 280 },
  { u: 'SUR', v: 'AHM', d: 265 },
  { u: 'MUM', v: 'PUN', d: 150 },
  { u: 'MUM', v: 'SUR', d: 280 },
  { u: 'MUM', v: 'NAG', d: 835 },
  { u: 'PUN', v: 'MUM', d: 150 },
  { u: 'PUN', v: 'BAN', d: 840 },
  { u: 'PUN', v: 'HYD', d: 560 },
  { u: 'PUN', v: 'NAG', d: 705 },
  { u: 'NAG', v: 'HYD', d: 500 },
  { u: 'NAG', v: 'JAM', d: 860 },
  { u: 'NAG', v: 'MUM', d: 835 },
  { u: 'HYD', v: 'BAN', d: 570 },
  { u: 'HYD', v: 'CHE', d: 630 },
  { u: 'HYD', v: 'NAG', d: 500 },
  { u: 'BAN', v: 'CHE', d: 350 },
  { u: 'BAN', v: 'HYD', d: 570 },
  { u: 'CHE', v: 'BAN', d: 350 },
  { u: 'CHE', v: 'HYD', d: 630 },
  { u: 'LUC', v: 'DEL', d: 555 },
  { u: 'LUC', v: 'JAM', d: 820 },
  { u: 'LUC', v: 'NAG', d: 1095 },
  { u: 'JAM', v: 'KOL', d: 260 },
  { u: 'JAM', v: 'NAG', d: 860 },
  { u: 'KOL', v: 'JAM', d: 260 },
];

// Build adjacency list
const buildGraph = () => {
  const graph = {};
  Object.keys(NODES).forEach(id => { graph[id] = []; });
  EDGES.forEach(({ u, v, d }) => {
    graph[u].push({ to: v, dist: d });
    graph[v].push({ to: u, dist: d });
  });
  return graph;
};

// ─── Dijkstra's Algorithm ──────────────────────────────────────────────────
const dijkstra = (graph, start, end) => {
  const dist = {};
  const prev = {};
  const visited = new Set();
  Object.keys(graph).forEach(n => { dist[n] = Infinity; prev[n] = null; });
  dist[start] = 0;

  const pq = [{ node: start, cost: 0 }];

  while (pq.length > 0) {
    pq.sort((a, b) => a.cost - b.cost);
    const { node } = pq.shift();
    if (visited.has(node)) continue;
    visited.add(node);
    if (node === end) break;

    for (const { to, dist: d } of (graph[node] || [])) {
      const newDist = dist[node] + d;
      if (newDist < dist[to]) {
        dist[to] = newDist;
        prev[to] = node;
        pq.push({ node: to, cost: newDist });
      }
    }
  }

  // Reconstruct path
  const path = [];
  let cur = end;
  while (cur) { path.unshift(cur); cur = prev[cur]; }
  if (path[0] !== start) return null; // No path
  return { path, totalDist: dist[end] };
};

// Find K alternative paths (variation: block nodes from shortest path one at a time)
const findAlternativePaths = (graph, start, end) => {
  const graph2 = JSON.parse(JSON.stringify(graph));
  const results = [];

  // Path 1: Shortest
  const p1 = dijkstra(graph2, start, end);
  if (!p1) return [];
  results.push({ ...p1, label: 'Shortest Route', color: '#10b981', rank: 1 });

  // Path 2: Block one intermediate node from path 1
  if (p1.path.length > 2) {
    const midNode = p1.path[Math.floor(p1.path.length / 2)];
    const g2 = JSON.parse(JSON.stringify(graph));
    delete g2[midNode];
    Object.keys(g2).forEach(n => {
      g2[n] = g2[n].filter(e => e.to !== midNode);
    });
    const p2 = dijkstra(g2, start, end);
    if (p2 && p2.totalDist !== p1.totalDist) {
      results.push({ ...p2, label: 'Alternative Route A', color: '#f59e0b', rank: 2 });
    }
  }

  // Path 3: Block another intermediate node
  if (p1.path.length > 3) {
    const midNode2 = p1.path[1];
    const g3 = JSON.parse(JSON.stringify(graph));
    delete g3[midNode2];
    Object.keys(g3).forEach(n => {
      g3[n] = g3[n].filter(e => e.to !== midNode2);
    });
    const p3 = dijkstra(g3, start, end);
    if (p3 && p3.totalDist !== p1.totalDist && (!results[1] || p3.totalDist !== results[1].totalDist)) {
      results.push({ ...p3, label: 'Alternative Route B', color: '#8b5cf6', rank: 3 });
    }
  }

  return results;
};

// ─── Haversine distance (for display) ──────────────────────────────────────
const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ─── Icons ─────────────────────────────────────────────────────────────────
const makeIcon = (color, emoji) => L.divIcon({
  className: 'custom-transit-icon',
  html: `<div style="background:${color};width:34px;height:34px;border-radius:50%;border:2px solid #ffffff;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 0 14px ${color}aa;cursor:pointer;">${emoji}</div>`,
  iconSize: [34, 34], iconAnchor: [17, 17]
});

const MapFitter = ({ paths }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const t = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    if (paths.length === 0) return () => clearTimeout(t);
    const allCoords = paths[0].path.map(id => [NODES[id].lat, NODES[id].lng]);
    if (allCoords.length > 1) {
      try {
        map.fitBounds(allCoords, { padding: [40, 40], duration: 1 });
      } catch (e) {
        console.warn('Map fitBounds error', e);
      }
    }
    return () => clearTimeout(t);
  }, [paths, map]);
  return null;
};

// ─── Main Component ─────────────────────────────────────────────────────────
export const TransportationMap = () => {
  const [source, setSource] = useState('DEL');
  const [destination, setDestination] = useState('CHE');
  const [paths, setPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [calculated, setCalculated] = useState(false);

  const graph = buildGraph();

  const handleCalculate = useCallback(() => {
    if (source === destination) return;
    const results = findAlternativePaths(graph, source, destination);
    setPaths(results);
    setSelectedPath(results[0] || null);
    setCalculated(true);
  }, [source, destination]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  // Straight-line distance
  const straightLine = source !== destination
    ? haversine(NODES[source].lat, NODES[source].lng, NODES[destination].lat, NODES[destination].lng)
    : 0;

  const nodeIds = Object.keys(NODES);

  const estTime = (km) => {
    const hrs = km / 60; // avg 60 km/h for trucks
    if (hrs < 1) return `${Math.round(hrs * 60)} mins`;
    return `${Math.floor(hrs)}h ${Math.round((hrs % 1) * 60)}min`;
  };

  const estCost = (km) => `₹${Math.round(km * 45).toLocaleString()}`;

  return (
    <div className="content-enter space-y-5">

      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
          <Route className="w-6 h-6 text-emerald-400" />
          CO₂ Transport Route Planner
        </h2>
        <p className="text-xs text-slate-400">
          Select source & destination to find the shortest CO₂ delivery route using Dijkstra's algorithm.
        </p>
      </div>

      {/* Source / Destination Selector */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">

          {/* Source */}
          <div>
            <label className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Source (Pickup)
            </label>
            <select
              value={source}
              onChange={e => { setSource(e.target.value); setCalculated(false); setPaths([]); }}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-emerald-500"
            >
              {nodeIds.map(id => (
                <option key={id} value={id}>{NODES[id].icon} {NODES[id].name}</option>
              ))}
            </select>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={() => { const t = source; setSource(destination); setDestination(t); setCalculated(false); setPaths([]); }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 transition flex items-center gap-2 text-sm font-bold"
            >
              <ArrowRight className="w-4 h-4" /> Swap
            </button>
          </div>

          {/* Destination */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5" /> Destination (Dropoff)
            </label>
            <select
              value={destination}
              onChange={e => { setDestination(e.target.value); setCalculated(false); setPaths([]); }}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-3 py-2.5 text-sm font-semibold focus:outline-none focus:border-cyan-500"
            >
              {nodeIds.map(id => (
                <option key={id} value={id}>{NODES[id].icon} {NODES[id].name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick info + Calculate */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Straight-line: <span className="text-white font-bold ml-1">{Math.round(straightLine)} km</span>
            &nbsp;· Road network uses Dijkstra's shortest-path algorithm
          </div>
          <button
            onClick={handleCalculate}
            disabled={source === destination}
            className="px-6 py-2.5 rounded-xl font-black text-sm flex items-center gap-2 transition-all duration-200"
            style={{
              background: source === destination ? '#374151' : 'linear-gradient(135deg,#10b981,#059669)',
              color: source === destination ? '#6b7280' : '#000',
              cursor: source === destination ? 'not-allowed' : 'pointer',
              boxShadow: source !== destination ? '0 4px 20px rgba(16,185,129,0.4)' : 'none'
            }}
          >
            <Zap className="w-4 h-4" /> Find Routes
          </button>
        </div>
      </div>

      {/* Results */}
      {calculated && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Route Cards */}
          <div className="space-y-3">
            {paths.length === 0 ? (
              <div className="glass-panel p-5 rounded-2xl border border-red-800/40 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-red-400 font-bold text-sm">No Route Found</p>
                  <p className="text-slate-500 text-xs">No road connection exists between these two locations.</p>
                </div>
              </div>
            ) : (
              paths.map((p) => (
                <button
                  key={p.rank}
                  onClick={() => setSelectedPath(p)}
                  className="w-full text-left p-4 rounded-2xl border transition-all duration-200"
                  style={{
                    borderColor: selectedPath?.rank === p.rank ? p.color : 'rgba(51,65,85,1)',
                    background: selectedPath?.rank === p.rank ? `${p.color}18` : 'rgba(15,23,42,0.5)',
                    boxShadow: selectedPath?.rank === p.rank ? `0 0 20px ${p.color}22` : 'none'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-sm" style={{ color: p.color }}>
                      {p.rank === 1 ? '⚡ ' : p.rank === 2 ? '🔶 ' : '🟣 '}{p.label}
                    </span>
                    {p.rank === 1 && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-slate-900 rounded-xl p-2.5 text-center">
                      <div className="text-lg font-black text-white">{p.totalDist.toLocaleString()} km</div>
                      <div className="text-[10px] text-slate-500">Road Distance</div>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-2.5 text-center">
                      <div className="text-lg font-black" style={{ color: p.color }}>{estTime(p.totalDist)}</div>
                      <div className="text-[10px] text-slate-500">Est. Time</div>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-2.5 text-center">
                      <div className="text-base font-black text-amber-400">{estCost(p.totalDist)}</div>
                      <div className="text-[10px] text-slate-500">Est. Cost</div>
                    </div>
                    <div className="bg-slate-900 rounded-xl p-2.5 text-center">
                      <div className="text-base font-black text-slate-300">{p.path.length - 1}</div>
                      <div className="text-[10px] text-slate-500">Stops</div>
                    </div>
                  </div>

                  {/* Path */}
                  <div className="flex flex-wrap items-center gap-1">
                    {p.path.map((id, i) => (
                      <React.Fragment key={id}>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                          style={{ background: `${p.color}22`, color: p.color }}>
                          {NODES[id].icon} {NODES[id].name.split(' ')[0]}
                        </span>
                        {i < p.path.length - 1 && <ArrowRight className="w-2.5 h-2.5 text-slate-600" />}
                      </React.Fragment>
                    ))}
                  </div>
                </button>
              ))
            )}

            {/* Comparison Table */}
            {paths.length > 1 && (
              <div className="glass-panel rounded-2xl border border-slate-800 p-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Route Comparison</h4>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-slate-500">
                      <th className="text-left pb-2">Route</th>
                      <th className="text-right pb-2">Distance</th>
                      <th className="text-right pb-2">Extra km</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paths.map(p => (
                      <tr key={p.rank} className="border-t border-slate-800/50">
                        <td className="py-2 font-bold" style={{ color: p.color }}>{p.label.replace('Route ', '')}</td>
                        <td className="text-right text-white font-bold">{p.totalDist.toLocaleString()} km</td>
                        <td className="text-right" style={{ color: p.rank === 1 ? '#10b981' : '#f87171' }}>
                          {p.rank === 1 ? '✓ Best' : `+${(p.totalDist - paths[0].totalDist).toLocaleString()} km`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="xl:col-span-2">
            <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden" style={{ height: 480 }}>
              <MapContainer
                center={[20.5937, 78.9629]}
                zoom={5}
                scrollWheelZoom
                className="w-full h-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap"
                />
                {paths.length > 0 && <MapFitter paths={paths} />}

                {/* Draw all paths (non-selected dimmed) */}
                {paths.map(p => (
                  <Polyline
                    key={p.rank}
                    positions={p.path.map(id => [NODES[id].lat, NODES[id].lng])}
                    pathOptions={{
                      color: p.color,
                      weight: selectedPath?.rank === p.rank ? 5 : 2.5,
                      opacity: selectedPath?.rank === p.rank ? 1 : 0.35,
                      dashArray: p.rank === 1 ? '' : '10 6'
                    }}
                  />
                ))}

                {/* Draw all graph edges lightly */}
                {EDGES.map((e, i) => (
                  <Polyline
                    key={i}
                    positions={[[NODES[e.u].lat, NODES[e.u].lng], [NODES[e.v].lat, NODES[e.v].lng]]}
                    pathOptions={{ color: '#334155', weight: 1, opacity: 0.4, dashArray: '3 5' }}
                  />
                ))}

                {/* All nodes */}
                {Object.values(NODES).map(node => {
                  const isSource = node.id === source;
                  const isBest = selectedPath?.path.includes(node.id);
                  const color = isSource && node.id === destination ? '#8b5cf6'
                    : node.id === source ? '#10b981'
                    : node.id === destination ? '#06b6d4'
                    : isBest ? (selectedPath?.color || '#64748b') : '#334155';
                  return (
                    <Marker
                      key={node.id}
                      position={[node.lat, node.lng]}
                      icon={makeIcon(color, node.icon)}
                    >
                      <Popup>
                        <div style={{ fontFamily: 'Inter, sans-serif', minWidth: 160 }}>
                          <b style={{ fontSize: 13 }}>{node.icon} {node.name}</b><br />
                          <small style={{ color: '#6b7280', textTransform: 'capitalize' }}>{node.type}</small>
                          {selectedPath?.path.includes(node.id) && (
                            <div style={{ marginTop: 6, color: selectedPath.color, fontSize: 11, fontWeight: 700 }}>
                              ✓ On selected route (stop #{selectedPath.path.indexOf(node.id) + 1})
                            </div>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              {paths.map(p => (
                <div key={p.rank} className="flex items-center gap-1.5">
                  <div className="h-1 w-8 rounded-full" style={{ background: p.color, opacity: selectedPath?.rank === p.rank ? 1 : 0.4 }} />
                  <span className="text-slate-400">{p.label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="h-px w-8 border-t border-dashed border-slate-600" />
                <span className="text-slate-500">Available roads</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!calculated && (
        <div className="glass-panel rounded-2xl border border-slate-800 p-12 text-center">
          <Route className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <p className="text-slate-400 font-semibold">Select source & destination, then click <span className="text-emerald-400">Find Routes</span></p>
          <p className="text-slate-600 text-xs mt-2">Dijkstra's algorithm will find the shortest road path and suggest alternatives</p>
        </div>
      )}
    </div>
  );
};
