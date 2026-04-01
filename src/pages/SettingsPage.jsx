import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layouts/DashboardLayout'
import MaterialIcon from '../components/ui/MaterialIcon'
import { authClient } from '../lib/authClient'
import { useTransactions } from '../context/TransactionContext'
import axios from 'axios'

/* ===============================
   Import Confirmation Dialog
   =============================== */
function ImportDialog({ fileName, count, onCancel, onConfirm, isImporting }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={onCancel}>
      <div className="bg-surface-container-high rounded-2xl p-8 max-w-sm w-full mx-6 shadow-2xl border border-outline-variant/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-tertiary/20 flex items-center justify-center">
            <MaterialIcon icon="upload_file" className="text-tertiary text-3xl" />
          </div>
        </div>
        <h3 className="text-xl font-headline font-bold text-on-surface text-center mb-2">Import Data?</h3>
        <p className="text-sm text-on-surface-variant text-center mb-2 font-body">
          File: <strong className="text-on-surface">{fileName}</strong>
        </p>
        <p className="text-sm text-on-surface-variant text-center mb-8 font-body">
          Ditemukan <strong className="text-primary">{count} transaksi</strong> siap diimpor. Data yang sudah ada tidak akan terhapus.
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
            disabled={isImporting}
            className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:brightness-110 transition-all active:scale-95 flex justify-center items-center gap-2"
          >
            {isImporting ? (
              <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
            ) : (
              <>
                <MaterialIcon icon="upload" className="text-base" />
                Import
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ===============================
   Delete All Confirmation Dialog
   =============================== */
function DeleteAllDialog({ onCancel, onConfirm, isDeleting }) {
  const [confirmText, setConfirmText] = useState('')

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in-up" onClick={onCancel}>
      <div className="bg-surface-container-high rounded-2xl p-8 max-w-sm w-full mx-6 shadow-2xl border border-outline-variant/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-error-container/20 flex items-center justify-center">
            <MaterialIcon icon="delete_forever" className="text-error text-3xl" />
          </div>
        </div>
        <h3 className="text-xl font-headline font-bold text-on-surface text-center mb-2">Hapus Semua Data?</h3>
        <p className="text-sm text-on-surface-variant text-center mb-6 font-body">
          Semua transaksi akan dihapus secara permanen. Ketik <strong className="text-error">HAPUS</strong> untuk konfirmasi.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder='Ketik "HAPUS"'
          className="w-full bg-surface-container-low border-0 rounded-xl py-3 px-4 text-on-surface font-body text-center focus:ring-2 focus:ring-error/30 transition-all mb-6"
        />
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-surface-container text-on-surface font-medium text-sm hover:bg-surface-container-highest transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting || confirmText !== 'HAPUS'}
            className={`flex-1 py-3 rounded-xl bg-error text-on-error font-bold text-sm transition-all active:scale-95 flex justify-center items-center gap-2 ${confirmText !== 'HAPUS' ? 'opacity-40 cursor-not-allowed' : 'hover:brightness-110'}`}
          >
            {isDeleting ? (
              <span className="w-4 h-4 border-2 border-on-error/30 border-t-on-error rounded-full animate-spin" />
            ) : (
              <>
                <MaterialIcon icon="delete_forever" className="text-base" />
                Hapus Semua
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [theme, setTheme] = useState('dark')
  const navigate = useNavigate()
  const { data: session } = authClient.useSession()
  const { transactions, addTransaction, deleteTransaction, refreshTransactions } = useTransactions()
  const fileInputRef = useRef(null)

  // Import state
  const [importData, setImportData] = useState(null)
  const [importFileName, setImportFileName] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  // Delete all state
  const [showDeleteAll, setShowDeleteAll] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  // Toast
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const userName = session?.user?.name || 'User'
  const userEmail = session?.user?.email || ''
  const initials = userName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  /* ---- Export JSON ---- */
  const handleExport = () => {
    if (transactions.length === 0) {
      showToast('Tidak ada transaksi untuk di-export.', 'error')
      return
    }

    const exportPayload = {
      exportedAt: new Date().toISOString(),
      app: 'Kelola Keuanganmu',
      user: userName,
      totalTransactions: transactions.length,
      transactions: transactions.map((tx) => ({
        type: tx.type,
        amount: tx.amount,
        categoryKey: tx.categoryKey,
        date: tx.rawDate || tx.date,
        notes: tx.name,
      }))
    }

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `keuangan_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    showToast(`${transactions.length} transaksi berhasil di-export!`)
  }

  /* ---- Import JSON ---- */
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result)
        const txList = json.transactions
        if (!Array.isArray(txList) || txList.length === 0) {
          showToast('File JSON tidak berisi data transaksi yang valid.', 'error')
          return
        }

        setImportData(txList)
        setImportFileName(file.name)
      } catch (err) {
        showToast('File bukan JSON yang valid.', 'error')
      }
    }
    reader.readAsText(file)

    // Reset input agar bisa memilih file yang sama lagi
    e.target.value = ''
  }

  const handleImportConfirm = async () => {
    if (!importData) return
    setIsImporting(true)

    let successCount = 0
    for (const tx of importData) {
      try {
        await addTransaction({
          type: tx.type,
          amount: tx.amount,
          categoryKey: tx.categoryKey,
          date: tx.date,
          notes: tx.notes,
        })
        successCount++
      } catch (err) {
        console.error('Failed to import tx:', err)
      }
    }

    setIsImporting(false)
    setImportData(null)
    showToast(`${successCount} dari ${importData.length} transaksi berhasil di-import!`)
  }

  /* ---- Delete All ---- */
  const handleDeleteAllConfirm = async () => {
    setIsDeletingAll(true)
    let deleted = 0

    for (const tx of transactions) {
      try {
        await deleteTransaction(tx.id)
        deleted++
      } catch (err) {
        console.error('Failed to delete tx:', err)
      }
    }

    setIsDeletingAll(false)
    setShowDeleteAll(false)
    showToast(`${deleted} transaksi berhasil dihapus.`)
  }

  return (
    <DashboardLayout activePage="settings">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl font-extrabold font-headline tracking-tight text-on-surface">
          Configuration
        </h2>
        <p className="text-on-surface-variant font-body">
          Manage your treasury preferences and data integrity.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ===== Profile Card ===== */}
        <section className="lg:col-span-12 flex items-center p-8 bg-surface-container rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <div className="relative flex flex-col md:flex-row items-center gap-8 w-full">
            <div className="w-24 h-24 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container text-3xl font-bold font-headline shadow-inner">
              {initials}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold font-headline text-on-surface">{userName}</h3>
              <p className="text-on-surface-variant font-body">{userEmail}</p>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="px-6 py-2.5 bg-surface-container-highest text-on-surface rounded-lg font-medium hover:bg-surface-bright transition-all flex items-center gap-2 border border-outline-variant/20"
            >
              <MaterialIcon icon="edit" className="text-xl" />
              Edit Profile
            </button>
          </div>
        </section>

        {/* ===== Preferences Section ===== */}
        <section className="lg:col-span-7 bg-surface-container rounded-xl p-8 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-primary">
              <MaterialIcon icon="tune" />
            </div>
            <h3 className="text-xl font-bold font-headline">Preferences</h3>
          </div>

          <div className="space-y-6">
            {/* Currency */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-on-surface">Primary Currency</span>
                <span className="text-xs text-on-surface-variant">Used for all financial calculations</span>
              </div>
              <div className="flex items-center gap-2 bg-surface-container-highest px-3 py-1.5 rounded-lg border border-outline-variant/10">
                <span className="font-label font-bold text-primary">IDR</span>
                <MaterialIcon icon="expand_more" className="text-sm text-on-surface-variant" />
              </div>
            </div>

            {/* Display Mode */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-on-surface">Display Mode</span>
                <span className="text-xs text-on-surface-variant">Current theme: Dark Kinetic</span>
              </div>
              <div className="flex bg-surface-container-highest p-1 rounded-full border border-outline-variant/20">
                <button
                  onClick={() => setTheme('light')}
                  className={`p-2 rounded-full transition-all ${theme === 'light'
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                      : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                >
                  <MaterialIcon icon="light_mode" className="text-xl" />
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`p-2 rounded-full transition-all ${theme === 'dark'
                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                      : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                >
                  <MaterialIcon icon="dark_mode" filled className="text-xl" />
                </button>
              </div>
            </div>

            {/* Reset Balance */}
            <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg hover:bg-surface-container-high transition-colors">
              <div className="flex flex-col gap-0.5">
                <span className="font-medium text-on-surface">Reset Balance</span>
                <span className="text-xs text-on-surface-variant">Zero out all account totals</span>
              </div>
              <button className="px-4 py-2 text-primary font-medium hover:bg-primary/10 rounded-lg transition-colors">
                Reset Now
              </button>
            </div>
          </div>
        </section>

        {/* ===== Data Vault Section ===== */}
        <section className="lg:col-span-5 bg-surface-container rounded-xl p-8 flex flex-col gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-tertiary/10 rounded-lg text-tertiary">
              <MaterialIcon icon="database" />
            </div>
            <h3 className="text-xl font-bold font-headline">Data Vault</h3>
          </div>

          <div className="flex flex-col gap-4">
            {/* Export */}
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high transition-all rounded-lg border border-outline-variant/5"
            >
              <div className="flex items-center gap-3">
                <MaterialIcon icon="download" className="text-tertiary" />
                <div className="text-left">
                  <span className="font-medium block">Export JSON</span>
                  <span className="text-[10px] text-on-surface-variant">{transactions.length} transaksi</span>
                </div>
              </div>
              <MaterialIcon icon="chevron_right" className="text-on-surface-variant" />
            </button>

            {/* Import */}
            <button
              onClick={handleImportClick}
              className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container-high transition-all rounded-lg border border-outline-variant/5"
            >
              <div className="flex items-center gap-3">
                <MaterialIcon icon="upload" className="text-tertiary" />
                <span className="font-medium">Import JSON</span>
              </div>
              <MaterialIcon icon="chevron_right" className="text-on-surface-variant" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Delete All */}
            <div className="mt-4 pt-6 border-t-2 border-surface-container-highest">
              <button
                onClick={() => setShowDeleteAll(true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-error-container/20 text-error hover:bg-error-container/30 transition-all rounded-lg border border-error/20 font-bold uppercase tracking-wider text-sm font-label"
              >
                <MaterialIcon icon="delete_forever" />
                Delete All Data
              </button>
              <p className="text-[10px] text-center mt-3 text-on-surface-variant uppercase tracking-widest">
                This action cannot be undone
              </p>
            </div>
          </div>
        </section>

        {/* ===== Logout Section ===== */}
        <section className="lg:col-span-12 flex flex-col md:flex-row items-center justify-between p-10 bg-surface-container-lowest rounded-xl border border-outline-variant/10 mt-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="flex flex-col gap-2 relative z-10">
            <h3 className="text-2xl font-bold font-headline">Finish your session?</h3>
            <p className="text-on-surface-variant font-body">
              Your data is always encrypted and synced across your devices.
            </p>
          </div>
          <button
            onClick={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.href = '/login';
                  }
                }
              });
            }}
            className="mt-6 md:mt-0 relative z-10 px-12 py-4 bg-gradient-to-r from-error-container to-[#690005] hover:from-[#93000a] hover:to-error-container text-on-error-container rounded-xl font-bold font-headline text-lg shadow-xl shadow-error/10 transition-all active:scale-95 duration-100 flex items-center gap-3"
          >
            <MaterialIcon icon="logout" />
            Keluar
          </button>
        </section>
      </div>

      {/* ===== Toast Notification ===== */}
      {toast && (
        <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up ${toast.type === 'error' ? 'bg-error-container text-on-error-container' : 'bg-primary text-on-primary'}`}>
          <MaterialIcon icon={toast.type === 'error' ? 'error' : 'check_circle'} className="text-xl" />
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* ===== Import Dialog ===== */}
      {importData && (
        <ImportDialog
          fileName={importFileName}
          count={importData.length}
          onCancel={() => setImportData(null)}
          onConfirm={handleImportConfirm}
          isImporting={isImporting}
        />
      )}

      {/* ===== Delete All Dialog ===== */}
      {showDeleteAll && (
        <DeleteAllDialog
          onCancel={() => setShowDeleteAll(false)}
          onConfirm={handleDeleteAllConfirm}
          isDeleting={isDeletingAll}
        />
      )}
    </DashboardLayout>
  )
}
