import DashboardLayout from '../components/layouts/DashboardLayout'
import BudgetAlertBanner from '../components/dashboard/BudgetAlertBanner'
import SummaryCards from '../components/dashboard/SummaryCards'
import SpendingChart from '../components/dashboard/SpendingChart'
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown'
import RecentTransactions from '../components/dashboard/RecentTransactions'

export default function DashboardPage() {
  return (
    <DashboardLayout activePage="dashboard">
      <BudgetAlertBanner />
      <SummaryCards />

      {/* Charts Bento Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <SpendingChart />
        <CategoryBreakdown />
      </section>

      <RecentTransactions />
    </DashboardLayout>
  )
}
