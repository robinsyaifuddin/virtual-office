/**
 * DigiBooster AI Executive Workspace - PDF Export Engine (Super Cepat & Presisi A4)
 * Mengunduh LANGSUNG file .pdf dalam hitungan detik tanpa dialog print, tanpa lag.
 * Rapi, font Poppins, logo di kiri atas, catatan di paling bawah, tanpa tanda tangan.
 */

import { formatDateID } from './dateFormatter';

let cachedLogoBase64 = null;

/**
 * Ekstrak teks murni dari string atau elemen React JSX
 */
export function extractTextFromReactNode(node) {
  if (node === null || node === undefined) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node).trim();
  if (Array.isArray(node)) {
    return node.map(extractTextFromReactNode).filter(Boolean).join(' ').trim();
  }
  if (typeof node === 'object' && node.props) {
    if (node.props.children) {
      return extractTextFromReactNode(node.props.children);
    }
    return '';
  }
  return String(node).trim();
}

/**
 * Format tanggal Indonesia ramah cetak (Format konsisten: DD Mmm YYYY, contoh: 05 Okt 2026)
 */
function formatIndonesianDate(dateStr) {
  return formatDateID(dateStr);
}

/**
 * Mengonversi gambar URL ke format Base64 PNG dengan memory cache instan
 */
async function getBase64Image(url) {
  if (cachedLogoBase64) return cachedLogoBase64;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 200;
        canvas.height = img.naturalHeight || img.height || 50;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        cachedLogoBase64 = dataUrl;
        resolve(dataUrl);
      } catch (err) {
        resolve(url);
      }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
}

/**
 * Memuat library html2pdf secara dinamis dari file lokal public
 */
function loadHtml2Pdf() {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve(window.html2pdf);
      return;
    }
    const existingScript = document.querySelector('script[src="/html2pdf.bundle.min.js"]');
    if (existingScript) {
      existingScript.onload = () => resolve(window.html2pdf);
      existingScript.onerror = reject;
      return;
    }
    const script = document.createElement('script');
    script.src = '/html2pdf.bundle.min.js';
    script.onload = () => resolve(window.html2pdf);
    script.onerror = () => {
      const cdnScript = document.createElement('script');
      cdnScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      cdnScript.onload = () => resolve(window.html2pdf);
      cdnScript.onerror = reject;
      document.head.appendChild(cdnScript);
    };
    document.head.appendChild(script);
  });
}

/**
 * Mesin Konversi Terisolasi Super Cepat: Presisi A4, Zero Lag, Ringan & Tajam
 */
