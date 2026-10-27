import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, LineChart, SlidersHorizontal, Settings } from 'lucide-react'

export const BottomNav: React.FC = () => {
  const items = [
    { name: 'Overview', to: '/', icon: LayoutDashboard },
    { name: 'Khata', to: '/customers', icon: Users },
    { name: 'Cash Flow', to: '/cash-flow', icon: LineChart },
    { name: 'Simulator', to: '/simulator', icon: SlidersHorizontal },
    { name: 'Settings', to: '/settings', icon: Settings },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[var(--card-bg)]/95 backdrop-blur-lg border-t border-[var(--card-border)] flex items-center justify-around px-2 z-30 transition-colors">
      {items.map((item) => {
        const Icon = item.icon
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 text-[11px] font-medium transition-colors ${
                isActive ? 'text-[var(--primary)] font-bold' : 'text-[var(--text-muted)]'
              }`
            }
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span>{item.name}</span>
          </NavLink>
        )
      })}
    </nav>
  )
}
