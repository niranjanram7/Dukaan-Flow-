import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Store, ShieldCheck, ArrowRight, Lock, Mail, User, Building, AlertCircle, Sparkles } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { ThemeToggle } from '../../components/common/ThemeToggle'

export const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (isRegister) {
        if (!fullName.trim() || !businessName.trim()) {
          throw new Error('Please provide both your name and business name.')
        }
        if (password.length < 8) {
          throw new Error('Password must be at least 8 characters long.')
        }
        await register(email, password, fullName, businessName)
      } else {
        await login(email, password)
      }
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    setError(null)
    setIsSubmitting(true)
    try {
      await login('demo@dukaanflow.in', 'password123')
      navigate(from, { replace: true })
    } catch {
      // If demo user wasn't registered yet, try registering demo user
      try {
        await register('demo@dukaanflow.in', 'password123', 'Ramesh Kumar (Demo)', 'Demo Kirana Store')
        navigate(from, { replace: true })
      } catch (regErr: any) {
        setError(regErr.message || 'Demo login failed.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--canvas-bg)] flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors duration-200">
      {/* Ambient Animated Gradient Orbs in Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-[15%] -left-[10%] w-[550px] h-[550px] rounded-full blur-[140px] opacity-25 dark:opacity-20 animate-float-glow"
          style={{ background: 'var(--primary)' }}
        />
        <div
          className="absolute top-[40%] -right-[15%] w-[600px] h-[600px] rounded-full blur-[160px] opacity-20 dark:opacity-25 animate-float-glow"
          style={{ background: 'var(--primary-glow)', animationDelay: '-6s' }}
        />
        <div
          className="absolute -bottom-[15%] left-[25%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-15 dark:opacity-20 animate-float-glow"
          style={{ background: 'var(--primary)', animationDelay: '-12s' }}
        />
      </div>

      {/* Grid Pattern Texture Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-30 dark:opacity-15"
        style={{
          backgroundImage: `radial-gradient(var(--card-border) 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top Navigation Bar with Theme Controls */}
      <div className="absolute top-5 right-6 z-20 flex items-center gap-2">
        <ThemeToggle showPalettePicker={true} />
      </div>

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[var(--card-bg)] text-[var(--primary)] mb-4 shadow-lg border border-[var(--card-border)] relative group">
          <div className="absolute inset-0 rounded-2xl bg-[var(--primary-light)] opacity-70 group-hover:opacity-100 transition-opacity" />
          <Store className="w-8 h-8 relative z-10 transition-transform group-hover:scale-110" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-main)] font-heading">
          DukaanFlow
        </h1>
        <p className="mt-2 text-sm text-[var(--text-muted)] max-w-xs mx-auto">
          Merchant Precision Cash Book & Working Capital Management
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[var(--card-bg)]/90 backdrop-blur-xl py-8 px-6 shadow-xl border border-[var(--card-border)] rounded-3xl sm:px-10 transition-all duration-200">
          {/* Tab Selector */}
          <div className="flex border-b border-[var(--card-border)] mb-6 p-1 bg-[var(--card-bg-subtle)] rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false)
                setError(null)
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                !isRegister
                  ? 'bg-[var(--card-bg)] text-[var(--primary)] shadow-xs font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true)
                setError(null)
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${
                isRegister
                  ? 'bg-[var(--card-bg)] text-[var(--primary)] shadow-xs font-bold'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              Register Store
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-red-700 dark:text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
                    Your Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
                    Dukaan / Business Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Sharma Provision Store"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all font-medium"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@store.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--text-main)] mb-1.5">
                Password {isRegister && <span className="font-normal text-[var(--text-muted)]">(min. 8 characters)</span>}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-md text-xs font-bold text-white transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              style={{ background: 'var(--primary-gradient)' }}
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? 'Create Store Account' : 'Sign In to DukaanFlow'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          <div className="mt-6 pt-6 border-t border-[var(--card-border)]">
            <p className="text-center text-xs text-[var(--text-muted)] mb-3 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>Explore instantly with sample Kirana records:</span>
            </p>
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-3.5 text-xs font-bold text-[var(--primary)] bg-[var(--primary-light)] hover:opacity-90 border border-[var(--primary-border)] rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Use Instant Demo Store (1-Click)</span>
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 text-center text-xs text-[var(--text-muted)] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[var(--primary)]" />
          <span>Tenant Isolated & Encrypted Sessions (JWT + Bcrypt)</span>
        </div>
      </div>
    </div>
  )
}
