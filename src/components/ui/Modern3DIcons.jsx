import React from 'react';

/**
 * Modern 3D Isometric Vector Icons (Warna Biru Berseragam)
 * Seluruh icon menggunakan palet tema warna biru (#38bdf8, #0284c7, #0369a1, #1e40af)
 * dengan gradien halus, bayangan dimensional 3D, dan tampilan clean berkelas.
 */

// 1. Icon 3D Clipboard Biru
export function Icon3DClipboard({ size = 28, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="blueClipBoard" x1="8" y1="6" x2="40" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284c7" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="blueClipBody" x1="10" y1="8" x2="38" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0f9ff" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="blueClipMetal" x1="16" y1="2" x2="32" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
        <filter id="blueShadow3D" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="3" stdDeviation="2.5" floodColor="#0284c7" floodOpacity="0.25" />
        </filter>
      </defs>
      <rect x="8" y="8" width="32" height="36" rx="6" fill="url(#blueClipBoard)" filter="url(#blueShadow3D)" />
      <rect x="12" y="12" width="24" height="28" rx="4" fill="url(#blueClipBody)" />
      <line x1="16" y1="20" x2="26" y2="20" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="16" y1="26" x2="32" y2="26" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="32" x2="28" y2="32" stroke="#bae6fd" strokeWidth="2" strokeLinecap="round" />
      <rect x="17" y="4" width="14" height="8" rx="2.5" fill="url(#blueClipMetal)" />
      <circle cx="24" cy="7" r="1.5" fill="#f0f9ff" />
    </svg>
  );
}

// 2. Icon 3D Kalender Biru
export function Icon3DCalendar({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="calGradBlue" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f0f9ff" />
          <stop offset="1" stopColor="#e0f2fe" />
        </linearGradient>
        <linearGradient id="calHeaderBlue" x1="3" y1="3" x2="21" y2="9" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect x="3" y="4" width="18" height="17" rx="3.5" fill="url(#calGradBlue)" stroke="#bae6fd" strokeWidth="1" />
      <path d="M3 7.5C3 5.567 4.567 4 6.5 4H17.5C19.433 4 21 5.567 21 7.5V9H3V7.5Z" fill="url(#calHeaderBlue)" />
      <circle cx="8" cy="13" r="1.2" fill="#0284c7" />
      <circle cx="12" cy="13" r="1.2" fill="#38bdf8" />
      <circle cx="16" cy="13" r="1.2" fill="#0284c7" />
      <circle cx="8" cy="17" r="1.2" fill="#38bdf8" />
      <circle cx="12" cy="17" r="1.2" fill="#0284c7" />
      <circle cx="16" cy="17" r="1.2" fill="#38bdf8" />
      <rect x="6.5" y="2" width="2" height="3.5" rx="1" fill="#0284c7" />
      <rect x="15.5" y="2" width="2" height="3.5" rx="1" fill="#0284c7" />
    </svg>
  );
}

// 3. Icon 3D Tag Kategori Biru
export function Icon3DTag({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="tagGradBlue" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <path d="M2.5 12V4C2.5 3.17 3.17 2.5 4 2.5H12L21.5 12L12 21.5L2.5 12Z" fill="url(#tagGradBlue)" />
      <circle cx="7" cy="7" r="1.8" fill="#ffffff" />
    </svg>
  );
}

// 4. Icon 3D Prioritas Flag Biru
export function Icon3DFlag({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="flagGradBlue" x1="5" y1="3" x2="20" y2="15" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <line x1="5" y1="3" x2="5" y2="21" stroke="#0369a1" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 4H18.5C19.3 4 19.8 4.9 19.3 5.5L17 9.5L19.3 13.5C19.8 14.1 19.3 15 18.5 15H5V4Z" fill="url(#flagGradBlue)" />
    </svg>
  );
}

// 5. Icon 3D Gear / Status Biru
export function Icon3DGear({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="gearGradBlue" x1="3" y1="3" x2="21" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#f0f9ff" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10.2 2.5H13.8L14.3 4.6C14.9 4.9 15.5 5.2 16.1 5.7L18.1 4.7L20.6 7.2L19.6 9.2C20 9.8 20.4 10.4 20.6 11L22.8 11.5V15.1L20.6 15.6C20.4 16.2 20 16.8 19.6 17.4L20.6 19.4L18.1 21.9L16.1 20.9C15.5 21.3 14.9 21.7 14.3 21.9L13.8 24.1H10.2L9.7 21.9C9.1 21.7 8.5 21.3 7.9 20.9L5.9 21.9L3.4 19.4L4.4 17.4C4 16.8 3.6 16.2 3.4 15.6L1.2 15.1V11.5L3.4 11C3.6 10.4 4 9.8 4.4 9.2L3.4 7.2L5.9 4.7L7.9 5.7C8.5 5.2 9.1 4.9 9.7 4.6L10.2 2.5ZM12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" fill="url(#gearGradBlue)" />
    </svg>
  );
}

// 6. Icon 3D User / PIC Biru
export function Icon3DUser({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ flexShrink: 0 }}>
      <defs>
        <linearGradient id="userHeadBlue" x1="7" y1="3" x2="17" y2="13" gradientUnits="userSpaceOnUse">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
        <linearGradient id="userBodyBlue" x1="4" y1="13" x2="20" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="7.5" r="4.5" fill="url(#userHeadBlue)" />
      <path d="M4.5 19.5C4.5 16 7.5 14 12 14C16.5 14 19.5 16 19.5 19.5V20.5H4.5V19.5Z" fill="url(#userBodyBlue)" />
    </svg>
  );
}

// 7. Icon 3D Status Dots Biru (Dengan indikator bayangan 3D)
export function Icon3DStatusDot({ status = 'backlog', size = 10 }) {
  const isSelesai = status === 'Selesai' || status === 'Lunas';
  const isInProgress = status === 'Sedang Dikerjakan' || status === 'ON PROGRESS' || status === 'Pending';
  
  const colors = isSelesai 
    ? { top: '#38bdf8', bottom: '#0284c7', shadow: 'rgba(2, 132, 199, 0.4)' }
    : isInProgress 
    ? { top: '#60a5fa', bottom: '#2563eb', shadow: 'rgba(37, 99, 235, 0.4)' }
    : { top: '#93c5fd', bottom: '#1d4ed8', shadow: 'rgba(29, 78, 216, 0.4)' };

  return (
    <span style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: `linear-gradient(135deg, ${colors.top}, ${colors.bottom})`,
      boxShadow: `0 2px 4px ${colors.shadow}, inset 0 1px 1px rgba(255,255,255,0.7)`,
      display: 'inline-block',
      flexShrink: 0
    }} />
  );
}

// 8. Icon 3D Notes / Keterangan Biru
export function Icon3DNotes({ size = 16, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} style={{ flexShrink: 0 }}>
      <line x1="3" y1="6" x2="21" y2="6" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="3" y1="12" x2="16" y2="12" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="3" y1="18" x2="19" y2="18" stroke="#0284c7" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}
