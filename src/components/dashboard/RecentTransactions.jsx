import { useNavigate } from 'react-router-dom'
import MaterialIcon from '../ui/MaterialIcon'
import { useTransactions } from '../../context/TransactionContext'

export default function RecentTransactions() {
  const { transactions, isLoading } = useTransactions()
  const navigate = useNavigate()

  // Show only the 5 most recent
  const recent = transactions.slice(0, 5)

  return (
    <section className="bg-surface-container rounded-xl p-8">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-bold font-headline">Transaksi Terakhir</h3>
        <button
          onClick={() => navigate('/transactions')}
          className="text-sm text-primary font-medium hover:underline"
        >
          Lihat Semua
        </button>
      </div>

      <div className="space-y-4">
        {isLoading && (
          <p className="text-center text-on-surface-variant text-sm py-8">Memuat transaksi...</p>
        )}

        {!isLoading && recent.length === 0 && (
          <p className="text-center text-on-surface-variant text-sm py-8">
            Belum ada transaksi. Tambahkan transaksi pertama Anda!
          </p>
        )}

        {recent.map((tx) => (
          <div
            key={tx.id}
            className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors cursor-pointer group"
          >
            {/* Left: Icon + Details */}
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${tx.iconBg} flex items-center justify-center ${tx.iconColor} group-hover:scale-110 transition-transform`}>
                <MaterialIcon icon={tx.icon} filled={tx.filled} />
              </div>
              <div>
                <p className="font-bold text-sm">{tx.name}</p>
                <p className="text-xs text-on-surface-variant">
                  {tx.category} • {tx.time}
                </p>
              </div>
            </div>

            {/* Right: Amount */}
            <div className="text-right">
              <p className={`font-bold font-label ${tx.type === 'income' ? 'text-primary' : 'text-error'}`}>
                {tx.type === 'income' ? '+ ' : '- '}{tx.amountDisplay}
              </p>
              <p className="text-[10px] text-on-surface-variant uppercase font-label">
                Selesai
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
