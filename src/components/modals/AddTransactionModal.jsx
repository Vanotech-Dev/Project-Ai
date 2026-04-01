import { useState } from 'react'
import MaterialIcon from '../ui/MaterialIcon'
import { useTransactions } from '../../context/TransactionContext'

const CATEGORIES = [
  { key: 'food', icon: 'restaurant', label: 'Food' },
  { key: 'transport', icon: 'directions_car', label: 'Transp' },
  { key: 'bills', icon: 'payments', label: 'Bills' },
  { key: 'entertainment', icon: 'movie', label: 'Entert' },
  { key: 'shopping', icon: 'shopping_bag', label: 'Belanja' },
  { key: 'health', icon: 'health_and_safety', label: 'Medis' },
  { key: 'education', icon: 'school', label: 'Edukasi' },
  { key: 'salary', icon: 'work', label: 'Jajan' },
  { key: 'home', icon: 'home', label: 'Rumah' },
  { key: 'other', icon: 'more_horiz', label: 'Lainnya' },
]

export default function AddTransactionModal({ isOpen, onClose }) {
  const { addTransaction } = useTransactions()
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [showToast, setShowToast] = useState(false)

  if (!isOpen) return null

  const handleAmountChange = (e) => {
    const raw = e.target.value.replace(/[^\d]/g, '')
    if (!raw) { setAmount(''); return }
    const formatted = parseInt(raw, 10).toLocaleString('id-ID')
    setAmount(formatted)
  }

  const handleSubmit = () => {
    if (!amount) return
    addTransaction({
      type,
      amount,
      categoryKey: category,
      date,
      notes,
    })
    setShowToast(true)
    setTimeout(() => {
      setShowToast(false)
      // Reset form
      setType('expense')
      setAmount('')
      setCategory('food')
      setDate(new Date().toISOString().split('T')[0])
      setNotes('')
      onClose()
    }, 1500)
  }

  return (
    <>
      {/* Overlay / Backdrop */}
      <div
        className="fixed inset-0 bg-surface/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        {/* Transaction Modal */}
        <div className="w-full max-w-lg bg-surface-container-low rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col border border-outline-variant/15 animate-fade-in-up">

          {/* Modal Header */}
          <div className="px-8 pt-8 pb-4 flex justify-between items-center">
            <h1 className="text-2xl font-headline font-bold text-on-surface tracking-tight">
              Tambah Transaksi
            </h1>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors"
            >
              <MaterialIcon icon="close" className="text-on-surface-variant" />
            </button>
          </div>

          {/* Form Body */}
          <div className="px-8 pb-8 space-y-8 overflow-y-auto max-h-[70vh]">

            {/* Toggle Switch (Income/Expense) */}
            <div className="flex p-1.5 bg-surface-container-lowest rounded-full w-full">
              <button
                onClick={() => setType('expense')}
                className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 ${
                  type === 'expense'
                    ? 'bg-surface-container-highest text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <MaterialIcon icon="remove_circle" className="text-[20px]" />
                Pengeluaran
              </button>
              <button
                onClick={() => setType('income')}
                className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all flex items-center justify-center gap-2 ${
                  type === 'income'
                    ? 'bg-surface-container-highest text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <MaterialIcon icon="add_circle" className="text-[20px]" />
                Pemasukan
              </button>
            </div>

            {/* Nominal Input */}
            <div className="space-y-2">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                Nominal Transaksi
              </label>
              <div className="relative group">
                <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-label font-bold text-primary">
                  Rp
                </span>
                <input
                  className="w-full bg-transparent border-none text-5xl font-label font-bold text-on-surface focus:ring-0 pl-16 py-2 placeholder:text-surface-variant transition-all"
                  placeholder="0"
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                />
                <div className="h-[2px] w-full bg-surface-container-highest group-focus-within:bg-primary transition-colors" />
              </div>
            </div>

            {/* Category Grid */}
            <div className="space-y-4">
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                Kategori
              </label>
              <div className="grid grid-cols-5 gap-3">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.key
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setCategory(cat.key)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-colors group ${
                        isSelected
                          ? 'bg-surface-container-highest border border-primary/30'
                          : 'hover:bg-surface-container border border-transparent'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-xl ${
                          isSelected
                            ? 'bg-primary/20 text-primary'
                            : 'bg-surface-container-lowest text-on-surface-variant group-hover:text-on-surface'
                        }`}
                      >
                        <MaterialIcon icon={cat.icon} filled={isSelected} />
                      </div>
                      <span
                        className={`text-[10px] font-medium ${
                          isSelected
                            ? 'text-primary'
                            : 'text-on-surface-variant group-hover:text-on-surface'
                        }`}
                      >
                        {cat.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Date & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  Tanggal
                </label>
                <div className="relative flex items-center">
                  <MaterialIcon icon="calendar_today" className="absolute left-4 text-on-surface-variant" />
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-xl pl-12 py-3 text-on-surface font-body focus:ring-1 focus:ring-secondary/50 transition-all"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  Catatan
                </label>
                <div className="relative flex items-center">
                  <MaterialIcon icon="notes" className="absolute left-4 text-on-surface-variant" />
                  <input
                    className="w-full bg-surface-container-lowest border-none rounded-xl pl-12 py-3 text-on-surface font-body focus:ring-1 focus:ring-secondary/50 transition-all"
                    placeholder="Makan siang bersama..."
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-primary to-primary-container py-4 rounded-2xl text-on-primary font-bold font-headline text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Simpan Transaksi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 bg-surface-bright/90 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-primary/20 animate-fade-in-up">
          <div className="w-10 h-10 bg-primary/20 text-primary flex items-center justify-center rounded-full">
            <MaterialIcon icon="check_circle" filled />
          </div>
          <div className="flex flex-col">
            <p className="text-sm font-bold text-on-surface">Berhasil Disimpan!</p>
            <p className="text-xs text-on-surface-variant">Transaksi ditambahkan.</p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="ml-4 text-on-surface-variant hover:text-on-surface"
          >
            <MaterialIcon icon="close" />
          </button>
        </div>
      )}

      {/* Background Decoration */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-[59]" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] bg-secondary/10 blur-[150px] rounded-full pointer-events-none z-[59]" />
    </>
  )
}
