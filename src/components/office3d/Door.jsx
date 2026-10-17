import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Door: Pintu Modern Dark Wood 5-Line Inlay dengan Gagang Stainless Minimalis (Persis Referensi Foto)
 */
export function Door({ position = [0, 0, 0], rotation = [0, 0, 0], width = 1.25, height = 2.2 }) {
  const doorTexture = useLoader(THREE.TextureLoader, '/modern_dark_door.webp');
  doorTexture.colorSpace = THREE.SRGBColorSpace;

  const leafW = width - 0.12;
  const leafH = height - 0.08;

  return (
    <group position={position} rotation={rotation}>
      {/* Left Frame (Charcoal Dark Matte / Dark Espresso) */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.10, height, 0.25]} />
        <meshStandardMaterial color="#18181b" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Right Frame */}
      <mesh position={[width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.10, height, 0.25]} />
        <meshStandardMaterial color="#18181b" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Top Frame Lintle */}
      <mesh position={[0, height - 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.10, 0.10, 0.25]} />
        <meshStandardMaterial color="#18181b" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Floor Threshold Strip */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[width, 0.04, 0.25]} />
        <meshStandardMaterial color="#27272a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Solid Modern Dark Door Leaf (5 Horizontal Silver Inlays) */}
      <mesh position={[0, leafH / 2 + 0.04, 0]} castShadow receiveShadow>
        <boxGeometry args={[leafW, leafH, 0.06]} />
        <meshStandardMaterial
          map={doorTexture}
          roughness={0.35}
          metalness={0.12}
        />
      </mesh>

      {/* Aksen Gagang Pintu Minimalis Modern Square Plate & Silver Lever */}
      {/* 1. Square Backplate Stainless Steel */}
      <mesh position={[leafW / 2 - 0.12, 1.05, 0.045]} castShadow>
        <boxGeometry args={[0.045, 0.055, 0.03]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* 2. Tuas Gagang Pintu Silver Lever Handle */}
      <mesh position={[leafW / 2 - 0.08, 1.05, 0.06]} castShadow>
        <boxGeometry args={[0.10, 0.022, 0.03]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  );
}
