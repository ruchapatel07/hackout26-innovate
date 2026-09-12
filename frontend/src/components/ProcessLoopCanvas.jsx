import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Leaf, Factory, Recycle, Truck } from 'lucide-react';

export const ProcessLoopCanvas = () => {
  const containerRef = useRef(null);
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 440;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 450;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. 3D Glowing Particle Orbit Ring
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    const baseRadius = 145;
    const greenColor = new THREE.Color('#22c55e');
    const emeraldColor = new THREE.Color('#34d399');
    const cyanColor = new THREE.Color('#06b6d4');

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const radius = baseRadius + (Math.random() - 0.5) * 20;

      angles[i] = angle;
      radii[i] = radius;
      speeds[i] = 0.008 + Math.random() * 0.012;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

      const mix = Math.random();
      const col = mix > 0.6 ? emeraldColor : mix > 0.3 ? greenColor : cyanColor;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = Math.random() * 4 + 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle Material
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(34,197,94,0.8)');
    grad.addColorStop(1, 'rgba(34,197,94,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);

    const texture = new THREE.CanvasTexture(canvas);
    const pMaterial = new THREE.PointsMaterial({
      size: 6,
      vertexColors: true,
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(geometry, pMaterial);
    scene.add(particleSystem);

    // 3. 3D Torus Outer Energy Ring
    const torusGeo = new THREE.TorusGeometry(baseRadius, 1.2, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const torusRing = new THREE.Mesh(torusGeo, torusMat);
    scene.add(torusRing);

    // 4. Mouse Parallax Motion
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 5. Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Animate Particles along orbit
      const posAttr = geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        angles[i] += speeds[i];
        posAttr.array[i * 3] = Math.cos(angles[i]) * radii[i];
        posAttr.array[i * 3 + 1] = Math.sin(angles[i]) * radii[i];
      }
      posAttr.needsUpdate = true;

      // Rotate torus ring
      torusRing.rotation.z += 0.002;
      torusRing.rotation.x = Math.sin(Date.now() * 0.001) * 0.15;

      // Smooth camera / scene tilt parallax
      targetX += (mouseX * 0.3 - targetX) * 0.05;
      targetY += (mouseY * 0.3 - targetY) * 0.05;

      scene.rotation.y = targetX;
      scene.rotation.x = -targetY;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      pMaterial.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-[440px] h-[440px] flex items-center justify-center">
      
      {/* 3D Three.js WebGL Particle Canvas Background */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-auto cursor-grab active:cursor-grabbing"></div>

      {/* 3 Curved Connecting Arrows SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 440 440" fill="none">
        <defs>
          <marker id="three-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#e2e8f0" />
          </marker>
        </defs>

        {/* Transport -> Capture */}
        <path
          d="M 115,190 A 135,135 0 0,1 185,90"
          stroke="#e2e8f0"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#three-arrow)"
        />

        {/* Capture -> Reuse */}
        <path
          d="M 255,90 A 135,135 0 0,1 325,190"
          stroke="#e2e8f0"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#three-arrow)"
        />

        {/* Transport -> Reuse */}
        <path
          d="M 130,315 A 135,135 0 0,0 310,315"
          stroke="#e2e8f0"
          strokeWidth="2.5"
          strokeLinecap="round"
          markerEnd="url(#three-arrow)"
        />
      </svg>

      {/* Top Node: Capture */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none">
        <div className="w-[115px] h-[115px] rounded-full bg-[#082213]/90 border-2 border-emerald-500 flex flex-col items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5),inset_0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md hover:scale-105 transition duration-300">
          <Leaf className="w-10 h-10 text-white fill-white" />
          <span className="text-white font-bold text-sm mt-1">Capture</span>
        </div>
      </div>

      {/* Center Node: Match */}
      <div className="absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
        <div className="w-[125px] h-[125px] rounded-full bg-[#082213]/90 border-2 border-emerald-500 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.55),inset_0_0_25px_rgba(16,185,129,0.35)] backdrop-blur-md hover:scale-105 transition duration-300">
          <Factory className="w-11 h-11 text-white" />
          <span className="text-white font-bold text-sm mt-1">Match</span>
        </div>
      </div>

      {/* Left Node: Transport */}
      <div className="absolute left-4 top-[56%] -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
        <div className="w-[115px] h-[115px] rounded-full bg-[#082213]/90 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5),inset_0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md hover:scale-105 transition duration-300">
          <Truck className="w-12 h-12 text-white" />
        </div>
        <span className="text-white font-bold text-sm mt-2">Transport</span>
      </div>

      {/* Right Node: Reuse */}
      <div className="absolute right-4 top-[56%] -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none">
        <div className="w-[115px] h-[115px] rounded-full bg-[#082213]/90 border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_35px_rgba(16,185,129,0.5),inset_0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md hover:scale-105 transition duration-300">
          <Recycle className="w-12 h-12 text-white" />
        </div>
        <span className="text-white font-bold text-sm mt-2">Reuse</span>
      </div>

    </div>
  );
};
