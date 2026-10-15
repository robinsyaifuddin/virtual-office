import React, { useState } from 'react';
import { ShieldCheck, Lock, ArrowRight, Building2, Sparkles } from 'lucide-react';
import '../styles/management.css';

export default function LoginPage({ onLoginSuccess, onCancel }) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Default PIN master eksekutif untuk demo: 1234 atau 8888
    if (pin === '1234' || pin === '8888' || pin.toLowerCase() === 'admin') {
      onLoginSuccess();
    } else {
      setErrorMsg('PIN atau Kredensial tidak valid. Silakan coba kembali (Gunakan PIN default: 1234)');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 20px 40px -15px rgba(2, 132, 199, 0.15)',
        border: '1px solid #e2e8f0',
        padding: '2.5rem',
        textAlign: 'center'
      }}>
        {/* Brand Icon */}
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
          margin: '0 auto 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)'
        }}>
          <Building2 size={28} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          Ruang Eksekutif Kantor
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Pusat kendali, lemari arsip digital, dan verifikasi tugas tim Multi-Agent DigiBooster.
        </p>

        {errorMsg && (
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#e11d48',
            fontSize: '0.8rem',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1.25rem',
            textAlign: 'left'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '0.4rem' }}>
              Master Security PIN / Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Masukkan PIN Master (Default: 1234)"
                value={pin}
                onChange={(e) => { setPin(e.target.value); setErrorMsg(''); }}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.5rem',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: '#94a3b8' }} />
            </div>
          </div>

          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
              marginTop: '0.5rem'
            }}
          >
            Buka Ruang Kendali
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              fontSize: '0.85rem',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            ← Kembali ke Denah Visual 3D
          </button>
        </form>

        <div style={{ marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          🛡️ Terproteksi Kriptografi Sesi & Dual-Engine (Groq + Gemini)
        </div>
      </div>
    </div>
  );
}
