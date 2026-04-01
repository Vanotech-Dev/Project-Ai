import { useState, useMemo } from 'react'
import DashboardLayout from '../components/layouts/DashboardLayout'
import MaterialIcon from '../components/ui/MaterialIcon'
import { useTransactions } from '../context/TransactionContext'

const FILTER_CHIPS = [
  { key: 'all', label: 'Semua Tipe' },
  { key: 'expense', label: 'Pengeluaran' },
  { key: 'income', label: 'Pemasukan' },
  { key: 'food', label: 'Makanan & Minuman' },
  { key: 'transport', label: 'Transportasi' },
]

const CATEGORY_OPTIONS = [
  { key: 'food', label: 'Makanan & Minuman' },
  { key: 'transport', label: 'Transportasi' },
  { key: 'bills', label: 'Tagihan' },
  { key: 'entertainment', label: 'Hiburan' },
  { key: 'shopping', label: 'Belanja' },
  { key: 'health', label: 'Kesehatan' },
  { key: 'education', label: 'Edukasi' },
  { key: 'salary', label: 'Jajan' },
  { key: 'home', label: 'Rumah' },
  { key: 'other', label: 'Lainnya' },
]

/* ===============================
   Delete Confirmation Dialog
   =============================== */
function DeleteDialog({ tx, onCancel, onConfirm, isDeleting }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={onCancel}>
      <div className="bg-surface-container-high rounded-2xl p-8 max-w-sm w-full mx-6 shadow-2xl border border-outline-variant/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center">
            <MaterialIcon icon="delete_forever" className="text-error text-3xl" />
          </div>
        </div>
        <h3 className="text-xl font-headline font-bold text-on-surface text-center mb-2">Hapus Transaksi?</h3>
        <p className="text-sm text-on-surface-variant text-center mb-8 font-body">
          Anda yakin ingin menghapus <strong className="text-on-surface">"{tx.name}"</strong> sebesar <strong className="text-on-surface">{tx.amountDisplay}</strong>? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-surface-container text-on-surface font-medium text-sm hover:bg-surface-container-highest transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 rounded-xl bg-error text-on-error font-bold text-sm hover:brightness-110 transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin" />
            ) : (
              <>
                <MaterialIcon icon="delete" className="text-base" />
                Hapus
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===============================
   Edit Transaction Dialog
   =============================== */
function EditDialog({ tx, onCancel, onSave, isSaving }) {
  const [type, setType] = useState(tx.type)
  const [amount, setAmount] = useState(String(tx.amount))
  const [categoryKey, setCategoryKey] = useState(tx.categoryKey || 'other')
  const [date, setDate] = useState(tx.rawDate || '')
  const [notes, setNotes] = useState(tx.name || '')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!amount || parseInt(amount) <= 0) {
      setErrorMsg('Jumlah harus lebih dari 0')
      return
    }

    try {
      await onSave(tx.id, { type, amount: parseInt(amount), categoryKey, date, notes })
    } catch (err) {
      setErrorMsg('Gagal menyimpan perubahan.')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={onCancel}>
      <div className="bg-surface-container-high rounded-2xl p-8 max-w-md w-full mx-6 shadow-2xl border border-outline-variant/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
            <MaterialIcon icon="edit_note" className="text-primary text-2xl" />
            Edit Transaksi
          </h3>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors">
            <MaterialIcon icon="close" className="text-lg" />
          </button>
        </div>

        {errorMsg && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-error-container/20 border border-error/20 rounded-xl">
            <MaterialIcon icon="error" className="text-error text-lg" />
            <p className="text-sm font-body text-error">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm border transition-all ${type === 'expense' ? 'bg-error/15 text-error border-error/30' : 'bg-surface-container text-on-surface-variant border-outline-variant/15 hover:border-error/20'}`}
            >
              Pengeluaran
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2.5 rounded-xl font-medium text-sm border transition-all ${type === 'income' ? 'bg-primary/15 text-primary border-primary/30' : 'bg-surface-container text-on-surface-variant border-outline-variant/15 hover:border-primary/20'}`}
            >
              Pemasukan
            </button>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant ml-1">Jumlah (Rp)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-surface-container-low border-0 rounded-xl py-3 px-4 text-on-surface font-body focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="50000"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant ml-1">Kategori</label>
            <select
              value={categoryKey}
              onChange={(e) => setCategoryKey(e.target.value)}
              className="w-full bg-surface-container-low border-0 rounded-xl py-3 px-4 text-on-surface font-body focus:ring-2 focus:ring-primary/30 transition-all"
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant ml-1">Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface-container-low border-0 rounded-xl py-3 px-4 text-on-surface font-body focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-on-surface-variant ml-1">Catatan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface-container-low border-0 rounded-xl py-3 px-4 text-on-surface font-body focus:ring-2 focus:ring-primary/30 transition-all"
              placeholder="Deskripsi transaksi"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-surface-container text-on-surface font-medium text-sm hover:bg-surface-container-highest transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:brightness-110 transition-all active:scale-95 flex justify-center items-center gap-2"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
              ) : (
                <>
                  <MaterialIcon icon="save" className="text-base" />
                  Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ===============================
   Single Transaction Row
   =============================== */
function TransactionItem({ tx, onEdit, onDelete }) {
  return (
    <div className="group flex items-center gap-4 p-4 bg-surface-container rounded-2xl hover:bg-surface-container-high transition-all border border-transparent hover:border-outline-variant/20 shadow-sm">
      {/* Icon */}
      <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${tx.iconBg} ${tx.iconColor}`}>
        <MaterialIcon icon={tx.icon} filled={tx.filled} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-on-surface truncate">{tx.name}</h3>
        <p className="text-xs text-on-surface-variant font-body">
          {tx.category} • {tx.time}
        </p>
      </div>

      {/* Amount + Hover Actions */}
      <div className="text-right flex flex-col items-end gap-2">
        <span className={`font-label font-bold ${tx.type === 'income' ? 'text-primary' : 'text-error'}`}>
          {tx.amountDisplay}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(tx)}
            className="p-1.5 rounded-lg bg-surface hover:bg-primary/10 text-on-surface-variant hover:text-primary transition-colors"
            title="Edit"
          >
            <MaterialIcon icon="edit" className="text-sm" />
          </button>
          <button
            onClick={() => onDelete(tx)}
            className="p-1.5 rounded-lg bg-surface hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors"
            title="Hapus"
          >
            <MaterialIcon icon="delete" className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===============================
   Main Page
   =============================== */
export default function TransactionsPage() {
  const { transactions, editTransaction, deleteTransaction } = useTransactions()
  const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  const now = new Date()
  const currentYear = now.getFullYear()
  const YEARS = Array.from({ length: 5 }, (_, i) => String(currentYear - 2 + i))

  const [activeChip, setActiveChip] = useState('all')
  const [month, setMonth] = useState(MONTHS[now.getMonth()])
  const [year, setYear] = useState(String(currentYear))
  const [search, setSearch] = useState('')

  // Modal/dialog state
  const [editingTx, setEditingTx] = useState(null)
  const [deletingTx, setDeletingTx] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (tx) => setEditingTx(tx)
  const handleDelete = (tx) => setDeletingTx(tx)

  const handleEditSave = async (txId, data) => {
    setIsSaving(true)
    try {
      await editTransaction(txId, data)
      setEditingTx(null)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingTx) return
    setIsDeleting(true)
    try {
      await deleteTransaction(deletingTx.id)
      setDeletingTx(null)
    } finally {
      setIsDeleting(false)
    }
  }

  // Group transactions by dateLabel
  const groups = useMemo(() => {
    let filtered = transactions
    if (activeChip === 'expense') filtered = filtered.filter((t) => t.type === 'expense')
    else if (activeChip === 'income') filtered = filtered.filter((t) => t.type === 'income')
    else if (activeChip === 'food') filtered = filtered.filter((t) => t.category === 'Makanan & Minuman')
    else if (activeChip === 'transport') filtered = filtered.filter((t) => t.category === 'Transportasi')

    // Hanya filter bulan/tahun jika user TIDAK sedang mencari
    if (!search.trim()) {
      const selectedMonthIdx = MONTHS.indexOf(month)
      if (selectedMonthIdx !== -1) {
        filtered = filtered.filter((t) => {
          const d = new Date(t.date)
          return d.getMonth() === selectedMonthIdx && d.getFullYear() === parseInt(year)
        })
      }
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q)
      )
    }

    const map = new Map()
    for (const tx of filtered) {
      if (!map.has(tx.dateLabel)) {
        map.set(tx.dateLabel, [])
      }
      map.get(tx.dateLabel).push(tx)
    }

    return Array.from(map.entries()).map(([dateLabel, items]) => {
      const incomeTotal = items.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
      const expenseTotal = items.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
      const net = incomeTotal - expenseTotal
      const sign = net >= 0 ? '+' : '-'
      const totalDisplay = `${sign} Rp ${Math.abs(net).toLocaleString('id-ID')}`
      const totalColor = net >= 0 ? 'text-primary' : 'text-error'

      return { dateLabel, items, totalDisplay, totalColor }
    })
  }, [transactions, activeChip, search, month, year])

  return (
    <DashboardLayout activePage="history">
      {/* Sticky Filter Bar */}
      <section className="sticky top-16 z-40 py-4 bg-surface/80 backdrop-blur-md -mx-6 px-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/15">
              <MaterialIcon icon="search" className="text-on-surface-variant text-sm" />
              <input
                className="bg-transparent border-none focus:ring-0 text-sm w-full font-body ml-2"
                placeholder="Cari transaksi..."
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Month Selector */}
          <select
            className="bg-surface-container border-none text-on-surface text-sm rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 font-body"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {MONTHS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>

          {/* Year Selector */}
          <select
            className="bg-surface-container border-none text-on-surface text-sm rounded-xl px-4 pr-10 py-2.5 focus:ring-2 focus:ring-primary/20 font-body"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {YEARS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>

          {/* Filter Button */}
          <button className="flex items-center gap-2 bg-surface-container-high px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-surface-container-highest transition-colors">
            <MaterialIcon icon="filter_list" className="text-lg" />
            <span>Filters</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {FILTER_CHIPS.map((chip) => (
            <button
              key={chip.key}
              onClick={() => setActiveChip(chip.key)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeChip === chip.key
                ? 'bg-primary-container/20 text-primary border-primary/30'
                : 'bg-surface-container text-on-surface-variant border-outline-variant/15 hover:border-primary/50'
                }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </section>

      {/* Transaction List */}
      <div className="space-y-8 mt-4 max-w-4xl">
        {groups.length === 0 && (
          <div className="text-center py-16 text-on-surface-variant">
            <MaterialIcon icon="receipt_long" className="text-5xl mb-4 opacity-30" />
            <p className="font-label">Tidak ada transaksi ditemukan</p>
          </div>
        )}
        {groups.map((group) => (
          <section key={group.dateLabel}>
            {/* Sticky Date Header */}
            <header className="sticky top-[148px] md:top-[124px] z-30 py-2 bg-surface/90 backdrop-blur-sm flex justify-between items-center mb-4">
              <h2 className="text-sm font-label font-bold text-on-surface uppercase tracking-widest">
                {group.dateLabel}
              </h2>
              <span className={`text-xs font-label ${group.totalColor}`}>
                {group.totalDisplay}
              </span>
            </header>

            {/* Transaction Items */}
            <div className="space-y-3">
              {group.items.map((tx) => (
                <TransactionItem key={tx.id} tx={tx} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ===== Edit Dialog ===== */}
      {editingTx && (
        <EditDialog
          tx={editingTx}
          onCancel={() => setEditingTx(null)}
          onSave={handleEditSave}
          isSaving={isSaving}
        />
      )}

      {/* ===== Delete Confirmation Dialog ===== */}
      {deletingTx && (
        <DeleteDialog
          tx={deletingTx}
          onCancel={() => setDeletingTx(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}

    </DashboardLayout>
  )
}
