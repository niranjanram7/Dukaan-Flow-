import React, { useState, useRef, useEffect } from 'react'
import { Sun, Moon, Palette, Check } from 'lucide-react'
import { useTheme, type ColorTheme } from '../../context/ThemeContext'

interface ThemeToggleProps {
  showPalettePicker?: boolean
  className?: string
}

const themeOptions: Array<{ id: ColorTheme; name: string; color: string; ring: string }> = [
  { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500', ring: 'ring-emerald-400' },
  { id: 'sapphire', name: 'Sapphire', color: 'bg-blue-600', ring: 'ring-blue-400' },
  { id: 'amber', name: 'Amber', color: 'bg-amber-500', ring: 'ring-amber-400' },
  { id: 'violet', name: 'Violet', color: 'bg-purple-600', ring: 'ring-purple-400' },
]

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ showPalettePicker = true, className = '' }) => {
  const { resolvedMode, toggleMode, theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`relative flex items-center gap-1.5 ${className}`} ref={dropdownRef}>
      {/* Quick Dark/Light Toggle */}
      <button
        type="button"
        onClick={toggleMode}
        title={`Switch to ${resolvedMode === 'dark' ? 'Light' : 'Dark'} mode`}
        className="p-2 rounded-xl transition-all duration-200 border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-elevated)] text-[var(--text-main)] shadow-xs hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
      >
        {resolvedMode === 'dark' ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
        ) : (
          <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
        )}
      </button>

      {/* Palette Dropdown Toggle */}
      {showPalettePicker && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            title="Change Accent Theme"
            className="p-2 rounded-xl transition-all duration-200 border border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-bg-elevated)] text-[var(--text-main)] shadow-xs hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <Palette className="w-4 h-4 text-[var(--primary)]" />
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 py-2 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--card-border)] mb-1">
                Accent Themes
              </div>
              <div className="p-1 space-y-0.5">
                {themeOptions.map((opt) => {
                  const isSelected = theme === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        setTheme(opt.id)
                        setIsOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[var(--primary-light)] text-[var(--primary)] font-bold'
                          : 'text-[var(--text-main)] hover:bg-[var(--card-bg-elevated)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`w-3.5 h-3.5 rounded-full ${opt.color} shadow-xs`} />
                        <span>{opt.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[var(--primary)]" />}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
