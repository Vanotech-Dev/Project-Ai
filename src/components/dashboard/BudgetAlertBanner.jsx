import { useMemo } from 'react'
import MaterialIcon from '../ui/MaterialIcon'
import { useTransactions } from '../../context/TransactionContext'

// Budget default per kategori (bisa dikustomisasi nanti)
const BUDGET_LIMITS = {
  food: { label: 'Makan & Minum', budget: 2000000 },
  transport: { label: 'Transportasi', budget: 1000000 },
  bills: { label: 'Tagihan', budget: 1500000 },
  entertainment: { label: 'Hiburan', budget: 500000 },
  shopping: { label: 'Belanja', budget: 1000000 },
  health: { label: 'Kesehatan', budget: 500000 },
  education: { label: 'Edukasi', budget: 500000 },
  salary: { label: 'Jajan', budget: 500000 },
  home: { label: 'Rumah', budget: 2000000 },
}

export default function BudgetAlertBanner() {
  const { transactions } = useTransactions()

  // Hitung pengeluaran bulan ini per kategori
  const topAlert = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Filter hanya expense bulan ini
    const thisMonthExpenses = transactions.filter((t) => {
      const d = new Date(t.date)
      return t.type === 'expense' && d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    // Hitung total per kategori
    const categoryTotals = {}
    for (const tx of thisMonthExpenses) {
      const key = tx.categoryKey || 'other'
      categoryTotals[key] = (categoryTotals[key] || 0) + tx.amount
    }

    // Cari kategori dengan persentase tertinggi terhadap budget
    let highest = null
    for (const [key, spent] of Object.entries(categoryTotals)) {
      const budgetInfo = BUDGET_LIMITS[key]
      if (!budgetInfo) continue

      const pct = Math.round((spent / budgetInfo.budget) * 100)
      if (!highest || pct > highest.pct) {
        highest = {
          key,
          label: budgetInfo.label,
          spent,
          budget: budgetInfo.budget,
          pct: Math.min(pct, 100),
          rawPct: pct,
        }
      }
    }

    return highest
  }, [transactions])

  // Jika tidak ada expense bulan ini, tampilkan pesan default
  if (!topAlert) {
    return (
      <section className="relative overflow-hidden bg-surface-container-low rounded-xl p-4 flex items-center gap-4 group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
        <div className="bg-primary/20 p-2 rounded-lg relative z-10">
          <MaterialIcon icon="check_circle" className="text-primary" />
        </div>
        <div className="flex-1 relative z-10">
          <p className="text-sm font-medium text-on-surface">Semua budget bulan ini aman! 🎉</p>
          <p className="text-xs text-on-surface-variant">Belum ada pengeluaran yang mencapai batas budget.</p>
        </div>
      </section>
    )
  }

  // Tentukan warna berdasarkan persentase
  const isWarning = topAlert.rawPct >= 80
  const isDanger = topAlert.rawPct >= 100
  const barColor = isDanger ? 'bg-error' : isWarning ? 'bg-tertiary' : 'bg-primary'
  const glowColor = isDanger ? 'rgba(255,180,171,0.4)' : isWarning ? 'rgba(123,208,255,0.4)' : 'rgba(78,222,163,0.4)'
  const iconColor = isDanger ? 'text-error' : isWarning ? 'text-tertiary' : 'text-primary'
  const iconBg = isDanger ? 'bg-error/20' : isWarning ? 'bg-tertiary/20' : 'bg-primary/20'
  const gradientColor = isDanger ? 'from-error/10' : isWarning ? 'from-tertiary/10' : 'from-primary/10'
  const icon = isDanger ? 'warning' : isWarning ? 'info' : 'check_circle'

  const spentDisplay = `Rp ${topAlert.spent.toLocaleString('id-ID')}`
  const budgetDisplay = `Rp ${topAlert.budget.toLocaleString('id-ID')}`

  return (
    <section className="relative overflow-hidden bg-surface-container-low rounded-xl p-4 flex items-center gap-4 group">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradientColor} to-transparent opacity-50`} />
      <div className={`${iconBg} p-2 rounded-lg relative z-10`}>
        <MaterialIcon icon={icon} className={iconColor} />
      </div>
      <div className="flex-1 relative z-10">
        <div className="flex justify-between items-center mb-1">
          <p className="text-sm font-medium text-on-surface">Budget Alert: {topAlert.label}</p>
          <p className="text-xs font-label text-on-surface-variant">{topAlert.rawPct}% Terpakai</p>
        </div>
        <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all duration-1000`}
            style={{ width: `${topAlert.pct}%`, boxShadow: `0 0 8px ${glowColor}` }}
          />
        </div>
        <p className="text-[10px] text-on-surface-variant mt-1 font-label">
          {spentDisplay} / {budgetDisplay}
        </p>
      </div>
    </section>
  )
}
