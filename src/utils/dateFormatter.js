/**
 * Utility Formatting Tanggal Terpadu DigiBooster Enterprise
 * Format standar: "DD Mmm YYYY" (contoh: "05 Okt 2026")
 * Mendukung format jam opsional: "05 Okt 2026 14:23"
 */

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
];

const MONTH_NAMES_FULL = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

/**
 * Format tanggal ke standar "DD Mmm YYYY" (misal: 05 Okt 2026)
 * @param {string|number|Date} dateVal - String tanggal, timestamp, atau objek Date
 * @param {boolean} [includeTime=false] - Sertakan jam menit jika true ("05 Okt 2026 14:23")
 * @returns {string} Tanggal terformat konsisten
 */
export function formatDateID(dateVal, includeTime = false) {
  if (!dateVal) return '-';

  try {
    // Tangani format string umum "YYYY-MM-DD" atau "YYYY-MM-DD HH:mm" atau ISO string
    let d;
    if (dateVal instanceof Date) {
      d = dateVal;
    } else if (typeof dateVal === 'string') {
      const trimmed = dateVal.trim();
      // Bila sudah berformat "DD Mmm YYYY" (contoh: "14 Okt 2026")
      if (/^\d{2}\s+[A-Za-z]{3}\s+\d{4}$/.test(trimmed)) {
        return trimmed;
      }
      // Bila berformat tanggal murni "YYYY-MM-DD"
      if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
        const parts = trimmed.split('-');
        const y = parseInt(parts[0], 10);
        const m = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        d = new Date(y, m, day);
      } else {
        d = new Date(trimmed);
        if (isNaN(d.getTime()) && trimmed.includes(' ')) {
          d = new Date(trimmed.replace(' ', 'T'));
        }
      }
    } else {
      d = new Date(dateVal);
    }

    if (isNaN(d.getTime())) {
      return String(dateVal);
    }

    const dayStr = String(d.getDate()).padStart(2, '0');
    const monthStr = MONTH_NAMES_SHORT[d.getMonth()] || '';
    const yearStr = d.getFullYear();

    if (includeTime) {
      const hoursStr = String(d.getHours()).padStart(2, '0');
      const minsStr = String(d.getMinutes()).padStart(2, '0');
      return `${dayStr} ${monthStr} ${yearStr} ${hoursStr}:${minsStr}`;
    }

    return `${dayStr} ${monthStr} ${yearStr}`;
  } catch {
    return String(dateVal);
  }
}

/**
 * Normalisasi nilai tanggal ke format YYYY-MM-DD untuk input HTML type="date"
 * @param {string|number|Date} dateVal 
 * @returns {string} Format YYYY-MM-DD
 */
export function toInputDateFormat(dateVal) {
  if (!dateVal) return '';

  try {
    if (typeof dateVal === 'string') {
      const trimmed = dateVal.trim();
      // Jika format "DD Mmm YYYY" misal "05 Okt 2026"
      const match = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3,})\s+(\d{4})/);
      if (match) {
        const day = match[1].padStart(2, '0');
        const mName = match[2].toLowerCase();
        let mIdx = MONTH_NAMES_SHORT.findIndex(m => m.toLowerCase() === mName);
        if (mIdx === -1) {
          mIdx = MONTH_NAMES_FULL.findIndex(m => m.toLowerCase().startsWith(mName));
        }
        if (mIdx !== -1) {
          const month = String(mIdx + 1).padStart(2, '0');
          return `${match[3]}-${month}-${day}`;
        }
      }

      if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        return trimmed.split('T')[0].split(' ')[0];
      }
    }

    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    }
  } catch {
    // fallback
  }

  return '';
}
