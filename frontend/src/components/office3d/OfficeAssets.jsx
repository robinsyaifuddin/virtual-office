import React from 'react';

/**
 * Desk: Meja kerja voxel dengan aksen kayu #C49A6C dan kaki navy
 */
export function Desk({ position = [0, 0, 0], rotation = [0, 0, 0], width = 3, depth = 1.6, height = 1.3 }) {
  const woodColor = '#C49A6C';
  const legColor = '#0f172a';

  return (
    <group position={position} rotation={rotation}>
      {/* Tabletop Wood Plank */}
      <mesh position={[0, height - 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, 0.16, depth]} />
        <meshStandardMaterial color={woodColor} roughness={0.6} metalness={0.1} />
      </mesh>
      {/* Front Privacy Panel */}
      <mesh position={[0, height * 0.45, -depth / 2 + 0.1]} castShadow receiveShadow>
        <boxGeometry args={[width - 0.4, height * 0.7, 0.1]} />
        <meshStandardMaterial color="#101B2D" roughness={0.7} />
      </mesh>

      {/* 4 Sturdy Legs */}
      <mesh position={[-width / 2 + 0.15, (height - 0.16) / 2, -depth / 2 + 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.15, height - 0.16, 0.15]} />
        <meshStandardMaterial color={legColor} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[width / 2 - 0.15, (height - 0.16) / 2, -depth / 2 + 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.15, height - 0.16, 0.15]} />
        <meshStandardMaterial color={legColor} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[-width / 2 + 0.15, (height - 0.16) / 2, depth / 2 - 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.15, height - 0.16, 0.15]} />
        <meshStandardMaterial color={legColor} metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[width / 2 - 0.15, (height - 0.16) / 2, depth / 2 - 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.15, height - 0.16, 0.15]} />
        <meshStandardMaterial color={legColor} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * OfficeChair: Kursi kantor ergonomis voxel
 */
export function OfficeChair({ position = [0, 0, 0], rotation = [0, 0, 0], color = '#1e293b' }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Seat Cushion */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.9, 0.18, 0.9]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 1.35, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.85, 1.0, 0.14]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Lumbar Accent DigiBooster */}
      <mesh position={[0, 1.1, -0.32]} castShadow>
        <boxGeometry args={[0.6, 0.15, 0.06]} />
        <meshStandardMaterial color="#00B9F1" />
      </mesh>
      {/* Stem / Piston */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Star Base Wheels */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.9, 0.08, 0.2]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.08, 0.9]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} />
      </mesh>
    </group>
  );
}

/**
 * ComputerMonitor: Layar desktop modern dengan stand & keyboard
 */
export function ComputerMonitor({
  position = [0, 1.3, 0],
  rotation = [0, 0, 0],
  glowColor = '#00B9F1',
  screenRatio = [1.4, 0.9]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Stand Base */}
      <mesh position={[0, 0.03, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.06, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.35, -0.05]} castShadow>
        <boxGeometry args={[0.1, 0.6, 0.1]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Bezel */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <boxGeometry args={[screenRatio[0], screenRatio[1], 0.08]} />
        <meshStandardMaterial color="#0f172a" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Screen Glowing Display */}
      <mesh position={[0, 0.65, 0.045]}>
        <planeGeometry args={[screenRatio[0] - 0.1, screenRatio[1] - 0.1]} />
        <meshBasicMaterial color={glowColor} />
      </mesh>
    </group>
  );
}

/**
 * Keyboard: Keyboard & Mousepad di meja
 */
export function Keyboard({ position = [0, 1.32, 0.4], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Mousepad */}
      <mesh position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[1.5, 0.6]} />
        <meshStandardMaterial color="#1e293b" rotation={[-Math.PI / 2, 0, 0]} />
      </mesh>
      {/* Keyboard */}
      <mesh position={[-0.2, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.03, 0.3]} />
        <meshStandardMaterial color="#475569" />
      </mesh>
      {/* Mouse */}
      <mesh position={[0.4, 0.03, 0]} castShadow>
        <boxGeometry args={[0.14, 0.04, 0.22]} />
        <meshStandardMaterial color="#00B9F1" />
      </mesh>
    </group>
  );
}

/**
 * ServerRack: Rak server IT & Data center voxel dengan status LED berkedip
 */
export function ServerRack({ position = [0, 0, 0], rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Chasis Utama */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 4, 1.2]} />
        <meshStandardMaterial color="#091322" metalness={0.8} roughness={0.25} />
      </mesh>
      {/* Panel Depan Kisi-kisi Server Slots */}
      {[0.8, 1.4, 2.0, 2.6, 3.2].map((y, idx) => (
        <group key={idx} position={[0, y, 0.61]}>
          <mesh>
            <boxGeometry args={[1.4, 0.45, 0.05]} />
            <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
          </mesh>
          {/* LEDs */}
          <mesh position={[-0.5, 0, 0.03]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[-0.35, 0, 0.03]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color="#00B9F1" />
          </mesh>
          <mesh position={[-0.2, 0, 0.03]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#38bdf8' : '#f59e0b'} />
          </mesh>
        </group>
      ))}
      {/* Top ventilation */}
      <mesh position={[0, 4.02, 0]}>
        <boxGeometry args={[1.4, 0.05, 1]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
    </group>
  );
}

/**
 * MeetingTable: Meja rapat besar untuk ruang kolaborasi
 */
export function MeetingTable({ position = [0, 0, 0], size = [4.5, 1.3, 2.4] }) {
  const [w, h, d] = size;
  return (
    <group position={position}>
      {/* Tabletop */}
      <mesh position={[0, h, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 0.16, d]} />
        <meshStandardMaterial color="#C49A6C" roughness={0.5} />
      </mesh>
      {/* Center Cable Channel with DigiBooster Cyan Glow */}
      <mesh position={[0, h + 0.01, 0]}>
        <boxGeometry args={[w * 0.7, 0.02, 0.25]} />
        <meshBasicMaterial color="#00B9F1" />
      </mesh>
      {/* Center pedestal / double base */}
      <mesh position={[-w * 0.3, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, h, d * 0.6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={[w * 0.3, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, h, d * 0.6]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

/**
 * Plant: Tanaman hias voxel pot modern
 */
export function Plant({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Pot Voxel */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.9, 0.7]} />
        <meshStandardMaterial color="#E8EDF2" roughness={0.4} />
      </mesh>
      {/* Tanah */}
      <mesh position={[0, 0.88, 0]}>
        <boxGeometry args={[0.62, 0.08, 0.62]} />
        <meshStandardMaterial color="#3f2714" roughness={0.9} />
      </mesh>
      {/* Daun-daun voxel hijau segar */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshStandardMaterial color="#10b981" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[0.65, 0.5, 0.65]} />
        <meshStandardMaterial color="#059669" roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color="#34d399" roughness={0.6} />
      </mesh>
    </group>
  );
}
