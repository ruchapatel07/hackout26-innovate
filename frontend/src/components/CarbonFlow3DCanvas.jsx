import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Leaf, Handshake, Truck, Recycle, Building2, Sprout, Zap, FileCheck, Play, Pause, RotateCcw, Sparkles, Activity, ShieldCheck, Move, Send, Plus, RefreshCw, Award, ArrowRight, DollarSign } from 'lucide-react';

const STAGE_DETAILS = [
  {
    id: 0,
    title: '1. Industrial CO₂ Capture',
    shortName: 'Capture',
    icon: Leaf,
    color: '#10b981',
    metrics: [
      { label: 'Avg CO₂ Purity', value: '99.8%' },
      { label: 'Capture Tech', value: 'Amine Scrubbing / Direct Air' },
      { label: 'Monitored Facilities', value: '120+ Industrial Plants' },
      { label: 'Annual Volume', value: '250,000+ Tons' }
    ],
    desc: 'Industrial CO₂ streams are captured, purified to commercial grade, and registered with immutable carbon origin certificates.'
  },
  {
    id: 1,
    title: '2. AI Matchmaking Engine',
    shortName: 'Match',
    icon: Handshake,
    color: '#34d399',
    metrics: [
      { label: 'Match Accuracy', value: '98.4%' },
      { label: 'Match Speed', value: '< 120 Seconds' },
      { label: 'Recommended Price', value: '$38 - $46 / Ton' },
      { label: 'Active Buyers', value: '85+ Enterprises' }
    ],
    desc: 'Algorithmic matching pairs CO₂ supply with nearby industrial buyers based on purity, distance, price curves, and ESG targets.'
  },
  {
    id: 2,
    title: '3. Smart Pressurized Logistics',
    shortName: 'Transport',
    icon: Truck,
    color: '#059669',
    metrics: [
      { label: 'Tracked Tankers', value: '45 Liquefied Tankers' },
      { label: 'Safety Index', value: '99.9% Zero-Leak' },
      { label: 'Avg Distance', value: '115 km' },
      { label: 'Delivery Time', value: 'Same Day / Scheduled' }
    ],
    desc: 'Specialized transporters transport liquid or compressed CO₂ with real-time GPS telemetry, pressure sensors, and route optimization.'
  },
  {
    id: 3,
    title: '4. Sustainable Product Reuse',
    shortName: 'Reuse',
    icon: Recycle,
    color: '#6ee7b7',
    metrics: [
      { label: 'Primary Uses', value: 'Concrete, Algae, E-Fuels' },
      { label: 'Carbon Permanence', value: '100+ Years (Mineralized)' },
      { label: 'Carbon Credits', value: 'ISO 14064 Verified' },
      { label: 'Net Abatement', value: '85,000 Tons CO₂e' }
    ],
    desc: 'CO₂ is permanently sequestered in green concrete, fed to algae farms for bio-products, or synthesized into carbon-neutral e-fuels.'
  }
];

const REUSE_TYPES = [
  { id: 'concrete', name: 'Green Concrete', icon: Building2, detail: 'CO₂ permanently mineralized into structural building blocks.' },
  { id: 'algae', name: 'Algae Bio-Farm', icon: Sprout, detail: 'CO₂ feeds high-yield algae for biofuels & bio-plastics.' },
  { id: 'efuel', name: 'Synthetic E-Fuel', icon: Zap, detail: 'Net-zero aviation & marine e-fuels synthesized with hydrogen.' },
  { id: 'credits', name: 'Carbon Offsets', icon: FileCheck, detail: 'ISO-certified carbon removal credits traded on digital ledger.' }
];

