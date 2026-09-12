import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeShieldCanvas = () => {
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

    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // 1. Hexagonal Cylinder Prism Core (Security Token)
    const hexGeo = new THREE.CylinderGeometry(3.5, 3.5, 0.8, 6);
    const hexMat = new THREE.MeshPhongMaterial({
      color: 0x059669,
      emissive: 0x047857,
      shininess: 90,
      transparent: true,
      opacity: 0.9,
    });
    const hexMesh = new THREE.Mesh(hexGeo, hexMat);
    hexMesh.rotation.x = Math.PI / 2;
    shieldGroup.add(hexMesh);

    // 2. Wireframe Hex Shield Outer Border
    const borderGeo = new THREE.CylinderGeometry(3.9, 3.9, 0.85, 6);
    const borderMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const borderMesh = new THREE.Mesh(borderGeo, borderMat);
    borderMesh.rotation.x = Math.PI / 2;
    shieldGroup.add(borderMesh);

    // 3. Orbiting Token Ring Nodes
    const ringGeo = new THREE.TorusGeometry(5.2, 0.03, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.5;
    shieldGroup.add(ring);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x34d399, 3, 40);
    pointLight.position.set(6, 6, 8);
    scene.add(pointLight);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      shieldGroup.rotation.y = elapsed * 0.4;
      shieldGroup.rotation.z = Math.sin(elapsed * 0.3) * 0.15;
      ring.rotation.z = elapsed * 0.2;

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
        ISO 14064 Security Shield Node
      </div>
    </div>
  );
};
