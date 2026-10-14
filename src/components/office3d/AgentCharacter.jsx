import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { STATUS_COLORS } from '../../data/agents';
import { useOfficeStore } from '../../store/officeStore';

/**
 * StatusIndicator: Lingkaran pulsing status & badge di atas kepala agent
 */
export function StatusIndicator({ status = 'Working', position = [0, 2.8, 0] }) {
  const meshRef = useRef();
  const color = STATUS_COLORS[status] || '#10b981';

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating & pulsing effect
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = position[1] + Math.sin(t * 3) * 0.08;
      const s = 1 + Math.sin(t * 4) * 0.12;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      {/* Outer Halo Disc */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/**
 * RoomLabel: Label 3D di atas ruangan yang bisa disembunyikan / ditampilkan
 */
export function RoomLabel({ room, onClick }) {
  const labelsVisible = useOfficeStore((state) => state.labelsVisible);
  const selectedRoomId = useOfficeStore((state) => state.selectedRoomId);
  const isSelected = selectedRoomId === room.id;

  if (!labelsVisible) return null;

  const [cx, , cz] = room.bounds.center;

  return (
    <group
      position={[cx, 4.0, cz]}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(room.id);
      }}
    >
      {/* Voxel Signboard Plaque 3D */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4.2, 0.7, 0.15]} />
        <meshStandardMaterial
          color={isSelected ? '#00B9F1' : '#101B2D'}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
      {/* Status glowing dot badge on sign */}
      <mesh position={[-1.7, 0, 0.09]}>
        <sphereGeometry args={[0.14, 12, 12]} />
        <meshBasicMaterial color={room.color} />
      </mesh>
      {/* Border trim */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[4.3, 0.76, 0.08]} />
        <meshStandardMaterial color={room.color} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * AgentCharacter: Karakter manusia bergaya voxel, seragam Navy DigiBooster + Cyan
 * Memiliki animasi idle halus & interaksi klik
 */
export function AgentCharacter({ agent, isSelected = false, onClick }) {
  const groupRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const headRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Idle breathing subtle bounce
      groupRef.current.position.y = Math.sin(t * 2) * 0.04;
    }
    if (headRef.current) {
      // Idle head nod / turn
      headRef.current.rotation.y = Math.sin(t * 1.2) * 0.08;
    }
    if (leftArmRef.current && rightArmRef.current) {
      // Subtle typing / holding arm motion
      leftArmRef.current.rotation.x = -0.5 + Math.sin(t * 3) * 0.06;
      rightArmRef.current.rotation.x = -0.5 - Math.sin(t * 3) * 0.06;
    }
  });

  const navyUniform = '#101B2D';
  const cyanAccent = '#00B9F1';
  const skin = agent.skinColor || '#ffd7ba';
  const hair = agent.hairColor || '#1e293b';

  return (
    <group
      position={agent.position}
      rotation={agent.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(agent.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {/* Selection Glow Cylinder on Floor */}
      {isSelected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.95, 32]} />
          <meshBasicMaterial color="#00B9F1" />
        </mesh>
      )}

      {/* Floating Status Indicator */}
      <StatusIndicator status={agent.status} position={[0, 2.7, 0]} />

      <group ref={groupRef}>
        {/* LEGS (Navy Pants) */}
        <mesh position={[-0.2, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.9, 0.26]} />
          <meshStandardMaterial color={navyUniform} roughness={0.7} />
        </mesh>
        <mesh position={[0.2, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.24, 0.9, 0.26]} />
          <meshStandardMaterial color={navyUniform} roughness={0.7} />
        </mesh>
        {/* Sepatu Hitam / Voxel Shoes */}
        <mesh position={[-0.2, 0.08, 0.05]} castShadow>
          <boxGeometry args={[0.25, 0.16, 0.35]} />
          <meshStandardMaterial color="#020617" roughness={0.5} />
        </mesh>
        <mesh position={[0.2, 0.08, 0.05]} castShadow>
          <boxGeometry args={[0.25, 0.16, 0.35]} />
          <meshStandardMaterial color="#020617" roughness={0.5} />
        </mesh>

        {/* TORSO (Navy DigiBooster Jacket + Cyan Tie/Accent) */}
        <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.68, 0.85, 0.42]} />
          <meshStandardMaterial color={navyUniform} roughness={0.6} />
        </mesh>
        {/* Cyan Stripe / Tie di tengah dada */}
        <mesh position={[0, 1.35, 0.215]} castShadow>
          <boxGeometry args={[0.14, 0.6, 0.03]} />
          <meshStandardMaterial color={cyanAccent} roughness={0.3} metalness={0.2} />
        </mesh>
        {/* DigiBooster Logo Badge Pin di dada kiri */}
        <mesh position={[-0.2, 1.45, 0.22]}>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
          <meshBasicMaterial color="#00B9F1" />
        </mesh>

        {/* HEAD (Voxel Head + Skin + Hair + Face) */}
        <group ref={headRef} position={[0, 1.95, 0]}>
          {/* Head Cube */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.55, 0.55, 0.55]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>
          {/* Hair Voxel Cap */}
          <mesh position={[0, 0.18, -0.05]} castShadow>
            <boxGeometry args={[0.6, 0.32, 0.6]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.28, 0.05]} castShadow>
            <boxGeometry args={[0.58, 0.15, 0.4]} />
            <meshStandardMaterial color={hair} roughness={0.9} />
          </mesh>
          {/* Eyes (Voxel Navy dots) */}
          <mesh position={[-0.14, 0.02, 0.28]}>
            <boxGeometry args={[0.08, 0.08, 0.02]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
          <mesh position={[0.14, 0.02, 0.28]}>
            <boxGeometry args={[0.08, 0.08, 0.02]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* ARMS (Navy Sleeves + Skin Hands) */}
        <group ref={leftArmRef} position={[-0.45, 1.45, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.18, 0.55, 0.2]} />
            <meshStandardMaterial color={navyUniform} roughness={0.6} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.62, 0]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.15]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.45, 1.45, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.18, 0.55, 0.2]} />
            <meshStandardMaterial color={navyUniform} roughness={0.6} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.62, 0]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.15]} />
            <meshStandardMaterial color={skin} roughness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
