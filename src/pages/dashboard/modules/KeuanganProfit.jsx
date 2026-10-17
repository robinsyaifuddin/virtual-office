import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Plus, FileText } from 'lucide-react';

import { 
  Icon3DClipboard, 
  Icon3DCalendar, 
  Icon3DTag, 
  Icon3DFlag, 
  Icon3DGear, 
  Icon3DUser, 
  Icon3DNotes 
} from '../../../components/ui/Modern3DIcons';
import { toInputDateFormat } from '../../../utils/dateFormatter';

export default function KeuanganProfit() {
  const { financeTransactions, addFinanceTransaction, updateFinanceTransaction, deleteFinanceTransaction } = useWorkspaceStore();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Lunas', 'Pending', 'Dibatalkan'];

  const financeCategories = [
    'Pembayaran Klien',
    'Server & Tools',
    'Marketing Ads',
    'Operasional Kantor',
    'Gaji & Tim',
    'Lain-lain'
  ];

  // Filter transaksi berdasarkan status pembayaran & kategori kas
  const filteredTransactions = financeTransactions.filter((t) => {
    const matchesStatus = (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all')
      ? true 
      : t.status === statusFilter;
    const matchesCat = (!activeCategory || activeCategory === 'ALL' || activeCategory === 'all')
      ? true 
      : t.category === activeCategory;
    return matchesStatus && matchesCat;
  });

  const totalIncome = financeTransactions
    .filter(t => t.type === 'Pemasukan' && t.status === 'Lunas')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const totalExpense = financeTransactions
    .filter(t => t.type === 'Pengeluaran' && t.status === 'Lunas')
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const netProfit = totalIncome - totalExpense;

  // Data Bar Chart: Pemasukan vs Pengeluaran per Kategori
  const categoryAmounts = financeTransactions.reduce((acc, t) => {
    const cat = t.category || 'Operasional';
    acc[cat] = (acc[cat] || 0) + (t.amount || 0);
    return acc;
  }, {});

  const financeBarData = Object.keys(categoryAmounts).slice(0, 5).map((cat, idx) => {
    const valJt = Math.round(categoryAmounts[cat] / 1000000);
    const colors = ['#0284c7', '#0ea5e9', '#38bdf8', '#60a5fa', '#93c5fd'];
    const rawCat = (cat && typeof cat === 'string') ? cat : `Kategori ${idx+1}`;
    return {
      label: rawCat.split(' ')[0] || rawCat,
      value: valJt,
      displayVal: `Rp ${valJt}Jt`,
      color: colors[idx % colors.length]
    };
  });

  // Data Donut Chart: Distribusi Status Pembayaran Transaksi
  const statusCounts = financeTransactions.reduce((acc, t) => {
    const s = (t.status && typeof t.status === 'string' && t.status.trim()) ? t.status.trim() : 'Lunas';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const statusColors = {
    'Lunas': '#16a34a',
    'Pending': '#d97706',
    'Dibatalkan': '#dc2626'
  };

  const financeDonutData = Object.keys(statusCounts).map(st => ({
    label: st,
    value: statusCounts[st],
    displayVal: `${statusCounts[st]} Transaksi`,
    color: statusColors[st] || '#0284c7'
  }));

  const columns = [
    { 
      key: 'title', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DClipboard size={14} /> Uraian Transaksi
        </span>
      ), 
      minWidth: '220px' 
    },
    {
      key: 'type',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DFlag size={14} /> Tipe
        </span>
      ),
      minWidth: '135px',
      render: (val) => {
        const isIncome = val === 'Pemasukan';
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: isIncome ? '#f0fdf4' : '#fef2f2',
              color: isIncome ? '#16a34a' : '#dc2626',
              border: `1px solid ${isIncome ? '#bbf7d0' : '#fecaca'}`
            }}
          >
            {isIncome ? '▲ Pemasukan' : '▼ Pengeluaran'}
          </span>
        );
      }
    },
    { 
      key: 'category', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Kategori Kas
        </span>
      ),
      minWidth: '160px',
      options: financeCategories,
      render: (val) => (
        <span
          className="ws-notion-pill"
          style={{
            border: '1px solid #bfdbfe',
            backgroundColor: '#eff6ff',
            color: '#0284c7',
            fontSize: '0.8rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '6px',
            display: 'inline-block'
          }}
        >
          {val || 'Lain-lain'}
        </span>
      )
    },
    {
      key: 'amount',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Nominal
        </span>
      ),
      minWidth: '140px',
      render: (val, row) => (
        <span
          style={{
            fontWeight: 700,
            color: row.type === 'Pemasukan' ? '#16a34a' : '#dc2626',
            fontSize: '0.82rem'
          }}
        >
          {`Rp ${(Number(val) || 0).toLocaleString('id-ID')}`}
        </span>
      )
    },
    { 
      key: 'clientRef', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DUser size={14} /> Relasi Proyek / Klien
        </span>
      ), 
      minWidth: '160px' 
    },
    { 
      key: 'date', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DCalendar size={14} /> Tanggal Transaksi
        </span>
      ),
      minWidth: '135px',
      render: (val) => (
        <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>
          {val || '-'}
        </span>
      )
    },
    {
      key: 'status',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DGear size={14} /> Status Pembayaran
        </span>
      ),
      minWidth: '130px',
      render: (val) => {
        const statusColors = {
          'Lunas': { bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' },
          'Pending': { bg: '#fffbeb', border: '#fef3c7', text: '#d97706' },
          'Dibatalkan': { bg: '#fef2f2', border: '#fecaca', text: '#dc2626' }
        };
        const current = statusColors[val] || { bg: '#f8fafc', border: '#e2e8f0', text: '#64748b' };
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: current.bg,
              border: `1px solid ${current.border}`,
              color: current.text
            }}
          >
            {val || 'Lunas'}
          </span>
        );
      }
    },
    {
      key: 'receiptDoc',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Faktur / Bukti
        </span>
      ),
      minWidth: '140px',
      render: (val) => val ? (
        <span style={{ color: '#0284c7', fontSize: '0.75rem', fontWeight: 600 }}>
          {val}
        </span>
      ) : '-'
    }
  ];

  const handleAddQuickTransaction = (overrideCat) => {
    const defaultCat = overrideCat || ((activeCategory && activeCategory !== 'ALL' && activeCategory !== 'all')
      ? activeCategory
      : financeCategories[0]);

    const newTx = {
      id: `FIN-${Date.now().toString().slice(-4)}`,
      title: '',
      type: 'Pemasukan',
      category: defaultCat,
      amount: 0,
      clientRef: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      receiptDoc: '',
      createdBy: 'Executive Owner',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedBy: 'Executive Owner',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      comments: []
    };
    addFinanceTransaction(newTx);
    return newTx;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="ws-page-title">
            Keuangan &amp; Profit
          </h2>
        </div>
      </div>

      <div className="ws-metric-grid">
        <MetricCard
          title="Total Pemasukan (Lunas)"
          value={`Rp ${(totalIncome / 1000000).toFixed(1)} Jt`}
          icon={ArrowUpRight}
        />
        <MetricCard
          title="Total Pengeluaran"
          value={`Rp ${(totalExpense / 1000000).toFixed(1)} Jt`}
          icon={ArrowDownRight}
        />
        <MetricCard
          title="Laba Bersih Operasional"
          value={`Rp ${(netProfit / 1000000).toFixed(1)} Jt`}
          change="+24%"
          trend="up"
          icon={DollarSign}
        />
      </div>

      {/* 2 Charts: Bar Chart & Donut Chart */}
      <div className="ws-charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
        <SimpleBarChart
          title="Alokasi Biaya & Kas per Kategori"
          subtitle="Distribusi perputaran dana operasional"
          data={financeBarData}
        />
        <DonutChart
          title="Distribusi Status Pembayaran"
          subtitle="Status verifikasi tagihan & transaksi"
          data={financeDonutData}
        />
      </div>

      <NotionTable
        title="Buku Kas & Transaksi"
        data={filteredTransactions}
        columns={columns}
        onAddRow={handleAddQuickTransaction}
        onDeleteRow={deleteFinanceTransaction}
        onUpdateCell={(id, field, val) => updateFinanceTransaction(id, { [field]: val })}
        exportFileName="laporan_keuangan_digibooster.csv"
        categories={financeCategories}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
        categoryKey="category"
        statusFilter={statusFilter}
        onChangeStatusFilter={setStatusFilter}
        statusOptions={statusOptions}
        archiveMonth={archiveMonth}
        onChangeArchiveMonth={setArchiveMonth}
        availableArchiveMonths={['September 2026', 'Agustus 2026', 'Juli 2026']}
      />
    </div>
  );
}
