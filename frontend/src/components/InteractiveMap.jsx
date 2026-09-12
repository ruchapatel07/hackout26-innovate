import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Factory, Recycle, Truck, Activity } from 'lucide-react';

// Custom Leaflet Icons using SVG Data URIs
const producerIcon = L.divIcon({
  className: 'custom-producer-icon',
  html: `<div style="background-color:#10b981; width:28px; height:28px; border-radius:50%; border:3px solid #070b14; display:flex; align-items:center; justify-content:center; color:white; font-size:14px; font-weight:bold; box-shadow:0 0 15px rgba(16,185,129,0.8);">P</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

const consumerIcon = L.divIcon({
  className: 'custom-consumer-icon',
  html: `<div style="background-color:#06b6d4; width:28px; height:28px; border-radius:50%; border:3px solid #070b14; display:flex; align-items:center; justify-content:center; color:white; font-size:14px; font-weight:bold; box-shadow:0 0 15px rgba(6,182,212,0.8);">C</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14]
});

export const InteractiveMap = () => {
  const [producers, setProducers] = useState([]);
  const [consumers, setConsumers] = useState([]);

  useEffect(() => {
    // Fetch live marketplace listings for map producers
    fetch('/api/marketplace/listings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const liveProducers = data.listings.map((l, i) => ({
            id: l.listingId || `p-${i}`,
            name: l.producerName,
            type: l.captureMethod,
            lat: l.latitude || (29.7604 + i * 0.3),
            lng: l.longitude || (-95.3698 + i * 0.4),
            co2: `${l.availableCO2.toLocaleString()} Tons`,
            purity: `${l.purity}%`,
            price: `$${l.pricePerTon}/T`
          }));
          setProducers(liveProducers);
        }
      })
      .catch(console.error);

    // Fetch top consumers for map buyers
    fetch('/api/ai/leaderboard')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.topConsumers) {
          const liveConsumers = data.topConsumers.map((c, i) => ({
            id: c.userId || `c-${i}`,
            name: c.name,
            type: 'CO₂ Utilization Facility',
            lat: 29.9511 - i * 0.2,
            lng: -90.0715 - i * 0.3,
            demand: `${c.totalPurchasedTons.toLocaleString()} Tons`,
            minPurity: '95.0%'
          }));
          setConsumers(liveConsumers);
        }
      })
      .catch(console.error);
  }, []);

  const routes = producers.length > 0 && consumers.length > 0
    ? [{ from: [producers[0].lat, producers[0].lng], to: [consumers[0].lat, consumers[0].lng], label: 'Active Supply Route' }]
    : [];

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-brand-green" />
            <span>Interactive Industrial Carbon Map</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">Real-time geospatial distribution of CO₂ capture sources and commercial demand sinks.</p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-green shadow-sm shadow-brand-green/50"></span>
            <span className="text-slate-300">Carbon Producers (Emitters)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-cyan shadow-sm shadow-brand-cyan/50"></span>
            <span className="text-slate-300">Carbon Consumers (Buyers)</span>
          </div>
        </div>
      </div>

      {/* Map Container Container */}
      <div className="glass-panel rounded-2xl p-2 border border-slate-800 h-[600px] relative overflow-hidden">
        <MapContainer
          center={[29.8504, -92.5698]}
          zoom={7}
          scrollWheelZoom={true}
          className="w-full h-full rounded-xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Producer Markers */}
          {producers.map((p) => (
            <Marker key={p.id} position={[p.lat, p.lng]} icon={producerIcon}>
              <Popup>
                <div className="p-1 space-y-1">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">Producer</span>
                  <h4 className="font-bold text-sm text-white">{p.name}</h4>
                  <p className="text-xs text-slate-300">{p.type}</p>
                  <div className="pt-2 border-t border-slate-800 text-xs font-semibold">
                    <p className="text-emerald-400">Available: {p.co2}</p>
                    <p className="text-slate-400">Purity: {p.purity} • Price: {p.price}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Consumer Markers */}
          {consumers.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={consumerIcon}>
              <Popup>
                <div className="p-1 space-y-1">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 uppercase">Consumer</span>
                  <h4 className="font-bold text-sm text-white">{c.name}</h4>
                  <p className="text-xs text-slate-300">{c.type}</p>
                  <div className="pt-2 border-t border-slate-800 text-xs font-semibold">
                    <p className="text-cyan-400">Demand: {c.demand}</p>
                    <p className="text-slate-400">Min Purity Required: {c.minPurity}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Polyline Route Lines */}
          {routes.map((r, rIdx) => (
            <Polyline
              key={rIdx}
              positions={[r.from, r.to]}
              pathOptions={{ color: '#10b981', weight: 3, dashArray: '8, 8', opacity: 0.8 }}
            />
          ))}

        </MapContainer>
      </div>

    </div>
  );
};
