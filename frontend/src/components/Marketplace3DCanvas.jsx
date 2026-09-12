import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, MapPin, Globe, Sparkles, TrendingUp, ShieldCheck, Zap, Activity, ArrowUpRight } from 'lucide-react';

const GLOBAL_HUBS = [
  { id: 1, name: 'Mumbai Industrial Hub', type: 'Cement Plant CO₂', purity: '99.8%', volume: '15,000 Tons', price: '$42/Ton', lat: 19.07, lng: 72.87, color: 0x10b981 },
  { id: 2, name: 'Rotterdam Clean Energy Hub', type: 'Direct Air Capture', purity: '99.9%', volume: '28,000 Tons', price: '$48/Ton', lat: 51.92, lng: 4.47, color: 0x34d399 },
  { id: 3, name: 'Houston Gulf Coast Energy', type: 'Refinery CO₂ Stream', purity: '98.5%', volume: '45,000 Tons', price: '$36/Ton', lat: 29.76, lng: -95.36, color: 0x059669 },
  { id: 4, name: 'Tokyo Bio-Tech Algae Hub', type: 'Biomass CO₂ Capture', purity: '99.7%', volume: '12,000 Tons', price: '$45/Ton', lat: 35.67, lng: 139.65, color: 0x6ee7b7 },
  { id: 5, name: 'Dubai Solar Synthetic Fuel', type: 'E-Fuel Synthesis Stream', purity: '99.9%', volume: '20,000 Tons', price: '$52/Ton', lat: 25.20, lng: 55.27, color: 0x22c55e }
];

