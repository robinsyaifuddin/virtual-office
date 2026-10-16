import * as XLSX from 'xlsx';
import { extractTextFromReactNode } from './exportPdf';

/**
 * Ekspor data tabel ke format Excel (.xlsx) dengan:
 * - Header freeze (membeku saat di-scroll)
 * - Auto-fit lebar kolom dinamis + padding rapi
 * - Pemformatan angka & teks terstruktur
 * - Header bersih tanpa karakter ikon mentah
 */
export function exportTableAsExcel(data = [], columns = [], options = {}) {
  if (!data || data.length === 0) {
    alert('Tidak ada data tabel untuk diekspor ke Excel.');
    return;
  }

  const title = options.title || 'DigiBooster Data';
  const fileName = options.fileName
    ? (options.fileName.endsWith('.xlsx') ? options.fileName : `${options.fileName.replace(/\.[^/.]+$/, '')}.xlsx`)
    : `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${new Date().toISOString().slice(0, 10)}.xlsx`;

  // 1. Bersihkan label header kolom (buang node/icon JSX jika ada)
  const headerKeys = [];
  const headerLabels = [];

  columns.forEach((col) => {
    headerKeys.push(col.key);
    const cleanLabel = extractTextFromReactNode(col.label) || col.key;
    headerLabels.push(cleanLabel);
  });

  // 2. Petakan baris data
  const excelRows = data.map((row) => {
    const rowObj = {};
    columns.forEach((col) => {
      const cleanHeader = extractTextFromReactNode(col.label) || col.key;
      let val = row[col.key];

      if (val === null || val === undefined) {
        rowObj[cleanHeader] = '-';
      } else if (col.key === 'dealValue' || col.key === 'amount' || col.key === 'nominal') {
        const numVal = Number(val);
        rowObj[cleanHeader] = !isNaN(numVal) ? `Rp ${numVal.toLocaleString('id-ID')}` : String(val);
      } else if (Array.isArray(val)) {
        rowObj[cleanHeader] = val.join(', ');
      } else if (typeof val === 'object') {
        if (val.reach !== undefined) {
          rowObj[cleanHeader] = `${val.reach} reach (${val.leads || 0} leads)`;
        } else {
          rowObj[cleanHeader] = JSON.stringify(val);
        }
      } else {
        rowObj[cleanHeader] = val;
      }
    });
    return rowObj;
  });

  // 3. Buat Sheet dari data JSON
  const worksheet = XLSX.utils.json_to_sheet(excelRows, { header: headerLabels });

  // 4. Hitung Autofit Kolom secara dinamis
  const colWidths = headerLabels.map((header) => {
    let maxLen = String(header).length;
    excelRows.forEach((row) => {
      const cellVal = row[header];
      if (cellVal !== undefined && cellVal !== null) {
        const len = String(cellVal).length;
        if (len > maxLen) {
          maxLen = len;
        }
      }
    });
    // Beri batas minimal dan padding agar tidak terlalu mepet
    return { wch: Math.min(Math.max(maxLen + 4, 14), 50) };
  });

  worksheet['!cols'] = colWidths;

  // 5. Freeze Header Baris Pertama (Membeku saat di-scroll)
  // Pada XLSX standar, freeze pane baris 1 diatur lewat !views
  worksheet['!views'] = [
    {
      state: 'frozen',
      ySplit: 1, // Membekukan baris ke-1 (header)
      topLeftCell: 'A2',
      activeCell: 'A2'
    }
  ];

  // 6. Buat Workbook & simpan file
  const workbook = XLSX.utils.book_new();
  const safeSheetName = title.slice(0, 30).replace(/[:\\\/\?\*\[\]]/g, '_');
  XLSX.utils.book_append_sheet(workbook, worksheet, safeSheetName || 'Data');

  XLSX.writeFile(workbook, fileName);
}
