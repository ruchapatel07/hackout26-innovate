import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06150b, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Main Central CO2 Molecule Node
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Central Carbon Atom
    const carbonGeo = new THREE.SphereGeometry(1.4, 32, 32);
    const carbonMat = new THREE.MeshPhongMaterial({
      color: 0x10b981,
      emissive: 0x047857,
      shininess: 90,
      transparent: true,
      opacity: 0.95,
    });
    const carbonMesh = new THREE.Mesh(carbonGeo, carbonMat);
    coreGroup.add(carbonMesh);

    // Outer Glow Shield
    const shieldGeo = new THREE.SphereGeometry(1.75, 24, 24);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    coreGroup.add(shieldMesh);

    // Oxygen Atoms (O = C = O)
    const oxygenGeo = new THREE.SphereGeometry(0.95, 28, 28);
    const oxygenMat = new THREE.MeshPhongMaterial({
      color: 0x06b6d4,
      emissive: 0x0891b2,
      shininess: 80,
    });

    const o1 = new THREE.Mesh(oxygenGeo, oxygenMat);
    o1.position.set(-3.2, 0, 0);
    coreGroup.add(o1);

    const o2 = new THREE.Mesh(oxygenGeo, oxygenMat);
    o2.position.set(3.2, 0, 0);
    coreGroup.add(o2);

    // Double Bond Cylinders
    const bondMat = new THREE.MeshBasicMaterial({ color: 0x6ee7b7, transparent: true, opacity: 0.7 });
    const createBonds = (xOffset) => {
      const bGroup = new THREE.Group();
      const bGeo = new THREE.CylinderGeometry(0.1, 0.1, 2.4, 12);

      const b1 = new THREE.Mesh(bGeo, bondMat);
      b1.rotation.z = Math.PI / 2;
      b1.position.set(xOffset, 0.3, 0);

      const b2 = new THREE.Mesh(bGeo, bondMat);
      b2.rotation.z = Math.PI / 2;
      b2.position.set(xOffset, -0.3, 0);

      bGroup.add(b1);
      bGroup.add(b2);
      return bGroup;
    };

    coreGroup.add(createBonds(-1.6));
    coreGroup.add(createBonds(1.6));

    // 3. Orbiting Particle Sphere Field
    const particleCount = 450;
    const pPositions = new Float32Array(particleCount * 3);
    const pColors = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#10b981');
    const color2 = new THREE.Color('#06b6d4');
    const color3 = new THREE.Color('#a7f3d0');

    for (let i = 0; i < particleCount; i++) {
      const radius = 4.5 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = radius * Math.cos(phi);

      const mixColor = Math.random() > 0.5 ? color1 : Math.random() > 0.5 ? color2 : color3;
      pColors[i * 3] = mixColor.r;
      pColors[i * 3 + 1] = mixColor.g;
      pColors[i * 3 + 2] = mixColor.b;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    // Draw particle texture
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.4, 'rgba(52,211,153,0.8)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const pTexture = new THREE.CanvasTexture(canvas);
    const pMat = new THREE.PointsMaterial({
      size: 0.35,
      map: pTexture,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 4. Orbiting Torus Rings
    const ringGeo1 = new THREE.TorusGeometry(6.2, 0.03, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.4 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(7.8, 0.02, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.3 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    scene.add(ring2);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x34d399, 3, 50);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Mouse movement response
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / height - 0.5) * 2;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotation
      coreGroup.rotation.y = elapsed * 0.45;
      coreGroup.rotation.x = Math.sin(elapsed * 0.3) * 0.2;

      particles.rotation.y = elapsed * 0.12;
      particles.rotation.z = elapsed * 0.08;

      ring1.rotation.z = elapsed * 0.2;
      ring2.rotation.x = elapsed * 0.15;

      // Parallax smooth interpolation
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#06150b]/80 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 backdrop-blur-md shadow-md">
        Interactive CO₂ Molecular Sphere
      </div>
    </div>
  );
};
