import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Factory, ShieldCheck, Route, Search, Filter, RefreshCw } from 'lucide-react';

// Predefined geographic fallback coordinates for key industrial Indian hubs
const CITY_COORDS = {
  mumbai: [19.0760, 72.8777],
  hyderabad: [17.3850, 78.4867],
  chennai: [13.0827, 80.2707],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  pune: [18.5204, 73.8567],
  ahmedabad: [23.0225, 72.5714],
  delhi: [28.6139, 77.2090],
  surat: [21.1702, 72.8311],
  jaipur: [26.9124, 75.7873],
  nagpur: [21.1458, 79.0882],
  jamshedpur: [22.8046, 86.2029],
  kolkata: [22.5726, 88.3639],
  lucknow: [26.8467, 80.9462],
  karnataka: [15.3173, 75.7139],
  gujarat: [22.2587, 71.1924],
  maharashtra: [19.7515, 75.7139],
  tamil: [11.1271, 78.6569]
};

const resolveCoordinates = (locationStr, fallbackIndex = 0) => {
  if (!locationStr) {
    const fallbacks = Object.values(CITY_COORDS);
    return fallbacks[fallbackIndex % fallbacks.length];
  }
  const lower = locationStr.toLowerCase();
  for (const [city, coords] of Object.entries(CITY_COORDS)) {
    if (lower.includes(city)) {
      return coords;
    }
  }
  const fallbacks = Object.values(CITY_COORDS);
  return fallbacks[fallbackIndex % fallbacks.length];
};

// Custom Leaflet Icons with high contrast glowing aesthetics
const producerIcon = L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background:linear-gradient(135deg, #10b981, #059669); width:34px; height:34px; border-radius:50%; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; color:white; font-size:15px; font-weight:900; box-shadow:0 0 16px rgba(16,185,129,0.85); cursor:pointer;">P</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -18]
});