export const Marketplace3DCanvas = ({ onSelectHub }) => {
  const mountRef = useRef(null);
  const [selectedHub, setSelectedHub] = useState(GLOBAL_HUBS[0]);
  const [hubPositions, setHubPositions] = useState([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = 440;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 2, 8.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Main Rotatable Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 3D Wireframe Globe Sphere
    const globeGeo = new THREE.SphereGeometry(2.6, 36, 36);
    const globeMat = new THREE.MeshPhongMaterial({
      color: 0x042111,
      emissive: 0x072e18,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const globeMesh = new THREE.Mesh(globeGeo, globeMat);
    globeGroup.add(globeMesh);

    // Inner Glow Core
    const coreGeo = new THREE.SphereGeometry(2.55, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x071e12,
      transparent: true,
      opacity: 0.95
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Starfield Particle Field
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 3.2 + Math.random() * 2.2;
      particlePos[i * 3] = Math.cos(theta) * r;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 3;
      particlePos[i * 3 + 2] = Math.sin(theta) * r;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.075,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    globeGroup.add(particles);

    // 3. Convert Lat/Lng Coordinates to 3D Sphere Points
    const hubMeshes = [];

    GLOBAL_HUBS.forEach((hub) => {
      const phi = (90 - hub.lat) * (Math.PI / 180);
      const theta = (hub.lng + 180) * (Math.PI / 180);

      const r = 2.65;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = r * Math.sin(phi) * Math.sin(theta);
      const y = r * Math.cos(phi);

      // Pin Sphere Mesh
      const pinGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const pinMat = new THREE.MeshPhongMaterial({
        color: hub.color,
        emissive: hub.color,
        emissiveIntensity: 0.8,
        shininess: 90
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      pinMesh.position.set(x, y, z);
      globeGroup.add(pinMesh);

      // Selection Pulsing Ring
      const ringGeo = new THREE.RingGeometry(0.24, 0.32, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x6ee7b7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(x, y, z);
      ringMesh.lookAt(0, 0, 0);
      globeGroup.add(ringMesh);

      hubMeshes.push({ pinMesh, ringMesh, hub, pos: new THREE.Vector3(x, y, z) });
    });

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x34d399, 3.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 5. 3D Drag Rotation & Raycasting
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        globeGroup.rotation.y += deltaX * 0.007;
        globeGroup.rotation.x = Math.max(-0.6, Math.min(0.6, globeGroup.rotation.x + deltaY * 0.005));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => { isDragging = false; };

    const onCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(hubMeshes.map(h => h.pinMesh));

      if (intersects.length > 0) {
        const found = hubMeshes.find(h => h.pinMesh === intersects[0].object);
        if (found) {
          setSelectedHub(found.hub);
          if (onSelectHub) onSelectHub(found.hub);
        }
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('click', onCanvasClick);

    // 6. Render Animation Loop
    let animationFrameId;
    const projVector = new THREE.Vector3();

    const animate = () => {
      if (!isDragging) {
        globeGroup.rotation.y += 0.003;
      }

      // Update 3D -> 2D Screen Positions for Overlay Badges
      const updatedPositions = [];
      const time = Date.now() * 0.003;

      hubMeshes.forEach((h) => {
        const isSel = h.hub.id === selectedHub.id;
        const scale = isSel ? 1.4 + Math.sin(time * 2) * 0.1 : 1;
        h.pinMesh.scale.set(scale, scale, scale);
        h.ringMesh.scale.set(scale, scale, scale);

        projVector.setFromMatrixPosition(h.pinMesh.matrixWorld);
        projVector.project(camera);

        const sx = (projVector.x * 0.5 + 0.5) * width;
        const sy = (-(projVector.y * 0.5) + 0.5) * height;

        // Only show badge if pin is facing camera (z > 0 in normalized camera space)
        if (projVector.z < 1) {
          updatedPositions.push({ x: sx, y: sy, hub: h.hub });
        }
      });

      setHubPositions(updatedPositions);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('click', onCanvasClick);
      cancelAnimationFrame(animationFrameId);
      scene.clear();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [selectedHub, onSelectHub]);

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#061e0e] to-[#04140a] border border-emerald-800/40 shadow-2xl overflow-hidden p-6">
      
      {/* Canvas Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-900/40 z-20 relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Globe className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
              Global CO₂ Supply Trading Globe
            </h3>
            <p className="text-slate-400 text-xs font-medium">Drag 360° to rotate globe or click any node pin to inspect listings.</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#072414] px-3 py-1.5 rounded-2xl border border-emerald-500/30 text-xs text-emerald-400 font-bold">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Live Trading Nodes Active</span>
        </div>
      </div>

      {/* Main Grid: Left 3D Globe + Right Active Hub Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2">
        
        {/* 3D Globe Viewport (7 Cols) */}
        <div className="lg:col-span-7 relative h-[420px] rounded-2xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing border border-emerald-900/40">
          <div ref={mountRef} className="w-full h-full" />

          {/* Floating 3D Node Pins Tracking Globe Coordinates */}
          {hubPositions.map((pos) => {
            const isSel = selectedHub.id === pos.hub.id;
            return (
              <button
                key={pos.hub.id}
                onClick={() => { setSelectedHub(pos.hub); if (onSelectHub) onSelectHub(pos.hub); }}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y - 35}px`,
                  transform: 'translate(-50%, -100%)'
                }}
                className={`absolute z-30 px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all duration-150 shadow-xl cursor-pointer ${
                  isSel
                    ? 'bg-emerald-500 text-dark-950 border border-emerald-300 scale-110 shadow-emerald-500/50'
                    : 'bg-[#072515]/90 text-emerald-300 border border-emerald-500/40 hover:scale-105'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{pos.hub.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Hub Details Panel (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#082615]/95 border border-emerald-500/40 backdrop-blur-xl shadow-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-4">
            <div>
              <span className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">SELECTED TRADING HUB</span>
              <h4 className="text-xl font-black text-white">{selectedHub.name}</h4>
              <span className="text-xs text-slate-400 font-semibold">{selectedHub.type}</span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-sm">
              {selectedHub.price}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[#05170d] border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 font-semibold block">Available Volume</span>
              <strong className="text-sm font-black text-emerald-300 block mt-0.5">{selectedHub.volume}</strong>
            </div>

            <div className="p-3 rounded-xl bg-[#05170d] border border-emerald-800/40">
              <span className="text-[10px] text-slate-400 font-semibold block">CO₂ Purity Rating</span>
              <strong className="text-sm font-black text-emerald-400 block mt-0.5">{selectedHub.purity}</strong>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> ISO-14064 Verified Origin
            </div>
            <button
              onClick={() => { if (onSelectHub) onSelectHub(selectedHub); }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-black text-xs flex items-center gap-1 transition shadow-lg shadow-emerald-500/20"
            >
              <span>View Listings</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
