import { Link } from 'react-router-dom'
import MaterialIcon from '../ui/MaterialIcon'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'grid_view', path: '/dashboard' },
  { key: 'history', label: 'History', icon: 'swap_horiz', path: '/transactions' },
  { key: 'add', label: 'Add', icon: 'add', path: '#', isCenter: true },
  { key: 'reports', label: 'Reports', icon: 'monitoring', path: '/reports' },
  { key: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
]

export default function BottomNavBar({ activePage = 'dashboard', onAddClick }) {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 md:hidden bg-surface-variant/60 backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.3)] rounded-t-3xl">
      {NAV_ITEMS.map((item) => {
        if (item.isCenter) {
          return (
            <div key={item.key} className="flex flex-col items-center justify-center -mt-8">
              <button onClick={onAddClick} className="bg-primary text-on-primary w-12 h-12 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 -mt-0 border-4 border-surface active:scale-95 transition-transform">
                <MaterialIcon icon={item.icon} />
              </button>
              <span className="text-[10px] font-medium font-body text-on-surface/50 mt-1">
                {item.label}
              </span>
            </div>
          )
        }

        const isActive = activePage === item.key
        return (
          <Link
            key={item.key}
            to={item.path}
            className={`flex flex-col items-center justify-center ${
              isActive ? 'text-primary scale-110' : 'text-on-surface/50 active:bg-surface-variant'
            }`}
          >
            <MaterialIcon icon={item.icon} />
            <span className="text-[10px] font-medium font-body">{item.label}</span>
          </Link>
        )
      })}
    </footer>
  )
}
