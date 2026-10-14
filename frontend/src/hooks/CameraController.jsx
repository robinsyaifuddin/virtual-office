import React, { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useOfficeStore } from '../store/officeStore';

/**
 * CameraController: Mengatur pergerakan halus OrbitControls kamera orthographic
 * Mendukung fokus ke ruangan/karakter, batasan zoom, dan pencegahan sudut menembus lantai.
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
      // Smooth interpolation lerp menuju fokus ruangan/agent
      currentLookAt.current.lerp(targetVec.current, Math.min(1, delta * 4));
      controlsRef.current.target.copy(currentLookAt.current);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping={true}
      dampingFactor={0.05}
      // Membatasi rotasi vertikal agar tidak menembus lantai atau melihat dari bawah
      minPolarAngle={Math.PI / 8} // ~22.5 derajat
      maxPolarAngle={Math.PI / 2.3} // ~78 derajat (tidak pernah di bawah lantai)
      // Batas jarak orbit perspective camera
      minDistance={15}
      maxDistance={140}
      // Pan kecepatan halus
      panSpeed={1.0}
      rotateSpeed={0.7}
      enableRotate={true}
      enablePan={true}
      enableZoom={true}
    />
  );
}
