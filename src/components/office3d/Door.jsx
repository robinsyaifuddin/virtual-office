import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Door: Pintu Klasik Dark 6-Panel Mewah dengan Aksen Emas Satin (Persis Referensi)
 */
export function Door({ position = [0, 0, 0], rotation = [0, 0, 0], width = 1.8, height = 3.2 }) {
  const doorTexture = useLoader(THREE.TextureLoader, '/classic_dark_door.png');
  doorTexture.colorSpace = THREE.SRGBColorSpace;

  const leafW = width - 0.2;
  const leafH = height - 0.15;

  return (
    <group position={position} rotation={rotation}>
      {/* Left Frame (Charcoal Dark Matte) */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, height, 0.35]} />
        <meshStandardMaterial color="#18181b" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Right Frame */}
      <mesh position={[width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.15, height, 0.35]} />
        <meshStandardMaterial color="#18181b" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Top Frame Lintle */}
      <mesh position={[0, height - 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.15, 0.16, 0.35]} />
        <meshStandardMaterial color="#18181b" metalness={0.2} roughness={0.5} />
      </mesh>

      {/* Floor Threshold Strip */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[width, 0.06, 0.35]} />
        <meshStandardMaterial color="#27272a" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Solid 6-Panel Classic Dark Leaf */}
      <mesh position={[0, leafH / 2 + 0.06, 0]} castShadow receiveShadow>
        <boxGeometry args={[leafW, leafH, 0.12]} />
        <meshStandardMaterial
          map={doorTexture}
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>

      {/* Aksen Emas Satin / Brushed Gold Hardware */}
      {/* 1. Gagang Pintu Lever Handle */}
      <mesh position={[leafW / 2 - 0.22, 1.3, 0.08]} castShadow>
        <boxGeometry args={[0.05, 0.22, 0.08]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[leafW / 2 - 0.18, 1.35, 0.09]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.08]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 2. Rim Lock Plate Box Samping Emas */}
      <mesh position={[leafW / 2 - 0.22, 1.7, 0.07]} castShadow>
        <boxGeometry args={[0.1, 0.12, 0.06]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* 3. Mata Kucing / Peephole Tengah Emas */}
      <mesh position={[0, leafH * 0.72, 0.07]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.25} />
      </mesh>
    </group>
  );
}
