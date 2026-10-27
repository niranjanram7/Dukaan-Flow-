import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { BottomNav } from './BottomNav'
import { useTheme } from '../../context/ThemeContext'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard Overview', subtitle: 'Live cash position, receivables, and payables summary' },
  '/customers': { title: 'Customers & Udhaar Khata', subtitle: 'Track customer credit sales, dues, and repayments' },
  '/suppliers': { title: 'Supplier Bills & Payables', subtitle: 'Manage distributor invoices, payment dates, and settlements' },
  '/transactions': { title: 'Transactions & Expenses', subtitle: 'Consolidated cash movements and categorized shop expenses' },
  '/cash-flow': { title: '14-Day Cash-Flow Forecast', subtitle: 'Deterministic projected liquidity and safety buffer alerts' },
  '/simulator': { title: 'What-If Cash Simulator', subtitle: 'Test hypothetical collections and bill shifts without altering actual records' },
  '/settings': { title: 'Store Settings', subtitle: 'Safety buffer configuration, appearance, and themes' },
  '/management': { title: 'Business Management', subtitle: 'Repayment schedules, budgets, reports, and in-app reminders' },
  '/imports': { title: 'Import Expenses', subtitle: 'Validate a CSV preview and confirm before adding cashbook records' },
}

export const AppShell: React.FC = () => {
  const location = useLocation()
  const { bgPattern, resolvedMode } = useTheme()
  const currentMeta = pageTitles[location.pathname] || { title: 'DukaanFlow', subtitle: 'Merchant Flow Precision' }

  return (
    <div className="min-h-screen flex bg-[var(--canvas-bg)] text-[var(--text-main)] transition-colors duration-200 relative overflow-x-hidden">
      {/* Background Ambience / Mesh Effects */}
      {bgPattern === 'mesh' && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {/* Top Right Ambient Glow */}
          <div
            className="absolute -top-[15%] -right-[10%] w-[600px] h-[600px] rounded-full blur-[140px] opacity-20 dark:opacity-25 animate-float-glow"
            style={{ background: 'var(--primary)' }}
          />
          {/* Bottom Left Accent Glow */}
          <div
            className="absolute top-[40%] -left-[15%] w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 dark:opacity-20 animate-float-glow"
            style={{
              background:
                resolvedMode === 'dark' ? 'var(--accent-secondary)' : 'var(--primary-glow)',
              animationDelay: '-5s',
            }}
          />
          {/* Subtle Bottom Wash */}
          <div
            className="absolute -bottom-[20%] right-[20%] w-[550px] h-[550px] rounded-full blur-[180px] opacity-10 dark:opacity-15 animate-float-glow"
            style={{ background: 'var(--primary)', animationDelay: '-10s' }}
          />
        </div>
      )}

      {bgPattern === 'grid' && (
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(var(--card-border) 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
          }}
        />
      )}

      {/* Desktop Sidebar (240px) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8 relative z-10">
        <Header title={currentMeta.title} subtitle={currentMeta.subtitle} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav (64px) */}
      <BottomNav />
    </div>
  )
}
