import { Link } from 'react-router-dom'
import MaterialIcon from '../ui/MaterialIcon'

const NAV_LINKS = [
  { key: 'dashboard', label: 'Dashboard', path: '/dashboard' },
  { key: 'history', label: 'Transactions', path: '/transactions' },
  { key: 'reports', label: 'Reports', path: '/reports' },
]

export default function TopNavBar({ activePage = 'dashboard' }) {
  return (
    <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-variant/60 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-on-surface tracking-tight font-headline">
          Kelola Keuanganmu
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className={
                activePage === link.key
                  ? 'text-primary border-b-2 border-primary pb-1 font-label'
                  : 'text-on-surface/70 hover:bg-surface-variant hover:text-primary transition-all px-2 py-1 rounded'
              }
            >
              {link.label}
            </Link>
          ))}
        </div>

      </div>
    </header>
  )
}
