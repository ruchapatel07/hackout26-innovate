import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeRadarCanvas = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 450;
    const height = container.clientHeight || 360;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Radar Wireframe Outer Sphere
    const sphereGeo = new THREE.IcosahedronGeometry(4.8, 2);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    mainGroup.add(sphereMesh);

    // 2. Central Core AI Pulsing Orb
    const coreGeo = new THREE.SphereGeometry(1.2, 24, 24);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x34d399,
      emissive: 0x059669,
      shininess: 100,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    mainGroup.add(coreMesh);

    // 3. Node Points (Suppliers & Buyers)
    const nodeCount = 8;
    const nodeGroup = new THREE.Group();
    const nodePositions = [
      [3.2, 2.1, 1.5],
      [-3.5, 1.8, -1.2],
      [2.8, -3.1, -2.0],
      [-2.9, -2.4, 2.2],
      [4.0, -1.0, 1.8],
      [-4.2, 0.8, -2.5],
      [1.5, 3.8, -1.9],
      [-1.8, -3.9, 1.4],
    ];

    const nodeGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const nodeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });

    const lineMat = new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.6 });

    nodePositions.forEach((pos) => {
      const nMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nMesh.position.set(pos[0], pos[1], pos[2]);
      nodeGroup.add(nMesh);

      // Connecting laser beam to central core
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(pos[0], pos[1], pos[2]),
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      nodeGroup.add(line);
    });

    mainGroup.add(nodeGroup);

    // 4. Radar Scanning Ring
    const ringGeo = new THREE.RingGeometry(0.1, 5.2, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x6ee7b7,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const scanRing = new THREE.Mesh(ringGeo, ringMat);
    scanRing.rotation.x = Math.PI / 2;
    mainGroup.add(scanRing);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x34d399, 2.5, 30);
    pointLight.position.set(5, 8, 8);
    scene.add(pointLight);

    let animId;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      mainGroup.rotation.y = elapsed * 0.35;
      mainGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.15;
      scanRing.position.y = Math.sin(elapsed * 2) * 1.5;

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
        AI Radar Matchmaking Mesh
      </div>
    </div>
  );
};
