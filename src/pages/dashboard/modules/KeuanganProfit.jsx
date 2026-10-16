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

export default function KeuanganProfit() {
  const { financeTransactions, addFinanceTransaction, updateFinanceTransaction, deleteFinanceTransaction } = useWorkspaceStore();
  const [statusFilter, setStatusFilter] = useState('Semua Status');
  const [archiveMonth, setArchiveMonth] = useState('September 2026');
  const statusOptions = ['Semua Status', 'Lunas', 'Pending', 'Dibatalkan'];

  // Filter transaksi berdasarkan status pembayaran
  const filteredTransactions = financeTransactions.filter((t) => {
    if (!statusFilter || statusFilter === 'Semua Status' || statusFilter === 'ALL' || statusFilter === 'all') {
      return true;
    }
    return t.status === statusFilter;
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

  // Data Donut Chart: Alokasi Tipe Finansial
  const financeDonutData = [
    { label: 'Pemasukan (Lunas)', value: Math.round(totalIncome / 1000000), displayVal: `Rp ${(totalIncome/1000000).toFixed(0)}Jt`, color: '#10b981' },
    { label: 'Pengeluaran (Operasional)', value: Math.round(totalExpense / 1000000), displayVal: `Rp ${(totalExpense/1000000).toFixed(0)}Jt`, color: '#ef4444' }
  ];

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
      render: (val, row, update) => (
        <select
          value={val || 'Pemasukan'}
          onChange={(e) => update ? update(e.target.value) : updateFinanceTransaction(row.id, { type: e.target.value })}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: val === 'Pemasukan' ? '#16a34a' : '#dc2626',
            fontSize: '0.8rem',
            fontWeight: 700,
            outline: 'none',
            cursor: 'pointer',
            padding: '2px 0'
          }}
        >
          <option value="Pemasukan" style={{ color: '#16a34a', fontWeight: 600 }}>▲ Pemasukan</option>
          <option value="Pengeluaran" style={{ color: '#dc2626', fontWeight: 600 }}>▼ Pengeluaran</option>
        </select>
      )
    },
    { 
      key: 'category', 
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DTag size={14} /> Kategori Kas
        </span>
      ),
      minWidth: '160px',
      render: (val, row, update) => (
        <select
          value={val || 'Pembayaran Klien'}
          onChange={(e) => update ? update(e.target.value) : updateFinanceTransaction(row.id, { category: e.target.value })}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: '#0f172a',
            fontSize: '0.8rem',
            fontWeight: 700,
            outline: 'none',
            cursor: 'pointer',
            padding: '2px 0'
          }}
        >
          <option value="Pembayaran Klien" style={{ color: '#0f172a', fontWeight: 500 }}>Pembayaran Klien</option>
          <option value="Server & Tools" style={{ color: '#0f172a', fontWeight: 500 }}>Server & Tools</option>
          <option value="Marketing Ads" style={{ color: '#0f172a', fontWeight: 500 }}>Marketing Ads</option>
          <option value="Operasional Kantor" style={{ color: '#0f172a', fontWeight: 500 }}>Operasional Kantor</option>
          <option value="Gaji & Tim" style={{ color: '#0f172a', fontWeight: 500 }}>Gaji & Tim</option>
          <option value="Lain-lain" style={{ color: '#0f172a', fontWeight: 500 }}>Lain-lain</option>
        </select>
      )
    },
    {
      key: 'amount',
      label: (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Icon3DNotes size={14} /> Nominal
        </span>
      ),
      minWidth: '130px',
      render: (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`
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
      render: (val, row, update) => (
        <input
          type="date"
          value={val ? String(val).split(' ')[0] : ''}
          onChange={(e) => update ? update(e.target.value) : updateFinanceTransaction(row.id, { date: e.target.value })}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            fontSize: '0.8rem',
            fontFamily: 'inherit',
            color: '#0f172a',
            outline: 'none',
            padding: '2px 4px',
            cursor: 'pointer'
          }}
        />
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
      render: (val, row, update) => {
        const statusTextColors = {
          'Lunas': '#16a34a',
          'Pending': '#d97706',
          'Dibatalkan': '#dc2626'
        };
        const currentTextColor = statusTextColors[val] || '#64748b';
        return (
          <select
            value={val || 'Lunas'}
            onChange={(e) => update ? update(e.target.value) : updateFinanceTransaction(row.id, { status: e.target.value })}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              color: currentTextColor,
              fontSize: '0.8rem',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
              padding: '2px 0'
            }}
          >
            <option value="Lunas" style={{ color: '#16a34a', fontWeight: 600 }}>Lunas</option>
            <option value="Pending" style={{ color: '#d97706', fontWeight: 600 }}>Pending</option>
            <option value="Dibatalkan" style={{ color: '#dc2626', fontWeight: 600 }}>Dibatalkan</option>
          </select>
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

  const handleAddQuickTransaction = () => {
    const newTx = {
      id: `FIN-${Date.now().toString().slice(-4)}`,
      title: '',
      type: 'Pemasukan',
      category: 'Pembayaran Klien',
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
          title="Rasio Kas Masuk vs Kas Keluar"
          subtitle="Perbandingan kas realisasi lunas"
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
