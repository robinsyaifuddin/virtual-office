import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, ChevronUp, ChevronDown, X, LayoutDashboard } from 'lucide-react';
import './styles/virtualOffice.css';

export default function Office3D({ onOpenDashboard }) {
  const [waInput, setWaInput] = useState('Buatkan formula 5 hook video viral TikTok untuk DigiBooster');
  const [toastMessage, setToastMessage] = useState(null);
  const [isWaOpen, setIsWaOpen] = useState(false);

  const handleSendWA = (e) => {
    e.preventDefault();
    if (!waInput.trim()) return;

    setToastMessage(`Perintah WhatsApp diterima! Agent DigiBooster sedang memproses: "${waInput}"`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const [activeRoom, setActiveRoom] = useState(null);

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

      {/* Top Action: Buka Ruang Eksekutif / Dashboard */}
      {onOpenDashboard && (
        <button
          onClick={onOpenDashboard}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 20,
            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '12px',
            padding: '9px 16px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.35)',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease'
          }}
          title="Masuk ke Ruang Kendali Manajemen Eksekutif"
        >
          <LayoutDashboard size={16} />
          <span>Ruang Eksekutif</span>
        </button>
      )}

      {/* WhatsApp Command Simulator (Modern White Chatbot UI) */}
      <div
        className="wa-command-box"
        style={{
          width: isWaOpen ? '340px' : 'auto',
          maxWidth: 'calc(100vw - 24px)',
          padding: isWaOpen ? '14px 16px' : '9px 14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            marginBottom: isWaOpen ? '12px' : 0,
            cursor: 'pointer',
          }}
          onClick={() => setIsWaOpen(!isWaOpen)}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 2px 6px rgba(37, 211, 102, 0.4)'
              }}
            >
              <MessageSquare size={13} fill="#ffffff" stroke="none" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
                {isWaOpen ? 'AI WhatsApp Assistant' : 'Kirim Perintah WhatsApp'}
              </div>
              {isWaOpen && (
                <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }}></span>
                  Online 24/7 Multi-Agent
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            title={isWaOpen ? 'Kecilkan chat' : 'Buka simulasi chat'}
            style={{
              background: '#f1f5f9',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              padding: 0
            }}
          >
            {isWaOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>

        {isWaOpen && (
          <form onSubmit={handleSendWA} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                padding: '8px 10px',
                fontSize: '11px',
                color: '#475569',
                lineHeight: 1.4
              }}
            >
              Kirim instruksi langsung ke tim agen autonomous DigiBooster:
            </div>
            <textarea
              rows={2}
              value={waInput}
              onChange={(e) => setWaInput(e.target.value)}
              placeholder="Ketik instruksi via WhatsApp..."
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                padding: '9px 12px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 600,
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
              }}
              autoFocus
            />
            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                border: 'none',
                color: '#ffffff',
                padding: '9px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <Send size={13} /> Kirim ke Tim Agent
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
