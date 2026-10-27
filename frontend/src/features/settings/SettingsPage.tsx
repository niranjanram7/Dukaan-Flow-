import React, { useState, useEffect, useCallback } from 'react'
import {
  Shield,
  Store,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sun,
  Moon,
  Laptop,
  Palette,
  Sparkles,
  Grid,
  Square,
  Check,
  TrendingUp,
  Wallet
} from 'lucide-react'
import { formatPaiseToINR } from '../../lib/formatters'
import { apiFetch } from '../../lib/api'
import { useTheme, type ThemeMode, type ColorTheme, type BgPattern } from '../../context/ThemeContext'

interface SettingsData {
  store_name: string
  currency: string
  timezone: string
  opening_cash_paise: number
  cash_safety_buffer_paise: number
}

const colorThemes: Array<{
  id: ColorTheme
  name: string
  tagline: string
  previewHex: string
  badgeText: string
  gradient: string
}> = [
  {
    id: 'emerald',
    name: 'Emerald Growth',
    tagline: 'Classic Kirana & Merchant Trust',
    previewHex: '#10B981',
    badgeText: 'Kirana Default',
    gradient: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'sapphire',
    name: 'Ocean Sapphire',
    tagline: 'Modern Corporate Fintech & Banking',
    previewHex: '#2563EB',
    badgeText: 'Institutional',
    gradient: 'from-blue-500 to-indigo-700',
  },
  {
    id: 'amber',
    name: 'Sunset Amber',
    tagline: 'Warm Indian Spice & Merchant Brass',
    previewHex: '#D97706',
    badgeText: 'Warm Gold',
    gradient: 'from-amber-500 to-orange-700',
  },
  {
    id: 'violet',
    name: 'Cyber Violet',
    tagline: 'Neo-Commerce & High-Tech Velvet',
    previewHex: '#8B5CF6',
    badgeText: 'Neo Velvet',
    gradient: 'from-purple-500 to-violet-700',
  },
]

const backgroundPatterns: Array<{
  id: BgPattern
  name: string
  description: string
  icon: React.ElementType
}> = [
  {
    id: 'mesh',
    name: 'Aurora Mesh Glow',
    description: 'Dynamic ambient glowing blurs that give atmospheric depth',
    icon: Sparkles,
  },
  {
    id: 'grid',
    name: 'Dot Matrix Grid',
    description: 'Crisp technical blueprint dot pattern for precision focus',
    icon: Grid,
  },
  {
    id: 'minimal',
    name: 'Minimalist Clean',
    description: 'Pure, flat distraction-free canvas with zero ambient glow',
    icon: Square,
  },
]

