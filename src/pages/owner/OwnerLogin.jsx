import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { KeyRound, Smartphone, UserCog } from 'lucide-react'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { cx } from '../../lib/utils'

export default function OwnerLogin() {
  const { demoLogin, sendPhoneOtp, verifyOtp, isSupabaseConfigured } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async (e) => {
    e.preventDefault()
    setError('')
    if (!/^\d{10}$/.test(mobile)) {
      setError('Enter a valid 10-digit mobile number.')
      return
    }
    if (isSupabaseConfigured) {
      setLoading(true)
      try {
        await sendPhoneOtp(mobile)
        setOtpSent(true)
        toast.success('OTP sent to the owner mobile.')
      } catch (err) {
        setError(err.message)
        toast.error(err.message)
      } finally {
        setLoading(false)
      }
      return
    }
    // Demo mode: owner number is the configured identifier; verify & login
    setLoading(true)
    try {
      await demoLogin({ role: 'owner', mobile })
      toast.success('Welcome back, Hostel Owner!')
      navigate('/owner/dashboard')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    if (otp.trim().length < 6) {
      setError('Enter the 6-digit OTP.')
      return
    }
    setLoading(true)
    try {
      await verifyOtp({ phone: mobile, token: otp.trim(), isMobile: true })
      toast.success('Welcome back, Hostel Owner!')
      navigate('/owner/dashboard')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Owner Login"
      subtitle="Secure access for the hostel management team."
      demoHint={
        isSupabaseConfigured
          ? 'Authenticate with a real SMS OTP via Supabase. No password is ever stored.'
          : 'Demo Mode: the demo owner mobile is used to sign in. No password or OTP is faked or hard-coded.'
      }
      footer={
        <>
          <Link to="/" className="font-bold text-brand-700 hover:text-brand-800">← Back to website</Link>
        </>
      }
    >
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
          <UserCog className="h-6 w-6" />
        </span>
        <div>
          <p className="font-display text-sm font-bold text-slate-900">Hostel Owner Panel</p>
          <p className="text-xs text-slate-500">Dashboard · Rooms · Students · Payments</p>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      ) : null}

      {!otpSent ? (
        <form onSubmit={handleSend} className="space-y-4">
          <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
            <Smartphone className="h-5 w-5 shrink-0" />
            Mobile / Email
          </div>
          <Field label="Owner Mobile Number" required hint="OTP is authenticated through Supabase when configured.">
            <Input
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit registered mobile"
              inputMode="numeric"
              maxLength={10}
            />
          </Field>
          <Button type="submit" loading={loading} size="lg" className="w-full">
            <KeyRound className="h-4 w-4" /> {isSupabaseConfigured ? 'Send OTP' : 'Authenticate & Login'}
          </Button>
          <Link
            to="/forgot-password"
            className="block text-center text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            Forgot password?
          </Link>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="rounded-xl bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-700">OTP sent to +91 {mobile}</p>
            <p className="mt-0.5 text-slate-500">Enter the code to continue to the owner dashboard.</p>
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
            className={cx('w-full text-center text-sm font-semibold text-brand-700 hover:text-brand-800')}
          >
            ← Use a different number
          </button>
        </form>
      )}
    </AuthShell>
  )
}