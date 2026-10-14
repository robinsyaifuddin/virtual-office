import React from 'react';

/**
 * WallSegment: Dinding modular voxel dengan base skirting board
 */
export function WallSegment({
  position = [0, 0, 0],
  size = [1, 3.5, 0.4],
  color = '#101B2D',
  skirtingColor = '#00B9F1'
}) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      {/* Main wall body */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={0.05} />
      </mesh>
      {/* Skirting line aksen DigiBooster Cyan/Navy */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.002, 0.2, d * 1.05]} />
        <meshStandardMaterial color={skirtingColor} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Top cornice trim */}
      <mesh position={[0, h - 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[w * 1.002, 0.16, d * 1.05]} />
        <meshStandardMaterial color="#0b1320" roughness={0.5} />
      </mesh>
    </group>
  );
}
