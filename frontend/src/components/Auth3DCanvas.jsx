import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ShieldCheck, Sparkles, Atom, Activity } from 'lucide-react';

const ROLE_THEMES = {
  buyer: {
    tag: 'BUYER WORKSPACE',
    title: 'Industrial CO₂ Sourcing Platform',
    subtitle: 'Connecting captured industrial CO₂ streams to verified commercial off-takers.',
    color: 0x10b981, // Emerald
    accent: 0x06b6d4, // Cyan
  },
  seller: {
    tag: 'SELLER WORKSPACE',
    title: 'Industrial Emission Monetization',
    subtitle: 'Monetize high-purity (99.9%) captured carbon dioxide streams on spot markets.',
    color: 0x22c55e, // Green
    accent: 0x34d399, // Bright emerald
  },
  transporter: {
    tag: 'LOGISTICS WORKSPACE',
    title: 'Cryogenic CO₂ Liquid Transport',
    subtitle: 'Monitor pressurized liquid CO₂ telemetry, IoT fleet routes, and tank conditions.',
    color: 0x14b8a6, // Teal
    accent: 0x38bdf8, // Sky blue
  },
  admin: {
    tag: 'ADMIN GOVERNANCE',
    title: 'ISO 14064 Compliance Tracking',
    subtitle: 'Enterprise audit logs, AI price forecasting, and system security key validation.',
    color: 0xf59e0b, // Amber
    accent: 0x10b981, // Emerald
  },
};

