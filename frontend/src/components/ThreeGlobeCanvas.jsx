import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeGlobeCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 15);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // 1. Globe Mesh
    const sphereGeo = new THREE.SphereGeometry(4.2, 32, 32);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x064e3b,
      emissive: 0x022c22,
      wireframe: true,
      transparent: true,
      opacity: 0.8,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // 2. Inner Solid Atmosphere Core
    const innerGeo = new THREE.SphereGeometry(3.9, 24, 24);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x082b17,
      transparent: true,
      opacity: 0.9,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    globeGroup.add(innerMesh);

    // 3. Orbiting Carbon Rings
    const ringGeo1 = new THREE.TorusGeometry(5.4, 0.04, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.7 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    globeGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(6.2, 0.03, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.5 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    globeGroup.add(ring2);

    // 4. Orbiting Particles
    const pCount = 200;
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const radius = 5.2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPositions[i * 3 + 2] = radius * Math.cos(phi);
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.25,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    globeGroup.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x10b981, 2, 40);
    pointLight.position.set(8, 8, 8);
    scene.add(pointLight);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      globeGroup.rotation.y = elapsed * 0.25;
      ring1.rotation.z = elapsed * 0.3;
      ring2.rotation.x = elapsed * 0.2;
      particles.rotation.y = elapsed * 0.15;

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
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[320px] sm:h-[380px] relative flex items-center justify-center cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#06150b]/80 border border-emerald-500/30 text-[11px] font-bold text-emerald-400 backdrop-blur-md shadow-md">
        Eco-Sphere Circular Network
      </div>
    </div>
  );
};
