import { Link } from 'react-router-dom'
import MaterialIcon from '../ui/MaterialIcon'
import { authClient } from '../../lib/authClient'

const MAIN_LINKS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { key: 'history', label: 'Transactions', icon: 'receipt_long', path: '/transactions' },
  { key: 'reports', label: 'Reports', icon: 'analytics', path: '/reports' },
]

const BOTTOM_LINKS = [
  { key: 'settings', label: 'Account', icon: 'account_circle', path: '/settings' },
]

export default function SideNavBar({ activePage = 'dashboard' }) {

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 p-4 bg-surface-container-low pt-20 z-40">
      {/* Brand */}
      <div className="mb-8 px-2">
        <h1 className="text-lg font-black text-primary font-headline">Kelola Keuanganmu</h1>
        <p className="text-xs text-on-surface/60 font-label">Premium Treasury</p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2 flex-1">
        {MAIN_LINKS.map((link) => (
          <Link
            key={link.key}
            to={link.path}
            className={
              activePage === link.key
                ? 'flex items-center gap-3 px-4 py-3 text-primary font-bold bg-surface-variant rounded-lg transition-colors duration-200'
                : 'flex items-center gap-3 px-4 py-3 text-on-surface/60 hover:text-primary hover:bg-surface-container transition-colors duration-200'
            }
          >
            <MaterialIcon icon={link.icon} />
            <span className="font-label">{link.label}</span>
          </Link>
        ))}

        {/* Bottom section */}
        <div className="mt-auto flex flex-col gap-2">
          {BOTTOM_LINKS.map((link) => (
            <Link
              key={link.key}
              to={link.path}
              className={
                activePage === link.key
                  ? 'flex items-center gap-3 px-4 py-3 text-primary font-bold bg-surface-variant rounded-lg transition-colors duration-200'
                  : 'flex items-center gap-3 px-4 py-3 text-on-surface/60 hover:text-primary hover:bg-surface-container transition-colors duration-200'
              }
            >
              <MaterialIcon icon={link.icon} />
              <span className="font-label">{link.label}</span>
            </Link>
          ))}
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
            className="flex items-center gap-3 px-4 py-3 text-error/70 hover:text-error hover:bg-surface-container transition-colors duration-200 w-full text-left"
          >
            <MaterialIcon icon="logout" />
            <span className="font-label">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}
