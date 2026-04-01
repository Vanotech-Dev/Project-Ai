import MaterialIcon from '../ui/MaterialIcon'
import { useTransactions } from '../../context/TransactionContext'

export default function SummaryCards() {
  const { transactions } = useTransactions()

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
  
  const balance = totalIncome - totalExpense

  const fmt = (n) => 'Rp ' + n.toLocaleString('id-ID')

  const CARDS = [
    {
      label: 'Saldo Utama',
      value: fmt(balance),
      icon: 'account_balance_wallet',
      borderColor: 'border-primary',
      valueColor: balance >= 0 ? 'text-primary' : 'text-error',
    },
    {
      label: 'Total Pemasukan',
      value: fmt(totalIncome),
      icon: 'arrow_downward',
      borderColor: 'border-primary-container',
      valueColor: 'text-on-surface',
      subtext: 'Seluruh waktu',
    },
    {
      label: 'Total Pengeluaran',
      value: fmt(totalExpense),
      icon: 'arrow_upward',
      borderColor: 'border-error',
      valueColor: 'text-error',
      subtext: 'Seluruh waktu',
    },
  ]

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {CARDS.map((card) => (
        <div
          key={card.label}
          className={`bg-surface-container p-6 rounded-xl border-l-4 ${card.borderColor} relative overflow-hidden`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <MaterialIcon icon={card.icon} className="text-6xl" />
          </div>

          <p className="text-on-surface-variant text-sm font-medium mb-2">{card.label}</p>
          <h2 className={`text-2xl font-bold font-label ${card.valueColor}`}>{card.value}</h2>

          {card.subtext && (
            <p className="mt-4 text-xs text-on-surface-variant font-label">{card.subtext}</p>
          )}
        </div>
      ))}
    </section>
  )
}