export const SettingsPage: React.FC = () => {
  const { mode, setMode, theme, setTheme, bgPattern, setBgPattern, resolvedMode } = useTheme()

  const [storeName, setStoreName] = useState('Demo Kirana Store')
  const [bufferInr, setBufferInr] = useState('15000')
  const [currency, setCurrency] = useState('INR')
  const [timezone, setTimezone] = useState('Asia/Kolkata')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      const res = await apiFetch('/api/v1/settings')
      if (res.ok) {
        const data: SettingsData = await res.json()
        setStoreName(data.store_name)
        setBufferInr((data.cash_safety_buffer_paise / 100).toString())
        setCurrency(data.currency)
        setTimezone(data.timezone)
      }
    } catch (err) {
      console.error('Failed to load settings:', err)
      setError('Could not load current settings.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchSettings()
  }, [fetchSettings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const bufferNum = parseInt(bufferInr || '0', 10)
    if (isNaN(bufferNum) || bufferNum < 0) {
      setError('Please provide a valid non-negative buffer amount.')
      setSaving(false)
      return
    }

    try {
      const res = await apiFetch('/api/v1/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          store_name: storeName.trim() || 'Demo Kirana Store',
          cash_safety_buffer_paise: bufferNum * 100,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.error?.message || data?.detail || 'Failed to update settings')
      }

      const updated: SettingsData = await res.json()
      setStoreName(updated.store_name)
      setBufferInr((updated.cash_safety_buffer_paise / 100).toString())
      setSaved(true)
      window.dispatchEvent(
        new CustomEvent('dukaanflow:safety-buffer-updated', {
          detail: updated.cash_safety_buffer_paise,
        })
      )
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving settings.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--text-muted)]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span className="text-xs font-semibold">Loading settings…</span>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      {error && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/40 p-4 text-xs text-red-700 dark:text-red-400"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ========================================================
          1. APPEARANCE & THEMES
          ======================================================== */}
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-6 md:p-8 shadow-sm transition-all duration-200">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-[var(--card-border)]">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center border border-[var(--primary-border)] shadow-xs">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">Appearance & Themes</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Personalize your display mode, vibrant color accents, and ambient background patterns
            </p>
          </div>
        </div>

        {/* Display Mode Selection */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Color Scheme Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'light' as ThemeMode, name: 'Light Mode', desc: 'Crisp daytime clarity', icon: Sun },
              { id: 'dark' as ThemeMode, name: 'Dark Mode', desc: 'OLED midnight comfort', icon: Moon },
              { id: 'system' as ThemeMode, name: 'System Sync', desc: 'Matches device settings', icon: Laptop },
            ].map((item) => {
              const Icon = item.icon
              const isSelected = mode === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`flex items-start gap-3.5 p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] ring-2 ring-[var(--primary-glow)] shadow-xs'
                      : 'border-[var(--card-border)] bg-[var(--card-bg-subtle)] hover:border-[var(--card-border-hover)] hover:bg-[var(--card-bg-elevated)]'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-[var(--primary)] text-white shadow-xs'
                        : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-main)]">{item.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-[var(--primary)]" />}
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Color Palette Accents */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Accent Theme Palette
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {colorThemes.map((cTheme) => {
              const isSelected = theme === cTheme.id
              return (
                <button
                  key={cTheme.id}
                  type="button"
                  onClick={() => setTheme(cTheme.id)}
                  className={`group relative p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--card-bg)] ring-2 ring-[var(--primary-glow)] shadow-md'
                      : 'border-[var(--card-border)] bg-[var(--card-bg-subtle)] hover:border-[var(--card-border-hover)] hover:bg-[var(--card-bg-elevated)]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white/50 dark:ring-black/50"
                        style={{ backgroundColor: cTheme.previewHex }}
                      />
                      <span className="text-sm font-bold text-[var(--text-main)]">{cTheme.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isSelected
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--card-bg-elevated)] text-[var(--text-muted)] border border-[var(--card-border)]'
                      }`}
                    >
                      {cTheme.badgeText}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] mb-3">{cTheme.tagline}</p>

                  {/* Gradient strip indicator */}
                  <div
                    className="h-1.5 w-full rounded-full transition-opacity"
                    style={{
                      background: isSelected
                        ? 'var(--primary-gradient)'
                        : `linear-gradient(90deg, ${cTheme.previewHex}33, ${cTheme.previewHex}88)`,
                    }}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Background Ambience */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Background Atmosphere
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {backgroundPatterns.map((bg) => {
              const Icon = bg.icon
              const isSelected = bgPattern === bg.id
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => setBgPattern(bg.id)}
                  className={`flex flex-col p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[var(--primary)] bg-[var(--primary-light)] ring-2 ring-[var(--primary-glow)] shadow-xs'
                      : 'border-[var(--card-border)] bg-[var(--card-bg-subtle)] hover:border-[var(--card-border-hover)] hover:bg-[var(--card-bg-elevated)]'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-[var(--primary)] text-white'
                          : 'bg-[var(--card-bg)] text-[var(--text-muted)] border border-[var(--card-border)]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[var(--primary)]" />}
                  </div>
                  <span className="text-xs font-bold text-[var(--text-main)] mb-1">{bg.name}</span>
                  <span className="text-[11px] text-[var(--text-muted)] leading-relaxed">{bg.description}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Live Theme Preview Box */}
        <div className="p-4 sm:p-5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg-elevated)] relative overflow-hidden">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Interactive Live Preview ({resolvedMode} Mode • {theme} Theme)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Metric Preview */}
            <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
                <span>Available Cash</span>
                <Wallet className="w-3.5 h-3.5 text-[var(--primary)]" />
              </div>
              <div className="text-lg font-bold text-[var(--text-main)] tabular-nums">₹4,82,500</div>
              <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-[var(--primary)]">
                <TrendingUp className="w-3 h-3" />
                <span>+12.4% vs last week</span>
              </div>
            </div>

            {/* Status Pills Preview */}
            <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex flex-col justify-between">
              <div className="text-xs text-[var(--text-muted)] mb-2">Dynamic Badges</div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)]">
                  Active Shop
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40">
                  Buffer Safe
                </span>
              </div>
            </div>

            {/* Action Button Preview */}
            <div className="p-3.5 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xs flex flex-col justify-between">
              <div className="text-xs text-[var(--text-muted)] mb-2">Theme CTA Button</div>
              <button
                type="button"
                className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white transition-transform active:scale-95 shadow-sm"
                style={{ background: 'var(--primary-gradient)' }}
              >
                Sample Action
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. CASH SAFETY BUFFER
          ======================================================== */}
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-6 md:p-8 shadow-sm transition-all duration-200">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-[var(--card-border)]">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-[#E9A23B] flex items-center justify-center border border-amber-200 dark:border-amber-800/40 shadow-xs">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">Cash Liquidity Safety Buffer</h3>
            <p className="text-xs text-[var(--text-muted)]">
              Minimum liquid reserve threshold before automatic liquidity shortage alerts trigger
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
              Store / Business Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="max-w-md w-full px-3.5 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-bold text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all"
              placeholder="e.g. Sharma Kirana Store"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
              Safety Buffer Threshold (₹ INR)
            </label>
            <div className="relative max-w-xs">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--text-muted)]">
                ₹
              </span>
              <input
                type="number"
                min="0"
                step="1"
                value={bufferInr}
                onChange={(e) => setBufferInr(e.target.value)}
                disabled={loading || saving}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-xs font-bold tabular-nums text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all"
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
              Current safety reserve:{' '}
              <strong className="text-[var(--text-main)] tabular-nums">
                {formatPaiseToINR(parseInt(bufferInr || '0', 10) * 100)}
              </strong>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2 cursor-pointer"
              style={{ background: 'var(--primary-gradient)' }}
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Save Store Settings
            </button>
            {saved && (
              <span className="text-xs font-semibold text-[var(--primary)] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Settings saved successfully!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* ========================================================
          3. STORE PARAMETERS & LOCALIZATION
          ======================================================== */}
      <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--card-border)] p-6 md:p-8 shadow-sm transition-all duration-200">
        <div className="flex items-center gap-3 pb-5 mb-6 border-b border-[var(--card-border)]">
          <div className="w-10 h-10 rounded-xl bg-[var(--card-bg-elevated)] text-[var(--text-muted)] flex items-center justify-center border border-[var(--card-border)] shadow-xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[var(--text-main)]">Store Parameters & Localization</h3>
            <p className="text-xs text-[var(--text-muted)]">Verified merchant account specifications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg-subtle)]">
            <span className="text-[var(--text-muted)] block mb-1">Registered Business</span>
            <span className="font-bold text-[var(--text-main)] text-sm">{storeName}</span>
          </div>
          <div className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg-subtle)]">
            <span className="text-[var(--text-muted)] block mb-1">Base Currency</span>
            <span className="font-bold text-[var(--text-main)] text-sm">{currency} (₹ Indian Rupee)</span>
          </div>
          <div className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg-subtle)]">
            <span className="text-[var(--text-muted)] block mb-1">Fiscal Timezone</span>
            <span className="font-bold text-[var(--text-main)] text-sm">{timezone} (IST)</span>
          </div>
          <div className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg-subtle)]">
            <span className="text-[var(--text-muted)] block mb-1">Ledger Precision Engine</span>
            <span className="font-bold text-[var(--text-main)] text-sm">Deterministic Integer Paise (Zero Math Errors)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
