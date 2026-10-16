import React, { useState } from 'react';
import { useWorkspaceStore } from '../../../store/workspaceStore';
import NotionTable from '../components/NotionTable';
import MetricCard from '../components/MetricCard';
import { SimpleBarChart, DonutChart } from '../components/ChartWidgets';
import { DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Plus, FileText } from 'lucide-react';

export default function KeuanganProfit() {
  const { financeTransactions, addFinanceTransaction, updateFinanceTransaction, deleteFinanceTransaction } = useWorkspaceStore();

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
    const colors = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
    return {
      label: cat.split(' ')[0] || cat,
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
    { key: 'title', label: 'Uraian Transaksi' },
    {
      key: 'type',
      label: 'Tipe',
      render: (val) => (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontWeight: 700,
          fontSize: '0.75rem',
          color: val === 'Pemasukan' ? '#16a34a' : '#dc2626'
        }}>
          {val === 'Pemasukan' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {val}
        </span>
      )
    },
    { key: 'category', label: 'Kategori' },
    {
      key: 'amount',
      label: 'Nominal',
      render: (val) => `Rp ${(val || 0).toLocaleString('id-ID')}`
    },
    { key: 'clientRef', label: 'Relasi Proyek / Klien' },
    { key: 'date', label: 'Tanggal' },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span style={{
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '0.75rem',
          fontWeight: 700,
          backgroundColor: val === 'Lunas' ? '#dcfce7' : '#fef3c7',
          color: val === 'Lunas' ? '#15803d' : '#b45309'
        }}>
          {val}
        </span>
      )
    },
    {
      key: 'receiptDoc',
      label: 'Faktur / Bukti',
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
      title: 'Pemasukan Jasa Otomasi Baru',
      type: 'Pemasukan',
      category: 'Pembayaran Klien',
      amount: 15000000,
      clientRef: 'Klien Baru',
      date: new Date().toISOString().split('T')[0],
      status: 'Lunas',
      receiptDoc: 'Faktur_Draft.pdf',
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
      <div>
        <h2 className="ws-page-title">
          Keuangan & Profitabilitas
        </h2>
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
          centerValue={`Rp ${((totalIncome - totalExpense)/1000000).toFixed(0)}Jt`}
          centerLabel="Laba Bersih"
        />
      </div>

      <NotionTable
        title="Buku Kas & Transaksi"
        data={financeTransactions}
        columns={columns}
        onAddRow={handleAddQuickTransaction}
        onDeleteRow={deleteFinanceTransaction}
        onUpdateCell={(id, field, val) => updateFinanceTransaction(id, { [field]: val })}
        exportFileName="laporan_keuangan_digibooster.csv"
      />
    </div>
  );
}
