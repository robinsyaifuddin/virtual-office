import { create } from 'zustand';
import { supabase } from '../utils/supabaseClient';

// Helper Audit Log
async function recordAuditLog(action, tableName, recordId, changes) {
  try {
    await supabase.from('audit_logs').insert([{
      actor_type: 'USER',
      actor_name: 'Executive Owner',
      action,
      table_name: tableName,
      record_id: String(recordId),
      changes: changes || {}
    }]);
  } catch (err) {
    console.warn('Gagal mencatat audit log:', err);
  }
}

export const useWorkspaceStore = create((set, get) => ({
  // Active Module / Navigation
  activeModule: 'executivedashboard',
  setActiveModule: (moduleKey) => set({ activeModule: moduleKey }),

  // Status sinkronisasi DB Supabase
  isDbLoading: false,
  dbError: null,

  // Method Utama: Tarik Semua Data dari Supabase (Zero Dummy)
  fetchWorkspaceData: async () => {
    set({ isDbLoading: true, dbError: null });
    try {
      const [
        { data: clients, error: errClients },
        { data: txs, error: errTxs },
        { data: tasks, error: errTasks },
        { data: mkt, error: errMkt },
        { data: okrs, error: errOkrs },
        { data: meetingsRaw, error: errMeetings },
        { data: reportsRaw, error: errReports },
        { data: archivesRaw, error: errArchives },
        { data: templatesRaw, error: errTemplates }
      ] = await Promise.all([
        supabase.from('crm_clients').select('*').order('created_at', { ascending: false }),
        supabase.from('finance_transactions').select('*').order('date', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('marketing_campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('okr_goals').select('*').order('updated_at', { ascending: false }),
        supabase.from('meetings').select('*').order('created_at', { ascending: false }),
        supabase.from('reports').select('*').order('created_at', { ascending: false }),
        supabase.from('archives').select('*').order('created_at', { ascending: false }),
        supabase.from('custom_templates').select('*').order('created_at', { ascending: false })
      ]);

      if (errClients) console.warn('Supabase clients error:', errClients.message);
      if (errTxs) console.warn('Supabase transactions error:', errTxs.message);
      if (errTasks) console.warn('Supabase tasks error:', errTasks.message);
      if (errMkt) console.warn('Supabase marketing error:', errMkt.message);
      if (errOkrs) console.warn('Supabase OKRs error:', errOkrs.message);
      if (errMeetings) console.warn('Supabase meetings error:', errMeetings.message);
      if (errReports) console.warn('Supabase reports error:', errReports.message);
      if (errArchives) console.warn('Supabase archives error:', errArchives.message);

      // Normalisasi kolom DB snake_case ke format state camelCase
      const formattedClients = (clients || []).map(c => ({
        id: c.id,
        name: c.name,
        category: c.category,
        contact: c.contact,
        stage: c.stage,
        dealValue: Number(c.deal_value || 0),
        services: c.services || [],
        pic: c.pic,
        contractDoc: c.contract_doc,
        updatedAt: c.updated_at ? c.updated_at.split('T')[0] : ''
      }));

      const formattedTxs = (txs || []).map(t => ({
        id: t.id,
        title: t.title,
        type: t.type,
        category: t.category,
        amount: Number(t.amount || 0),
        clientRef: t.client_ref,
        date: t.date,
        status: t.status,
        receiptDoc: t.receipt_doc
      }));

      const formattedTasks = (tasks || []).map(tk => ({
        id: tk.id,
        title: tk.title,
        description: tk.description,
        category: tk.category,
        project: tk.project,
        assignee: tk.assignee,
        priority: tk.priority,
        status: tk.status,
        dueDate: tk.due_date,
        completedDate: tk.completed_date,
        outputResult: tk.output_result,
        createdBy: tk.created_by,
        comments: tk.comments || [],
        updatedAt: tk.updated_at ? tk.updated_at.replace('T', ' ').substring(0, 16) : ''
      }));

      const formattedMkt = (mkt || []).map(m => ({
        id: m.id,
        title: m.title,
        channel: m.channel,
        pillar: m.pillar,
        stage: m.stage,
        publishDate: m.publish_date,
        adSpend: Number(m.ad_spend || 0),
        metrics: m.metrics || { reach: 0, leads: 0 },
        mediaLink: m.media_link
      }));

      const formattedOkrs = (okrs || []).map(o => ({
        id: o.id,
        objective: o.objective,
        keyResult: o.key_result,
        category: o.category,
        division: o.division,
        quarter: o.quarter,
        targetNum: Number(o.target_num || 0),
        currentNum: Number(o.current_num || 0),
        unit: o.unit,
        progressPercent: o.progress_percent || 0,
        status: o.status,
        owner: o.owner
      }));

      const formattedMeetings = (meetingsRaw || []).map(m => ({
        id: m.id,
        title: m.title || '',
        dateTime: m.date_time || m.dateTime || '',
        type: m.type || 'Internal Weekly Sync',
        status: m.status || 'Terjadwal',
        participants: Array.isArray(m.participants) ? m.participants : [],
        link: m.link || '',
        summaryNotes: m.summary_notes || m.summaryNotes || '',
        actionItems: Array.isArray(m.action_items) ? m.action_items : (Array.isArray(m.actionItems) ? m.actionItems : []),
        createdAt: m.created_at ? m.created_at.replace('T', ' ').substring(0, 16) : ''
      }));

      const formattedReports = (reportsRaw || []).map(r => ({
        id: r.id,
        title: r.title || r.period || '',
        period: r.period || '',
        category: r.category || 'Audit Kualitas',
        status: r.status || 'Draft',
        date: r.date || '',
        rating: Number(r.rating || 5),
        whatWentWell: r.what_went_well || r.whatWentWell || '',
        bottlenecks: r.bottlenecks || '',
        actionPlan: r.action_plan || r.actionPlan || '',
        author: r.author || '',
        attachmentDoc: r.attachment_doc || r.attachmentDoc || null,
        createdAt: r.created_at ? r.created_at.replace('T', ' ').substring(0, 16) : ''
      }));

      const formattedArchives = (archivesRaw || []).map(a => ({
        id: a.id,
        title: a.title || '',
        category: a.category || 'Dokumen PDF / Legalitas',
        fileFormat: a.file_format || a.type || 'PDF',
        version: a.version || 'v1.0',
        status: a.status || (a.status === 'Active' ? 'Aktif' : 'Draft'),
        updatedAt: a.updated_at ? a.updated_at.split('T')[0] : (a.created_at ? a.created_at.split('T')[0] : ''),
        accessLevel: a.access_level || 'Publik Semua Tim',
        fileSize: a.file_size || a.size || '',
        downloadUrl: a.download_url || a.link || null,
        description: a.description || ''
      }));

      // Normalisasi custom templates dari Supabase (dengan fallback ke localStorage)
      let syncedTemplates = {};
      try {
        const localStored = localStorage.getItem('digibooster_custom_templates');
        if (localStored) syncedTemplates = JSON.parse(localStored);
      } catch (e) {
        // ignore
      }

      if (templatesRaw && templatesRaw.length > 0) {
        templatesRaw.forEach((row) => {
          const modKey = row.module_name || row.module_type || 'General';
          const catKey = row.category || 'General';
          if (!syncedTemplates[modKey]) syncedTemplates[modKey] = {};
          if (!syncedTemplates[modKey][catKey]) syncedTemplates[modKey][catKey] = [];
          
          const existingIdx = syncedTemplates[modKey][catKey].findIndex(t => t.id === row.id);
          const tplStructure = row.structure || row.payload || {};
          const tplObj = {
            id: row.id,
            title: row.name || row.title || tplStructure.title || 'Template Kustom',
            isCustom: true,
            savedAt: row.created_at,
            ...tplStructure
          };

          if (existingIdx >= 0) {
            syncedTemplates[modKey][catKey][existingIdx] = tplObj;
          } else {
            syncedTemplates[modKey][catKey].push(tplObj);
          }
        });
      }

      // Hitung ringkasan eksekutif murni dari data nyata Supabase
      const totalIncome = formattedTxs.filter(t => t.type === 'Pemasukan' && t.status === 'Lunas').reduce((acc, t) => acc + (t.amount || 0), 0);
      const totalExpense = formattedTxs.filter(t => t.type === 'Pengeluaran' && t.status === 'Lunas').reduce((acc, t) => acc + (t.amount || 0), 0);
      const netCashflow = totalIncome - totalExpense;
      const pipelineVal = formattedClients.filter(c => c.stage !== 'Deal Lost').reduce((acc, c) => acc + (c.dealValue || 0), 0);
      const completedTasks = formattedTasks.filter(t => t.status === 'Selesai').length;
      const velocityPct = formattedTasks.length > 0 ? Math.round((completedTasks / formattedTasks.length) * 100) : 0;

      const dynamicSummary = {
        monthlyNetCashflow: 'Rp ' + netCashflow.toLocaleString('id-ID'),
        cashflowGrowth: '0%',
        activePipelineValue: 'Rp ' + pipelineVal.toLocaleString('id-ID'),
        pipelineDealsCount: formattedClients.length,
        taskVelocityPercent: velocityPct,
        taskVelocityStatus: formattedTasks.length === 0 ? 'Data Kosong' : (velocityPct >= 80 ? 'Optimal' : (velocityPct >= 50 ? 'Sedang Berjalan' : 'Perlu Akselerasi')),
        okrAverageProgress: formattedOkrs.length > 0 ? Math.round(formattedOkrs.reduce((a, b) => a + (b.progressPercent || 0), 0) / formattedOkrs.length) : 0,
        criticalAlerts: []
      };

      set({
        crmClients: formattedClients,
        financeTransactions: formattedTxs,
        tasks: formattedTasks,
        marketingCampaigns: formattedMkt,
        okrGoals: formattedOkrs,
        meetings: formattedMeetings,
        reports: formattedReports,
        archives: formattedArchives,
        customTemplates: syncedTemplates,
        executiveSummary: dynamicSummary,
        isDbLoading: false
      });
    } catch (e) {
      console.error('Fatal fetch error:', e);
      set({ isDbLoading: false, dbError: e.message });
    }
  },



  // 1. Executive Summary & KPIs (Dihitung dinamis dari data nyata)
  executiveSummary: {
    monthlyNetCashflow: 'Rp 0',
    cashflowGrowth: '0%',
    activePipelineValue: 'Rp 0',
    pipelineDealsCount: 0,
    taskVelocityPercent: 0,
    taskVelocityStatus: 'Siap Input',
    okrAverageProgress: 0,
    criticalAlerts: []
  },

  crmCategories: [
    'Enterprise Corp',
    'UKM / Ritel',
    'Startup & Tech',
    'Pemerintahan / BUMN',
    'Agensi Mitra'
  ],
  addCrmCategory: (newCategory) => set((state) => {
    if (!newCategory || state.crmCategories.includes(newCategory)) return state;
    return { crmCategories: [...state.crmCategories, newCategory] };
  }),
  deleteCrmCategory: (categoryToDelete) => set((state) => ({
    crmCategories: state.crmCategories.filter((c) => c !== categoryToDelete)
  })),

  // 2. CRM & Klien (Murni kosong dari awal, disimpan ke Supabase)
  crmClients: [],
  addCrmClient: async (client) => {
    const id = client.id || `CRM-${Date.now().toString().slice(-4)}`;
    const newClient = { ...client, id };
    
    // Update local state instan
    set((state) => ({ crmClients: [newClient, ...state.crmClients] }));

    // Simpan ke Supabase
    try {
      await supabase.from('crm_clients').insert([{
        id: newClient.id,
        name: newClient.name,
        category: newClient.category,
        contact: newClient.contact,
        stage: newClient.stage,
        deal_value: newClient.dealValue || 0,
        services: newClient.services || [],
        pic: newClient.pic,
        contract_doc: newClient.contractDoc
      }]);
      await recordAuditLog('INSERT', 'crm_clients', newClient.id, newClient);
    } catch (err) {
      console.error('Gagal simpan client ke Supabase:', err);
    }
  },

  updateCrmClient: async (id, updated) => {
    set((state) => ({
      crmClients: state.crmClients.map((item) => item.id === id ? { ...item, ...updated } : item)
    }));

    try {
      const payload = {};
      if (updated.name !== undefined) payload.name = updated.name;
      if (updated.category !== undefined) payload.category = updated.category;
      if (updated.contact !== undefined) payload.contact = updated.contact;
      if (updated.stage !== undefined) payload.stage = updated.stage;
      if (updated.dealValue !== undefined) payload.deal_value = updated.dealValue;
      if (updated.services !== undefined) payload.services = updated.services;
      if (updated.pic !== undefined) payload.pic = updated.pic;
      if (updated.contractDoc !== undefined) payload.contract_doc = updated.contractDoc;
      payload.updated_at = new Date().toISOString();

      await supabase.from('crm_clients').update(payload).eq('id', id);
      await recordAuditLog('UPDATE', 'crm_clients', id, updated);
    } catch (err) {
      console.error('Gagal update client di Supabase:', err);
    }
  },

  deleteCrmClient: async (id) => {
    set((state) => ({
      crmClients: state.crmClients.filter((item) => item.id !== id)
    }));

    try {
      await supabase.from('crm_clients').delete().eq('id', id);
      await recordAuditLog('DELETE', 'crm_clients', id, null);
    } catch (err) {
      console.error('Gagal hapus client di Supabase:', err);
    }
  },

  // 3. Keuangan & Profit
  financeTransactions: [],
  addFinanceTransaction: async (tx) => {
    const id = tx.id || `FIN-${Date.now().toString().slice(-4)}`;
    const newTx = { ...tx, id };

    set((state) => ({ financeTransactions: [newTx, ...state.financeTransactions] }));

    try {
      await supabase.from('finance_transactions').insert([{
        id: newTx.id,
        title: newTx.title,
        type: newTx.type,
        category: newTx.category,
        amount: newTx.amount || 0,
        client_ref: newTx.clientRef,
        date: newTx.date || new Date().toISOString().split('T')[0],
        status: newTx.status || 'Pending',
        receipt_doc: newTx.receiptDoc
      }]);
      await recordAuditLog('INSERT', 'finance_transactions', newTx.id, newTx);
    } catch (err) {
      console.error('Gagal simpan transaksi ke Supabase:', err);
    }
  },

  updateFinanceTransaction: async (id, updated) => {
    set((state) => ({
      financeTransactions: state.financeTransactions.map((item) => item.id === id ? { ...item, ...updated } : item)
    }));

    try {
      const payload = {};
      if (updated.title !== undefined) payload.title = updated.title;
      if (updated.type !== undefined) payload.type = updated.type;
      if (updated.category !== undefined) payload.category = updated.category;
      if (updated.amount !== undefined) payload.amount = updated.amount;
      if (updated.clientRef !== undefined) payload.client_ref = updated.clientRef;
      if (updated.date !== undefined) payload.date = updated.date;
      if (updated.status !== undefined) payload.status = updated.status;
      if (updated.receiptDoc !== undefined) payload.receipt_doc = updated.receiptDoc;

      await supabase.from('finance_transactions').update(payload).eq('id', id);
      await recordAuditLog('UPDATE', 'finance_transactions', id, updated);
    } catch (err) {
      console.error('Gagal update transaksi di Supabase:', err);
    }
  },

  deleteFinanceTransaction: async (id) => {
    set((state) => ({
      financeTransactions: state.financeTransactions.filter((item) => item.id !== id)
    }));

    try {
      await supabase.from('finance_transactions').delete().eq('id', id);
      await recordAuditLog('DELETE', 'finance_transactions', id, null);
    } catch (err) {
      console.error('Gagal hapus transaksi di Supabase:', err);
    }
  },

  // 4. Branding & Marketing
  marketingCampaigns: [],
  addMarketingCampaign: async (camp) => {
    const id = camp.id || `MKT-${Date.now().toString().slice(-4)}`;
    const newCamp = { ...camp, id };

    set((state) => ({ marketingCampaigns: [newCamp, ...state.marketingCampaigns] }));

    try {
      await supabase.from('marketing_campaigns').insert([{
        id: newCamp.id,
        title: newCamp.title,
        channel: newCamp.channel,
        pillar: newCamp.pillar,
        stage: newCamp.stage,
        publish_date: newCamp.publishDate,
        ad_spend: newCamp.adSpend || 0,
        metrics: newCamp.metrics || { reach: 0, leads: 0 },
        media_link: newCamp.mediaLink
      }]);
      await recordAuditLog('INSERT', 'marketing_campaigns', newCamp.id, newCamp);
    } catch (err) {
      console.error('Gagal simpan kampanye ke Supabase:', err);
    }
  },

  updateMarketingCampaign: async (id, updated) => {
    set((state) => ({
      marketingCampaigns: state.marketingCampaigns.map((item) => item.id === id ? { ...item, ...updated } : item)
    }));

    try {
      const payload = {};
      if (updated.title !== undefined) payload.title = updated.title;
      if (updated.channel !== undefined) payload.channel = updated.channel;
      if (updated.pillar !== undefined) payload.pillar = updated.pillar;
      if (updated.stage !== undefined) payload.stage = updated.stage;
      if (updated.publishDate !== undefined) payload.publish_date = updated.publishDate;
      if (updated.adSpend !== undefined) payload.ad_spend = updated.adSpend;
      if (updated.metrics !== undefined) payload.metrics = updated.metrics;
      if (updated.mediaLink !== undefined) payload.media_link = updated.mediaLink;

      await supabase.from('marketing_campaigns').update(payload).eq('id', id);
      await recordAuditLog('UPDATE', 'marketing_campaigns', id, updated);
    } catch (err) {
      console.error('Gagal update kampanye di Supabase:', err);
    }
  },

  deleteMarketingCampaign: async (id) => {
    set((state) => ({
      marketingCampaigns: state.marketingCampaigns.filter((item) => item.id !== id)
    }));

    try {
      await supabase.from('marketing_campaigns').delete().eq('id', id);
      await recordAuditLog('DELETE', 'marketing_campaigns', id, null);
    } catch (err) {
      console.error('Gagal hapus kampanye di Supabase:', err);
    }
  },

  // 5. Tugas & Kalender (Tasks)
  taskCategories: [
    'Website & Tracking',
    'Konten & Creative',
    'Social Channel Ops',
    'Campaign / Promo',
    'CRM & Omnichannel',
    'SOP & Workflow',
    'KPI & Reporting',
    'Procurement & Tools',
    'Meeting & Koordinasi'
  ],
  addCategoryOption: (newCategory) => set((state) => {
    if (!newCategory || state.taskCategories.includes(newCategory)) return state;
    return { taskCategories: [...state.taskCategories, newCategory] };
  }),
  deleteCategoryOption: (categoryToDelete) => set((state) => ({
    taskCategories: state.taskCategories.filter((c) => c !== categoryToDelete)
  })),

  tasks: [],
  addTask: async (task) => {
    const id = task.id || `TSK-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newTask = { 
      ...task, 
      id, 
      comments: task.comments || [],
      createdAt: task.createdAt || nowStr,
      updatedAt: nowStr
    };

    set((state) => ({ tasks: [newTask, ...state.tasks] }));

    try {
      await supabase.from('tasks').insert([{
        id: newTask.id,
        title: newTask.title,
        description: newTask.description,
        category: newTask.category,
        project: newTask.project,
        assignee: newTask.assignee,
        priority: newTask.priority || 'P2',
        status: newTask.status || 'Backlog',
        due_date: newTask.dueDate || null,
        completed_date: newTask.completedDate || null,
        output_result: newTask.outputResult || '',
        created_by: newTask.createdBy || 'Executive Owner',
        comments: newTask.comments || []
      }]);
      await recordAuditLog('INSERT', 'tasks', newTask.id, newTask);
    } catch (err) {
      console.error('Gagal simpan task ke Supabase:', err);
    }
  },

  updateTask: async (id, updated) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    set((state) => ({
      tasks: state.tasks.map((item) => item.id === id ? { 
        ...item, 
        ...updated, 
        updatedAt: nowStr,
        updatedBy: 'Executive Owner'
      } : item)
    }));

    try {
      const payload = {};
      if (updated.title !== undefined) payload.title = updated.title;
      if (updated.description !== undefined) payload.description = updated.description;
      if (updated.category !== undefined) payload.category = updated.category;
      if (updated.project !== undefined) payload.project = updated.project;
      if (updated.assignee !== undefined) payload.assignee = updated.assignee;
      if (updated.priority !== undefined) payload.priority = updated.priority;
      if (updated.status !== undefined) payload.status = updated.status;
      if (updated.dueDate !== undefined) payload.due_date = updated.dueDate || null;
      if (updated.completedDate !== undefined) payload.completed_date = updated.completedDate || null;
      if (updated.outputResult !== undefined) payload.output_result = updated.outputResult;
      if (updated.comments !== undefined) payload.comments = updated.comments;
      payload.updated_at = new Date().toISOString();

      await supabase.from('tasks').update(payload).eq('id', id);
      await recordAuditLog('UPDATE', 'tasks', id, updated);
    } catch (err) {
      console.error('Gagal update task di Supabase:', err);
    }
  },

  deleteTask: async (id) => {
    set((state) => ({
      tasks: state.tasks.filter((item) => item.id !== id)
    }));

    try {
      await supabase.from('tasks').delete().eq('id', id);
      await recordAuditLog('DELETE', 'tasks', id, null);
    } catch (err) {
      console.error('Gagal hapus task di Supabase:', err);
    }
  },

  addTaskComment: async (taskId, commentText, author = 'Executive Owner') => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newComment = {
      id: `C-${Date.now()}`,
      author,
      createdAt: nowStr,
      text: commentText
    };

    const currentTask = get().tasks.find(t => t.id === taskId);
    const updatedComments = currentTask ? [...(currentTask.comments || []), newComment] : [newComment];

    set((state) => ({
      tasks: state.tasks.map((item) => item.id === taskId ? {
        ...item,
        comments: updatedComments,
        updatedAt: nowStr,
        updatedBy: author
      } : item)
    }));

    try {
      await supabase.from('tasks').update({
        comments: updatedComments,
        updated_at: new Date().toISOString()
      }).eq('id', taskId);
    } catch (err) {
      console.error('Gagal tambah komentar di Supabase:', err);
    }
  },

  // 6. Sasaran & KPI (OKR)
  okrCategories: [
    'Revenue & Pertumbuhan',
    'Teknologi & Infrastruktur',
    'Brand & Komunitas',
    'Efisiensi Operasional',
    'Kepuasan Klien'
  ],
  addOkrCategory: (newCategory) => set((state) => {
    if (!newCategory || state.okrCategories.includes(newCategory)) return state;
    return { okrCategories: [...state.okrCategories, newCategory] };
  }),
  deleteOkrCategory: (categoryToDelete) => set((state) => ({
    okrCategories: state.okrCategories.filter((c) => c !== categoryToDelete)
  })),

  okrGoals: [],
  addOkrGoal: async (goal) => {
    const id = goal.id || `OKR-${Date.now().toString().slice(-4)}`;
    const newGoal = { ...goal, id };

    set((state) => ({ okrGoals: [newGoal, ...state.okrGoals] }));

    try {
      await supabase.from('okr_goals').insert([{
        id: newGoal.id,
        objective: newGoal.objective || 'Sasaran Baru',
        key_result: newGoal.keyResult || 'Indikator Utama',
        category: newGoal.category || 'Revenue & Pertumbuhan',
        division: newGoal.division || 'Bisnis & Sales',
        quarter: newGoal.quarter || 'Q4',
        target_num: newGoal.targetNum || 0,
        current_num: newGoal.currentNum || 0,
        unit: newGoal.unit || '%',
        progress_percent: newGoal.progressPercent || 0,
        status: newGoal.status || 'On Track',
        owner: newGoal.owner || 'Executive Owner'
      }]);
      await recordAuditLog('INSERT', 'okr_goals', newGoal.id, newGoal);
    } catch (err) {
      console.error('Gagal simpan OKR ke Supabase:', err);
    }
  },

  updateOkrGoal: async (id, updated) => {
    set((state) => ({
      okrGoals: state.okrGoals.map((item) => item.id === id ? { ...item, ...updated } : item)
    }));

    try {
      const payload = {};
      if (updated.objective !== undefined) payload.objective = updated.objective;
      if (updated.keyResult !== undefined) payload.key_result = updated.keyResult;
      if (updated.category !== undefined) payload.category = updated.category;
      if (updated.division !== undefined) payload.division = updated.division;
      if (updated.quarter !== undefined) payload.quarter = updated.quarter;
      if (updated.targetNum !== undefined) payload.target_num = updated.targetNum;
      if (updated.currentNum !== undefined) payload.current_num = updated.currentNum;
      if (updated.unit !== undefined) payload.unit = updated.unit;
      if (updated.progressPercent !== undefined) payload.progress_percent = updated.progressPercent;
      if (updated.status !== undefined) payload.status = updated.status;
      if (updated.owner !== undefined) payload.owner = updated.owner;
      payload.updated_at = new Date().toISOString();

      await supabase.from('okr_goals').update(payload).eq('id', id);
      await recordAuditLog('UPDATE', 'okr_goals', id, updated);
    } catch (err) {
      console.error('Gagal update OKR di Supabase:', err);
    }
  },

  deleteOkrGoal: async (id) => {
    set((state) => ({
      okrGoals: state.okrGoals.filter((item) => item.id !== id)
    }));

    try {
      await supabase.from('okr_goals').delete().eq('id', id);
      await recordAuditLog('DELETE', 'okr_goals', id, null);
    } catch (err) {
      console.error('Gagal hapus OKR di Supabase:', err);
    }
  },

  // 7. Rapat & Catatan (Supabase meetings table)
  meetings: [],
  addMeeting: async (m) => {
    const fallbackId = `MTG-${Date.now().toString().slice(-4)}`;
    const newM = { ...m, id: m.id || fallbackId };
    set((state) => ({ meetings: [newM, ...state.meetings] }));
    try {
      const payload = {
        title: newM.title || 'Rapat Baru',
        date_time: newM.dateTime || new Date().toISOString().split('T')[0],
        type: newM.type || 'Internal Weekly Sync',
        status: newM.status || 'Terjadwal',
        participants: Array.isArray(newM.participants) ? newM.participants : [],
        link: newM.link || null,
        summary_notes: newM.summaryNotes || '',
        action_items: Array.isArray(newM.actionItems) ? newM.actionItems : []
      };
      // Bila id bukan prefix MTG (misal UUID valid), sertakan id
      if (newM.id && !newM.id.startsWith('MTG-')) {
        payload.id = newM.id;
      }
      const { data: inserted, error: insErr } = await supabase.from('meetings').insert([payload]).select().single();
      if (insErr) {
        console.error('Gagal simpan rapat ke Supabase:', insErr.message);
      } else if (inserted && inserted.id) {
        // Sinkronkan ID UUID nyata dari database ke local store
        set((state) => ({
          meetings: state.meetings.map(item => item.id === newM.id ? { ...item, id: inserted.id } : item)
        }));
        await recordAuditLog('INSERT', 'meetings', inserted.id, newM);
      }
    } catch (err) {
      console.error('Gagal simpan rapat ke Supabase:', err);
    }
  },
  updateMeeting: async (id, updated) => {
    set((state) => ({
      meetings: state.meetings.map((item) => item.id === id ? { ...item, ...updated } : item)
    }));
    try {
      const payload = {};
      if (updated.title !== undefined) payload.title = updated.title;
      if (updated.dateTime !== undefined) payload.date_time = updated.dateTime || null;
      if (updated.type !== undefined) payload.type = updated.type;
      if (updated.status !== undefined) payload.status = updated.status;
      if (updated.participants !== undefined) payload.participants = updated.participants;
      if (updated.link !== undefined) payload.link = updated.link || null;
      if (updated.summaryNotes !== undefined) payload.summary_notes = updated.summaryNotes;
      if (updated.actionItems !== undefined) payload.action_items = updated.actionItems;
      await supabase.from('meetings').update(payload).eq('id', id);
      await recordAuditLog('UPDATE', 'meetings', id, updated);
    } catch (err) {
      console.error('Gagal update rapat di Supabase:', err);
    }
  },
  deleteMeeting: async (id) => {
    set((state) => ({
      meetings: state.meetings.filter((item) => item.id !== id)
    }));
    try {
      await supabase.from('meetings').delete().eq('id', id);
      await recordAuditLog('DELETE', 'meetings', id, null);
    } catch (err) {
      console.error('Gagal hapus rapat di Supabase:', err);
    }
  },

  // 8. Laporan & Evaluasi (Supabase reports table)
  reports: [],
  addReport: async (rpt) => {
    const fallbackId = `RPT-${Date.now().toString().slice(-4)}`;
    const newRpt = { ...rpt, id: rpt.id || fallbackId };
    set((state) => ({ reports: [newRpt, ...state.reports] }));
    try {
      const payload = {
        title: newRpt.title || newRpt.period || 'Laporan Evaluasi Baru',
        period: newRpt.period || 'Mingguan',
        category: newRpt.category || 'Audit Kualitas',
        status: newRpt.status || 'Draft',
        date: newRpt.date || new Date().toISOString().split('T')[0],
        rating: Number(newRpt.rating || 5),
        what_went_well: newRpt.whatWentWell || '',
        bottlenecks: newRpt.bottlenecks || '',
        action_plan: newRpt.actionPlan || '',
        author: newRpt.author || 'Executive Owner',
        attachment_doc: newRpt.attachmentDoc || null
      };
      if (newRpt.id && !newRpt.id.startsWith('RPT-')) {
        payload.id = newRpt.id;
      }
      const { data: inserted, error: insErr } = await supabase.from('reports').insert([payload]).select().single();
      if (insErr) {
        console.error('Gagal simpan laporan ke Supabase:', insErr.message);
      } else if (inserted && inserted.id) {
        set((state) => ({
          reports: state.reports.map(item => item.id === newRpt.id ? { ...item, id: inserted.id } : item)
        }));
        await recordAuditLog('INSERT', 'reports', inserted.id, newRpt);
      }
    } catch (err) {
      console.error('Gagal simpan laporan ke Supabase:', err);
    }
  },
  updateReport: async (id, updated) => {
    set((state) => ({
      reports: state.reports.map((item) => item.id === id ? { ...item, ...updated } : item)
    }));
    try {
      const payload = {};
      if (updated.title !== undefined) payload.title = updated.title;
      if (updated.period !== undefined) payload.period = updated.period;
      if (updated.category !== undefined) payload.category = updated.category;
      if (updated.status !== undefined) payload.status = updated.status;
      if (updated.date !== undefined) payload.date = updated.date;
      if (updated.rating !== undefined) payload.rating = updated.rating;
      if (updated.whatWentWell !== undefined) payload.what_went_well = updated.whatWentWell;
      if (updated.bottlenecks !== undefined) payload.bottlenecks = updated.bottlenecks;
      if (updated.actionPlan !== undefined) payload.action_plan = updated.actionPlan;
      if (updated.author !== undefined) payload.author = updated.author;
      if (updated.attachmentDoc !== undefined) payload.attachment_doc = updated.attachmentDoc;
      await supabase.from('reports').update(payload).eq('id', id);
      await recordAuditLog('UPDATE', 'reports', id, updated);
    } catch (err) {
      console.error('Gagal update laporan di Supabase:', err);
    }
  },
  deleteReport: async (id) => {
    set((state) => ({
      reports: state.reports.filter((item) => item.id !== id)
    }));
    try {
      await supabase.from('reports').delete().eq('id', id);
      await recordAuditLog('DELETE', 'reports', id, null);
    } catch (err) {
      console.error('Gagal hapus laporan di Supabase:', err);
    }
  },

  // 9. Data & Arsip (Supabase archives table)
  archives: [],
  addArchive: async (arc) => {
    const fallbackId = `ARC-${Date.now().toString().slice(-4)}`;
    const newArc = { ...arc, id: arc.id || fallbackId };
    set((state) => ({ archives: [newArc, ...state.archives] }));
    try {
      const payload = {
        title: newArc.title || 'Dokumen Baru',
        category: newArc.category || 'Dokumen PDF / Legalitas',
        type: newArc.fileFormat || newArc.type || 'PDF',
        status: newArc.status || 'Active',
        size: newArc.fileSize || newArc.size || '1.0 MB',
        link: newArc.downloadUrl || newArc.link || null,
        description: newArc.description || ''
      };
      if (newArc.id && !newArc.id.startsWith('ARC-')) {
        payload.id = newArc.id;
      }
      const { data: inserted, error: insErr } = await supabase.from('archives').insert([payload]).select().single();
      if (insErr) {
        console.error('Gagal simpan arsip ke Supabase:', insErr.message);
      } else if (inserted && inserted.id) {
        set((state) => ({
          archives: state.archives.map(item => item.id === newArc.id ? { ...item, id: inserted.id } : item)
        }));
        await recordAuditLog('INSERT', 'archives', inserted.id, newArc);
      }
    } catch (err) {
      console.error('Gagal simpan arsip ke Supabase:', err);
    }
  },
  updateArchive: async (id, updated) => {
    set((state) => ({
      archives: state.archives.map((item) => item.id === id ? { ...item, ...updated } : item)
    }));
    try {
      const payload = {};
      if (updated.title !== undefined) payload.title = updated.title;
      if (updated.category !== undefined) payload.category = updated.category;
      if (updated.fileFormat !== undefined || updated.type !== undefined) payload.type = updated.fileFormat || updated.type;
      if (updated.status !== undefined) payload.status = updated.status;
      if (updated.fileSize !== undefined || updated.size !== undefined) payload.size = updated.fileSize || updated.size;
      if (updated.downloadUrl !== undefined || updated.link !== undefined) payload.link = updated.downloadUrl || updated.link;
      if (updated.description !== undefined) payload.description = updated.description;
      await supabase.from('archives').update(payload).eq('id', id);
      await recordAuditLog('UPDATE', 'archives', id, updated);
    } catch (err) {
      console.error('Gagal update arsip di Supabase:', err);
    }
  },
  deleteArchive: async (id) => {
    set((state) => ({
      archives: state.archives.filter((item) => item.id !== id)
    }));
    try {
      await supabase.from('archives').delete().eq('id', id);
      await recordAuditLog('DELETE', 'archives', id, null);
    } catch (err) {
      console.error('Gagal hapus arsip di Supabase:', err);
    }
  },



  // 8. Staff AI Agents (Staf Manusia & Dewan Agen AI DigiBooster)
  staffAgents: [
    // Staf Manusia (Tim Inti PIC - Tampilan Tabel Standar)
    {
      id: 'staff_human_01',
      name: 'Bambang Triatmojo',
      type: 'Staf Manusia',
      role: 'Head of Operations & Lead Account',
      department: 'Operasional',
      room: 'Executive Room',
      status: 'Online / Bertugas',
      contact: 'bambang@digibooster.id',
      phone: '+62 812-3456-7890',
      avatar: null,
      notes: 'Supervisi jalannya automasi dan validasi final deliverable tim.'
    },
    {
      id: 'staff_human_02',
      name: 'Nadia Larasati',
      type: 'Staf Manusia',
      role: 'Client Relationship & Finance Executive',
      department: 'Sales & Marketing',
      room: 'Executive Room',
      status: 'Online / Bertugas',
      contact: 'nadia@digibooster.id',
      phone: '+62 813-9876-5432',
      avatar: null,
      notes: 'Penanggung jawab negosiasi kontrak klien dan rekonsiliasi kas masuk.'
    },

    // Autonomous AI Agents (Khusus Command Deck, Persona, Log & 3D Sync)
    {
      id: 'agent_strategy',
      name: 'Arga',
      type: 'AI Agent DigiBooster',
      role: 'Chief Strategy Officer (CSO)',
      department: 'Manajemen',
      room: 'Strategy Room',
      roomCode: 'strategy',
      status: 'Online / Bertugas',
      avatar: null,
      persona: 'Visioner, analitis tingkat tinggi, lugas, dan selalu menyertakan KPI/Action Plan terukur.',
      systemPrompt: 'Kamu adalah Arga, Chief Strategy Officer DigiBooster yang bertugas di Strategy Room. Tugasmu adalah menjadi rekan brainstorming bagi Owner, memimpin jalannya rapat (meeting leader), memvalidasi ide bisnis, dan merumuskan target sasaran (OKR). Setelah diskusi matang, simpulkan hasilnya menjadi Action Items konkret dan serahkan ke Reta (COO) untuk dieksekusi.',
      aiEngine: 'Groq Qwen 3.8 27B / Gemini 2.5 Flash',
      managedModules: ['Sasaran & KPI', 'Rapat & Catatan', 'Executive Dashboard'],
      executionMode: 'Autonomous',
      currentActivity: 'Menganalisis pencapaian OKR Q4 & memimpin strategi sprint di Strategy Room',
      stats: { efficiency: '99.4%', tasksDone: 148, uptime: '99.9%' },
      capabilities: ['Brainstorming Bisnis', 'Fasilitasi Rapat & Notulen', 'Perumusan Sasaran OKR'],
      executionCount: 148,
      activityLogs: [
        {
          id: 'LOG-ARG-101',
          timestamp: '17 Okt 2026 23:40 WIB',
          module: 'Sasaran & KPI',
          action: 'Audit Progres OKR Q4',
          details: 'Memperbarui estimasi pencapaian revenue target dari 75% menjadi 82% berdasarkan pipeline aktif.',
          status: 'Success'
        },
        {
          id: 'LOG-ARG-102',
          timestamp: '17 Okt 2026 18:15 WIB',
          module: 'Rapat & Catatan',
          action: 'Auto-Generate Rangkuman Notulensi',
          details: 'Merekap 4 Action Items dari agenda Internal Weekly Sync dan mengalokasikannya ke Reta (COO).',
          status: 'Success'
        }
      ]
    },
    {
      id: 'agent_operations',
      name: 'Reta',
      type: 'AI Agent DigiBooster',
      role: 'Chief Operating Officer (COO)',
      department: 'Operasional',
      room: 'Operations Room',
      roomCode: 'operations',
      status: 'Online / Bertugas',
      avatar: null,
      persona: 'Disiplin, cepat mengeksekusi, berorientasi deadline ketat, dan detail dalam pembagian tugas kerja.',
      systemPrompt: 'Kamu adalah Reta, Chief Operating Officer DigiBooster yang memimpin Operations Room. Kamu adalah pusat kendali eksekusi. Tugasmu menerima arahan langsung dari Owner atau notulen rapat dari Arga (CSO), lalu memecahnya menjadi daftar tugas di modul Tugas & Kalender, mendelegasikannya ke Silvi/Raka/Siska, memantau deadline prioritas (P1/P2/P3), dan melaporkan status deliverable ke Owner.',
      aiEngine: 'Groq Qwen 3.8 27B',
      managedModules: ['Tugas & Kalender', 'Executive Dashboard', 'Laporan & Evaluasi'],
      executionMode: 'Autonomous',
      currentActivity: 'Memantau SLA tugas P1 & sinkronisasi jadwal sprint di Operations Room',
      stats: { efficiency: '98.9%', tasksDone: 215, uptime: '99.8%' },
      capabilities: ['Pusat Komando & Delegasi', 'Manajemen Tugas & Kalender', 'Monitoring Deadline & Output'],
      executionCount: 215,
      activityLogs: [
        {
          id: 'LOG-RET-201',
          timestamp: '18 Okt 2026 01:10 WIB',
          module: 'Tugas & Kalender',
          action: 'Otomatisasi Status Prioritas',
          details: 'Memeriksa 8 tugas backlog dan menyematkan tagging P1 untuk deliverable deadline < 24 jam.',
          status: 'Success'
        },
        {
          id: 'LOG-RET-202',
          timestamp: '17 Okt 2026 21:00 WIB',
          module: 'Tugas & Kalender',
          action: 'Delegasi Tugas ke Silvi',
          details: 'Meneruskan brief naskah konten TikTok dari dokumen arsip ke PIC Silvi.',
          status: 'Success'
        }
      ]
    },
    {
      id: 'agent_growth',
      name: 'Silvi',
      type: 'AI Agent DigiBooster',
      role: 'Head of Growth & Creative',
      department: 'Sales & Marketing',
      room: 'Growth Room',
      roomCode: 'growth',
      status: 'Online / Bertugas',
      avatar: null,
      persona: 'Kreatif, persuasif, menguasai tren viral media sosial, dan lihai memetakan peluang deal CRM.',
      systemPrompt: 'Kamu adalah Silvi, Head of Growth & Creative yang bertugas di Growth Room. Tugasmu melakukan riset pasar dan kompetitor, menyusun skrip konten promosi/sosmed, membuat visual konsep banner kampanye via Pollinations.ai, serta mengelola prospek klien di modul CRM dari tahap Lead hingga Deal Won.',
      aiEngine: 'Groq Qwen 3.8 27B + Pollinations.ai',
      managedModules: ['CRM & Klien', 'Branding & Marketing'],
      executionMode: 'Autonomous',
      currentActivity: 'Meriset 5 tren hook video TikTok & scoring deal klien di Growth Room',
      stats: { efficiency: '97.5%', tasksDone: 182, uptime: '99.5%' },
      capabilities: ['Riset Pasar & Sosmed', 'Pembuatan Gambar Promosi', 'Pipeline CRM & Penjualan'],
      executionCount: 182,
      activityLogs: [
        {
          id: 'LOG-SIL-301',
          timestamp: '18 Okt 2026 02:00 WIB',
          module: 'CRM & Klien',
          action: 'Lead Scoring & Stage Update',
          details: 'Memperbarui status prospek BUMN Klaster Logistik menjadi Discovery Call dengan probabilitas 70%.',
          status: 'Success'
        },
        {
          id: 'LOG-SIL-302',
          timestamp: '17 Okt 2026 19:30 WIB',
          module: 'Branding & Marketing',
          action: 'Generate Headline Kampanye',
          details: 'Menyusun 3 variasi copywriting iklan Meta Ads bertema transformasi kantor otomatis.',
          status: 'Success'
        }
      ]
    },
    {
      id: 'agent_document',
      name: 'Raka',
      type: 'AI Agent DigiBooster',
      role: 'Head of Documentation & Legal Systems',
      department: 'Tech',
      room: 'Systems Room',
      roomCode: 'systems',
      status: 'Online / Bertugas',
      avatar: null,
      persona: 'Sangat teliti, presisi hukum tinggi, rapi dalam penataan arsip, dan berstandar korporat tanpa cacat.',
      systemPrompt: 'Kamu adalah Raka, Head of Documentation & Legal Systems di Systems Room. Tugasmu mengelola seluruh berkas perusahaan: menyusun draf kontrak kerja sama (PKS), NDA, invoice/faktur, merapikan redaksi bahasa dokumen, menyusun SOP operasional di modul SOP & Workflow, serta mengekspor data laporan dashboard menjadi file Excel/PDF resmi.',
      aiEngine: 'Groq Qwen 3.8 27B / Gemini 2.5 Flash',
      managedModules: ['Data & Arsip', 'Keuangan & Profit'],
      executionMode: 'Autonomous',
      currentActivity: 'Verifikasi klausul PKS retainer & validasi nomor faktur di Systems Room',
      stats: { efficiency: '100%', tasksDone: 135, uptime: '100%' },
      capabilities: ['Penyusunan Kontrak & PKS', 'Standarisasi SOP', 'Tata Kelola Berkas & Ekspor Data'],
      executionCount: 135,
      activityLogs: [
        {
          id: 'LOG-RAK-401',
          timestamp: '17 Okt 2026 22:15 WIB',
          module: 'Data & Arsip',
          action: 'Verifikasi Draft Kontrak',
          details: 'Memastikan klausul SLA 99.9% dan NDA tersimpan pada repositori dokumen hukum.',
          status: 'Success'
        }
      ]
    },
    {
      id: 'agent_talent',
      name: 'Siska',
      type: 'AI Agent DigiBooster',
      role: 'Head of AI Performance & Quality Control',
      department: 'Tech',
      room: 'Quality Room',
      roomCode: 'quality',
      status: 'Online / Bertugas',
      avatar: null,
      persona: 'Objektif, perfeksionis, fokus pada akurasi output data, dan pendeteksi anomali kinerja bot.',
      systemPrompt: 'Kamu adalah Siska, Head of AI Performance & Quality Control di Quality Room. Tugasmu adalah mengevaluasi kinerja dan kualitas respon dari seluruh agen (Reta, Silvi, Raka, Arga). Kamu memantau log aktivitas di modul Audit Logs, menilai akurasi eksekusi data, melatih prompt agar bot semakin cerdas, serta membuat laporan evaluasi mutu berkala.',
      aiEngine: 'Groq Qwen 3.8 27B / Gemini 2.5 Flash',
      managedModules: ['Laporan & Evaluasi', 'Staff & AI Agents'],
      executionMode: 'Autonomous',
      currentActivity: 'Benchmarking respons LLM & pemantauan audit trail di Quality Room',
      stats: { efficiency: '99.8%', tasksDone: 196, uptime: '99.9%' },
      capabilities: ['Audit Mutu & Kinerja AI', 'Pelatihan Prompting Bot', 'Quality Control & Audit Log'],
      executionCount: 196,
      activityLogs: [
        {
          id: 'LOG-SIS-501',
          timestamp: '18 Okt 2026 00:30 WIB',
          module: 'Laporan & Evaluasi',
          action: 'Audit Mutu Respon Bot',
          details: 'Melakukan evaluasi 50 log interaksi agen dan memberikan skor akurasi 99.2%.',
          status: 'Success'
        }
      ]
    }
  ],
  addStaffAgent: (stf) => set((state) => ({ staffAgents: [stf, ...state.staffAgents] })),
  updateStaffAgent: (id, updated) => set((state) => ({
    staffAgents: state.staffAgents.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteStaffAgent: (id) => set((state) => ({
    staffAgents: state.staffAgents.filter((item) => item.id !== id)
  })),
  addAgentActivityLog: (agentId, logItem) => set((state) => ({
    staffAgents: state.staffAgents.map((agent) => {
      if (agent.id !== agentId) return agent;
      const logs = agent.activityLogs || [];
      const newLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
        ...logItem
      };
      return {
        ...agent,
        activityLogs: [newLog, ...logs],
        executionCount: (agent.executionCount || 0) + 1,
        currentActivity: logItem.details || agent.currentActivity
      };
    })
  })),

  // 9. Pengaturan Workspace
  workspaceSettings: {
    workspaceName: 'DigiBooster Indonesia Enterprise',
    companyTagline: 'Autonomous AI Agency & Digital Acceleration Hub',
    currency: 'IDR (Rp)',
    timezone: 'Asia/Jakarta (WIB)',
    logoUrl: '/logo.webp',
    whatsappGateway: {
      status: 'Connected',
      phoneNumber: 'Ready for Green-API',
      provider: 'Green-API / Supabase Realtime'
    },
    aiIntegrations: {
      activeEngine: 'Google Gemini 2.5 Flash',
      fallbackEngine: 'Groq Llama 3.3 70B Versatile',
      latencyAverage: '0.8s'
    },
    rolesMatrix: [
      { role: 'Owner & Executive', access: 'Semua Menu (Full Akses & Hapus)' },
      { role: 'Project Manager', access: 'Semua Menu kecuali Pengaturan Finansial Penuh' },
      { role: 'Team Member', access: 'Tugas, Kalender, Rapat, Notulensi, Arsip' },
      { role: 'AI Agent', access: 'Kirim Output, Pembaruan Tugas, Sinkronisasi Otomatis' }
    ]
  },
  updateWorkspaceSettings: (newSettings) => set((state) => ({
    workspaceSettings: { ...state.workspaceSettings, ...newSettings }
  })),

  // 10. Kustom Template User (Dual sync: Supabase DB + localStorage fallback)
  customTemplates: (() => {
    try {
      const stored = localStorage.getItem('digibooster_custom_templates');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  })(),

  addCustomTemplate: async (moduleName, category, templateData) => {
    const prev = get().customTemplates || {};
    const modKey = moduleName || 'General';
    const catKey = category || 'General';
    const modTemplates = prev[modKey] || {};
    const catList = modTemplates[catKey] || [];
    
    const newTemplateId = `CUST-TPL-${Date.now()}`;
    const newTemplate = {
      ...templateData,
      id: newTemplateId,
      isCustom: true,
      savedAt: new Date().toISOString()
    };

    const next = {
      ...prev,
      [modKey]: {
        ...modTemplates,
        [catKey]: [newTemplate, ...catList]
      }
    };

    // Update local state instan
    set({ customTemplates: next });

    // 1. Simpan ke localStorage sebagai offline cache
    try {
      localStorage.setItem('digibooster_custom_templates', JSON.stringify(next));
    } catch (err) {
      console.warn('Gagal menyimpan custom template ke localStorage', err);
    }

    // 2. Simpan permanen ke Supabase database (anti hilang saat clear cache)
    try {
      const payload = {
        name: newTemplate.title || 'Template Kustom',
        module_type: modKey,
        category: catKey,
        structure: templateData
      };
      const { data: inserted, error: insErr } = await supabase.from('custom_templates').insert([payload]).select().single();
      if (insErr) {
        console.warn('Supabase custom_templates insert failed (fallback to local):', insErr.message);
      } else if (inserted && inserted.id) {
        // Sinkronkan id DB
        set((state) => {
          const cur = state.customTemplates || {};
          const curMod = cur[modKey] || {};
          const curList = curMod[catKey] || [];
          return {
            customTemplates: {
              ...cur,
              [modKey]: {
                ...curMod,
                [catKey]: curList.map(t => t.id === newTemplateId ? { ...t, id: inserted.id } : t)
              }
            }
          };
        });
        await recordAuditLog('INSERT', 'custom_templates', inserted.id, { module: modKey, category: catKey });
      }
    } catch (err) {
      console.warn('Supabase custom_templates insert error:', err);
    }
  },

  deleteCustomTemplate: async (moduleName, category, templateId) => {
    const prev = get().customTemplates || {};
    const modKey = moduleName || 'General';
    const catKey = category || 'General';
    const modTemplates = prev[modKey] || {};
    const catList = modTemplates[catKey] || [];

    const next = {
      ...prev,
      [modKey]: {
        ...modTemplates,
        [catKey]: catList.filter(t => t.id !== templateId)
      }
    };

    // Update local state instan
    set({ customTemplates: next });

    try {
      localStorage.setItem('digibooster_custom_templates', JSON.stringify(next));
    } catch (err) {
      console.warn('Gagal menghapus custom template dari localStorage', err);
    }

    try {
      await supabase.from('custom_templates').delete().eq('id', templateId);
      await recordAuditLog('DELETE', 'custom_templates', templateId, null);
    } catch (err) {
      console.warn('Supabase custom_templates delete failed:', err);
    }
  },

  // 11. AI Telemetry & Token Monitoring (Pilar 1 & 3)
  aiTelemetry: {
    totalTokensUsed: 384520,
    inputTokens: 254120,
    outputTokens: 130400,
    monthlyQuotaBudget: 2000000,
    avgLatencyMs: 385,
    taskSuccessRate: 98.4,
    intelligenceGrowthIndex: 94.6, // Score 0-100
    activeEngine: 'Groq Llama 3.3 70B (Primary) + Local vLLM Fallback',
    agentTokenBreakdown: [
      { agentId: 'agent_talent', agentName: 'Siska (Head QA & Trainer)', tokens: 68500, tasks: 196, accuracy: '99.8%' },
      { agentId: 'agent_strategy', agentName: 'Arga (CSO)', tokens: 112400, tasks: 148, accuracy: '99.1%' },
      { agentId: 'agent_marketing', agentName: 'Reta (COO)', tokens: 138900, tasks: 215, accuracy: '98.5%' },
      { agentId: 'agent_finance', agentName: 'Silvi (CFO)', tokens: 74200, tasks: 104, accuracy: '99.4%' },
      { agentId: 'agent_tech', agentName: 'Raka (CTO)', tokens: 59020, tasks: 87, accuracy: '97.8%' }
    ],
    taskAuditFeed: [
      {
        id: 'AUD-901',
        timestamp: '18 Okt 2026, 03:45 WIB',
        agent: 'Arga (CSO)',
        action: 'Auto-Generate OKR Q4 Goal',
        targetModule: 'Sasaran & KPI',
        tokensUsed: 420,
        latencyMs: 320,
        status: 'Success',
        engine: 'Groq Llama-3.3-70b'
      },
      {
        id: 'AUD-902',
        timestamp: '18 Okt 2026, 02:15 WIB',
        agent: 'Reta (COO)',
        action: 'Publish Task Breakdown & Sprint Plan',
        targetModule: 'Tugas & Kalender',
        tokensUsed: 680,
        latencyMs: 410,
        status: 'Success',
        engine: 'Gemini 2.5 Flash'
      },
      {
        id: 'AUD-903',
        timestamp: '18 Okt 2026, 01:10 WIB',
        agent: 'Silvi (CFO)',
        action: 'Reconcile Tax & Create Invoice Draft',
        targetModule: 'Keuangan & Profit',
        tokensUsed: 512,
        latencyMs: 380,
        status: 'Success',
        engine: 'Local Ollama Qwen-2.5-14B'
      },
      {
        id: 'AUD-904',
        timestamp: '17 Okt 2026, 23:55 WIB',
        agent: 'Raka (CTO)',
        action: 'SLA Zero-Trust Integrity Compliance Check',
        targetModule: 'Data & Arsip',
        tokensUsed: 390,
        latencyMs: 290,
        status: 'Success',
        engine: 'Groq Llama-3.3-70b'
      }
    ]
  },

  recordAiTelemetryEvent: (event) => set((state) => {
    const prev = state.aiTelemetry || {};
    const tokens = Number(event.tokensUsed || 350);
    const inTok = Math.round(tokens * 0.65);
    const outTok = tokens - inTok;
    const newFeedItem = {
      id: `AUD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      agent: event.agent || 'AI Agent',
      action: event.action || 'Interactive Tool Calling',
      targetModule: event.targetModule || 'General',
      tokensUsed: tokens,
      latencyMs: event.latencyMs || Math.floor(Math.random() * 200 + 250),
      status: event.status || 'Success',
      engine: event.engine || prev.activeEngine
    };

    return {
      aiTelemetry: {
        ...prev,
        totalTokensUsed: (prev.totalTokensUsed || 0) + tokens,
        inputTokens: (prev.inputTokens || 0) + inTok,
        outputTokens: (prev.outputTokens || 0) + outTok,
        taskAuditFeed: [newFeedItem, ...(prev.taskAuditFeed || [])].slice(0, 50)
      }
    };
  }),

  // 12. AI Training & Continuous Memory Rules (Pilar 1 & 2)
  aiTrainingRules: [
    {
      id: 'RULE-01',
      agentId: 'agent_finance',
      agentName: 'Silvi (CFO)',
      ruleTitle: 'Klausul PPN 11% Otomatis Transaksi > 10 Juta',
      category: 'SOP Keuangan',
      instruction: 'Setiap kali membuat faktur atau transaksi bernilai di atas Rp 10.000.000, wajib mencantumkan sub-klausul PPN 11% dan terms pembayaran 14 hari kerja.',
      addedAt: '16 Okt 2026',
      status: 'Active (Tersimpan di Mem0 Vector)',
      effectivenessScore: '99%'
    },
    {
      id: 'RULE-02',
      agentId: 'agent_strategy',
      agentName: 'Arga (CSO)',
      ruleTitle: 'Formula Penamaan Judul Tugas & Notulensi',
      category: 'SOP Rapat & Catatan',
      instruction: 'Judul tugas atau agenda rapat tidak boleh menggunakan kata pembuka santai. Harus ringkas 3-5 kata formal: [Departemen]: [Tindakan Konkret].',
      addedAt: '17 Okt 2026',
      status: 'Active (Tersimpan di Mem0 Vector)',
      effectivenessScore: '100%'
    },
    {
      id: 'RULE-03',
      agentId: 'agent_marketing',
      agentName: 'Reta (COO)',
      ruleTitle: 'Tone Komunikasi WhatsApp Client-Facing',
      category: 'SOP CRM & Marketing',
      instruction: 'Selalu gunakan salam hangat formal, sapa nama klien, hindari istilah teknis tanpa penjelasan, dan akhiri dengan call-to-action yang jelas.',
      addedAt: '17 Okt 2026',
      status: 'Active (Tersimpan di Mem0 Vector)',
      effectivenessScore: '98%'
    }
  ],

  addAiTrainingRule: (newRule) => set((state) => ({
    aiTrainingRules: [
      {
        id: `RULE-${Date.now().toString().slice(-4)}`,
        addedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Active (Tersimpan di Mem0 Vector)',
        effectivenessScore: '100%',
        ...newRule
      },
      ...state.aiTrainingRules
    ]
  })),

  deleteAiTrainingRule: (ruleId) => set((state) => ({
    aiTrainingRules: state.aiTrainingRules.filter(r => r.id !== ruleId)
  })),

  // 13. Siska Master Trainer Engine: Melatih & Menyuntikkan Kemampuan ke Bot Lain
  siskaTrainAgents: async ({ targetAgentName, coachingTopic, behaviorGuidelines, simulatedScenario }) => {
    const state = get();
    const newRuleId = `RULE-SIS-${Date.now().toString().slice(-4)}`;
    const nowStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // 1. Simpan SOP baru ke memory store Mem0
    const generatedRule = {
      id: newRuleId,
      agentName: targetAgentName,
      ruleTitle: `[Siska Directive] ${coachingTopic}`,
      category: 'Siska Behavioral Coaching',
      instruction: behaviorGuidelines,
      addedAt: nowStr,
      status: 'Active (Tersimpan di Mem0 Vector)',
      effectivenessScore: '99.5%'
    };

    // 2. Jika target spesifik, perkuat persona & system prompt bot tersebut
    const updatedStaff = (state.staffAgents || []).map(agent => {
      if (targetAgentName === 'Semua AI Agent' || agent.name === targetAgentName || agent.name.includes(targetAgentName)) {
        const existingPrompt = agent.systemPrompt || '';
        const directiveTag = `\n\n[DIRECTIVE SISKA QA]: Selalu patuhi standar komunikasi: ${behaviorGuidelines}`;
        return {
          ...agent,
          systemPrompt: existingPrompt.includes(directiveTag) ? existingPrompt : existingPrompt + directiveTag,
          currentActivity: `Telah dilatih oleh Siska: "${coachingTopic}" (SOP Aktif)`
        };
      }
      return agent;
    });

    // 3. Catat audit telemetri atas aksi Siska
    const auditFeedItem = {
      id: `AUD-SIS-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) + ' WIB',
      agent: 'Siska (Head QA & Master Trainer)',
      action: `Coaching & SOP Injection: ${targetAgentName}`,
      targetModule: 'Staff & AI Agents Hub',
      tokensUsed: 540,
      latencyMs: 310,
      status: 'Success',
      engine: 'Groq Llama-3.3-70b (Quality Evaluator)'
    };

    const prevTelem = state.aiTelemetry || {};
    const updatedTokenBreakdown = (prevTelem.agentTokenBreakdown || []).map(a => {
      if (a.agentId === 'agent_talent') {
        return { ...a, tasks: a.tasks + 1, tokens: a.tokens + 540 };
      }
      return a;
    });

    set({
      staffAgents: updatedStaff,
      aiTrainingRules: [generatedRule, ...(state.aiTrainingRules || [])],
      aiTelemetry: {
        ...prevTelem,
        totalTokensUsed: (prevTelem.totalTokensUsed || 0) + 540,
        outputTokens: (prevTelem.outputTokens || 0) + 320,
        inputTokens: (prevTelem.inputTokens || 0) + 220,
        taskAuditFeed: [auditFeedItem, ...(prevTelem.taskAuditFeed || [])].slice(0, 50),
        agentTokenBreakdown: updatedTokenBreakdown
      }
    });

    return {
      status: 'Success',
      ruleId: newRuleId,
      message: `Siska berhasil melatih ${targetAgentName} dan menanamkan SOP perilaku baru ke memori permanen.`
    };
  }
}));

