import React from 'react';

/**
 * GlassPartition: Partisi kaca tempered modern dengan frame aluminium navy
 */
export function GlassPartition({
  position = [0, 0, 0],
  size = [2, 3.2, 0.15],
  tint = '#38bdf8'
}) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      {/* Aluminum frame bottom */}
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.2, d + 0.05]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Aluminum frame top */}
      <mesh position={[0, h - 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.2, d + 0.05]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Left pillar */}
      <mesh position={[-w / 2 + 0.05, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, h, d + 0.05]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[w / 2 - 0.05, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.1, h, d + 0.05]} />
        <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Glass Pane Transparan */}
      <mesh position={[0, h / 2, 0]}>
        <boxGeometry args={[w - 0.1, h - 0.3, d]} />
        <meshPhysicalMaterial
          color={tint}
          transparent={true}
          opacity={0.35}
          roughness={0.05}
          metalness={0.1}
          transmission={0.85}
          ior={1.4}
          thickness={0.2}
        />
      </mesh>

      {/* DigiBooster Cyan stripe on glass */}
      <mesh position={[0, h * 0.45, 0]}>
        <boxGeometry args={[w - 0.1, 0.08, d * 1.05]} />
        <meshStandardMaterial color="#00B9F1" emissive="#00B9F1" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}
