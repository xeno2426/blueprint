import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Eye, EyeOff, Box, Compass, RefreshCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export default function MechView3D({ project, onPartClick }) {
  const mountRef = useRef(null);
  const [explodedOffset, setExplodedOffset] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [enclosureOpacity, setEnclosureOpacity] = useState(0.85);
  const [activePreset, setActivePreset] = useState('iso');

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const explodedPartsRef = useRef([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0c0c0c);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(160, 140, 200);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(100, 200, 150);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 1024;
    dirLight1.shadow.mapSize.height = 1024;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x3b82f6, 0.5);
    dirLight2.position.set(-150, -50, -100);
    scene.add(dirLight2);

    // 5. Grid Helper & Floor
    const gridHelper = new THREE.GridHelper(300, 30, 0x3f403f, 0x1f2937);
    gridHelper.position.y = -30;
    scene.add(gridHelper);

    // 6. Build CAD Assembly Model
    const cadRoot = new THREE.Group();
    scene.add(cadRoot);

    const partsList = [];

    // Base Enclosure Bottom
    const encBottomGeo = new THREE.BoxGeometry(160, 20, 110);
    const encMat = new THREE.MeshStandardMaterial({
      color: 0x22252a,
      roughness: 0.35,
      metalness: 0.2,
      wireframe: wireframe,
      transparent: true,
      opacity: enclosureOpacity
    });
    const encBottom = new THREE.Mesh(encBottomGeo, encMat);
    encBottom.position.set(0, -15, 0);
    encBottom.castShadow = true;
    encBottom.receiveShadow = true;
    cadRoot.add(encBottom);
    partsList.push({ mesh: encBottom, basePos: new THREE.Vector3(0, -15, 0), explodeDir: new THREE.Vector3(0, -1, 0) });

    // Main PCB (Green fiberglass + gold traces)
    const pcbGeo = new THREE.BoxGeometry(130, 3.2, 85);
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x104825,
      roughness: 0.4,
      metalness: 0.3,
      wireframe: wireframe
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.position.set(0, 0, 0);
    pcb.castShadow = true;
    pcb.receiveShadow = true;
    cadRoot.add(pcb);
    partsList.push({ mesh: pcb, basePos: new THREE.Vector3(0, 0, 0), explodeDir: new THREE.Vector3(0, 0, 0) });

    // 4 Brass Standoffs
    const standoffGeo = new THREE.CylinderGeometry(3, 3, 12, 16);
    const standoffMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.3 });
    const standoffCoords = [
      [-60, -7.5, -38],
      [60, -7.5, -38],
      [-60, -7.5, 38],
      [60, -7.5, 38]
    ];
    standoffCoords.forEach(pos => {
      const so = new THREE.Mesh(standoffGeo, standoffMat);
      so.position.set(...pos);
      cadRoot.add(so);
      partsList.push({ mesh: so, basePos: new THREE.Vector3(...pos), explodeDir: new THREE.Vector3(0, -0.5, 0) });
    });

    // Main Microcontroller IC Chip
    const mcuGeo = new THREE.BoxGeometry(32, 4, 32);
    const mcuMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.2, metalness: 0.1 });
    const mcu = new THREE.Mesh(mcuGeo, mcuMat);
    mcu.position.set(-25, 3.5, 0);
    mcu.castShadow = true;
    cadRoot.add(mcu);
    partsList.push({ mesh: mcu, basePos: new THREE.Vector3(-25, 3.5, 0), explodeDir: new THREE.Vector3(0, 0.4, 0) });

    // Metal Shielding Can on MCU
    const shieldGeo = new THREE.BoxGeometry(26, 3, 26);
    const shieldMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 });
    const shield = new THREE.Mesh(shieldGeo, shieldMat);
    shield.position.set(-25, 6, 0);
    cadRoot.add(shield);
    partsList.push({ mesh: shield, basePos: new THREE.Vector3(-25, 6, 0), explodeDir: new THREE.Vector3(0, 0.6, 0) });

    // Electrolytic Capacitor Cylinders
    const capGeo = new THREE.CylinderGeometry(5, 5, 14, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, metalness: 0.6, roughness: 0.3 });
    const cap1 = new THREE.Mesh(capGeo, capMat);
    cap1.position.set(40, 8.5, -25);
    cadRoot.add(cap1);
    partsList.push({ mesh: cap1, basePos: new THREE.Vector3(40, 8.5, -25), explodeDir: new THREE.Vector3(0, 0.5, 0) });

    const cap2 = new THREE.Mesh(capGeo, capMat);
    cap2.position.set(40, 8.5, -10);
    cadRoot.add(cap2);
    partsList.push({ mesh: cap2, basePos: new THREE.Vector3(40, 8.5, -10), explodeDir: new THREE.Vector3(0, 0.5, 0) });

    // USB-C Connector (Metal Stainless Steel)
    const usbGeo = new THREE.BoxGeometry(10, 4.5, 14);
    const usbMat = new THREE.MeshStandardMaterial({ color: 0x9ca3af, metalness: 0.85, roughness: 0.25 });
    const usb = new THREE.Mesh(usbGeo, usbMat);
    usb.position.set(-66, 3.5, 0);
    cadRoot.add(usb);
    partsList.push({ mesh: usb, basePos: new THREE.Vector3(-66, 3.5, 0), explodeDir: new THREE.Vector3(-0.6, 0, 0) });

    // Top Enclosure Lid
    const encTopGeo = new THREE.BoxGeometry(160, 8, 110);
    const encTopMat = new THREE.MeshStandardMaterial({
      color: 0x33373e,
      roughness: 0.3,
      metalness: 0.2,
      wireframe: wireframe,
      transparent: true,
      opacity: enclosureOpacity
    });
    const encTop = new THREE.Mesh(encTopGeo, encTopMat);
    encTop.position.set(0, 22, 0);
    encTop.castShadow = true;
    cadRoot.add(encTop);
    partsList.push({ mesh: encTop, basePos: new THREE.Vector3(0, 22, 0), explodeDir: new THREE.Vector3(0, 1.5, 0) });

    explodedPartsRef.current = partsList;

    // 7. Interactive Mouse Orbit Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = { radius: 240, theta: Math.PI / 4, phi: Math.PI / 3 };

    const updateCameraFromSpherical = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    };

    updateCameraFromSpherical();

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi - deltaY * 0.008));

      updateCameraFromSpherical();
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const onWheel = (e) => {
      e.preventDefault();
      spherical.radius = Math.max(80, Math.min(500, spherical.radius + e.deltaY * 0.2));
      updateCameraFromSpherical();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // 8. Animation Loop with gentle slow rotation
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Subtle slow turntable idle spin when not actively dragged
      if (!isDragging) {
        spherical.theta += 0.0012;
        updateCameraFromSpherical();
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Listener
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update exploded view offsets
  useEffect(() => {
    explodedPartsRef.current.forEach(({ mesh, basePos, explodeDir }) => {
      mesh.position.x = basePos.x + explodeDir.x * explodedOffset;
      mesh.position.y = basePos.y + explodeDir.y * explodedOffset;
      mesh.position.z = basePos.z + explodeDir.z * explodedOffset;
    });
  }, [explodedOffset]);

  // Set Camera View Presets
  const setPreset = (type) => {
    if (!cameraRef.current) return;
    setActivePreset(type);
    const camera = cameraRef.current;
    if (type === 'iso') {
      camera.position.set(160, 140, 200);
    } else if (type === 'top') {
      camera.position.set(0, 280, 0.1);
    } else if (type === 'front') {
      camera.position.set(0, 0, 280);
    } else if (type === 'side') {
      camera.position.set(280, 0, 0);
    }
    camera.lookAt(0, 0, 0);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0c0c0c] select-none overflow-hidden">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

      {/* Top Floating CAD Badge */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-[#131313]/90 border border-[#272828] rounded-md px-3.5 py-2 backdrop-blur-md">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-tech text-xs tracking-wider uppercase text-gray-300">
          Reference model (generic)
        </span>
        <span className="text-[10px] font-mono text-gray-500 bg-[#1c1c1c] px-2 py-0.5 rounded border border-[#333]">
          {project?.nodes?.length || 0} parts in BOM
        </span>
      </div>

      {/* Viewport Camera Presets */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-[#131313]/90 border border-[#272828] rounded-md p-1.5 backdrop-blur-md">
        {['iso', 'top', 'front', 'side'].map((p) => (
          <button
            key={p}
            onClick={() => setPreset(p)}
            className={`px-2.5 py-1 text-xs font-mono uppercase rounded transition-colors ${
              activePreset === p ? 'bg-[#3f403f] text-white font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-6 bg-[#131313]/95 border border-[#272828] rounded-lg px-6 py-3 backdrop-blur-md shadow-2xl">
        {/* Exploded View Slider */}
        <div className="flex items-center gap-3">
          <Layers size={14} className="text-gray-400" />
          <span className="text-xs font-mono uppercase tracking-wider text-gray-400 min-w-max">
            Exploded Assembly: {Math.round(explodedOffset)}%
          </span>
          <input
            type="range"
            min="0"
            max="60"
            value={explodedOffset}
            onChange={(e) => setExplodedOffset(parseFloat(e.target.value))}
            className="w-32 accent-blue-500 cursor-pointer h-1.5 bg-gray-700 rounded-lg"
          />
        </div>

        <div className="w-px h-5 bg-[#272828]" />

        {/* CAD Material / Enclosure Toggle */}
        <div className="flex items-center gap-2">
          <Box size={14} className="text-gray-400" />
          <span className="text-xs font-mono uppercase text-gray-400">Enclosure:</span>
          <button
            onClick={() => setEnclosureOpacity(enclosureOpacity === 0 ? 0.85 : 0)}
            className="px-2.5 py-1 text-xs font-mono rounded border border-[#3f403f] hover:border-gray-400 text-gray-300 transition-colors"
          >
            {enclosureOpacity > 0 ? 'Visible' : 'Hidden'}
          </button>
        </div>

        <div className="w-px h-5 bg-[#272828]" />

        <div className="text-[11px] font-mono text-gray-500">
          Left Drag: Rotate • Right Drag: Pan • Scroll: Zoom
        </div>
      </div>
    </div>
  );
}
