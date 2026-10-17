import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { FloorTile } from '../components/office3d/FloorTile';
import { Room } from '../components/office3d/Room';
import { AgentCharacter } from '../components/office3d/AgentCharacter';
import { Plant } from '../components/office3d/OfficeAssets';
import { CameraController } from '../hooks/CameraController';
import { useOfficeStore } from '../store/officeStore';

/**
 * Corridor: Koridor pusat yang menghubungkan seluruh 8 ruangan
 * Terbentang dari X = -24 hingga X = +24 di sumbu Z = [-6, 6]
 */
function CentralCorridor() {
  return (
    <group position={[0, 0, 0]}>
      {/* Lantai Utama Koridor (Lebar 50, Panjang 12) */}
      <FloorTile position={[0, 0, 0]} size={[48, 0.24, 12]} color="#0f172a" accentColor="#1e293b" />

      {/* Garis Aksen DigiBooster Cyan di tengah lorong jalan */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <planeGeometry args={[46, 0.3]} />
        <meshBasicMaterial color="#00B9F1" rotation={[-Math.PI / 2, 0, 0]} />
      </mesh>

      {/* Tanaman & Elemen Dekoratif di Ujung-ujung Koridor */}
      <Plant position={[-23, 0, 0]} scale={1.2} />
      <Plant position={[23, 0, 0]} scale={1.2} />
      <Plant position={[-12, 0, 0]} scale={0.9} />
      <Plant position={[12, 0, 0]} scale={0.9} />
      <Plant position={[0, 0, 0]} scale={1.0} />

      {/* Dinding Penutup Ujung Barat Koridor */}
      <mesh position={[-24.2, 1.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 3.4, 12]} />
        <meshStandardMaterial color="#091322" roughness={0.8} />
      </mesh>
      {/* Dinding Penutup Ujung Timur Koridor */}
      <mesh position={[24.2, 1.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 3.4, 12]} />
        <meshStandardMaterial color="#091322" roughness={0.8} />
      </mesh>
    </group>
  );
}

/**
 * OfficeLighting: Setup pencahayaan lembut, bayangan halus, dan ambient hangat/dingin
 */
function OfficeLighting() {
  return (
    <>
      {/* Ambient Light netral */}
      <ambientLight intensity={0.85} color="#e2e8f0" />

      {/* Directional Sun Light utama dengan bayangan orthographic tajam & lembut */}
      <directionalLight
        position={[30, 45, 25]}
        intensity={1.4}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={120}
        shadow-camera-left={-35}
        shadow-camera-right={35}
        shadow-camera-top={35}
        shadow-camera-bottom={-35}
        shadow-bias={-0.0005}
      />

      {/* Fill Light lembut dari sudut berlawanan (Cool Cyan tint) */}
      <directionalLight position={[-25, 20, -25]} intensity={0.6} color="#38bdf8" />

      {/* Ground bounce light */}
      <hemisphereLight skyColor="#bae6fd" groundColor="#0f172a" intensity={0.5} />
    </>
  );
}

/**
 * OfficeScene: Canvas React Three Fiber utama dengan orthographic camera isometrik
 */
export default function OfficeScene() {
  const rooms = useOfficeStore((state) => state.rooms);
  const agents = useOfficeStore((state) => state.agents);
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const selectRoom = useOfficeStore((state) => state.selectRoom);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        shadows
        camera={{
          fov: 32,
          position: [60, 52, 60],
          near: 1,
          far: 500
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        onPointerMissed={() => {
          // Klik di ruang kosong membersihkan pilihan
          selectAgent(null);
        }}
        style={{ background: '#091322' }}
      >
        <Suspense fallback={null}>
          <OfficeLighting />

          {/* Koridor Pusat */}
          <CentralCorridor />

          {/* 8 Ruangan Terkoneksi */}
          {rooms.map((room) => (
            <Room key={room.id} room={room} onRoomClick={selectRoom} />
          ))}

          {/* 8 Karakter AI Agent */}
          {agents.map((agent) => (
            <AgentCharacter
              key={agent.id}
              agent={agent}
              isSelected={selectedAgentId === agent.id}
              onClick={selectAgent}
            />
          ))}

          {/* Kontrol Navigasi & Kamera */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
}