export const CarbonFlow3DCanvas = () => {
  const mountRef = useRef(null);

  // Interactive States
  const [activeStage, setActiveStage] = useState(0);
  const [captureVolume, setCaptureVolume] = useState(500);
  const [co2Purity, setCo2Purity] = useState(99.5);
  const [selectedReuse, setSelectedReuse] = useState('concrete');
  const [transactedTotal, setTransactedTotal] = useState(12450);
  const [creditsEarned, setCreditsEarned] = useState(522900);
  const [isSimulatingBatch, setIsSimulatingBatch] = useState(false);
  const [batchStep, setBatchStep] = useState(null);
  
  // 3D Screen Projection Coordinates for Floating Node Badges
  const [nodePositions, setNodePositions] = useState([]);

  const activeStageRef = useRef(0);
  useEffect(() => { activeStageRef.current = activeStage; }, [activeStage]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = 440;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 9.8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Main Rotatable Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Particle Swarm
    const particleCount = 420;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 3.2 + Math.random() * 2.8;
      particlePos[i * 3] = Math.cos(theta) * r;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 3.0;
      particlePos[i * 3 + 2] = Math.sin(theta) * r;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.08,
      transparent: true,
      opacity: 0.65
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    mainGroup.add(particles);

    // 3. 4 Stage Node Spheres
    const nodeRadius = 3.7;
    const nodeColors = [0x10b981, 0x34d399, 0x059669, 0x6ee7b7];
    const nodeGroup = new THREE.Group();
    mainGroup.add(nodeGroup);

    const nodeMeshes = [];

    for (let index = 0; index < 4; index++) {
      const angle = (index / 4) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(angle) * nodeRadius;
      const z = Math.sin(angle) * nodeRadius;

      // Glowing Sphere
      const sphereGeo = new THREE.SphereGeometry(0.55, 32, 32);
      const sphereMat = new THREE.MeshPhongMaterial({
        color: nodeColors[index],
        emissive: nodeColors[index],
        emissiveIntensity: 0.65,
        shininess: 90,
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      sphere.position.set(x, 0, z);
      nodeGroup.add(sphere);

      // Selection Laser Ring
      const ringGeo = new THREE.RingGeometry(0.68, 0.82, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x6ee7b7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(x, 0, z);
      ring.rotation.x = Math.PI / 2;
      nodeGroup.add(ring);

      nodeMeshes.push({ sphere, ring, x, z, index });
    }

    // 4. Flow Track & Photons
    const curvePoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      curvePoints.push(new THREE.Vector3(Math.cos(angle) * nodeRadius, 0, Math.sin(angle) * nodeRadius));
    }
    const flowCurve = new THREE.CatmullRomCurve3(curvePoints, true);
    const tubeGeo = new THREE.TubeGeometry(flowCurve, 64, 0.05, 8, true);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.5
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    mainGroup.add(tube);

    // Photons
    const photonCount = 16;
    const photons = [];
    const photonGeo = new THREE.SphereGeometry(0.15, 16, 16);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xa7f3d0 });

    for (let i = 0; i < photonCount; i++) {
      const photon = new THREE.Mesh(photonGeo, photonMat);
      mainGroup.add(photon);
      photons.push({ mesh: photon, progress: i / photonCount });
    }

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x34d399, 3.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x10b981, 4.0, 15);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    // 6. Interactive 3D Drag Orbit & Projection Matrix Update
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

        mainGroup.rotation.y += deltaX * 0.007;
        mainGroup.rotation.x = Math.max(-0.4, Math.min(0.7, mainGroup.rotation.x + deltaY * 0.005));

        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => { isDragging = false; };

    const onCanvasClick = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes.map(n => n.sphere));

      if (intersects.length > 0) {
        const found = nodeMeshes.find(n => n.sphere === intersects[0].object);
        if (found) setActiveStage(found.index);
      }
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('click', onCanvasClick);

    // 7. Animation Loop with 3D -> 2D Projection for Badges
    let animationFrameId;
    const projVector = new THREE.Vector3();

    const animate = () => {
      if (!isDragging) {
        mainGroup.rotation.y += 0.0025;
      }

      // Continuous photons movement
      photons.forEach((p) => {
        p.progress += 0.004;
        if (p.progress > 1) p.progress = 0;
        const pt = flowCurve.getPoint(p.progress);
        p.mesh.position.copy(pt);
      });

      // Highlight active node & Project 3D positions to 2D screen coordinates
      const currentActive = activeStageRef.current;
      const time = Date.now() * 0.003;
      const updatedPositions = [];

      nodeMeshes.forEach((n) => {
        if (n.index === currentActive) {
          const s = 1.38 + Math.sin(time * 2) * 0.08;
          n.sphere.scale.set(s, s, s);
          n.ring.scale.set(1.4, 1.4, 1.4);
          n.ring.material.opacity = 0.95;
        } else {
          n.sphere.scale.set(1, 1, 1);
          n.ring.scale.set(1, 1, 1);
          n.ring.material.opacity = 0.35;
        }

        // Project 3D World Position to 2D Screen Canvas
        projVector.setFromMatrixPosition(n.sphere.matrixWorld);
        projVector.project(camera);

        const sx = (projVector.x * 0.5 + 0.5) * width;
        const sy = (-(projVector.y * 0.5) + 0.5) * height;
        updatedPositions.push({ x: sx, y: sy, index: n.index });
      });

      setNodePositions(updatedPositions);

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
  }, []);

  // Live Batch Transaction Simulation Handler
  const handleSimulateBatch = () => {
    if (isSimulatingBatch) return;
    setIsSimulatingBatch(true);

    setBatchStep('1. Capturing CO₂ Batch at Industrial Plant...');
    setActiveStage(0);

    setTimeout(() => {
      setBatchStep('2. AI Matchmaker Finding Optimal Buyer & Price...');
      setActiveStage(1);
    }, 1200);

    setTimeout(() => {
      setBatchStep('3. Pressurized Logistics Tanker Dispatched...');
      setActiveStage(2);
    }, 2400);

    setTimeout(() => {
      const addedTons = captureVolume;
      const addedRevenue = Math.round(captureVolume * 42 * (co2Purity / 100));

      const selectedName = REUSE_TYPES.find(r => r.id === selectedReuse)?.name;
      setBatchStep(`4. CO₂ Mineralized into ${selectedName}! +${addedTons} Tons ($${addedRevenue.toLocaleString()})`);
      setActiveStage(3);
      setTransactedTotal((prev) => prev + addedTons);
      setCreditsEarned((prev) => prev + addedRevenue);
    }, 3600);

    setTimeout(() => {
      setIsSimulatingBatch(false);
      setBatchStep(null);
    }, 5200);
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#061e0e] to-[#04140a] border border-emerald-800/40 shadow-2xl overflow-hidden p-6 space-y-6">
      
      {/* Interactive Simulation Control Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-900/40">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-white font-extrabold text-xl flex items-center gap-2">
              Live CO₂ Transaction Flow Sandbox
            </h3>
            <p className="text-slate-400 text-xs font-medium">Adjust parameters, trigger batch simulations, and observe real-time carbon abatement.</p>
          </div>
        </div>

        {/* Live Simulation Stats & Action Button */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Accumulated Metrics Display */}
          <div className="bg-[#082b17] border border-emerald-500/40 px-4 py-2 rounded-2xl flex items-center gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Tons Transacted</span>
              <strong className="text-sm font-black text-emerald-300">{transactedTotal.toLocaleString()} Tons</strong>
            </div>
            <div className="w-[1px] h-6 bg-emerald-900/60"></div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Market Value</span>
              <strong className="text-sm font-black text-emerald-400">${creditsEarned.toLocaleString()}</strong>
            </div>
          </div>

          {/* Trigger Batch Button */}
          <button
            onClick={handleSimulateBatch}
            disabled={isSimulatingBatch}
            className={`px-5 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl transition-all duration-300 ${
              isSimulatingBatch
                ? 'bg-emerald-400 text-dark-950 shadow-emerald-400/50 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-400 text-dark-950 shadow-emerald-500/30 hover:scale-105'
            }`}
          >
            {isSimulatingBatch ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>{isSimulatingBatch ? 'Simulating Batch Flow...' : 'Dispatch CO₂ Batch'}</span>
          </button>

        </div>
      </div>

      {/* Live Simulation Progress Banner */}
      {batchStep && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600/30 via-teal-500/20 to-emerald-600/30 border border-emerald-400 text-white font-bold text-xs flex items-center justify-between shadow-lg shadow-emerald-500/20 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
            <span>{batchStep}</span>
          </div>
          <span className="text-[10px] bg-emerald-400 text-dark-950 font-black px-2.5 py-1 rounded-full uppercase">Live Simulation</span>
        </div>
      )}

      {/* Main Grid: Left 3D Interactive Canvas + Right Live Parameter Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* 3D Drag Canvas with Floating Badges (7 Cols) */}
        <div className="lg:col-span-7 relative h-[420px] rounded-2xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing border border-emerald-900/40">
          <div ref={mountRef} className="w-full h-full" />
          
          {/* Controls Helper Badge Overlay */}
          <div className="absolute top-3 left-3 bg-[#061b0f]/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-500/40 text-[11px] text-emerald-300 font-bold flex items-center gap-2 pointer-events-none shadow-md">
            <Move className="w-3.5 h-3.5 text-emerald-400" />
            <span>Drag 360° Orbit | Click Sphere to Select</span>
          </div>

          {/* Floating 3D Node Badges Tracking Spheres in Real-Time */}
          {nodePositions.map((pos) => {
            const stage = STAGE_DETAILS[pos.index];
            const StageIcon = stage.icon;
            const isActive = activeStage === pos.index;

            return (
              <button
                key={pos.index}
                onClick={() => setActiveStage(pos.index)}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y - 45}px`,
                  transform: 'translate(-50%, -100%)'
                }}
                className={`absolute z-30 px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all duration-150 shadow-xl cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500 text-dark-950 border border-emerald-300 scale-110 shadow-emerald-500/50'
                    : 'bg-[#072515]/90 text-emerald-300 border border-emerald-500/40 hover:scale-105 hover:bg-emerald-950'
                }`}
              >
                <StageIcon className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{stage.shortName}</span>
              </button>
            );
          })}

        </div>

        {/* Live Parameter Controls & Product Conversion Panel (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#082615]/95 border border-emerald-500/40 backdrop-blur-xl shadow-2xl space-y-5">
          
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
            <h4 className="text-white font-black text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Interactive Carbon Parameters</span>
            </h4>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-500/30">SANDBOX MODE</span>
          </div>

          {/* Parameter 1: Capture Volume Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-bold">CO₂ Capture Volume</label>
              <span className="text-emerald-300 font-black">{captureVolume} Tons / Day</span>
            </div>
            <input
              type="range"
              min="50"
              max="2000"
              step="50"
              value={captureVolume}
              onChange={(e) => setCaptureVolume(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-emerald-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>50 Tons</span>
              <span>1,000 Tons</span>
              <span>2,000 Tons</span>
            </div>
          </div>

          {/* Parameter 2: CO2 Purity Rating Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-bold">Captured CO₂ Purity</label>
              <span className="text-emerald-300 font-black">{co2Purity}% Grade</span>
            </div>
            <input
              type="range"
              min="90"
              max="99.9"
              step="0.1"
              value={co2Purity}
              onChange={(e) => setCo2Purity(Number(e.target.value))}
              className="w-full accent-emerald-400 bg-emerald-950 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>90% (Industrial)</span>
              <span>98% (Commercial)</span>
              <span>99.9% (Food/Pharma)</span>
            </div>
          </div>

          {/* Parameter 3: Product Conversion Type Selector (Vector Icons) */}
          <div className="space-y-2 pt-1">
            <label className="text-slate-300 font-bold text-xs block">End Product Destination</label>
            <div className="grid grid-cols-2 gap-2">
              {REUSE_TYPES.map((r) => {
                const IconComponent = r.icon;
                const isSelected = selectedReuse === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedReuse(r.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all duration-200 flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-500/25 border-emerald-400 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-[#05180d] border-emerald-900/40 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-emerald-400 text-dark-950' : 'bg-emerald-950 text-emerald-400'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span>{r.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-1 italic">
              {REUSE_TYPES.find(r => r.id === selectedReuse)?.detail}
            </p>
          </div>

        </div>

      </div>

      {/* Interactive 4-Stage Navigation Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {STAGE_DETAILS.map((stage, idx) => {
          const StageIcon = stage.icon;
          const isActive = activeStage === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveStage(idx)}
              className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all duration-200 text-left ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-600/30 to-emerald-500/20 border-emerald-400 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'bg-[#072112]/80 border-emerald-900/40 text-slate-400 hover:text-slate-200 hover:border-emerald-700/50'
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isActive ? 'bg-emerald-500 text-dark-950 font-bold' : 'bg-emerald-950 text-emerald-400'}`}>
                <StageIcon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold block text-white">{stage.title.split('. ')[1]}</span>
                <span className="text-[10px] text-slate-400 font-medium">Stage {idx + 1}</span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
