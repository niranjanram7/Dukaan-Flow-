import React, { createContext, useContext, useState, useEffect } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ColorTheme = 'emerald' | 'sapphire' | 'amber' | 'violet'
export type BgPattern = 'mesh' | 'grid' | 'minimal'

interface ThemeContextType {
  mode: ThemeMode
  resolvedMode: 'light' | 'dark'
  theme: ColorTheme
  bgPattern: BgPattern
  setMode: (mode: ThemeMode) => void
  setTheme: (theme: ColorTheme) => void
  setBgPattern: (pattern: BgPattern) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY_MODE = 'dukaanflow_theme_mode'
const STORAGE_KEY_THEME = 'dukaanflow_color_theme'
const STORAGE_KEY_BG = 'dukaanflow_bg_pattern'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MODE)
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
    return 'light'
  })

  const [theme, setThemeState] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME)
    if (saved === 'emerald' || saved === 'sapphire' || saved === 'amber' || saved === 'violet') {
      return saved
    }
    return 'emerald'
  })

  const [bgPattern, setBgPatternState] = useState<BgPattern>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BG)
    if (saved === 'mesh' || saved === 'grid' || saved === 'minimal') return saved
    return 'mesh'
  })

  const [resolvedMode, setResolvedMode] = useState<'light' | 'dark'>('light')

  // Resolve system preference vs explicit mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const updateResolved = () => {
      if (mode === 'system') {
        setResolvedMode(mediaQuery.matches ? 'dark' : 'light')
      } else {
        setResolvedMode(mode)
      }
    }

    updateResolved()
    mediaQuery.addEventListener('change', updateResolved)
    return () => mediaQuery.removeEventListener('change', updateResolved)
  }, [mode])

  // Apply classes and data attributes to <html>
  useEffect(() => {
    const root = document.documentElement

    // Toggle .dark class
    if (resolvedMode === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }

    root.setAttribute('data-mode', resolvedMode)
    root.setAttribute('data-theme', theme)
    root.setAttribute('data-bg', bgPattern)
  }, [resolvedMode, theme, bgPattern])

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode)
    localStorage.setItem(STORAGE_KEY_MODE, newMode)
  }

  const setTheme = (newTheme: ColorTheme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY_THEME, newTheme)
  }

  const setBgPattern = (newPattern: BgPattern) => {
    setBgPatternState(newPattern)
    localStorage.setItem(STORAGE_KEY_BG, newPattern)
  }

  const toggleMode = () => {
    setMode(resolvedMode === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedMode,
        theme,
        bgPattern,
        setMode,
        setTheme,
        setBgPattern,
        toggleMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
