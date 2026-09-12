import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Smartphone, Eye, EyeOff, KeyRound, Sparkles } from 'lucide-react'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { cx } from '../../lib/utils'

export default function Login() {
  const { signInWithEmail, sendPhoneOtp, verifyOtp, loginAsDemoStudent, isSupabaseConfigured, isApiConfigured } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [mode, setMode] = useState('email')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpLoading, setOtpLoading] = useState(false)
  const [error, setError] = useState('')

  const res = (message, type = 'info') => {
    const fn = toast[type]
    if (typeof fn === 'function') fn(message)
    else toast.info(message)
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    try {
      await signInWithEmail({ email, password })
      toast.success('Welcome back!')
      navigate('/student/dashboard')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^\d{10}$/.test(phone)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    setOtpLoading(true)
    try {
      await sendPhoneOtp(phone)
      setOtpSent(true)
      toast.success('OTP sent to your mobile number.')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      res('For the demo, use email login or the demo account below.', 'warning')
    } finally {
      setOtpLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setError('')
    if (otp.trim().length < 6) {
      setError('Enter the 6-digit OTP you received.')
      return
    }
    setLoading(true)
    try {
      const { profile: p } = await verifyOtp({ phone, token: otp.trim(), isMobile: true })
      toast.success(`Welcome${p?.full_name ? ', ' + p.full_name : ''}!`)
      navigate('/student/dashboard')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = async () => {
    setLoading(true)
    try {
      await loginAsDemoStudent()
      toast.success('Logged in as Demo Student.')
      navigate('/student/dashboard')
    } finally {
      setLoading(false)
    }
  }

  const demoHint = isSupabaseConfigured
    ? 'Supabase is configured — real email/password and OTP auth are active.'
    : isApiConfigured
      ? "MySQL backend connected — email & password login active. Use the demo account below or any registered student."
      : "Demo Mode: no Supabase or MySQL keys set. Use the blue 'Demo Student' button below (OTP via SMS needs Supabase)."

  return (
    <AuthShell
      title="Student Login"
      subtitle="Welcome back! Log in to manage your booking."
      demoHint={demoHint}
      footer={
        <>
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-brand-700 hover:text-brand-800">
            Create one
          </Link>
        </>
      }
    >
      {/* Mode tabs */}
      <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode('email')}
          className={cx(
            'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition',
            mode === 'email' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          <Mail className="h-4 w-4" /> Login with Email
        </button>
        <button
          type="button"
          onClick={() => setMode('mobile')}
          className={cx(
            'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition',
            mode === 'mobile' ? 'bg-white text-brand-700 shadow-sm' : 'text-slate-500 hover:text-slate-700',
          )}
        >
          <Smartphone className="h-4 w-4" /> Mobile OTP
        </button>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      {mode === 'email' ? (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Field label="Email Address" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>
          <Field label="Password" required>
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
          <Button type="submit" loading={loading} size="lg" className="w-full">
            Login
          </Button>

          {!isSupabaseConfigured ? (
            <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-4 text-center">
              <p className="text-sm font-semibold text-brand-800">Demo account</p>
              <p className="mt-1 text-xs text-brand-700">Email: student@demo.app &nbsp;·&nbsp; Password: demo123</p>
              <Button type="button" variant="outline" size="sm" className="mt-3" onClick={demoLogin} loading={loading}>
                <Sparkles className="h-4 w-4 text-amber-500" /> One-click Demo Login
              </Button>
            </div>
          ) : null}
        </form>
      ) : (
        <div className="space-y-4">
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <Field label="Mobile Number" required hint="OTP is sent via SMS by Supabase (SMS provider must be configured).">
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="10-digit mobile number"
                  inputMode="numeric"
                  maxLength={10}
                />
              </Field>
              <Button type="submit" loading={otpLoading} size="lg" className="w-full">
                <KeyRound className="h-4 w-4" /> Send OTP
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="rounded-xl bg-slate-50 p-4 text-sm">
                <p className="font-semibold text-slate-700">OTP sent to {phone}</p>
                <p className="mt-0.5 text-slate-500">Enter the 6-digit code below to verify.</p>
              </div>
              <Field label="Enter OTP" required>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6-digit OTP"
                  inputMode="numeric"
                  maxLength={6}
                  className="text-center text-lg tracking-[0.5em]"
                />
              </Field>
              <Button type="submit" loading={loading} size="lg" className="w-full">
                Verify & Login
              </Button>
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false)
                  setOtp('')
                }}
                className="w-full text-center text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                ← Change mobile number
              </button>
            </form>
          )}
        </div>
      )}
    </AuthShell>
  )
}