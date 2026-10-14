import React from 'react';

/**
 * FloorTile: Ubin lantai voxel modular dengan border bevel halus
 */
export function FloorTile({ position = [0, 0, 0], size = [1, 0.2, 1], color = '#1e293b', accentColor = '#334155' }) {
  return (
    <group position={position}>
      {/* Base slab */}
      <mesh position={[0, -size[1] / 2, 0]} receiveShadow>
        <boxGeometry args={[size[0], size[1], size[2]]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Thin floor grid trim */}
      <mesh position={[0, 0.005, 0]} receiveShadow>
        <planeGeometry args={[size[0] * 0.96, size[2] * 0.96]} />
        <meshStandardMaterial 
          color={accentColor || color} 
          roughness={0.6} 
          metalness={0.15} 
          rotation={[-Math.PI / 2, 0, 0]} 
        />
      </mesh>
    </group>
  );
}
