import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Building2,
  ArrowLeftRight,
  LineChart,
  SlidersHorizontal,
  Settings,
  Store,
  ShieldCheck,
  ClipboardList,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface NavItem {
  name: string
  to: string
  icon: React.ElementType
}

const navItems: NavItem[] = [
  { name: 'Overview', to: '/', icon: LayoutDashboard },
  { name: 'Customers / Khata', to: '/customers', icon: Users },
  { name: 'Suppliers', to: '/suppliers', icon: Building2 },
  { name: 'Transactions', to: '/transactions', icon: ArrowLeftRight },
  { name: 'Cash Flow', to: '/cash-flow', icon: LineChart },
  { name: 'What-If Simulator', to: '/simulator', icon: SlidersHorizontal },
  { name: 'Business Management', to: '/management', icon: ClipboardList },
  { name: 'Import Expenses', to: '/imports', icon: ClipboardList },
  { name: 'Settings', to: '/settings', icon: Settings },
]

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth()

  const displayName = user?.business_name || 'Demo Kirana Store'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'DF'

  return (
    <aside className="hidden md:flex flex-col w-[240px] shrink-0 bg-[var(--card-bg)] border-r border-[var(--card-border)] min-h-screen z-20 transition-colors duration-200">
      {/* Brand Header */}
      <div className="h-[72px] px-6 flex items-center gap-3 border-b border-[var(--card-border)]">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] border border-[var(--primary-border)] flex items-center justify-center text-[var(--primary)] shadow-xs">
          <Store className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-[var(--text-main)] leading-none tracking-tight">DukaanFlow</h1>
          <p className="text-[11px] text-[var(--text-muted)] font-medium mt-1">Merchant Precision</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold shadow-xs border-l-3 border-[var(--primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--card-bg-elevated)]'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Merchant / Business Badge */}
      <div className="p-4 border-t border-[var(--card-border)] bg-[var(--card-bg-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[var(--text-main)] truncate">{displayName}</p>
            <div className="flex items-center gap-1 text-[10px] text-[var(--primary)] font-medium mt-0.5">
              <ShieldCheck className="w-3 h-3" />
              <span className="truncate">{user?.full_name || 'Verified Store (INR)'}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={logout}
          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-[var(--card-bg)] border border-red-200 dark:border-red-900/40 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer shadow-xs"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
