import React, { useEffect, useState } from 'react'
import { Shield } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { formatPaiseToINR } from '../../lib/formatters'
import { ThemeToggle } from '../common/ThemeToggle'

interface HeaderProps {
  title: string
  subtitle?: string
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const [bufferPaise, setBufferPaise] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    const handleBufferUpdate = (event: Event) => {
      const value = (event as CustomEvent<number>).detail
      if (Number.isInteger(value)) setBufferPaise(value)
    }
    window.addEventListener('dukaanflow:safety-buffer-updated', handleBufferUpdate)
    apiFetch('/api/v1/settings')
      .then(async (response) => {
        if (!response.ok) return
        const data = await response.json()
        if (active && Number.isInteger(data.cash_safety_buffer_paise)) {
          setBufferPaise(data.cash_safety_buffer_paise)
        }
      })
      .catch((error) => console.error('Could not load safety buffer:', error))
    return () => {
      active = false
      window.removeEventListener('dukaanflow:safety-buffer-updated', handleBufferUpdate)
    }
  }, [])

  return (
    <header className="h-[72px] bg-[var(--card-bg)]/80 backdrop-blur-md border-b border-[var(--card-border)] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-200">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-main)] tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-[var(--text-muted)] font-normal">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Safety buffer pill */}
        <Link
          to="/settings"
          title="Configure cash safety buffer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FEF6EB] dark:bg-amber-950/40 text-[#E9A23B] dark:text-amber-400 border border-[#FCD34D] dark:border-amber-700/50 text-xs font-semibold hover:bg-[#FFF0D6] dark:hover:bg-amber-900/50 transition-colors"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Buffer: {bufferPaise === null ? '…' : formatPaiseToINR(bufferPaise)}</span>
        </Link>

        {/* Demo data badge */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--card-bg-elevated)] text-[var(--text-muted)] text-xs font-medium border border-[var(--card-border)]">
          <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary-glow)]"></span>
          Sample Data
        </div>

        {/* Theme and Mode Switcher */}
        <ThemeToggle showPalettePicker={true} />
      </div>
    </header>
  )
}
