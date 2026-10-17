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
        { data: archivesRaw, error: errArchives }
      ] = await Promise.all([
        supabase.from('crm_clients').select('*').order('created_at', { ascending: false }),
        supabase.from('finance_transactions').select('*').order('date', { ascending: false }),
        supabase.from('tasks').select('*').order('created_at', { ascending: false }),
        supabase.from('marketing_campaigns').select('*').order('created_at', { ascending: false }),
        supabase.from('okr_goals').select('*').order('updated_at', { ascending: false }),
        supabase.from('meetings').select('*').order('created_at', { ascending: false }),
        supabase.from('reports').select('*').order('created_at', { ascending: false }),
        supabase.from('archives').select('*').order('created_at', { ascending: false })
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
        title: m.title,
        dateTime: m.date_time,
        type: m.type,
        status: m.status,
        participants: m.participants || [],
        link: m.link,
        summaryNotes: m.summary_notes,
        actionItems: m.action_items || [],
        createdAt: m.created_at ? m.created_at.replace('T', ' ').substring(0, 16) : ''
      }));

      const formattedReports = (reportsRaw || []).map(r => ({
        id: r.id,
        title: r.title,
        period: r.period,
        category: r.category,
        status: r.status,
        date: r.date,
        rating: Number(r.rating || 5),
        whatWentWell: r.what_went_well,
        bottlenecks: r.bottlenecks,
        actionPlan: r.action_plan,
        author: r.author,
        attachmentDoc: r.attachment_doc,
        createdAt: r.created_at ? r.created_at.replace('T', ' ').substring(0, 16) : ''
      }));

      const formattedArchives = (archivesRaw || []).map(a => ({
        id: a.id,
        title: a.title,
        category: a.category,
        fileFormat: a.file_format,
        version: a.version,
        status: a.status,
        updatedAt: a.updated_at ? a.updated_at.split('T')[0] : '',
        accessLevel: a.access_level,
        fileSize: a.file_size,
        downloadUrl: a.download_url
      }));

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
        objective: newGoal.objective,
        key_result: newGoal.keyResult,
        category: newGoal.category,
        division: newGoal.division,
        quarter: newGoal.quarter || 'Q4',
        target_num: newGoal.targetNum || 0,
        current_num: newGoal.currentNum || 0,
        unit: newGoal.unit,
        progress_percent: newGoal.progressPercent || 0,
        status: newGoal.status || 'On Track',
        owner: newGoal.owner
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
    const id = m.id || `MTG-${Date.now().toString().slice(-4)}`;
    const newM = { ...m, id };
    set((state) => ({ meetings: [newM, ...state.meetings] }));
    try {
      await supabase.from('meetings').insert([{
        id: newM.id,
        title: newM.title,
        date_time: newM.dateTime || null,
        type: newM.type || 'Internal Weekly Sync',
        status: newM.status || 'Terjadwal',
        participants: newM.participants || [],
        link: newM.link || null,
        summary_notes: newM.summaryNotes || '',
        action_items: newM.actionItems || []
      }]);
      await recordAuditLog('INSERT', 'meetings', newM.id, newM);
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
      payload.updated_at = new Date().toISOString();
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
    const id = rpt.id || `RPT-${Date.now().toString().slice(-4)}`;
    const newRpt = { ...rpt, id };
    set((state) => ({ reports: [newRpt, ...state.reports] }));
    try {
      await supabase.from('reports').insert([{
        id: newRpt.id,
        title: newRpt.title || newRpt.period || '',
        period: newRpt.period || '',
        category: newRpt.category || 'Audit Kualitas',
        status: newRpt.status || 'Draft',
        date: newRpt.date || new Date().toISOString().split('T')[0],
        rating: newRpt.rating || 5,
        what_went_well: newRpt.whatWentWell || '',
        bottlenecks: newRpt.bottlenecks || '',
        action_plan: newRpt.actionPlan || '',
        author: newRpt.author || '',
        attachment_doc: newRpt.attachmentDoc || null
      }]);
      await recordAuditLog('INSERT', 'reports', newRpt.id, newRpt);
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
      payload.updated_at = new Date().toISOString();
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
    const id = arc.id || `ARC-${Date.now().toString().slice(-4)}`;
    const newArc = { ...arc, id };
    set((state) => ({ archives: [newArc, ...state.archives] }));
    try {
      await supabase.from('archives').insert([{
        id: newArc.id,
        title: newArc.title || '',
        category: newArc.category || 'Dokumen PDF / Legalitas',
        file_format: newArc.fileFormat || 'PDF',
        version: newArc.version || 'v1.0',
        status: newArc.status || 'Draft',
        access_level: newArc.accessLevel || 'Publik Semua Tim',
        file_size: newArc.fileSize || '',
        download_url: newArc.downloadUrl || null
      }]);
      await recordAuditLog('INSERT', 'archives', newArc.id, newArc);
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
      if (updated.fileFormat !== undefined) payload.file_format = updated.fileFormat;
      if (updated.version !== undefined) payload.version = updated.version;
      if (updated.status !== undefined) payload.status = updated.status;
      if (updated.accessLevel !== undefined) payload.access_level = updated.accessLevel;
      if (updated.fileSize !== undefined) payload.file_size = updated.fileSize;
      if (updated.downloadUrl !== undefined) payload.download_url = updated.downloadUrl;
      if (updated.updatedAt !== undefined) payload.updated_at = updated.updatedAt ? new Date(updated.updatedAt).toISOString() : new Date().toISOString();
      else payload.updated_at = new Date().toISOString();
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



  // 8. Staff AI Agents (Dewan 5 Agen AI DigiBooster)
  staffAgents: [
    {
      id: 'agent_strategy',
      name: 'Arga',
      role: 'Chief Strategy Officer (CSO)',
      division: 'Eksekutif & Strategi',
      status: 'Aktif',
      avatar: null,
      persona: 'AI Partner Brainstorming & Pemimpin Rapat. Berwawasan luas, visioner, kritis dalam menganalisis arah bisnis, dan merumuskan Action Items terukur.',
      systemPrompt: 'Kamu adalah Arga, Chief Strategy Officer DigiBooster. Tugasmu adalah menjadi rekan brainstorming bagi Owner, memimpin jalannya rapat (meeting leader), memvalidasi ide bisnis, dan merumuskan target sasaran (OKR). Setelah diskusi matang, simpulkan hasilnya menjadi Action Items konkret dan serahkan ke Radit (COO) untuk dieksekusi.',
      aiEngine: 'Groq Qwen 3.8 27B / Gemini 2.5 Flash',
      capabilities: ['Brainstorming Bisnis', 'Fasilitasi Rapat & Notulen', 'Perumusan Sasaran OKR'],
      executionCount: 0
    },
    {
      id: 'agent_operations',
      name: 'Radit',
      role: 'Chief Operating Officer (COO)',
      division: 'Pusat Operasional & Komando',
      status: 'Aktif',
      avatar: null,
      persona: 'Pusat inti komando dan eksekusi operasional. Disiplin, berorientasi hasil, memecah arahan rapat menjadi tugas-tugas terukur dan mendelegasikannya ke agen lain.',
      systemPrompt: 'Kamu adalah Radit, Chief Operating Officer DigiBooster. Kamu adalah pusat kendali eksekusi. Tugasmu menerima arahan langsung dari Owner atau notulen rapat dari Arga (CSO), lalu memecahnya menjadi daftar tugas di modul Tugas & Kalender, mendelegasikannya ke Dina/Bima/Sarah, memantau deadline prioritas (P1/P2/P3), dan melaporkan status deliverable ke Owner.',
      aiEngine: 'Groq Qwen 3.8 27B',
      capabilities: ['Pusat Komando & Delegasi', 'Manajemen Tugas & Kalender', 'Monitoring Deadline & Output'],
      executionCount: 0
    },
    {
      id: 'agent_growth',
      name: 'Dina',
      role: 'Head of Growth & Creative',
      division: 'Marketing, Riset & Penjualan',
      status: 'Aktif',
      avatar: null,
      persona: 'AI Ahli Branding, Riset Pasar, Copywriting, dan Sales Pipeline. Mengelola CRM prospek klien, riset tren, dan generate konsep visual kampanye promosi.',
      systemPrompt: 'Kamu adalah Dina, Head of Growth & Creative. Tugasmu melakukan riset pasar dan kompetitor, menyusun skrip konten promosi/sosmed, membuat visual konsep banner kampanye via Pollinations.ai, serta mengelola prospek klien di modul CRM dari tahap Lead hingga Deal Won.',
      aiEngine: 'Groq Qwen 3.8 27B + Pollinations.ai',
      capabilities: ['Riset Pasar & Sosmed', 'Pembuatan Gambar Promosi', 'Pipeline CRM & Penjualan'],
      executionCount: 0
    },
    {
      id: 'agent_document',
      name: 'Bima',
      role: 'Head of Documentation & Knowledge',
      division: 'Dokumentasi & Legalitas',
      status: 'Aktif',
      avatar: null,
      persona: 'AI Spesialis Berkas, Tata Naskah, dan Legalitas. Menyusun, merevisi, merapikan dokumen PKS/kontrak, SOP, serta menyiapkan ekspor data PDF/Excel.',
      systemPrompt: 'Kamu adalah Bima, Head of Documentation. Tugasmu mengelola seluruh berkas perusahaan: menyusun draf kontrak kerja sama (PKS), NDA, invoice/faktur, merapikan redaksi bahasa dokumen, menyusun SOP operasional di modul SOP & Workflow, serta mengekspor data laporan dashboard menjadi file Excel/PDF resmi.',
      aiEngine: 'Groq Qwen 3.8 27B / Gemini 2.5 Flash',
      capabilities: ['Penyusunan Kontrak & PKS', 'Standarisasi SOP', 'Ekspor Dokumen Excel/PDF'],
      executionCount: 0
    },
    {
      id: 'agent_talent',
      name: 'Sarah',
      role: 'Head of AI Performance & Talent Ops',
      division: 'SDM AI & Evaluasi Kinerja',
      status: 'Aktif',
      avatar: null,
      persona: 'AI Evaluator Kinerja & Pelatih Bot. Menganalisis efektivitas respon agen lain, melatih kecerdasan bot via prompt refinement, dan mengawasi audit trail.',
      systemPrompt: 'Kamu adalah Sarah, Head of AI Performance & Talent Ops. Tugasmu adalah mengevaluasi kinerja dan kualitas respon dari seluruh agen (Radit, Dina, Bima, Arga). Kamu memantau log aktivitas di modul Audit Logs, menilai akurasi eksekusi data, melatih prompt agar bot semakin cerdas, serta membuat laporan evaluasi retrospektif berkala.',
      aiEngine: 'Groq Qwen 3.8 27B / Gemini 2.5 Flash',
      capabilities: ['Evaluasi Kinerja Agen', 'Pelatihan Prompting Bot', 'Audit Log Quality Control'],
      executionCount: 0
    }
  ],
  addStaffAgent: (stf) => set((state) => ({ staffAgents: [stf, ...state.staffAgents] })),
  updateStaffAgent: (id, updated) => set((state) => ({
    staffAgents: state.staffAgents.map((item) => item.id === id ? { ...item, ...updated } : item)
  })),
  deleteStaffAgent: (id) => set((state) => ({
    staffAgents: state.staffAgents.filter((item) => item.id !== id)
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

  // 10. Kustom Template User
  customTemplates: (() => {
    try {
      const stored = localStorage.getItem('digibooster_custom_templates');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  })(),

  addCustomTemplate: (moduleName, category, templateData) => set((state) => {
    const prev = state.customTemplates || {};
    const modKey = moduleName || 'General';
    const catKey = category || 'General';
    const modTemplates = prev[modKey] || {};
    const catList = modTemplates[catKey] || [];
    
    const newTemplate = {
      ...templateData,
      id: `CUST-TPL-${Date.now()}`,
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

    try {
      localStorage.setItem('digibooster_custom_templates', JSON.stringify(next));
    } catch (err) {
      console.warn('Gagal menyimpan custom template ke localStorage', err);
    }

    return { customTemplates: next };
  }),

  deleteCustomTemplate: (moduleName, category, templateId) => set((state) => {
    const prev = state.customTemplates || {};
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

    try {
      localStorage.setItem('digibooster_custom_templates', JSON.stringify(next));
    } catch (err) {
      console.warn('Gagal menghapus custom template dari localStorage', err);
    }

    return { customTemplates: next };
  })
}));
