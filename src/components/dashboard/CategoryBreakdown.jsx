import { useMemo } from 'react'
import { useTransactions } from '../../context/TransactionContext'

const COLOR_PALETTE = [
  { colorClass: 'bg-primary', strokeClass: 'stroke-primary' },
  { colorClass: 'bg-secondary', strokeClass: 'stroke-secondary' },
  { colorClass: 'bg-tertiary', strokeClass: 'stroke-tertiary' },
  { colorClass: 'bg-error', strokeClass: 'stroke-error' },
  { colorClass: 'bg-primary-container', strokeClass: 'stroke-primary-container' },
]

export default function CategoryBreakdown() {
  const { transactions } = useTransactions()

  const { categories, totalExpense } = useMemo(() => {
    const byCategory = {}
    let total = 0

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((tx) => {
        const cat = tx.category
        byCategory[cat] = (byCategory[cat] || 0) + tx.amount
        total += tx.amount
      })

    const cats = Object.entries(byCategory)
      .sort((a, b) => b[1] - a[1])
      .map(([label, amount], i) => ({
        label,
        pct: total > 0 ? Math.round((amount / total) * 100) : 0,
        ...COLOR_PALETTE[i % COLOR_PALETTE.length],
      }))

    return { categories: cats, totalExpense: total }
  }, [transactions])

  // Build donut offsets
  let offset = 0
  const segments = categories.map((cat) => {
    const segment = { ...cat, offset: -offset }
    offset += cat.pct
    return segment
  })

  const fmt = (n) => {
    if (n >= 1000000) return `Rp ${(n/1000000).toFixed(1)}M`
    if (n >= 1000) return `Rp ${Math.round(n/1000)}k`
    return `Rp ${n}`
  }

  return (
    <div className="bg-surface-container p-8 rounded-xl flex flex-col">
      <h3 className="text-xl font-bold font-headline mb-6">Distribusi Biaya</h3>

      <div className="flex-1 flex flex-col justify-center items-center">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle
              className="stroke-surface-container-low"
              cx="18" cy="18" r="15.9"
              fill="none" strokeWidth="3.8"
            />
            {segments.map((seg) => (
              <circle
                key={seg.label}
                className={seg.strokeClass}
                cx="18" cy="18" r="15.9"
                fill="none" strokeWidth="3.8"
                strokeDasharray={`${seg.pct} 100`}
                strokeDashoffset={seg.offset}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-on-surface-variant font-label">Total</span>
            <span className="text-xl font-bold font-label">{fmt(totalExpense)}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          {categories.length === 0 && (
            <p className="text-xs text-on-surface-variant text-center">Belum ada data pengeluaran.</p>
          )}
          {categories.map((cat) => (
            <div key={cat.label} className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${cat.colorClass}`} />
                <span className="text-xs font-medium">{cat.label}</span>
              </div>
              <span className="text-xs font-label">{cat.pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
