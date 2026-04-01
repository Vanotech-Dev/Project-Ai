import { useState } from 'react'
import TopNavBar from '../navigation/TopNavBar'
import SideNavBar from '../navigation/SideNavBar'
import BottomNavBar from '../navigation/BottomNavBar'
import AddTransactionModal from '../modals/AddTransactionModal'

/**
 * DashboardLayout - Main app layout with top nav, side nav, and bottom nav
 * Used for all authenticated/internal pages (Dashboard, Transactions, Reports, etc.)
 */
export default function DashboardLayout({ children, activePage = 'dashboard' }) {
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen">
      <TopNavBar activePage={activePage} />
      <SideNavBar activePage={activePage} />

      <main className="md:ml-64 pt-24 pb-32 px-6 min-h-screen">
        <div className="max-w-7xl mx-auto space-y-10">
          {children}
        </div>
      </main>

      <BottomNavBar activePage={activePage} onAddClick={() => setShowAddModal(true)} />

      {/* Desktop FAB */}
      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-primary text-on-primary rounded-full items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 active:scale-95 transition-all hidden md:flex"
      >
        <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
        <span className="material-symbols-outlined text-2xl relative z-10">add</span>
      </button>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  )
}
