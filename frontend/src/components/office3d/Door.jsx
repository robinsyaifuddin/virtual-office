import React from 'react';

/**
 * Door: Pintu bukaan koridor dengan kusen elegan
 */
export function Door({ position = [0, 0, 0], rotation = [0, 0, 0], width = 1.8, height = 3.2 }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Left Frame */}
      <mesh position={[-width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, height, 0.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Right Frame */}
      <mesh position={[width / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, height, 0.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Top Frame Lintle */}
      <mesh position={[0, height - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.2, 0.2, 0.4]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Floor Threshold Strip */}
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[width, 0.06, 0.4]} />
        <meshStandardMaterial color="#00B9F1" metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );
}
