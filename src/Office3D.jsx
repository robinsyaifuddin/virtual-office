import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, ChevronUp, ChevronDown } from 'lucide-react';
import './styles/virtualOffice.css';

export default function Office3D() {
  const [waInput, setWaInput] = useState('Buatkan formula 5 hook video viral TikTok untuk DigiBooster');
  const [toastMessage, setToastMessage] = useState(null);
  const [isWaOpen, setIsWaOpen] = useState(false);

  const handleSendWA = (e) => {
    e.preventDefault();
    if (!waInput.trim()) return;

    setToastMessage(`⚡ Perintah WhatsApp diterima! Agent DigiBooster sedang memproses: "${waInput}"`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const [activeRoom, setActiveRoom] = useState(null);

  // Titik Interaktif Ruangan (Persis Gambar 2)
  const roomHotspots = [
    { id: 'eco_garden', name: '🌿 Eco Garden', top: '44%', left: '14%', desc: 'Taman hidroponik & pergola santai asri' },
    { id: 'client_vip', name: '🛋️ Ruang Layanan Klien / VIP Lounge', top: '28%', left: '36%', desc: 'Sofa kulit mewah & presentasi klien' },
    { id: 'lobby', name: '🏢 Lobi & Resepsionis', top: '41%', left: '45%', desc: 'Meja resepsionis kurva modern & foyer' },
    { id: 'rapat_besar', name: '📊 Ruang Rapat Besar', top: '18%', left: '46%', desc: 'Meja rapat eksekutif 8-10 orang' },
    { id: 'rapat_kecil', name: '💼 Ruang Rapat Kecil', top: '10%', left: '60%', desc: 'Ruang meeting fokus 3-4 orang' },
    { id: 'core_8staff', name: '💻 Ruang Kerja Utama (Tim Inti 8 Karyawan)', top: '35%', left: '61%', desc: 'Workstation 8 staf inti lengkap dual monitor' },
    { id: 'agent_ai', name: '🧠 Ruang AI & Automation / Dedicated Agent Command Center', top: '22%', left: '71%', desc: 'Layar dashboard kurva raksasa status operasional agent' },
    { id: 'server_room', name: '⚡ Ruang Server & Infrastruktur', top: '32%', left: '84%', desc: 'Rak server tertutup, steril, dan bebas pipa air' },
    { id: 'pantry', name: '☕ Pantry & Coffee Bar', top: '46%', left: '76%', desc: 'Barista bar, espresso machine & dining table' },
    { id: 'musholla', name: '🕌 Musholla & Wudhu', top: '62%', left: '71%', desc: 'Karpet sajadah hijau tenang & tempat wudhu bersih' },
    { id: 'lounge', name: '🎮 Ruang Santai & Breakout Lounge', top: '53%', left: '85%', desc: 'Sofa santai, beanbag & TV hiburan' },
    { id: 'toilet', name: '🚻 Toilet', top: '41%', left: '93%', desc: 'Bilik toilet tertutup bersih & wastafel modern' },
    { id: 'satpam', name: '🛡️ Pos Satpam & Portal Masuk', top: '76%', left: '52%', desc: 'Pos keamanan dengan palang otomatis' },
  ];

  return (
    <div className="virtual-office-root" style={{ background: '#5bb83c', overflow: 'hidden' }}>
      {/* 3D Voxel Engine Interaktif 100% Menggunakan Aset 3D */}
      <iframe
        src={`/digibooster_office_engine.html?v=${Date.now()}`}
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

      {/* WhatsApp Command Simulator (Collapsible & Compact) */}
      <div
        className="glassmorphism wa-command-box"
        style={{
          width: isWaOpen ? '320px' : 'auto',
          maxWidth: 'calc(100vw - 20px)',
          padding: isWaOpen ? '12px' : '6px 12px'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            marginBottom: isWaOpen ? '8px' : 0,
            cursor: 'pointer'
          }}
          onClick={() => setIsWaOpen(!isWaOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
            <MessageSquare size={15} color="#38bdf8" style={{ filter: 'drop-shadow(0 0 6px rgba(56,189,248,0.7))' }} />
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#ffffff', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
              {isWaOpen ? 'SIMULASI WHATSAPP' : 'Kirim Perintah WhatsApp'}
            </span>
          </div>
          <button
            type="button"
            title={isWaOpen ? 'Kecilkan simulator' : 'Buka simulator WhatsApp'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              color: '#38bdf8',
              padding: '2px'
            }}
          >
            {isWaOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {isWaOpen && (
          <form onSubmit={handleSendWA} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              type="text"
              value={waInput}
              onChange={(e) => setWaInput(e.target.value)}
              placeholder="Ketik instruksi via WhatsApp..."
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#fff',
                padding: '8px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                outline: 'none'
              }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #00B9F1 0%, #0284c7 100%)',
                border: 'none',
                color: '#091322',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Send size={12} /> Kirim ke Tim Agent
            </button>
          </form>
        )}
      </div>

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
                  fontWeight: 800
                }}
              >
                ✕
              </button>
            </div>
            <p style={{ margin: '0 0 16px', color: '#bae6fd', fontSize: '13.5px', lineHeight: 1.5 }}>
              {activeRoom.desc}
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => {
                  setToastMessage(`⚡ Terhubung ke ${activeRoom.name}! Sistem aktif.`);
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
