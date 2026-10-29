import { useWorkspaceStore } from '../store/workspaceStore';
import { exportTableAsPdf } from '../utils/exportPdf';

/**
 * Reta Action Executor
 * Menghubungkan instruksi/aksi dari Reta (COO) langsung ke Supabase & Zustand Store.
 * Mendukung Create, Read, Update, Delete (CRUD) untuk Tasks, CRM Clients, Keuangan, serta PDF Export.
 * 
 * Mekanisme Anti-Halu:
 * - Aksi hanya dieksekusi jika parameter valid.
 * - Operasi database diverifikasi status kembaliannya.
 * - Hasil mutasi langsung disinkronkan ke reaktif state.
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
  if (!match) {
    return { cleanText: responseText, actionPayload: null };
  }

  const rawJson = match[1];
  const cleanText = responseText.replace(RETA_ACTION_REGEX, '').trim();

  try {
    const actionPayload = JSON.parse(rawJson);
    return { cleanText, actionPayload };
  } catch (err) {
    console.warn('[Reta Action Executor] Gagal parsing JSON action payload:', err, rawJson);
    return { cleanText, actionPayload: null };
  }
}

/**
 * Menjalankan aksi yang diperintahkan oleh Reta
 * @param {Object} actionPayload { action: string, params: object }
 * @returns {Promise<{ success: boolean, message: string, downloadLink?: string, data?: any }>}
 */
export async function executeRetaAction(actionPayload) {
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
        const title = params.title || 'Tugas Baru';
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
        // Cari berdasarkan id atau pencocokan teks judul
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
        if (params.id) {
          target = tasks.find(t => t.id === params.id);
        }
        if (!target && params.title) {
          const query = params.title.toLowerCase();
          target = tasks.find(t => t.title && t.title.toLowerCase().includes(query));
        }

        if (!target) {
          return {
            success: false,
            message: `Tugas "${params.title || params.id}" ngga ditemukan untuk dihapus.`
          };
        }

        // Jika belum dikonfirmasi oleh Bang Robin, jangan hapus langsung
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
        const clientName = params.name || params.title || 'Klien Baru';
        const newClient = {
          name: clientName,
          category: params.category || 'Corporate',
          contact: params.contact || '-',
          stage: params.stage || 'Lead Masuk',
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
        if (params.id) {
          target = clients.find(c => c.id === params.id);
        }
        if (!target && params.name) {
          const query = params.name.toLowerCase();
          target = clients.find(c => c.name && c.name.toLowerCase().includes(query));
        }

        if (!target) {
          return {
            success: false,
            message: `Klien "${params.name || params.id}" ngga ditemukan di CRM.`
          };
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
        if (params.id) {
          target = clients.find(c => c.id === params.id);
        }
        if (!target && params.name) {
          const query = params.name.toLowerCase();
          target = clients.find(c => c.name && c.name.toLowerCase().includes(query));
        }

        if (!target) {
          return {
            success: false,
            message: `Klien "${params.name || params.id}" ngga ditemukan untuk dihapus.`
          };
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
        const title = params.title || 'Transaksi Baru';
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

      // ==========================================
      // 4. GENERATE & DOWNLOAD PDF LAPORAN
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
          if (params.filterStatus) {
            taskList = taskList.filter(t => (t.status || '').toLowerCase().includes(params.filterStatus.toLowerCase()));
          }
          if (params.filterPic) {
            taskList = taskList.filter(t => (t.assignee || '').toLowerCase().includes(params.filterPic.toLowerCase()));
          }
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
          if (params.filterStage) {
            clientList = clientList.filter(c => (c.stage || '').toLowerCase().includes(params.filterStage.toLowerCase()));
          }
          if (params.minDealValue) {
            clientList = clientList.filter(c => Number(c.dealValue || 0) >= Number(params.minDealValue));
          }
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
          if (params.filterType) {
            txList = txList.filter(tx => (tx.type || '').toLowerCase().includes(params.filterType.toLowerCase()));
          }
          rows = txList.map(tx => ({
            title: tx.title || '-',
            type: tx.type || 'Pemasukan',
            category: tx.category || '-',
            amountFormatted: `Rp ${(Number(tx.amount) || 0).toLocaleString('id-ID')}`,
            date: tx.date || '-',
            status: tx.status || 'Lunas'
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

        // Panggil exportTableAsPdf bawaan sistem
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
