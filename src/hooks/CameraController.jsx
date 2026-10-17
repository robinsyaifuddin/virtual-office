import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useOfficeStore } from '../store/officeStore';

/**
 * CameraController: Mengatur pergerakan halus OrbitControls kamera orthographic
 * Mendukung fokus ke ruangan/karakter, batasan zoom, dan pencegahan sudut menembus lantai.
 * Dioptimasi: exponential lerp (frame-rate independent), damping lebih responsif.
 */
export function CameraController() {
  const controlsRef = useRef();
  const { camera } = useThree();
  const cameraTarget = useOfficeStore((state) => state.cameraTarget);
  const cameraZoom = useOfficeStore((state) => state.cameraZoom);

  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetVec = useRef(new THREE.Vector3(...cameraTarget));

  useEffect(() => {
    targetVec.current.set(...cameraTarget);
  }, [cameraTarget]);

  useFrame((_, delta) => {
    if (controlsRef.current) {
      // Exponential lerp — stabil di semua FPS (30, 60, 120fps)
      const alpha = 1 - Math.pow(0.01, delta * 6);
      currentLookAt.current.lerp(targetVec.current, alpha);
      controlsRef.current.target.copy(currentLookAt.current);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.12}         // Lebih responsif, settle lebih cepat
      rotateSpeed={1.0}            // Putar cepat dan natural
      zoomSpeed={1.2}              // Zoom responsif
      panSpeed={1.2}               // Pan natural
      // Membatasi rotasi vertikal agar tidak menembus lantai atau melihat dari bawah
      minPolarAngle={Math.PI / 8}  // ~22.5 derajat
      maxPolarAngle={Math.PI / 2.3} // ~78 derajat
      // Batas jarak orbit perspective camera
      minDistance={10}
      maxDistance={120}
      enableRotate={true}
      enablePan={true}
      enableZoom={true}
    />
  );
}
