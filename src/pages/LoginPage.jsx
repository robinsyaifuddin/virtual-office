import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Lock, Building2, AlertTriangle, KeyRound } from 'lucide-react';
import '../styles/management.css';

const MAX_ATTEMPTS = 3;
const LOCKOUT_MINUTES = 5;

export default function LoginPage({ onLoginSuccess, onCancel }) {
  const [pinDigits, setPinDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const inputRefs = useRef([]);

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
          setPinDigits(['', '', '', '', '', '']);
          if (inputRefs.current[0]) inputRefs.current[0].focus();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isLocked, remainingTime]);

  // Fokus ke digit pertama saat buka
  useEffect(() => {
    if (!isLocked && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isLocked]);

  // Mekanisme Verifikasi Otomatis via Supabase RPC Hash (Server-Side)
  const verifyPin = async (fullPin) => {
    if (isLocked) return;

    try {
      const { supabase } = await import('../utils/supabaseClient');
      const { data: isValid, error } = await supabase.rpc('verify_executive_pin', { input_pin: fullPin });

      if (error) {
        console.warn('RPC auth error:', error.message);
      }

      if (isValid) {
        // PIN BENAR -> Langsung Masuk Seketika!
        try {
          localStorage.removeItem('digibooster_pin_attempts');
          localStorage.removeItem('digibooster_pin_locked_until');
        } catch (err) {
          console.warn(err);
        }
        onLoginSuccess();
      } else {
        // PIN SALAH -> Hitung Sisa Percobaan & Bersihkan Input
        const currentStored = parseInt(localStorage.getItem('digibooster_pin_attempts') || '0', 10) + 1;
        try {
          localStorage.setItem('digibooster_pin_attempts', String(currentStored));
        } catch (err) {
          console.warn(err);
        }

        const left = MAX_ATTEMPTS - currentStored;
        setAttemptsLeft(left > 0 ? left : 0);
        setPinDigits(['', '', '', '', '', '']);

        if (currentStored >= MAX_ATTEMPTS) {
          const lockoutTime = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
          try {
            localStorage.setItem('digibooster_pin_locked_until', String(lockoutTime));
          } catch (err) {
            console.warn(err);
          }
          setIsLocked(true);
          setRemainingTime(LOCKOUT_MINUTES * 60);
          setErrorMsg(`Akses diblokir! Salah memasukkan PIN 3 kali. Silakan tunggu ${LOCKOUT_MINUTES} menit.`);
        } else {
          setErrorMsg(`PIN 6 digit tidak valid! Sisa kesempatan: ${left} kali lagi.`);
          if (inputRefs.current[0]) inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      console.error('Fatal auth check error:', err);
      setErrorMsg('Gagal memverifikasi ke server keamanan.');
    }
  };

  const handleChange = (index, value) => {
    if (isLocked) return;

    // Hanya menerima angka
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...pinDigits];
      newDigits[index] = '';
      setPinDigits(newDigits);
      return;
    }

    const digit = cleanVal.slice(-1);
    const newDigits = [...pinDigits];
    newDigits[index] = digit;
    setPinDigits(newDigits);
    setErrorMsg('');

    // Pindah fokus ke kotak input berikutnya
    if (index < 5 && digit) {
      inputRefs.current[index + 1]?.focus();
    }

    // Jika seluruh 6 digit sudah terisi, verifikasi seketika!
    const updatedFullPin = newDigits.join('');
    if (updatedFullPin.length === 6 && !newDigits.includes('')) {
      verifyPin(updatedFullPin);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    if (isLocked) return;
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newDigits = [...pinDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pasted[i] || '';
    }
    setPinDigits(newDigits);

    if (pasted.length === 6) {
      verifyPin(pasted);
    } else {
      inputRefs.current[pasted.length]?.focus();
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
        borderRadius: '24px',
        maxWidth: '440px',
        width: '100%',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12)',
        border: '1px solid #e2e8f0',
        padding: '2.5rem',
        textAlign: 'center'
      }}>
        {/* Brand Icon */}
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: isLocked 
            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
            : 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          margin: '0 auto 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: isLocked 
            ? '0 10px 25px rgba(239, 68, 68, 0.35)' 
            : '0 10px 25px rgba(2, 132, 199, 0.35)'
        }}>
          {isLocked ? <AlertTriangle size={30} /> : <KeyRound size={30} />}
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
          PIN Keamanan Eksekutif
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          Masukkan 6 digit PIN sandi untuk membuka Ruang Kendali DigiBooster secara instan.
        </p>

        {/* Notifikasi Error / Sisa Kesempatan */}
        {errorMsg && (
          <div style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#e11d48',
            fontSize: '0.82rem',
            fontWeight: 600,
            padding: '0.8rem 1rem',
            borderRadius: '10px',
            marginBottom: '1.5rem',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'shake 0.3s ease'
          }}>
            <AlertTriangle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 6 Digit Input Boxes (Otomatis Masuk Tanpa Tombol) */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
              6-Digit PIN
            </span>
            {!isLocked ? (
              <span style={{ fontSize: '0.75rem', color: attemptsLeft <= 1 ? '#ef4444' : '#64748b', fontWeight: 700 }}>
                Kesempatan: {attemptsLeft}/{MAX_ATTEMPTS}
              </span>
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>
                Terkunci: {formatTimer(remainingTime)}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }} onPaste={handlePaste}>
            {pinDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                disabled={isLocked}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                style={{
                  width: '46px',
                  height: '54px',
                  textAlign: 'center',
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  borderRadius: '12px',
                  border: isLocked 
                    ? '2px solid #fca5a5' 
                    : (digit ? '2px solid #0284c7' : '2px solid #e2e8f0'),
                  backgroundColor: isLocked ? '#fef2f2' : (digit ? '#f0f9ff' : '#ffffff'),
                  color: isLocked ? '#991b1b' : '#0284c7',
                  outline: 'none',
                  transition: 'all 150ms ease',
                  boxShadow: digit && !isLocked ? '0 2px 8px rgba(2, 132, 199, 0.15)' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Tombol Masuk Ditiadakan Sesuai Permintaan (Hanya Tombol Kembali ke 3D) */}
        <button
          type="button"
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            padding: '0.5rem',
            transition: 'color 150ms ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#0284c7'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
        >
          ← Kembali ke Denah Visual 3D
        </button>

        <div style={{ marginTop: '2rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <ShieldCheck size={14} color="#0284c7" />
          <span>Auto-Login 6 Digit • Brute-Force Rate Limiting (Maks 3x)</span>
        </div>
      </div>
    </div>
  );
}