const consumerIcon = L.divIcon({
  className: 'custom-map-icon',
  html: `<div style="background:linear-gradient(135deg, #06b6d4, #0891b2); width:34px; height:34px; border-radius:50%; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; color:white; font-size:15px; font-weight:900; box-shadow:0 0 16px rgba(6,182,212,0.85); cursor:pointer;">C</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -18]
});

// Auto bounds fitter component
const MapBoundsFitter = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    if (points && points.length > 0) {
      const validPoints = points.filter(p => typeof p.lat === 'number' && typeof p.lng === 'number');
      if (validPoints.length > 0) {
        const bounds = validPoints.map(p => [p.lat, p.lng]);
        try {
          map.fitBounds(bounds, { padding: [40, 40], maxZoom: 7 });
        } catch (e) {
          console.warn('Map bounds fit error', e);
        }
      }
    }
  }, [points, map]);
  return null;
};

export const InteractiveMap = () => {
  const [producers, setProducers] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all'); // 'all' | 'producers' | 'consumers'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/marketplace/listings').then(r => r.json()).catch(() => ({ success: false })),
      fetch('/api/ai/leaderboard').then(r => r.json()).catch(() => ({ success: false }))
    ]).then(([marketData, aiData]) => {
      if (marketData.success && marketData.listings) {
        const liveProducers = marketData.listings.map((l, i) => {
          let lat = l.latitude;
          let lng = l.longitude;
          if (!lat || !lng || isNaN(lat) || isNaN(lng) || (lat > 29 && lng < 0)) {
            const resolved = resolveCoordinates(l.location, i);
            lat = resolved[0] + (i % 2 === 0 ? 0.05 : -0.05);
            lng = resolved[1] + (i % 2 === 0 ? -0.05 : 0.05);
          }
          return {
            id: l.listingId || `p-${i}`,
            name: l.producerName,
            location: l.location || 'India',
            type: l.captureMethod || 'Direct Flue-Gas Capture',
            lat: Number(lat),
            lng: Number(lng),
            co2: `${(l.availableCO2 || 5000).toLocaleString()} Tons`,
            purity: `${l.purity || 95.0}%`,
            price: `$${l.pricePerTon || 25}/T`,
            category: 'producer'
          };
        });
        setProducers(liveProducers);
      }

      if (aiData.success && aiData.topConsumers) {
        const liveConsumers = aiData.topConsumers.map((c, i) => {
          const resolved = resolveCoordinates(c.location || c.name, i + 3);
          return {
            id: c.userId || `c-${i}`,
            name: c.name,
            location: c.location || 'India',
            type: 'Commercial CO₂ Utilization Facility',
            lat: Number(resolved[0]),
            lng: Number(resolved[1]),
            demand: `${(c.totalPurchasedTons || 2500).toLocaleString()} Tons`,
            minPurity: '95.0%',
            badge: c.badge || 'Circular Partner',
            score: c.score || 95,
            category: 'consumer'
          };
        });
        setConsumers(liveConsumers);
      }
      setLoading(false);
    }).catch(err => {
      console.error('[Map Data Fetch Error]', err);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered nodes based on tab and search query
  const filteredProducers = useMemo(() => {
    if (filterType === 'consumers') return [];
    return producers.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [producers, filterType, searchQuery]);

  const filteredConsumers = useMemo(() => {
    if (filterType === 'producers') return [];
    return consumers.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [consumers, filterType, searchQuery]);

  // Connect active supply routes between nearby producers and consumers
  const routes = useMemo(() => {
    if (producers.length === 0 || consumers.length === 0) return [];
    const pairedRoutes = [];
    const maxRoutes = Math.min(4, producers.length, consumers.length);
    for (let i = 0; i < maxRoutes; i++) {
      const p = producers[i];
      const c = consumers[i % consumers.length];
      if (p && c && p.lat && p.lng && c.lat && c.lng) {
        pairedRoutes.push({
          from: [p.lat, p.lng],
          to: [c.lat, c.lng],
          pName: p.name,
          cName: c.name
        });
      }
    }
    return pairedRoutes;
  }, [producers, consumers]);

  const allVisiblePoints = useMemo(() => {
    return [...filteredProducers, ...filteredConsumers];
  }, [filteredProducers, filteredConsumers]);

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterType === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span>All Facilities</span>
            <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">{producers.length + consumers.length}</span>
          </button>

          <button
            onClick={() => setFilterType('producers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterType === 'producers'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Producers (Emitters)</span>
            <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">{producers.length}</span>
          </button>

          <button
            onClick={() => setFilterType('consumers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              filterType === 'consumers'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Consumers (Buyers)</span>
            <span className="px-1.5 py-0.2 rounded bg-black/20 text-[10px]">{consumers.length}</span>
          </button>
        </div>

        {/* Search & Refresh */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search plant, city, method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            onClick={fetchData}
            title="Refresh Map Telemetry"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

      </div>

      {/* Map display */}
      <div className="relative rounded-2xl border border-emerald-900/50 overflow-hidden shadow-2xl h-[580px] bg-[#07130b]">
        <MapContainer
          center={[21.5, 78.9]}
          zoom={5}
          scrollWheelZoom={true}
          className="w-full h-full"
          style={{ background: '#051109' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={18}
          />

          <MapBoundsFitter points={allVisiblePoints} />

          {/* Active Supply Route Polylines */}
          {routes.map((r, idx) => (
            <Polyline
              key={`route-${idx}`}
              positions={[r.from, r.to]}
              pathOptions={{
                color: '#10b981',
                weight: 2.5,
                dashArray: '8, 8',
                opacity: 0.75
              }}
            />
          ))}

          {/* Producer (Emitter) Markers */}
          {filteredProducers.map((p) => (
            <Marker
              key={p.id}
              position={[p.lat, p.lng]}
              icon={producerIcon}
              eventHandlers={{
                click: () => setSelectedItem(p)
              }}
            >
              <Popup>
                <div className="space-y-1.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] tracking-wide uppercase border border-emerald-500/30">
                      Emitter / Producer
                    </span>
                    <span className="text-[10px] text-emerald-400 font-bold">{p.price}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white pt-1">{p.name}</h4>
                  <p className="text-slate-400 text-[11px]">{p.location}</p>
                  <p className="text-slate-300 text-[11px]"><strong className="text-slate-400">Method:</strong> {p.type}</p>
                  <div className="pt-2 mt-2 border-t border-slate-700/60 flex items-center justify-between font-semibold">
                    <span className="text-emerald-400">Available: {p.co2}</span>
                    <span className="text-slate-300">Purity: {p.purity}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Consumer (Buyer) Markers */}
          {filteredConsumers.map((c) => (
            <Marker
              key={c.id}
              position={[c.lat, c.lng]}
              icon={consumerIcon}
              eventHandlers={{
                click: () => setSelectedItem(c)
              }}
            >
              <Popup>
                <div className="space-y-1.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-extrabold text-[10px] tracking-wide uppercase border border-cyan-500/30">
                      Commercial Buyer Sink
                    </span>
                    <span className="text-[10px] text-cyan-400 font-bold">Score {c.score}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-white pt-1">{c.name}</h4>
                  <p className="text-slate-400 text-[11px]">{c.location}</p>
                  <p className="text-slate-300 text-[11px]"><strong className="text-slate-400">Facility:</strong> {c.type}</p>
                  <div className="pt-2 mt-2 border-t border-slate-700/60 flex items-center justify-between font-semibold">
                    <span className="text-cyan-400">Demand: {c.demand}</span>
                    <span className="text-slate-300">Min Purity: {c.minPurity}</span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

        </MapContainer>

        {/* Legend Overlay in corner */}
        <div className="absolute bottom-4 right-4 z-[500] bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-xl flex flex-col gap-2 pointer-events-auto">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Map Legend</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border border-white/60 shadow-sm shadow-emerald-500"></span>
            <span className="text-slate-200 font-semibold">Carbon Producer (P)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 border border-white/60 shadow-sm shadow-cyan-500"></span>
            <span className="text-slate-200 font-semibold">Carbon Consumer (C)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-5 h-0.5 border-t-2 border-dashed border-emerald-400"></span>
            <span className="text-slate-400 text-[11px]">Active Supply Corridors</span>
          </div>
        </div>

      </div>
    </div>
  );
};