export const Auth3DCanvas = ({ role = 'buyer' }) => {
  const mountRef = useRef(null);
  const theme = ROLE_THEMES[role] || ROLE_THEMES.buyer;
  const [atomScreenPositions, setAtomScreenPositions] = useState({ c: null, o1: null, o2: null });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || container.parentElement?.clientWidth || 600;
    let height = container.clientHeight || container.parentElement?.clientHeight || 650;
    if (height < 300) height = 650;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020a05, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.4);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. 3D CO2 Molecular Group (O = C = O)
    const moleculeGroup = new THREE.Group();
    moleculeGroup.position.set(0, 0.65, 0);
    scene.add(moleculeGroup);

    // --- Central Carbon Atom (C) ---
    const carbonGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const carbonMat = new THREE.MeshPhongMaterial({
      color: 0x051e12,
      emissive: theme.color,
      emissiveIntensity: 0.6,
      shininess: 120,
    });
    const carbonMesh = new THREE.Mesh(carbonGeo, carbonMat);
    carbonMesh.position.set(0, 0, 0);
    moleculeGroup.add(carbonMesh);

    // Carbon Outer Valence Electron Shield
    const carbonShieldGeo = new THREE.SphereGeometry(1.08, 20, 20);
    const carbonShieldMat = new THREE.MeshBasicMaterial({
      color: theme.accent,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const carbonShield = new THREE.Mesh(carbonShieldGeo, carbonShieldMat);
    moleculeGroup.add(carbonShield);

    // --- Oxygen Atom 1 (Left O) ---
    const oGeo = new THREE.SphereGeometry(0.65, 32, 32);
    const oMat = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      emissive: theme.accent,
      emissiveIntensity: 0.75,
      shininess: 100,
    });

    const o1 = new THREE.Mesh(oGeo, oMat);
    o1.position.set(-2.35, 0, 0);
    moleculeGroup.add(o1);

    // --- Oxygen Atom 2 (Right O) ---
    const o2 = new THREE.Mesh(oGeo, oMat);
    o2.position.set(2.35, 0, 0);
    moleculeGroup.add(o2);

    // --- Double Covalent Energy Bonds (=) ---
    const bondDistance = 2.35;
    const bondMat = new THREE.MeshBasicMaterial({
      color: theme.accent,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    });

    const createDoubleBond = (direction) => {
      const bondGroup = new THREE.Group();
      const bondOffset = 0.16;

      const bond1Geo = new THREE.CylinderGeometry(0.08, 0.08, bondDistance, 14);
      const b1 = new THREE.Mesh(bond1Geo, bondMat);
      b1.position.set((direction * bondDistance) / 2, bondOffset, 0);
      b1.rotation.z = Math.PI / 2;

      const b2 = new THREE.Mesh(bond1Geo, bondMat);
      b2.position.set((direction * bondDistance) / 2, -bondOffset, 0);
      b2.rotation.z = Math.PI / 2;

      bondGroup.add(b1);
      bondGroup.add(b2);
      return bondGroup;
    };

    const leftBond = createDoubleBond(-1);
    const rightBond = createDoubleBond(1);
    moleculeGroup.add(leftBond);
    moleculeGroup.add(rightBond);

    // --- Orbital Energy Rings ---
    const ring1Geo = new THREE.TorusGeometry(2.95, 0.02, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: theme.color,
      transparent: true,
      opacity: 0.3,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    moleculeGroup.add(ring1);

    // --- Orbiting Micro Electron Particles ---
    const particleCount = 100;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const r = 2.5 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePos[i * 3] = r * Math.cos(phi) * Math.cos(theta);
      particlePos[i * 3 + 1] = r * Math.sin(phi);
      particlePos[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: theme.accent,
      size: 0.04,
      transparent: true,
      opacity: 0.55,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    moleculeGroup.add(particles);

    // 3. Lighting (Atmospheric & Specular)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(4, 6, 5);
    scene.add(dirLight);

    const pointLight1 = new THREE.PointLight(theme.color, 4, 15);
    pointLight1.position.set(3, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(theme.accent, 3, 15);
    pointLight2.position.set(-3, -3, 3);
    scene.add(pointLight2);

    // 4. Mouse Interactive Parallax
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      mouseX = (x / width) * 0.6;
      mouseY = (y / height) * 0.6;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const w = entry.contentRect.width || container.clientWidth;
        const h = entry.contentRect.height || container.clientHeight || 650;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });

    resizeObserver.observe(container);

    // 6. Animation Loop & 3D-to-2D Screen Position Tracking
    let animationId;
    let clock = new THREE.Clock();
    const tempVec = new THREE.Vector3();

    const animate = () => {
      const time = clock.getElapsedTime();

      // Molecule Rotation
      moleculeGroup.rotation.y = time * 0.28;
      carbonShield.rotation.y = -time * 0.45;
      ring1.rotation.z = time * 0.15;

      // Symmetrical Bond Vibration
      const vibration = Math.sin(time * 3.5) * 0.04;
      o1.position.x = -2.35 - vibration;
      o2.position.x = 2.35 + vibration;

      // Mouse Lerp
      moleculeGroup.rotation.x += (mouseY * 0.3 - moleculeGroup.rotation.x) * 0.05;
      moleculeGroup.rotation.z += (-mouseX * 0.3 - moleculeGroup.rotation.z) * 0.05;

      // Update 3D -> 2D Screen Coordinates for Floating Badges
      const projectPoint = (mesh) => {
        tempVec.setFromMatrixPosition(mesh.matrixWorld);
        tempVec.project(camera);
        const x = (tempVec.x * 0.5 + 0.5) * width;
        const y = (-(tempVec.y * 0.5) + 0.5) * height;
        return { x, y };
      };

      setAtomScreenPositions({
        c: projectPoint(carbonMesh),
        o1: projectPoint(o1),
        o2: projectPoint(o2),
      });

      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      scene.clear();
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [role, theme]);

  return (
    <div className="relative w-full h-full min-h-[580px] flex flex-col justify-between p-8 sm:p-10 select-none overflow-hidden bg-gradient-to-br from-[#04190c] via-[#020d06] to-[#010804]">
      
      {/* Soft Ambient Backdrop Radial Light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 3D WebGL Canvas Mounting Container */}
      <div ref={mountRef} className="absolute inset-0 z-0 w-full h-full pointer-events-none" />

      {/* Sleek Floating Glass Badges tracking 3D Atom Coordinates */}
      {atomScreenPositions.o1 && (
        <div
          style={{ left: `${atomScreenPositions.o1.x}px`, top: `${atomScreenPositions.o1.y - 42}px` }}
          className="absolute z-20 -translate-x-1/2 px-3 py-1 rounded-full bg-[#082a17]/90 border border-emerald-400/50 backdrop-blur-md text-emerald-300 font-extrabold text-[11px] shadow-lg shadow-emerald-950/80 flex items-center gap-1.5 pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>O (Oxygen)</span>
        </div>
      )}

      {atomScreenPositions.c && (
        <div
          style={{ left: `${atomScreenPositions.c.x}px`, top: `${atomScreenPositions.c.y - 45}px` }}
          className="absolute z-20 -translate-x-1/2 px-3 py-1 rounded-full bg-[#03150b]/95 border border-emerald-500/70 backdrop-blur-md text-white font-black text-[11px] shadow-xl shadow-emerald-950/90 flex items-center gap-1.5 pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>C (Carbon Core)</span>
        </div>
      )}

      {atomScreenPositions.o2 && (
        <div
          style={{ left: `${atomScreenPositions.o2.x}px`, top: `${atomScreenPositions.o2.y - 42}px` }}
          className="absolute z-20 -translate-x-1/2 px-3 py-1 rounded-full bg-[#082a17]/90 border border-emerald-400/50 backdrop-blur-md text-emerald-300 font-extrabold text-[11px] shadow-lg shadow-emerald-950/80 flex items-center gap-1.5 pointer-events-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>O (Oxygen)</span>
        </div>
      )}

      {/* Top HUD Header Status Bar */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#062010]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/40 text-emerald-400 text-xs font-bold tracking-wide shadow-md">
          <Atom className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '7s' }} />
          <span>{theme.tag}</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-extrabold bg-[#03140a]/90 px-3.5 py-1.5 rounded-full border border-emerald-500/50 shadow-md">
          <span className="text-slate-400">STRUCTURE:</span>
          <span className="text-white font-mono bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-700/80">
            O = C = O
          </span>
        </div>
      </div>

      {/* Bottom Sleek Glass Info Banner */}
      <div className="relative z-10 space-y-3 max-w-md bg-[#051c0d]/90 p-6 rounded-3xl border border-emerald-500/30 backdrop-blur-2xl shadow-2xl mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
              MOLECULAR CO₂ SIMULATION
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>44.01 g/mol</span>
          </div>
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug">
          {theme.title}
        </h3>
        
        <p className="text-xs text-slate-300 font-medium leading-relaxed">
          {theme.subtitle}
        </p>

        <div className="pt-2 border-t border-emerald-900/50 flex items-center justify-between text-[11px] text-emerald-400 font-semibold">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ISO 14064 Verified Origin
          </span>
          <span className="text-emerald-300 font-mono">Formula: CO₂</span>
        </div>
      </div>

    </div>
  );
};