async function generatePdfFromIsolatedIframe(htmlBodyContent, cleanFileName, orientation = 'portrait') {
  const contentWidth = orientation === 'landscape' ? 1040 : 710;
  const iframeWidth = contentWidth + 30;

  // 1. Buat iframe terisolasi
  const iframe = document.createElement('iframe');
  iframe.id = 'pdf-fast-worker-iframe';
  iframe.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: ${iframeWidth}px;
    height: 1400px;
    z-index: 999999;
    border: none;
    background-color: #ffffff;
    opacity: 0.01;
    pointer-events: none;
  `;
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="utf-8">
      <title>${escapeHtml(cleanFileName)}</title>
      <style>
        *, *::before, *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html, body {
          margin: 0;
          padding: 0;
          background-color: #ffffff;
          color: #0f172a;
          font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        #pdf-render-root {
          width: ${contentWidth}px;
          margin: 0 auto;
          padding: 20px 24px;
          background: #ffffff;
          box-sizing: border-box;
        }
        table {
          border-collapse: collapse;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div id="pdf-render-root">
        ${htmlBodyContent}
      </div>
    </body>
    </html>
  `);
  doc.close();

  // 2. Beri jeda sangat singkat (50ms) agar DOM terpasang sempurna
  await new Promise(r => setTimeout(r, 60));

  const targetElement = doc.getElementById('pdf-render-root') || doc.body;

  // Optimasi kecepatan: scale 1.5 sangat tajam namun 4x lebih cepat dibanding scale 2
  const opt = {
    margin: [8, 8, 8, 8],
    filename: cleanFileName,
    image: { type: 'jpeg', quality: 0.95 },
    html2canvas: {
      scale: 1.5,
      useCORS: true,
      logging: false,
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  const html2pdfLib = await loadHtml2Pdf();
  await html2pdfLib().set(opt).from(targetElement).save();

  // Bersihkan iframe secara cepat
  setTimeout(() => {
    if (iframe && iframe.parentNode) {
      iframe.parentNode.removeChild(iframe);
    }
  }, 400);
}

/**
 * Susun Konten HTML Dokumen Baris yang Rapi & Proporsional
 */
function buildRowHtml(row, columns = [], logoBase64 = '/logo.webp') {
  const docTitle = 
    row.period || 
    row.title || 
    row.name || 
    row.objective || 
    row.uraian || 
    row.taskName || 
    `Dokumen_Operasional_${row.id || 'Data'}`;

  const docId = row.id || `DOC-${Date.now().toString().slice(-6)}`;
  const author = row.author || row.assignee || row.pic || (Array.isArray(row.participants) ? row.participants.join(', ') : '') || 'Tim Operasional';
  const category = row.category || row.type || row.kategori || row.stage || 'Operasional';
  const status = row.status || row.stage || 'Aktif';
  const hasRating = row.rating !== undefined && row.rating !== null && row.rating !== '';
  const rating = row.rating || 5;
  const printDate = formatIndonesianDate(row.date || row.dateTime || row.tanggal || row.updatedAt);
  const nowFormatted = formatDateID(new Date(), true);

  const fieldItems = columns.map(col => {
    const label = extractTextFromReactNode(col.label) || col.key;
    let rawVal = row[col.key];
    
    if (rawVal === undefined || rawVal === null || rawVal === '') {
      rawVal = '-';
    } else if (Array.isArray(rawVal)) {
      rawVal = rawVal.join(', ');
    } else if (typeof rawVal === 'object') {
      rawVal = JSON.stringify(rawVal);
    } else {
      rawVal = String(rawVal);
    }

    return {
      key: col.key,
      label,
      value: rawVal
    };
  });

  const whatWentWell = row.whatWentWell || row.achievement || row.pencapaian || '';
  const bottlenecks = row.bottlenecks || row.kendala || row.issues || '';
  const actionPlan = row.actionPlan || row.notes || row.catatan || row.solution || row.summary || row.notulensi || '';

  return {
    docTitle,
    docId,
    html: `
      <!-- Header Kop Resmi: Logo di Kiri Atas & Info Dokumen di Kanan Atas -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 18px; page-break-inside: avoid;">
        <div style="display: flex; align-items: center;">
          <img src="${logoBase64}" alt="Logo" style="height: 38px; max-width: 190px; object-fit: contain; display: block;" onerror="this.onerror=null; this.src='/favicon.svg';" />
        </div>
        <div style="text-align: right; font-size: 10.5px; color: #475569;">
          <div style="display: inline-block; font-size: 9.5px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background-color: #e0f2fe; color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;">
            Dokumen Resmi Operasional
          </div>
          <div><strong>No:</strong> ${escapeHtml(docId)}</div>
          <div><strong>Waktu Cetak:</strong> ${escapeHtml(nowFormatted)}</div>
        </div>
      </div>

      <!-- Judul Dokumen -->
      <div style="margin-bottom: 18px; page-break-inside: avoid;">
        <div style="font-size: 10.5px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.05em;">
          ${escapeHtml(category)} • Dokumen Resmi
        </div>
        <h1 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 3px 0 0 0; line-height: 1.35;">
          ${escapeHtml(docTitle)}
        </h1>
      </div>

      <!-- Key Metrics Grid -->
      <div style="display: grid; grid-template-columns: repeat(${hasRating ? 4 : 3}, 1fr); gap: 10px; margin-bottom: 20px; page-break-inside: avoid;">
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; background-color: #f8fafc;">
          <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Tanggal</div>
          <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px;">${escapeHtml(printDate)}</div>
        </div>
        ${hasRating ? `
          <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; background-color: #f8fafc;">
            <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Skor Mutu</div>
            <div style="font-size: 12px; font-weight: 800; color: #b45309; margin-top: 2px;">★ ${escapeHtml(String(rating))}/5.0</div>
          </div>
        ` : ''}
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; background-color: #f8fafc;">
          <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Status</div>
          <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px;">${escapeHtml(status)}</div>
        </div>
        <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; background-color: #f8fafc;">
          <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">PIC / Penanggung Jawab</div>
          <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px;">${escapeHtml(author)}</div>
        </div>
      </div>

      <!-- Rincian Properti Tabel Lengkap -->
      <div style="margin-bottom: 20px; page-break-inside: avoid;">
        <div style="font-size: 12px; font-weight: 700; color: #0f172a; border-left: 3px solid #0284c7; padding-left: 8px; margin-bottom: 8px; text-transform: uppercase;">
          Rincian Data Parameter Dokumen
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; table-layout: fixed;">
          <tbody>
            ${fieldItems.map((item, idx) => `
              <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#fafbfc'};">
                <th style="border: 1px solid #e2e8f0; padding: 7px 12px; text-align: left; background-color: #f8fafc; font-weight: 700; color: #475569; width: 34%; word-break: break-word;">
                  ${escapeHtml(item.label)}
                </th>
                <td style="border: 1px solid #e2e8f0; padding: 7px 12px; text-align: left; color: #0f172a; width: 66%; word-break: break-word;">
                  ${escapeHtml(item.value)}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Narasi Pencapaian & Kendala (Jika ada) -->
      ${whatWentWell ? `
        <div style="border: 1px solid #bbf7d0; border-left: 4px solid #10b981; border-radius: 8px; padding: 11px 13px; margin-bottom: 14px; background-color: #f0fdf4; page-break-inside: avoid;">
          <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: #047857; margin-bottom: 4px;">Pencapaian Positif &amp; Target Terpenuhi</div>
          <div style="font-size: 11.5px; color: #1e293b; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(whatWentWell)}</div>
        </div>
      ` : ''}

      ${bottlenecks ? `
        <div style="border: 1px solid #fde68a; border-left: 4px solid #f59e0b; border-radius: 8px; padding: 11px 13px; margin-bottom: 14px; background-color: #fffbeb; page-break-inside: avoid;">
          <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: #b45309; margin-bottom: 4px;">Kendala Utama &amp; Area Perbaikan</div>
          <div style="font-size: 11.5px; color: #1e293b; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(bottlenecks)}</div>
        </div>
      ` : ''}

      <!-- CATATAN DITARUH DI PALING BAWAH SESUAI PERMINTAAN -->
      ${actionPlan ? `
        <div style="border: 1px solid #bae6fd; border-left: 4px solid #0284c7; border-radius: 8px; padding: 11px 13px; margin-bottom: 14px; background-color: #f0f9ff; page-break-inside: avoid;">
          <div style="font-size: 10.5px; font-weight: 700; text-transform: uppercase; color: #0369a1; margin-bottom: 4px;">Rencana Tindak Lanjut &amp; Catatan Strategis</div>
          <div style="font-size: 11.5px; color: #1e293b; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(actionPlan)}</div>
        </div>
      ` : ''}

      <!-- Footer Resmi Minimalis (Tanpa Tanda Tangan Sesuai Request) -->
      <div style="border-top: 1px solid #e2e8f0; margin-top: 24px; padding-top: 8px; font-size: 9.5px; color: #94a3b8; display: flex; justify-content: space-between; align-items: center; page-break-inside: avoid;">
        <span>Dokumen Resmi Operasional • Digenerate secara otomatis</span>
        <span>ID Sistem: ${escapeHtml(docId)}</span>
      </div>
    `
  };
}

/**
 * Ekspor satu baris data (Row) LANGSUNG MENJADI FILE .PDF CEPAT & PROPORSIONAL
 */
export async function exportRowAsPdf(row, columns = [], options = {}) {
  if (!row) return;

  const logoBase64 = await getBase64Image('/logo.webp');
  const { docTitle, html } = buildRowHtml(row, columns, logoBase64);
  const cleanFileName = (docTitle.replace(/[^a-zA-Z0-9_\-]/g, '_') || 'Dokumen_Operasional') + '.pdf';

  // Indikator Loading minimalis sekejap
  const overlay = document.createElement('div');
  overlay.id = 'pdf-download-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(2px); z-index: 999998; display: flex;
    align-items: center; justify-content: center; font-family: 'Poppins', -apple-system, sans-serif;
  `;
  overlay.innerHTML = `
    <div style="background: #ffffff; border-radius: 12px; padding: 18px 24px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); max-width: 320px;">
      <div style="width: 28px; height: 28px; border: 3px solid #bae6fd; border-top-color: #0284c7; border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto 10px auto;"></div>
      <div style="font-weight: 700; font-size: 13.5px; color: #0f172a; margin-bottom: 2px;">Mengunduh PDF...</div>
      <div style="font-size: 11px; color: #64748b;">Menyimpan file secara instan.</div>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `;
  document.body.appendChild(overlay);

  try {
    await generatePdfFromIsolatedIframe(html, cleanFileName, 'portrait');
  } catch (err) {
    console.error('Gagal mengunduh PDF:', err);
  } finally {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }
}

/**
 * Buat dan unduh file PDF langsung dari konten teks / draf percakapan LiveChat
 */
export async function generateAndDownloadPdfDoc({
  title = 'Dokumen Resmi DigiBooster',
  category = 'Legal & Dokumentasi',
  author = 'Raka (Head of Documentation & Legal)',
  rawContent = ''
}) {
  const logoBase64 = await getBase64Image('/logo.webp');
  const cleanTitle = (title || 'Dokumen_DigiBooster').replace(/[^a-zA-Z0-9_\-\s]/g, '').trim();
  const cleanFileName = (cleanTitle.replace(/\s+/g, '_') || 'Dokumen_Resmi') + '_DigiBooster.pdf';
  const nowFormatted = formatIndonesianDate(new Date().toISOString());

  // Bersihkan format rawContent dari simbol markdown
  const formattedBody = rawContent
    .split('\n')
    .filter(line => line.trim().length > 0)
    .map(line => {
      const cleanLine = escapeHtml(line.replace(/\*\*/g, '').replace(/\*/g, '').trim());
      if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
        return `<li style="margin-bottom: 6px; line-height: 1.6; color: #334155;">${cleanLine.replace(/^[-•]\s*/, '')}</li>`;
      }
      return `<p style="margin-bottom: 12px; line-height: 1.7; color: #1e293b; text-align: justify;">${cleanLine}</p>`;
    })
    .join('');

  const docHtml = `
    <!-- Header Kop Resmi DigiBooster -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 18px; page-break-inside: avoid;">
      <div style="display: flex; align-items: center;">
        <img src="${logoBase64}" alt="Logo" style="height: 38px; max-width: 190px; object-fit: contain; display: block;" onerror="this.onerror=null; this.src='/favicon.svg';" />
      </div>
      <div style="text-align: right; font-size: 10.5px; color: #475569;">
        <div style="display: inline-block; font-size: 9.5px; font-weight: 700; padding: 2px 8px; border-radius: 4px; background-color: #e0f2fe; color: #0369a1; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 3px;">
          Dokumen Eksekutif Resmi
        </div>
        <div><strong>Waktu Terbit:</strong> ${escapeHtml(nowFormatted)}</div>
      </div>
    </div>

    <!-- Judul Dokumen -->
    <div style="margin-bottom: 18px; page-break-inside: avoid;">
      <div style="font-size: 10px; font-weight: 700; color: #0284c7; text-transform: uppercase; letter-spacing: 0.05em;">
        ${escapeHtml(category)} • HQ DigiBooster
      </div>
      <h1 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 4px 0 0 0; line-height: 1.35;">
        ${escapeHtml(title)}
      </h1>
    </div>

    <!-- Metadata Parameter -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 22px; page-break-inside: avoid;">
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; background-color: #f8fafc;">
        <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Kategori</div>
        <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px;">${escapeHtml(category)}</div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; background-color: #f8fafc;">
        <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Penanggung Jawab (PIC)</div>
        <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 2px;">${escapeHtml(author)}</div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px; background-color: #f8fafc;">
        <div style="font-size: 9.5px; font-weight: 700; color: #64748b; text-transform: uppercase;">Status Validasi</div>
        <div style="font-size: 12px; font-weight: 700; color: #16a34a; margin-top: 2px;">Terverifikasi HQ</div>
      </div>
    </div>

    <!-- Isi Dokumen -->
    <div style="font-size: 11px; margin-bottom: 24px;">
      <div style="font-size: 11.5px; font-weight: 700; color: #0f172a; border-left: 3px solid #0284c7; padding-left: 8px; margin-bottom: 12px; text-transform: uppercase;">
        Isi &amp; Klausul Dokumen
      </div>
      <div style="padding: 14px 16px; border: 1px solid #e2e8f0; border-radius: 8px; background-color: #ffffff;">
        ${formattedBody}
      </div>
    </div>

    <!-- Catatan Hukum & Arsip -->
    <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 9px; color: #64748b; line-height: 1.5; page-break-inside: avoid;">
      Dokumen ini diterbitkan secara otomatis dan terverifikasi oleh Sistem Dokumentasi &amp; Legal HQ DigiBooster Indonesia. Dilarang mengubah, menggandakan, atau mempublikasikan tanpa izin tertulis dari manajemen DigiBooster.
    </div>
  `;

  const overlay = document.createElement('div');
  overlay.id = 'pdf-download-overlay';
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(2px); z-index: 999998; display: flex;
    align-items: center; justify-content: center; font-family: 'Poppins', -apple-system, sans-serif;
  `;
  overlay.innerHTML = `
    <div style="background: #ffffff; border-radius: 12px; padding: 18px 24px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15); max-width: 320px;">
      <div style="width: 28px; height: 28px; border: 3px solid #bae6fd; border-top-color: #0284c7; border-radius: 50%; animation: spin 0.6s linear infinite; margin: 0 auto 10px auto;"></div>
      <div style="font-weight: 700; font-size: 13.5px; color: #0f172a; margin-bottom: 2px;">Menyiapkan PDF...</div>
      <div style="font-size: 11px; color: #64748b;">Menyimpan dokumen resmi ke perangkat.</div>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `;
  document.body.appendChild(overlay);

  try {
    await generatePdfFromIsolatedIframe(docHtml, cleanFileName, 'portrait');
  } catch (err) {
    console.error('Gagal mengunduh PDF:', err);
  } finally {
    if (overlay && overlay.parentNode) {
      overlay.parentNode.removeChild(overlay);
    }
  }
}

/**
 * Ekspor Seluruh Tabel Data langsung menjadi file .pdf matriks landscape super cepat
 */
export async function exportTableAsPdf(rows = [], columns = [], options = {}) {
  if (!rows || rows.length === 0) {
    alert('Tidak ada data tabel yang dapat diekspor ke PDF.');
    return;
  }

  const logoBase64 = await getBase64Image('/logo.webp');
  const tableTitle = options.title || 'Laporan Data Operasional';
  const nowFormatted = formatDateID(new Date(), true);

  const headers = columns.map(col => ({
    key: col.key,
    label: extractTextFromReactNode(col.label) || col.key
  }));

  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4);
    backdrop-filter: blur(2px); z-index: 999998; display: flex;
    align-items: center; justify-content: center; font-family: 'Poppins', sans-serif;
  `;
  overlay.innerHTML = `
    <div style="background: #ffffff; border-radius: 12px; padding: 18px 24px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.15);">
      <div style="font-weight: 700; font-size: 13.5px; color: #0f172a; margin-bottom: 2px;">Mengunduh PDF Tabel...</div>
      <div style="font-size: 11px; color: #64748b;">Memformat ${rows.length} baris data.</div>
    </div>
  `;
  document.body.appendChild(overlay);

  const cleanFileName = (tableTitle.replace(/[^a-zA-Z0-9_\-]/g, '_') || 'Tabel_Operasional') + '.pdf';

  const tableHtml = `
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 10px; margin-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${logoBase64}" alt="Logo" style="height: 36px; max-width: 180px; object-fit: contain;" onerror="this.onerror=null; this.src='/favicon.svg';" />
        <div>
          <div style="font-size: 15px; font-weight: 800; color: #0f172a;">${escapeHtml(tableTitle)}</div>
          <div style="font-size: 10px; color: #64748b;">Matriks Laporan Operasional Terpadu</div>
        </div>
      </div>
      <div style="text-align: right; font-size: 9.5px; color: #64748b;">
        <div>Dicetak: ${escapeHtml(nowFormatted)}</div>
        <div>Total: <strong>${rows.length}</strong> entri</div>
      </div>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; table-layout: fixed;">
      <thead>
        <tr>
          <th style="width: 34px; text-align: center; border: 1px solid #cbd5e1; padding: 5px 8px; background-color: #f1f5f9; color: #334155; font-weight: 700;">No</th>
          ${headers.map(h => `<th style="border: 1px solid #cbd5e1; padding: 5px 8px; text-align: left; background-color: #f1f5f9; color: #334155; font-weight: 700; word-break: break-word;">${escapeHtml(h.label)}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, idx) => `
          <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
            <td style="text-align: center; color: #64748b; font-weight: 600; border: 1px solid #cbd5e1; padding: 5px 8px;">${idx + 1}</td>
            ${headers.map(h => {
              let val = row[h.key];
              if (val === undefined || val === null || val === '') val = '-';
              else if (Array.isArray(val)) val = val.join(', ');
              else if (typeof val === 'object') val = JSON.stringify(val);
              return `<td style="border: 1px solid #cbd5e1; padding: 5px 8px; vertical-align: top; word-break: break-word;">${escapeHtml(String(val))}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  try {
    await generatePdfFromIsolatedIframe(tableHtml, cleanFileName, 'landscape');
  } catch (err) {
    console.error('html2pdf table download error:', err);
  } finally {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }
}

/**
 * Helper escape HTML
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
