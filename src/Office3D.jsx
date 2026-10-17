import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, MessageSquare, Users } from 'lucide-react';
import './styles/virtualOffice.css';
import OfficeGroupLiveChat from './components/chat/OfficeGroupLiveChat';

export default function Office3D() {
  const [toastMessage, setToastMessage] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
  const iframeRef = useRef(null);

  // Kirim sinyal pause ke mesin 3D ketika modal LiveChat aktif agar CPU/GPU 100% dialokasikan untuk mengetik
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      if (isGroupChatOpen) {
        iframeRef.current.contentWindow.postMessage({ type: 'PAUSE_3D_OFFICE' }, '*');
      } else {
        iframeRef.current.contentWindow.postMessage({ type: 'RESUME_3D_OFFICE' }, '*');
      }
    }
  }, [isGroupChatOpen]);

  // Titik Interaktif Ruangan
  const roomHotspots = [
    { id: 'ceo_suite', name: 'Ruang Direktur Utama (CEO Bang Robin)', top: '15%', left: '32%', desc: 'Executive CEO Command Desk, Curved Monitor 49", Sofa Tamu Bentuk U, Vision Board Notes, Credenza Trofi & Mesin Espresso' },
    { id: 'ceo_bath', name: 'Private En-Suite Restroom & Spa (CEO)', top: '15%', left: '18%', desc: 'Kamar mandi pribadi eksekutif: Wastafel marmer Carrara LED, Smart Toilet bidet emas, Glass Shower Stall & Lemari Wardrobe' },
    { id: 'eco_garden', name: 'Eco Garden & Smart Farm', top: '44%', left: '14%', desc: 'Smart hydroponic A-frame & vertical towers, teak wood deck timber pergola, zen fountain & lush garden pod' },
    { id: 'client_vip', name: 'Ruang Layanan Klien / VIP Lounge', top: '28%', left: '36%', desc: 'Sofa kulit mewah & presentasi klien' },
    { id: 'lobby', name: 'Lobi & Resepsionis', top: '41%', left: '45%', desc: 'Meja resepsionis kurva modern & foyer' },
    { id: 'rapat_besar', name: 'Ruang Rapat Besar', top: '18%', left: '46%', desc: 'Meja rapat eksekutif 8-10 orang' },
    { id: 'sports_hub', name: 'Mega Sports & Wellness Hub', top: '12%', left: '68%', desc: 'Hall 32 meter all-in-one: Gym & Fitness Hub, Table Tennis Tournament Court, E-Sport Gaming Battle Pod, dan Karaoke & Music Studio Lounge' },
    { id: 'server_room', name: 'Ruang Server & Infrastruktur', top: '32%', left: '84%', desc: 'Rak server tertutup, steril, dan bebas pipa air' },
    { id: 'pantry', name: 'Pantry & Coffee Lounge', top: '46%', left: '76%', desc: 'Kitchen bar walnut marmer, mesin espresso barista, smart double-door fridge, dispenser galon, microwave & cafe dining area' },
    { id: 'musholla', name: 'Executive Prayer Suite', top: '62%', left: '71%', desc: 'Karpet sajadah saf masjid full, sajadah imam otentik, kaligrafi emas & jam jadwal sholat real-time WIB' },
    { id: 'lounge', name: 'Ruang Santai & Breakout Lounge', top: '53%', left: '85%', desc: 'Sofa santai, beanbag & TV hiburan' },
    { id: 'toilet_wanita', name: 'Executive Restroom (Wanita)', top: '41%', left: '88%', desc: 'Kamar mandi shower kaca, smart toilet gantung, double vanity marmer & Dyson grooming suite' },
    { id: 'oasis_pool', name: 'Taman Oasis & Lap Pool DigiBooster', top: '48%', left: '8%', desc: 'Resort wellness park: Lap pool 22m air toska dengan underwater LED, water blade fountain waterfall, jembatan kayu jati melengkung, outdoor jacuzzi hangat, tiki juice & mocktail bar, luxury daybed cabana, sunken firepit lounge, dan palem tropis' },
    { id: 'cafeteria', name: 'Digi-Cafeteria & Extended Roastery', top: '68%', left: '18%', desc: 'Paviliun kaca raksasa 27.5 meter memanjang mentok ke pagar kiri: Barista specialty coffee bar, mesin espresso ganda, display pastry, private booth sofa co-working, dan outdoor alfresco dining terrace dengan meja payung' },
    { id: 'solar_farm', name: 'Smart Solar Grid & Megapack BESS Hub', top: '8%', left: '38%', desc: 'Pembangkit energi mandiri 100% Zero-Carbon: 4 deret panel surya fotovoltaik 185 kW terbentang lebar, tersambung ke 6 kabinet baterai industri putih Tesla Megapack 1,250 kWh mentok sampai dinding kanan, trafo proteksi & telemetry monitor' },
    { id: 'hardware_lab', name: 'Hardware Fabrication Lab & Warehouse', top: '50%', left: '92%', desc: 'Fasilitas produksi IoT & robotika, meja workbench elektro, 3D printer enclosure, rak bertingkat gudang hardware, forklift pallet, dan loading dock' },
  ];

  return (
    <div className="virtual-office-root" style={{ background: '#091322', overflow: 'hidden' }}>
      {/* 3D Voxel Engine Interaktif 100% Menggunakan Aset 3D */}
      <iframe
        ref={iframeRef}
        src="/digibooster_office_engine.html"
        title="DigiBooster 3D Virtual Office"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      />



      {/* Modal Dialog Detail Ruangan Interaktif */}
      {activeRoom && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 19, 34, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50
          }}
          onClick={() => setActiveRoom(null)}
        >
          <div
            className="glassmorphism"
            style={{
              padding: '24px 28px',
              borderRadius: '16px',
              maxWidth: '420px',
              width: '90%',
              border: '1.5px solid #00B9F1',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 185, 241, 0.4)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#f8fafc' }}>{activeRoom.name}</h3>
              <button
                onClick={() => setActiveRoom(null)}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>
            <p style={{ margin: '0 0 16px', color: '#bae6fd', fontSize: '13.5px', lineHeight: 1.5 }}>
              {activeRoom.desc}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setToastMessage(`Terhubung ke ${activeRoom.name}! Sistem aktif.`);
                  setActiveRoom(null);
                  setTimeout(() => setToastMessage(null), 4000);
                }}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #00B9F1 0%, #0284c7 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#091322',
                  fontWeight: 800,
                  fontSize: '12.5px',
                  cursor: 'pointer'
                }}
              >
                Pantau Aktivitas Ruangan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating HQ LiveChat Button (Trigger Modal Chat Grup Multi-Agent) */}
      <button
        onClick={() => setIsGroupChatOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          borderRadius: '50px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#ffffff',
          fontWeight: 800,
          fontSize: '13px',
          cursor: 'pointer',
          boxShadow: '0 8px 30px rgba(2, 132, 199, 0.45)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          animation: 'pulse 3s infinite'
        }}
        title="Buka HQ Group LiveChat DigiBooster (Chat Semua Agen)"
      >
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <MessageSquare size={18} color="#ffffff" />
          <span style={{
            position: 'absolute',
            top: '-6px',
            right: '-6px',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22c55e',
            boxShadow: '0 0 6px #22c55e'
          }} />
        </div>
        <span>LiveChat Dewan Agen (5)</span>
      </button>

      {/* Modal Full LiveChat Group Multi-Agent */}
      <OfficeGroupLiveChat
        isOpen={isGroupChatOpen}
        onClose={() => setIsGroupChatOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="glassmorphism animate-slide-left"
          style={{
            position: 'absolute',
            top: '76px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid #00B9F1',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ffffff',
            fontSize: '12.5px',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0, 185, 241, 0.3)'
          }}
        >
          <Sparkles size={16} color="#00B9F1" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
