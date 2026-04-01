import { useState, useEffect } from 'react'
import axios from 'axios'
import DashboardLayout from '../components/layouts/DashboardLayout'
import MaterialIcon from '../components/ui/MaterialIcon'
import { useTransactions } from '../context/TransactionContext'

const CATEGORY_COLORS = {
  food: '#ffb4ab',
  transport: '#7bd0ff',
  bills: '#3131c0',
  entertainment: '#4edea3',
  shopping: '#ffb4ab',
  health: '#7bd0ff',
  education: '#3131c0',
  home: '#4edea3',
  other: '#a9b0ba'
};

const CATEGORY_LABELS = {
  food: 'Makanan & Minuman',
  transport: 'Transportasi',
  bills: 'Tagihan',
  entertainment: 'Hiburan',
  shopping: 'Belanja',
  health: 'Kesehatan',
  education: 'Edukasi',
  home: 'Rumah',
  other: 'Lainnya',
};

export default function ReportsPage() {
  const [period, setPeriod] = useState('monthly')
  const { transactions } = useTransactions()
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    expensesByCategory: {}
  });

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await axios.get('/api/reports/summary');
        setSummary(res.data);
      } catch (e) {
        console.error("Gagal memuat laporan", e);
      }
    }
    loadSummary();
  }, [period]);

  /* ---- Download CSV ---- */
  const handleDownloadCSV = () => {
    if (transactions.length === 0) return

    const headers = ['Tanggal', 'Tipe', 'Kategori', 'Catatan', 'Jumlah (Rp)']
    const rows = transactions.map((tx) => [
      tx.rawDate || tx.date,
      tx.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
      tx.category,
      `"${(tx.name || '').replace(/"/g, '""')}"`,
      tx.amount,
    ])

    // Hitung total
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
    rows.push([])
    rows.push(['', '', '', 'Total Pemasukan', totalIncome])
    rows.push(['', '', '', 'Total Pengeluaran', totalExpense])
    rows.push(['', '', '', 'Saldo', totalIncome - totalExpense])

    const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n')
    // BOM for Excel compatibility with Indonesian chars
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `laporan_keuangan_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Build donut offsets and segments
  const totalExpense = summary.totalExpense || 1; // Prevent div by 0
  let offset = 0;
  const segments = Object.entries(summary.expensesByCategory).map(([key, val]) => {
    const pct = (val / totalExpense) * 100;
    const s = {
      label: CATEGORY_LABELS[key] || key,
      pct,
      color: CATEGORY_COLORS[key] || '#ffffff',
      offset: -offset
    };
    offset += pct;
    return s;
  });

  // Build Cashflow Graph Data (Simplified to current month)
  const maxVal = Math.max(summary.totalIncome, summary.totalExpense) || 1;
  const cashflowData = [
    { 
      month: 'Bulan Ini', 
      incomePct: (summary.totalIncome / maxVal) * 100, 
      expensePct: (summary.totalExpense / maxVal) * 100,
      highlight: true 
    }
  ];

  return (
    <DashboardLayout activePage="reports">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold font-headline text-on-surface tracking-tight mb-2">
            Laporan Keuangan
          </h1>
          <p className="text-on-surface-variant max-w-md">
            Analisis pergerakan kas dan distribusi pengeluaran Anda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex bg-surface-container-low p-1 rounded-xl shadow-inner">
            {['weekly', 'monthly', 'yearly'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  period === p
                    ? 'bg-surface-container-highest text-primary shadow-lg font-bold'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-6 py-2.5 border border-secondary/40 text-secondary hover:bg-secondary/10 transition-all rounded-xl font-semibold"
          >
            <MaterialIcon icon="download" className="text-lg" />
            Download CSV
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ===== Cash Flow Dynamics ===== */}
        <div className="lg:col-span-8 bg-surface-container-low p-8 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="flex justify-between items-start mb-12 relative z-10">
            <div>
              <h3 className="text-xl font-bold font-headline mb-1">Dinamika Arus Kas</h3>
              <p className="text-sm text-on-surface-variant">Pemasukan vs Pengeluaran</p>
            </div>
            <div className="flex gap-4 text-xs font-label">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(78,222,163,0.4)]" />
                <span className="uppercase tracking-widest">Pemasukan</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-error shadow-[0_0_10px_rgba(255,180,171,0.4)]" />
                <span className="uppercase tracking-widest">Pengeluaran</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-center h-64 gap-12 relative z-10">
            {cashflowData.map((bar) => (
              <div key={bar.month} className="flex flex-col justify-end items-center h-full w-32">
                <div className="flex gap-2 w-full justify-center items-end h-full">
                  <div
                    className="w-12 bg-primary/40 rounded-t-lg hover:bg-primary transition-colors cursor-pointer"
                    style={{ height: `${bar.incomePct}%` }}
                    title={`Rp ${summary.totalIncome.toLocaleString('id-ID')}`}
                  />
                  <div
                    className="w-12 bg-error/40 rounded-t-lg hover:bg-error transition-colors cursor-pointer"
                    style={{ height: `${bar.expensePct}%` }}
                    title={`Rp ${summary.totalExpense.toLocaleString('id-ID')}`}
                  />
                </div>
                <span className={`text-[10px] font-label mt-4 uppercase tracking-widest ${
                  bar.highlight ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`}>
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Expense Distribution ===== */}
        <div className="lg:col-span-4 bg-surface-container p-8 rounded-3xl flex flex-col items-center justify-between border border-outline-variant/10">
          <div className="w-full mb-6">
            <h3 className="text-xl font-bold font-headline mb-1">Distribusi Pengeluaran</h3>
            <p className="text-sm text-on-surface-variant">Alokasi dana per sektor</p>
          </div>

          {/* Donut */}
          <div className="relative w-48 h-48 flex items-center justify-center mt-4">
            <svg className="w-full h-full transform -rotate-90 scale-110" viewBox="0 0 36 36">
              <circle
                className="text-surface-container-highest"
                cx="18" cy="18" r="15.915"
                fill="none" stroke="currentColor"
                strokeDasharray="100" strokeWidth="3"
              />
              {segments.map((seg) => (
                <circle
                  key={seg.label}
                  cx="18" cy="18" r="15.915"
                  fill="none"
                  stroke={seg.color}
                  strokeDasharray={`${seg.pct > 0 ? seg.pct : 0} 100`}
                  strokeDashoffset={seg.offset}
                  strokeWidth="4.5"
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
              <span className="text-xl font-bold font-label tracking-tighter">
                Rp {summary.totalExpense > 1000000 ? (summary.totalExpense/1000000).toFixed(1) + 'M' : summary.totalExpense.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] font-label uppercase text-on-surface-variant mt-1">Total Keluar</span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full grid grid-cols-2 gap-3 mt-12 overflow-y-auto max-h-32">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-container-low/50 hover:bg-surface-container-highest transition-colors"
                title={`${seg.pct.toFixed(1)}%`}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                <span className="text-[10px] sm:text-xs font-label whitespace-nowrap overflow-hidden text-ellipsis">{seg.label}</span>
              </div>
            ))}
            {segments.length === 0 && (
              <span className="text-xs text-on-surface-variant text-center col-span-2 mt-4">Belum ada pengeluaran.</span>
            )}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
