import { useWorkspaceStore } from '../store/workspaceStore';
import { exportTableAsPdf } from '../utils/exportPdf';

/**
 * Reta Action Executor - Unified Master Database Controller
 * Menghubungkan instruksi/aksi dari Reta (COO) secara eksklusif ke seluruh modul database Supabase & Zustand Store.
 * 
 * Modul Terkelola Penuh oleh Reta:
 * 1. Tasks & Kalender (tasks)
 * 2. CRM & Klien (crm_clients)
 * 3. Keuangan & Profit (finance_transactions)
 * 4. Rapat & Notulensi (meetings)
 * 5. Branding & Marketing Campaigns (marketing_campaigns)
 * 6. Sasaran & OKR Goals (okr_goals)
 * 7. Ekspor Laporan Resmi (PDF)
 */

export const RETA_ACTION_REGEX = /<!--RETA_ACTION:\s*([\s\S]*?)\s*-->/;

/**
 * Parsing payload aksi Reta dari respon teks AI
 */
export function extractRetaAction(responseText) {
  if (!responseText || typeof responseText !== 'string') {
    return { cleanText: responseText, actionPayload: null };
  }

  const match = responseText.match(RETA_ACTION_REGEX);
  const cleanText = responseText
    .replace(/<!--RETA_ACTION:[\s\S]*?-->/gi, '')
    .replace(/<!--RETA_ACTION:[\s\S]*/gi, '')
    .trim();

  if (!match) {
    return { cleanText, actionPayload: null };
  }

  const rawJson = match[1];

  try {
    const actionPayload = JSON.parse(rawJson);
    return { cleanText, actionPayload };
  } catch (err) {
    console.warn('[Reta Action Executor] Gagal parsing JSON action payload:', err, rawJson);
    return { cleanText, actionPayload: null };
  }
}

/**
 * Menjalankan aksi yang diperintahkan secara eksklusif oleh Reta
 */
