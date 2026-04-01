import { useMemo } from 'react'
import { useTransactions } from '../../context/TransactionContext'

export default function SpendingChart() {
  const { transactions } = useTransactions()

  // Group expenses by day of week
  const chartData = useMemo(() => {
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
    const buckets = dayNames.map((day) => ({ day, amount: 0 }))

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((tx) => {
        const d = new Date(tx.date)
        buckets[d.getDay()].amount += tx.amount
      })

    return buckets
  }, [transactions])

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1)

  return (
    <div className="lg:col-span-2 bg-surface-container p-8 rounded-xl relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h3 className="text-xl font-bold font-headline">Ikhtisar Pengeluaran</h3>
          <p className="text-sm text-on-surface-variant">Pengeluaran per hari dalam seminggu</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="h-64 flex items-end justify-between gap-4 px-2 relative">
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-1 opacity-10 pointer-events-none">
          <div className="border-t border-outline-variant w-full" />
          <div className="border-t border-outline-variant w-full" />
          <div className="border-t border-outline-variant w-full" />
          <div className="border-t border-outline-variant w-full" />
        </div>

        {/* Bars */}
        {chartData.map((bar) => {
          const heightPct = maxAmount > 0 ? Math.round((bar.amount / maxAmount) * 100) : 0
          const label = bar.amount >= 1000000
            ? `Rp ${(bar.amount/1000000).toFixed(1)}M`
            : bar.amount >= 1000
              ? `Rp ${Math.round(bar.amount/1000)}k`
              : `Rp ${bar.amount}`
          return (
            <div
              key={bar.day}
              className="relative group flex-1 h-full flex flex-col justify-end"
            >
              <div
                className={`w-full rounded-t-lg transition-all duration-300 cursor-pointer ${
                  heightPct > 0
                    ? 'bg-gradient-to-t from-secondary-container to-primary hover:brightness-125'
                    : 'bg-surface-container-highest'
                }`}
                style={{ height: `${Math.max(heightPct, 2)}%` }}
              />
              <span className="mt-4 text-[10px] text-center font-label text-on-surface-variant">
                {bar.day}
              </span>
              {/* Tooltip */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-bright px-2 py-1 rounded text-[10px] font-label opacity-0 group-hover:opacity-100 transition-opacity shadow-xl z-20 whitespace-nowrap">
                {label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
