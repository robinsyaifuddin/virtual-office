/**
 * DigiBooster AI Executive Workspace - Word (.docx) Export Engine
 * Dikelola oleh Raka (Head of Documentation & Legal)
 * Menghasilkan file dokumen Word resmi, rapi, standar kop surat DigiBooster langsung di browser.
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';

/**
 * Buat dan unduh file .docx secara otomatis di browser
 */
export async function generateAndDownloadWordDoc({
  title = 'Dokumen Resmi DigiBooster',
  category = 'Administrasi & Legal',
  author = 'Raka (Head of Documentation & Legal)',
  sections = [],
  rawContent = ''
}) {
  const children = [];

  // 1. Header / Kop DigiBooster
  children.push(
    new Paragraph({
      alignment: 'center',
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: 'DIGIBOOSTER INDONESIA',
          bold: true,
          size: 28, // 14pt
          font: 'Arial',
          color: '0284C7'
        })
      ]
    }),
    new Paragraph({
      alignment: 'center',
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: 'AI Multi-Agent Headquarters • Legal & Enterprise Documentation System',
          italics: true,
          size: 18,
          font: 'Arial',
          color: '64748B'
        })
      ]
    }),
    new Paragraph({
      alignment: 'center',
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: '_________________________________________________________________________________',
          color: 'CBD5E1'
        })
      ]
    })
  );

  // 2. Metadata Dokumen
  children.push(
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: 'Judul Dokumen: ', bold: true, size: 22, font: 'Arial' }),
        new TextRun({ text: title, size: 22, font: 'Arial', color: '0F172A' })
      ]
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({ text: 'Kategori / Modul: ', bold: true, size: 20, font: 'Arial' }),
        new TextRun({ text: category, size: 20, font: 'Arial', color: '475569' })
      ]
    }),
    new Paragraph({
      spacing: { after: 240 },
      children: [
        new TextRun({ text: 'Penyusun: ', bold: true, size: 20, font: 'Arial' }),
        new TextRun({ text: `${author} • Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, size: 20, font: 'Arial', color: '475569' })
      ]
    })
  );

  // 3. Isi Dokumen
  if (sections && sections.length > 0) {
    sections.forEach((sec, idx) => {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: `${idx + 1}. ${sec.heading}`,
              bold: true,
              size: 22,
              font: 'Arial',
              color: '0369A1'
            })
          ]
        }),
        new Paragraph({
          spacing: { after: 180 },
          children: [
            new TextRun({
              text: sec.body || '',
              size: 20,
              font: 'Arial',
              color: '1E293B'
            })
          ]
        })
      );
    });
  } else if (rawContent) {
    // Parser teks biasa ke paragraf Word
    const lines = rawContent.split('\n');
    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        children.push(new Paragraph({ spacing: { after: 100 } }));
        return;
      }
      const isHeader = trimmed.startsWith('#') || trimmed.toUpperCase() === trimmed && trimmed.length > 5;
      children.push(
        new Paragraph({
          spacing: { after: 140 },
          children: [
            new TextRun({
              text: trimmed.replace(/^#+\s*/, ''),
              bold: isHeader,
              size: isHeader ? 22 : 20,
              font: 'Arial',
              color: isHeader ? '0369A1' : '1E293B'
            })
          ]
        })
      );
    });
  }

  // 4. Catatan Kaki Legal
  children.push(
    new Paragraph({
      spacing: { before: 400, after: 100 },
      children: [
        new TextRun({
          text: 'Catatan Keabsahan: Dokumen ini diterbitkan secara otomatis dan terverifikasi oleh Sistem Dokumentasi & Arsip Legal Dewan Agen AI DigiBooster.',
          italics: true,
          size: 16,
          font: 'Arial',
          color: '94A3B8'
        })
      ]
    })
  );

  // Buat File Dokumen Word
  const doc = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 45);
  const fileName = `${cleanTitle}_DigiBooster.docx`;

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);

  return { success: true, fileName };
}
