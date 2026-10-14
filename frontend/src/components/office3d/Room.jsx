import React from 'react';
import { FloorTile } from './FloorTile';
import { WallSegment } from './WallSegment';
import { GlassPartition } from './GlassPartition';
import { Door } from './Door';
import { Desk, OfficeChair, ComputerMonitor, Keyboard, ServerRack, MeetingTable, Plant } from './OfficeAssets';
import { RoomLabel } from './AgentCharacter';

/**
 * Room: Komponen ruangan modular data-driven
 * Menghasilkan lantai, dinding perimetral, partisi kaca, pintu masuk ke koridor, dan furnitur tematik.
 */
export function Room({ room, onRoomClick }) {
  const { bounds, door, id, floorColor } = room;
  const [cx, , cz] = bounds.center;
  const w = bounds.width; // 10
  const d = bounds.depth; // 10
  const isNorth = cz < 0; // Ruangan di sisi utara menghadap koridor di selatan

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onRoomClick && onRoomClick(id);
      }}
    >
      {/* 3D Floating Room Label */}
      <RoomLabel room={room} onClick={onRoomClick} />

      {/* LANTAI RUANGAN */}
      <FloorTile position={[cx, 0, cz]} size={[w, 0.25, d]} color={floorColor} accentColor="#263449" />

      {/* DINDING BELAKANG (Luar kompleks kantor) */}
      <WallSegment
        position={[cx, 0, isNorth ? cz - d / 2 : cz + d / 2]}
        size={[w, 3.4, 0.4]}
        color="#101B2D"
        skirtingColor={room.color}
      />

      {/* DINDING SAMPING KIRI */}
      <WallSegment
        position={[cx - w / 2, 0, cz]}
        size={[0.4, 3.4, d]}
        color="#0d1524"
        skirtingColor={room.color}
      />

      {/* DINDING SAMPING KANAN */}
      <WallSegment
        position={[cx + w / 2, 0, cz]}
        size={[0.4, 3.4, d]}
        color="#0d1524"
        skirtingColor={room.color}
      />

      {/* DINDING DEPAN MENGHADAP KORIDOR (Partisi Kaca + Dinding Voxel + Pintu Masuk) */}
      {/* Sisi kiri pintu */}
      <GlassPartition
        position={[cx - 2.8, 0, isNorth ? cz + d / 2 : cz - d / 2]}
        size={[3.8, 3.2, 0.15]}
        tint={room.color}
      />

      {/* Pintu Akses Terbuka */}
      <Door position={door.position} rotation={door.rotation} width={2.0} height={3.2} />

      {/* Sisi kanan pintu */}
      <GlassPartition
        position={[cx + 2.8, 0, isNorth ? cz + d / 2 : cz - d / 2]}
        size={[3.8, 3.2, 0.15]}
        tint={room.color}
      />

      {/* INTERIOR FURNITUR BERDASARKAN FUNGSI RUANGAN */}
      {/* Meja Kerja Utama & Komputer */}
      <group position={[cx, 0, isNorth ? cz - 1 : cz + 1]} rotation={isNorth ? [0, 0, 0] : [0, Math.PI, 0]}>
        <Desk position={[0, 0, 0]} width={3.2} depth={1.6} height={1.3} />
        <OfficeChair position={[0, 0, 1.2]} rotation={[0, Math.PI, 0]} color="#1e293b" />
        <ComputerMonitor position={[0, 1.3, -0.2]} glowColor={room.color} />
        <Keyboard position={[0, 1.32, 0.3]} />
      </group>

      {/* Tanaman Sudut Dekoratif */}
      <Plant position={[cx + w / 2 - 1.2, 0, isNorth ? cz - d / 2 + 1.2 : cz + d / 2 - 1.2]} scale={1.1} />

      {/* Properti Khusus Ruangan */}
      {id === 'it-infra' && (
        <group>
          <ServerRack position={[cx - 3.2, 0, cz - 2]} rotation={[0, Math.PI / 2, 0]} />
          <ServerRack position={[cx - 3.2, 0, cz]} rotation={[0, Math.PI / 2, 0]} />
          <ServerRack position={[cx - 3.2, 0, cz + 2]} rotation={[0, Math.PI / 2, 0]} />
        </group>
      )}

      {id === 'ai-ops' && (
        <group>
          <ServerRack position={[cx + 3.2, 0, cz - 1.5]} rotation={[0, -Math.PI / 2, 0]} />
          {/* Dual Display Station */}
          <ComputerMonitor position={[cx - 1.2, 1.3, isNorth ? cz - 1.2 : cz + 1.2]} glowColor="#00B9F1" />
        </group>
      )}

      {id === 'sales' && (
        <group>
          <MeetingTable position={[cx - 2.2, 0, cz + 1.5]} size={[2.4, 1.2, 1.6]} />
          <OfficeChair position={[cx - 2.2, 0, cz + 2.5]} rotation={[0, Math.PI, 0]} />
          <OfficeChair position={[cx - 2.2, 0, cz + 0.5]} rotation={[0, 0, 0]} />
        </group>
      )}

      {id === 'marketing' && (
        <group>
          {/* Whiteboard / Billboard Ide Konten */}
          <mesh position={[cx - 3.5, 2.2, cz]} rotation={[0, Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[3, 1.8, 0.1]} />
            <meshStandardMaterial color="#f8fafc" roughness={0.3} />
          </mesh>
          <mesh position={[cx - 3.44, 2.2, cz]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[2.8, 1.6]} />
            <meshBasicMaterial color="#f43f5e" />
          </mesh>
        </group>
      )}

      {id === 'research-qa' && (
        <group>
          <ServerRack position={[cx + 3.2, 0, cz + 1.5]} rotation={[0, -Math.PI / 2, 0]} />
        </group>
      )}

      {id === 'client-services' && (
        <group>
          {/* Tambahan Terminal Meja Support */}
          <Desk position={[cx + 2.5, 0, cz - 1.5]} width={2.2} depth={1.4} height={1.3} />
          <ComputerMonitor position={[cx + 2.5, 1.3, cz - 1.8]} glowColor="#10b981" />
        </group>
      )}

      {id === 'finance' && (
        <group>
          {/* Brankas / Filing Cabinet Voxel */}
          <mesh position={[cx - 3.2, 1.2, cz - 2]} castShadow receiveShadow>
            <boxGeometry args={[1.4, 2.4, 1.2]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      )}

      {id === 'web-dev' && (
        <group>
          {/* Dual Monitor Setup */}
          <ComputerMonitor position={[cx + 1.2, 1.3, isNorth ? cz - 1.2 : cz + 1.2]} glowColor="#38bdf8" />
        </group>
      )}
    </group>
  );
}