export async function executeRetaAction(actionPayload, callerAgent = 'Reta') {
  // ATURAN INTEGRITAS TUNGGAL: HANYA RETA YANG BERWENANG MENGISI & MENGELOLA DATA DASHBOARD!
  if (callerAgent && !callerAgent.toLowerCase().includes('reta')) {
    return {
      success: false,
      message: `Otoritas ditolak: Hanya Reta (COO) yang berwenang mengelola & mengisi data dashboard.`
    };
  }

  if (!actionPayload || !actionPayload.action) {
    return { success: false, message: 'Tidak ada aksi valid.' };
  }

  const store = useWorkspaceStore.getState();
  const { action, params = {} } = actionPayload;

  try {
    switch (action.toUpperCase()) {
      // ==========================================
      // 1. TUGAS / TASKS (CRUD)
      // ==========================================
      case 'CREATE_TASK': {
        const title = (params.title || 'Tugas Baru').trim();
        const existingTasks = store.tasks || [];
        
        const duplicateTask = existingTasks.find(t => 
          t.title && t.title.toLowerCase().trim() === title.toLowerCase()
        );

        if (duplicateTask) {
          return {
            success: true,
            action: 'CREATE_TASK',
            message: `Tugas "${title}" sudah ada di dashboard (anti-duplikasi aktif).`,
            data: duplicateTask
          };
        }

        const newTask = {
          title,
          description: params.description || params.notes || '',
          category: params.category || 'Website & Tracking',
          project: params.project || 'Operasional DigiBooster',
          assignee: params.assignee || 'Reta',
          priority: params.priority || 'P2',
          status: params.status || 'To-Do',
          dueDate: params.dueDate || new Date().toISOString().split('T')[0],
          outputResult: params.outputResult || '',
          createdBy: 'Reta (COO Agent)'
        };
        await store.addTask(newTask);
        return {
          success: true,
          action: 'CREATE_TASK',
          message: `Tugas "${title}" berhasil ditambahkan ke dashboard.`,
          data: newTask
        };
      }

      case 'UPDATE_TASK': {
        const tasks = store.tasks || [];
        let target = null;
        if (params.id) {
          target = tasks.find(t => t.id === params.id || String(t.id).toLowerCase() === String(params.id).toLowerCase());
        }
        if (!target && params.title) {
          const query = params.title.toLowerCase();
          target = tasks.find(t => t.title && t.title.toLowerCase().includes(query));
        }

        if (!target) {
          return {
            success: false,
            message: `Tugas "${params.title || params.id}" ngga ditemukan di daftar dashboard.`
          };
        }

        const updates = {};
        if (params.newTitle) updates.title = params.newTitle;
        if (params.status) updates.status = params.status;
        if (params.priority) updates.priority = params.priority;
        if (params.assignee) updates.assignee = params.assignee;
        if (params.dueDate) updates.dueDate = params.dueDate;
        if (params.category) updates.category = params.category;
        if (params.description || params.notes) updates.description = params.description || params.notes;
        if (params.outputResult) updates.outputResult = params.outputResult;

        await store.updateTask(target.id, updates, 'Reta (COO Agent)');
        return {
          success: true,
          action: 'UPDATE_TASK',
          message: `Tugas "${target.title}" berhasil di-update.`,
          data: { id: target.id, ...updates }
        };
      }

      case 'DELETE_TASK': {
        const tasks = store.tasks || [];
        let target = null;
        if (params.id) target = tasks.find(t => t.id === params.id);
        if (!target && params.title) {
          const query = params.title.toLowerCase();
          target = tasks.find(t => t.title && t.title.toLowerCase().includes(query));
        }

        if (!target) {
          return { success: false, message: `Tugas "${params.title || params.id}" ngga ditemukan.` };
        }

        if (!params.confirmed) {
          return {
            success: false,
            action: 'DELETE_TASK',
            requiresConfirmation: true,
            confirmTargetType: 'task',
            targetId: target.id,
            targetTitle: target.title,
            message: `Tugas "${target.title}" siap dihapus. Butuh konfirmasi Bang Robin.`
          };
        }

        await store.deleteTask(target.id);
        return {
          success: true,
          action: 'DELETE_TASK',
          message: `Tugas "${target.title}" telah resmi dihapus dari dashboard.`,
          data: { id: target.id }
        };
      }

      // ==========================================
      // 2. CLIENT CRM (CRUD)
      // ==========================================
      case 'CREATE_CLIENT': {
        const clientName = (params.name || params.title || 'Klien Baru').trim();
        const existingClients = store.crmClients || [];
        
        const duplicate = existingClients.find(c => 
          c.name && c.name.toLowerCase().trim() === clientName.toLowerCase()
        );

        if (duplicate) {
          const updates = {};
          if (params.category && params.category !== duplicate.category) updates.category = params.category;
          if (params.dealValue && Number(params.dealValue) !== Number(duplicate.dealValue)) updates.dealValue = Number(params.dealValue);
          if (params.stage && params.stage !== duplicate.stage) updates.stage = params.stage;
          if (params.pic && params.pic !== duplicate.pic) updates.pic = params.pic;
          if (params.contact && params.contact !== duplicate.contact) updates.contact = params.contact;

          if (Object.keys(updates).length > 0) {
            await store.updateCrmClient(duplicate.id, updates);
            return {
              success: true,
              action: 'UPDATE_CLIENT',
              message: `Klien "${clientName}" sudah ada di CRM. Data telah diperbarui (anti-duplikasi).`,
              data: { id: duplicate.id, ...updates }
            };
          }

          return {
            success: true,
            action: 'CREATE_CLIENT',
            message: `Klien "${clientName}" sudah tercatat sebelumnya di CRM.`,
            data: duplicate
          };
        }

        const newClient = {
          name: clientName,
          category: params.category || 'Corporate',
          contact: params.contact || '-',
          stage: params.stage || 'Prospect',
          dealValue: Number(params.dealValue || params.amount || 0),
          services: Array.isArray(params.services) ? params.services : (params.services ? [params.services] : ['Digital Marketing']),
          pic: params.pic || 'Robin',
          contractDoc: params.contractDoc || null
        };
        await store.addCrmClient(newClient);
        return {
          success: true,
          action: 'CREATE_CLIENT',
          message: `Klien "${clientName}" berhasil disimpan ke CRM.`,
          data: newClient
        };
      }

      case 'UPDATE_CLIENT': {
        const clients = store.crmClients || [];
        let target = null;
        if (params.id) target = clients.find(c => c.id === params.id);
        if (!target && params.name) {
          const query = params.name.toLowerCase();
          target = clients.find(c => c.name && c.name.toLowerCase().includes(query));
        }

        if (!target) {
          return { success: false, message: `Klien "${params.name || params.id}" ngga ditemukan di CRM.` };
        }

        const updates = {};
        if (params.newName) updates.name = params.newName;
        if (params.stage) updates.stage = params.stage;
        if (params.dealValue !== undefined) updates.dealValue = Number(params.dealValue);
        if (params.contact) updates.contact = params.contact;
        if (params.category) updates.category = params.category;
        if (params.pic) updates.pic = params.pic;

        await store.updateCrmClient(target.id, updates);
        return {
          success: true,
          action: 'UPDATE_CLIENT',
          message: `Data klien "${target.name}" berhasil di-update.`,
          data: { id: target.id, ...updates }
        };
      }

      case 'DELETE_CLIENT': {
        const clients = store.crmClients || [];
        let target = null;
        if (params.id) target = clients.find(c => c.id === params.id);
        if (!target && params.name) {
          const query = params.name.toLowerCase();
          target = clients.find(c => c.name && c.name.toLowerCase().includes(query));
        }

        if (!target) {
          return { success: false, message: `Klien "${params.name || params.id}" ngga ditemukan.` };
        }

        if (!params.confirmed) {
          return {
            success: false,
            action: 'DELETE_CLIENT',
            requiresConfirmation: true,
            confirmTargetType: 'client',
            targetId: target.id,
            targetTitle: target.name,
            message: `Klien "${target.name}" siap dihapus. Butuh konfirmasi Bang Robin.`
          };
        }

        await store.deleteCrmClient(target.id);
        return {
          success: true,
          action: 'DELETE_CLIENT',
          message: `Data klien "${target.name}" telah resmi dihapus dari CRM.`,
          data: { id: target.id }
        };
      }

      // ==========================================
      // 3. KEUANGAN & TRANSAKSI (CRUD)
      // ==========================================
      case 'CREATE_TRANSACTION': {
        const title = (params.title || 'Transaksi Baru').trim();
        const newTx = {
          title,
          type: params.type || 'Pemasukan',
          category: params.category || 'Pendapatan Jasa',
          amount: Number(params.amount || 0),
          clientRef: params.clientRef || '-',
          date: params.date || new Date().toISOString().split('T')[0],
          status: params.status || 'Lunas',
          receiptDoc: params.receiptDoc || null
        };
        await store.addFinanceTransaction(newTx);
        return {
          success: true,
          action: 'CREATE_TRANSACTION',
          message: `Transaksi "${title}" (Rp ${newTx.amount.toLocaleString('id-ID')}) berhasil dicatat di pembukuan.`,
          data: newTx
        };
      }

      case 'UPDATE_TRANSACTION': {
        const txs = store.financeTransactions || [];
        let target = null;
        if (params.id) target = txs.find(t => t.id === params.id);
        if (!target && params.title) {
          const query = params.title.toLowerCase();
          target = txs.find(t => t.title && t.title.toLowerCase().includes(query));
        }

        if (!target) {
          return { success: false, message: `Transaksi "${params.title || params.id}" ngga ditemukan.` };
        }

        const updates = {};
        if (params.newTitle) updates.title = params.newTitle;
        if (params.amount !== undefined) updates.amount = Number(params.amount);
        if (params.status) updates.status = params.status;
        if (params.category) updates.category = params.category;
        if (params.date) updates.date = params.date;
        if (params.type) updates.type = params.type;

        await store.updateFinanceTransaction(target.id, updates);
        return {
          success: true,
          action: 'UPDATE_TRANSACTION',
          message: `Transaksi "${target.title}" berhasil di-update.`,
          data: { id: target.id, ...updates }
        };
      }

      case 'DELETE_TRANSACTION': {
        const txs = store.financeTransactions || [];
        let target = null;
        if (params.id) target = txs.find(t => t.id === params.id);
        if (!target && params.title) {
          const query = params.title.toLowerCase();
          target = txs.find(t => t.title && t.title.toLowerCase().includes(query));
        }

        if (!target) {
          return { success: false, message: `Transaksi "${params.title || params.id}" ngga ditemukan.` };
        }

        if (!params.confirmed) {
          return {
            success: false,
            action: 'DELETE_TRANSACTION',
            requiresConfirmation: true,
            confirmTargetType: 'transaction',
            targetId: target.id,
            targetTitle: target.title,
            message: `Transaksi "${target.title}" siap dihapus. Butuh konfirmasi Bang Robin.`
          };
        }

        await store.deleteFinanceTransaction(target.id);
        return {
          success: true,
          action: 'DELETE_TRANSACTION',
          message: `Transaksi "${target.title}" telah resmi dihapus dari pembukuan.`,
          data: { id: target.id }
        };
      }

      // ==========================================
      // 4. RAPAT & NOTULENSI (MEETINGS)
      // ==========================================
      case 'CREATE_MEETING': {
        const title = (params.title || 'Rapat Koordinasi').trim();
        const newMeeting = {
          title,
          dateTime: params.dateTime || params.date || new Date().toISOString().split('T')[0],
          type: params.type || 'Client Pitching',
          status: params.status || 'Terjadwal',
          participants: Array.isArray(params.participants) ? params.participants : (params.participants ? [params.participants] : ['Robin', 'Reta']),
          link: params.link || '',
          summaryNotes: params.summaryNotes || params.notes || '',
          actionItems: Array.isArray(params.actionItems) ? params.actionItems : []
        };
        await store.addMeeting(newMeeting);
        return {
          success: true,
          action: 'CREATE_MEETING',
          message: `Jadwal rapat "${title}" (${newMeeting.dateTime}) berhasil dicatat di kalender.`,
          data: newMeeting
        };
      }

      case 'UPDATE_MEETING': {
        const meetings = store.meetings || [];
        let target = null;
        if (params.id) target = meetings.find(m => m.id === params.id);
        if (!target && params.title) {
          const query = params.title.toLowerCase();
          target = meetings.find(m => m.title && m.title.toLowerCase().includes(query));
        }

        if (!target) {
          return { success: false, message: `Rapat "${params.title || params.id}" ngga ditemukan.` };
        }

        const updates = {};
        if (params.newTitle) updates.title = params.newTitle;
        if (params.dateTime) updates.dateTime = params.dateTime;
        if (params.status) updates.status = params.status;
        if (params.summaryNotes) updates.summaryNotes = params.summaryNotes;

        await store.updateMeeting(target.id, updates);
        return {
          success: true,
          action: 'UPDATE_MEETING',
          message: `Jadwal rapat "${target.title}" berhasil di-update.`,
          data: { id: target.id, ...updates }
        };
      }

      // ==========================================
      // 5. MARKETING & CAMPAIGNS (MARKETING)
      // ==========================================
      case 'CREATE_CAMPAIGN': {
        const title = (params.title || 'Kampanye Baru').trim();
        const newCamp = {
          title,
          channel: params.channel || 'Meta Ads',
          pillar: params.pillar || 'Conversion',
          stage: params.stage || 'Aktif',
          publishDate: params.publishDate || new Date().toISOString().split('T')[0],
          adSpend: Number(params.adSpend || params.budget || 0),
          metrics: params.metrics || { reach: 0, leads: 0 },
          mediaLink: params.mediaLink || ''
        };
        await store.addMarketingCampaign(newCamp);
        return {
          success: true,
          action: 'CREATE_CAMPAIGN',
          message: `Kampanye iklan "${title}" (${newCamp.channel}) berhasil didaftarkan di marketing.`,
          data: newCamp
        };
      }

      // ==========================================
      // 6. SASARAN & OKR GOALS
      // ==========================================
      case 'CREATE_OKR': {
        const objective = (params.objective || params.title || 'Sasaran Baru').trim();
        const newOkr = {
          objective,
          keyResult: params.keyResult || 'Pencapaian Target',
          category: params.category || 'Revenue',
          division: params.division || 'Commercial',
          quarter: params.quarter || 'Q4 2026',
          targetNum: Number(params.targetNum || 100),
          currentNum: Number(params.currentNum || 0),
          unit: params.unit || '%',
          progressPercent: Number(params.progressPercent || 0),
          status: params.status || 'On Track',
          owner: params.owner || 'Robin'
        };
        await store.addOkrGoal(newOkr);
        return {
          success: true,
          action: 'CREATE_OKR',
          message: `Target OKR "${objective}" berhasil disimpan ke sistem KPI.`,
          data: newOkr
        };
      }

      case 'DELETE_MEETING': {
        const meetings = store.meetings || [];
        let target = null;
        if (params.id) target = meetings.find(m => m.id === params.id);
        if (!target && params.title) {
          const query = params.title.toLowerCase();
          target = meetings.find(m => m.title && m.title.toLowerCase().includes(query));
        }

        if (!target) return { success: false, message: `Rapat "${params.title || params.id}" ngga ditemukan.` };

        if (!params.confirmed) {
          return {
            success: false,
            action: 'DELETE_MEETING',
            requiresConfirmation: true,
            confirmTargetType: 'meeting',
            targetId: target.id,
            targetTitle: target.title,
            message: `Jadwal rapat "${target.title}" siap dihapus. Butuh konfirmasi Bang Robin.`
          };
        }

        await store.deleteMeeting(target.id);
        return {
          success: true,
          action: 'DELETE_MEETING',
          message: `Jadwal rapat "${target.title}" telah dihapus dari kalender.`,
          data: { id: target.id }
        };
      }

      case 'UPDATE_CAMPAIGN': {
        const camps = store.marketingCampaigns || [];
        let target = null;
        if (params.id) target = camps.find(c => c.id === params.id);
        if (!target && params.title) {
          const query = params.title.toLowerCase();
          target = camps.find(c => c.title && c.title.toLowerCase().includes(query));
        }

        if (!target) return { success: false, message: `Kampanye "${params.title || params.id}" ngga ditemukan.` };

        const updates = {};
        if (params.newTitle) updates.title = params.newTitle;
        if (params.stage) updates.stage = params.stage;
        if (params.adSpend !== undefined) updates.adSpend = Number(params.adSpend);
        if (params.channel) updates.channel = params.channel;

        await store.updateMarketingCampaign(target.id, updates);
        return {
          success: true,
          action: 'UPDATE_CAMPAIGN',
          message: `Kampanye iklan "${target.title}" berhasil di-update.`,
          data: { id: target.id, ...updates }
        };
      }

      case 'DELETE_CAMPAIGN': {
        const camps = store.marketingCampaigns || [];
        let target = null;
        if (params.id) target = camps.find(c => c.id === params.id);
        if (!target && params.title) {
          const query = params.title.toLowerCase();
          target = camps.find(c => c.title && c.title.toLowerCase().includes(query));
        }

        if (!target) return { success: false, message: `Kampanye "${params.title || params.id}" ngga ditemukan.` };

        if (!params.confirmed) {
          return {
            success: false,
            action: 'DELETE_CAMPAIGN',
            requiresConfirmation: true,
            confirmTargetType: 'campaign',
            targetId: target.id,
            targetTitle: target.title,
            message: `Kampanye "${target.title}" siap dihapus. Butuh konfirmasi Bang Robin.`
          };
        }

        await store.deleteMarketingCampaign(target.id);
        return {
          success: true,
          action: 'DELETE_CAMPAIGN',
          message: `Kampanye "${target.title}" telah resmi dihapus dari marketing.`,
          data: { id: target.id }
        };
      }

      case 'UPDATE_OKR': {
        const okrs = store.okrGoals || [];
        let target = null;
        if (params.id) target = okrs.find(o => o.id === params.id);
        if (!target && params.objective) {
          const query = params.objective.toLowerCase();
          target = okrs.find(o => o.objective && o.objective.toLowerCase().includes(query));
        }

        if (!target) return { success: false, message: `Sasaran OKR "${params.objective || params.id}" ngga ditemukan.` };

        const updates = {};
        if (params.progressPercent !== undefined) updates.progressPercent = Number(params.progressPercent);
        if (params.currentNum !== undefined) updates.currentNum = Number(params.currentNum);
        if (params.status) updates.status = params.status;

        await store.updateOkrGoal(target.id, updates);
        return {
          success: true,
          action: 'UPDATE_OKR',
          message: `Target OKR "${target.objective}" berhasil di-update (Progress: ${updates.progressPercent ?? target.progressPercent}%).`,
          data: { id: target.id, ...updates }
        };
      }

      case 'DELETE_OKR': {
        const okrs = store.okrGoals || [];
        let target = null;
        if (params.id) target = okrs.find(o => o.id === params.id);
        if (!target && params.objective) {
          const query = params.objective.toLowerCase();
          target = okrs.find(o => o.objective && o.objective.toLowerCase().includes(query));
        }

        if (!target) return { success: false, message: `Sasaran OKR "${params.objective || params.id}" ngga ditemukan.` };

        if (!params.confirmed) {
          return {
            success: false,
            action: 'DELETE_OKR',
            requiresConfirmation: true,
            confirmTargetType: 'okr',
            targetId: target.id,
            targetTitle: target.objective,
            message: `Target OKR "${target.objective}" siap dihapus. Butuh konfirmasi Bang Robin.`
          };
        }

        await store.deleteOkrGoal(target.id);
        return {
          success: true,
          action: 'DELETE_OKR',
          message: `Target OKR "${target.objective}" telah dihapus dari sistem KPI.`,
          data: { id: target.id }
        };
      }

      case 'CREATE_REPORT': {
        const title = (params.title || 'Laporan Evaluasi').trim();
        const newReport = {
          title,
          period: params.period || 'Bulanan',
          category: params.category || 'Audit Kualitas',
          status: params.status || 'Draft',
          summary: params.summary || params.notes || '',
          keyMetrics: params.keyMetrics || {},
          recommendations: Array.isArray(params.recommendations) ? params.recommendations : []
        };
        await store.addReport(newReport);
        return {
          success: true,
          action: 'CREATE_REPORT',
          message: `Laporan evaluasi "${title}" berhasil disimpan di modul Laporan & Evaluasi.`,
          data: newReport
        };
      }

      case 'CREATE_ARCHIVE': {
        const title = (params.title || 'Dokumen Arsip').trim();
        const newArchive = {
          title,
          category: params.category || 'Operasional',
          fileType: params.fileType || 'PDF',
          tags: Array.isArray(params.tags) ? params.tags : ['Penting'],
          notes: params.notes || ''
        };
        await store.addArchive(newArchive);
        return {
          success: true,
          action: 'CREATE_ARCHIVE',
          message: `Berkas arsip "${title}" berhasil disimpan di Data & Arsip.`,
          data: newArchive
        };
      }

      // ==========================================
      // 7. GENERATE & DOWNLOAD PDF LAPORAN
      // ==========================================
      case 'GENERATE_PDF': {
        const reportType = (params.type || params.module || 'tasks').toLowerCase();
        const tableTitle = params.title || `Rekap ${reportType.toUpperCase()} DigiBooster`;
        
        let headers = [];
        let rows = [];

        if (reportType.includes('task') || reportType.includes('tugas')) {
          headers = [
            { key: 'title', label: 'Judul Tugas' },
            { key: 'category', label: 'Kategori' },
            { key: 'assignee', label: 'PIC' },
            { key: 'priority', label: 'Prioritas' },
            { key: 'status', label: 'Status' },
            { key: 'dueDate', label: 'Deadline' }
          ];
          let taskList = store.tasks || [];
          if (params.filterStatus) taskList = taskList.filter(t => (t.status || '').toLowerCase().includes(params.filterStatus.toLowerCase()));
          if (params.filterPic) taskList = taskList.filter(t => (t.assignee || '').toLowerCase().includes(params.filterPic.toLowerCase()));
          rows = taskList.map(t => ({
            title: t.title || '-',
            category: t.category || '-',
            assignee: t.assignee || 'Reta',
            priority: t.priority || 'P2',
            status: t.status || 'To-Do',
            dueDate: t.dueDate || '-'
          }));
        } else if (reportType.includes('client') || reportType.includes('crm') || reportType.includes('klien')) {
          headers = [
            { key: 'name', label: 'Nama Klien' },
            { key: 'category', label: 'Kategori' },
            { key: 'stage', label: 'Tahapan' },
            { key: 'dealValueFormatted', label: 'Nilai Deal' },
            { key: 'pic', label: 'PIC' },
            { key: 'contact', label: 'Kontak' }
          ];
          let clientList = store.crmClients || [];
          if (params.filterStage) clientList = clientList.filter(c => (c.stage || '').toLowerCase().includes(params.filterStage.toLowerCase()));
          if (params.minDealValue) clientList = clientList.filter(c => Number(c.dealValue || 0) >= Number(params.minDealValue));
          rows = clientList.map(c => ({
            name: c.name || '-',
            category: c.category || '-',
            stage: c.stage || 'Lead Masuk',
            dealValueFormatted: `Rp ${(Number(c.dealValue) || 0).toLocaleString('id-ID')}`,
            pic: c.pic || 'Robin',
            contact: c.contact || '-'
          }));
        } else if (reportType.includes('uang') || reportType.includes('finan') || reportType.includes('transaksi')) {
          headers = [
            { key: 'title', label: 'Keterangan' },
            { key: 'type', label: 'Jenis' },
            { key: 'category', label: 'Kategori' },
            { key: 'amountFormatted', label: 'Nominal' },
            { key: 'date', label: 'Tanggal' },
            { key: 'status', label: 'Status' }
          ];
          let txList = store.financeTransactions || [];
          if (params.filterType) txList = txList.filter(tx => (tx.type || '').toLowerCase().includes(params.filterType.toLowerCase()));
          rows = txList.map(tx => ({
            title: tx.title || '-',
            type: tx.type || 'Pemasukan',
            category: tx.category || '-',
            amountFormatted: `Rp ${(Number(tx.amount) || 0).toLocaleString('id-ID')}`,
            date: tx.date || '-',
            status: tx.status || 'Lunas'
          }));
        } else if (reportType.includes('rapat') || reportType.includes('meet')) {
          headers = [
            { key: 'title', label: 'Agenda Rapat' },
            { key: 'dateTime', label: 'Waktu' },
            { key: 'type', label: 'Jenis' },
            { key: 'status', label: 'Status' }
          ];
          rows = (store.meetings || []).map(m => ({
            title: m.title || '-',
            dateTime: m.dateTime || '-',
            type: m.type || 'Internal',
            status: m.status || 'Terjadwal'
          }));
        } else {
          headers = [
            { key: 'title', label: 'Item / Tugas' },
            { key: 'status', label: 'Status' },
            { key: 'assignee', label: 'PIC' }
          ];
          rows = (store.tasks || []).map(t => ({
            title: t.title || '-',
            status: t.status || 'To-Do',
            assignee: t.assignee || 'Reta'
          }));
        }

        await exportTableAsPdf(tableTitle, headers, rows);

        return {
          success: true,
          action: 'GENERATE_PDF',
          message: `Laporan PDF "${tableTitle}" berhasil digenerate dan otomatis terunduh.`,
          data: { title: tableTitle, count: rows.length }
        };
      }

      default:
        return {
          success: false,
          message: `Aksi "${action}" tidak dikenali oleh sistem.`
        };
    }
  } catch (error) {
    console.error('[Reta Action Executor] Error eksekusi aksi:', error);
    return {
      success: false,
      message: `Terjadi kendala teknis saat mengeksekusi aksi: ${error.message}`
    };
  }
}
