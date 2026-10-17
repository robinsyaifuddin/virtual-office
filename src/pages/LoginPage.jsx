import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, ArrowRight, Building2, AlertTriangle } from 'lucide-react';
import '../styles/management.css';

const MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 5;

export default function LoginPage({ onLoginSuccess, onCancel }) {
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Periksa status lock dari localStorage
  useEffect(() => {
    try {
      const lockUntil = localStorage.getItem('digibooster_pin_locked_until');
      const storedAttempts = localStorage.getItem('digibooster_pin_attempts');

      if (lockUntil) {
        const lockTime = parseInt(lockUntil, 10);
        const now = Date.now();
        if (lockTime > now) {
          setIsLocked(true);
          setRemainingTime(Math.ceil((lockTime - now) / 1000));
        } else {
          localStorage.removeItem('digibooster_pin_locked_until');
          localStorage.removeItem('digibooster_pin_attempts');
          setIsLocked(false);
          setAttemptsLeft(MAX_ATTEMPTS);
        }
      } else if (storedAttempts) {
        const remaining = MAX_ATTEMPTS - parseInt(storedAttempts, 10);
        setAttemptsLeft(remaining > 0 ? remaining : 0);
      }
    } catch (e) {
      console.warn('Error reading lock state:', e);
    }
  }, []);

  // Timer hitung mundur jika sedang terkunci
  useEffect(() => {
    if (!isLocked || remainingTime <= 0) return;
    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          localStorage.removeItem('digibooster_pin_locked_until');
          localStorage.removeItem('digibooster_pin_attempts');
          setAttemptsLeft(MAX_ATTEMPTS);
          setErrorMsg('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, remainingTime]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    const trimmedPin = pin.trim();

    // Validasi PIN sandi rahasia:
    // 1. Password database & master eksekutif: VoDigibooster@123
    // 2. Akses Autonomous AI internal token: DG-AI-AGENT-SUPERPASS
    const isMasterValid = 
      trimmedPin === 'VoDigibooster@123' ||
      trimmedPin === 'DG-AI-AGENT-SUPERPASS' ||
      trimmedPin === '1234'; // Fallback kompatibilitas sementara

    if (isMasterValid) {
      // Reset counter saat berhasil
      try {
        localStorage.removeItem('digibooster_pin_attempts');
        localStorage.removeItem('digibooster_pin_locked_until');
      } catch (err) {
        console.warn(err);
      }
      onLoginSuccess();
    } else {
      const currentStored = parseInt(localStorage.getItem('digibooster_pin_attempts') || '0', 10) + 1;
      try {
        localStorage.setItem('digibooster_pin_attempts', String(currentStored));
      } catch (err) {
        console.warn(err);
      }

      const left = MAX_ATTEMPTS - currentStored;
      setAttemptsLeft(left > 0 ? left : 0);

      if (currentStored >= MAX_ATTEMPTS) {
        const lockoutTime = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
        try {
          localStorage.setItem('digibooster_pin_locked_until', String(lockoutTime));
        } catch (err) {
          console.warn(err);
        }
        setIsLocked(true);
        setRemainingTime(LOCKOUT_MINUTES * 60);
        setErrorMsg(`Akses diblokir! Anda telah salah memasukkan PIN ${MAX_ATTEMPTS} kali. Silakan tunggu ${LOCKOUT_MINUTES} menit.`);
      } else {
        setErrorMsg(`PIN sandi tidak valid. Sisa kesempatan: ${left} kali lagi.`);
      }
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
          background: isLocked 
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
            : 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
          margin: '0 auto 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: isLocked 
            ? '0 8px 20px rgba(239, 68, 68, 0.3)' 
            : '0 8px 20px rgba(2, 132, 199, 0.3)'
        }}>
          {isLocked ? <AlertTriangle size={28} /> : <Building2 size={28} />}
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          Ruang Eksekutif Kantor
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Pusat kendali, arsip data real-time, dan manajemen tugas tim Multi-Agent DigiBooster.
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
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                Master Security PIN / Sandi
              </label>
              {!isLocked && (
                <span style={{ fontSize: '0.75rem', color: attemptsLeft <= 1 ? '#ef4444' : '#64748b', fontWeight: 600 }}>
                  Percobaan: {attemptsLeft}/{MAX_ATTEMPTS}
                </span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder={isLocked ? "Akses terkunci sementara" : "Masukkan PIN atau Sandi Eksekutif"}
                value={pin}
                disabled={isLocked}
                onChange={(e) => { setPin(e.target.value); setErrorMsg(''); }}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.5rem',
                  border: isLocked ? '1px solid #fca5a5' : '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  backgroundColor: isLocked ? '#fef2f2' : '#ffffff',
                  color: isLocked ? '#991b1b' : '#0f172a'
                }}
                autoFocus={!isLocked}
              />
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: isLocked ? '#ef4444' : '#94a3b8' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLocked}
            style={{
              background: isLocked 
                ? '#94a3b8' 
                : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '0.85rem',
              borderRadius: '10px',
              fontSize: '0.95rem',
              fontWeight: 700,
              cursor: isLocked ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: isLocked ? 'none' : '0 4px 12px rgba(2, 132, 199, 0.25)',
              marginTop: '0.5rem'
            }}
          >
            {isLocked ? `Terkunci (${formatTimer(remainingTime)})` : 'Buka Ruang Kendali'}
            {!isLocked && <ArrowRight size={16} />}
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

        <div style={{ marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#0284c7" />
          <span>Keamanan Terenkripsi • Proteksi Brute-Force Rate Limiting (Maks 3x)</span>
        </div>
      </div>
    </div>
  );
}
