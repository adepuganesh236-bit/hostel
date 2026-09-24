import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { KeyRound, RefreshCw, ShieldQuestion, Eye, EyeOff } from 'lucide-react'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function ForgotPassword() {
  const { getCaptcha, requestPasswordReset, resetPassword } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState('identify') // 'identify' | 'reset'
  const [identifier, setIdentifier] = useState('')
  const [captchaId, setCaptchaId] = useState('')
  const [question, setQuestion] = useState('')
  const [captchaAnswer, setCaptchaAnswer] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [targetRole, setTargetRole] = useState('student')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadCaptcha = useCallback(async () => {
    try {
      const res = await getCaptcha()
      setQuestion(res.question)
      setCaptchaId(res.captchaId)
      setCaptchaAnswer('')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }, [getCaptcha])

  useEffect(() => {
    loadCaptcha()
  }, [loadCaptcha])

  const handleIdentify = async (e) => {
    e.preventDefault()
    setError('')
    const clean = identifier.trim()
    if (!clean) {
      setError('Enter your registered email or 10-digit mobile number.')
      return
    }
    if (!clean.includes('@') && clean.replace(/\D/g, '').length < 10) {
      setError('Enter a valid email or 10-digit mobile number.')
      return
    }
    if (!captchaAnswer.trim()) {
      setError('Solve the CAPTCHA to continue.')
      return
    }
    setLoading(true)
    try {
      const result = await requestPasswordReset({
        identifier: clean,
        captchaId,
        captchaAnswer,
      })
      setResetToken(result.resetToken)
      setTargetRole(result.role || 'student')
      setStep('reset')
      toast.success('Identity verified. Set a new password.')
    } catch (err) {
      setError(err.message)
      loadCaptcha()
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (confirm !== password) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await resetPassword({ resetToken, password, confirmPassword: confirm })
      toast.success('Password updated. Please log in with your new password.')
      navigate(targetRole === 'owner' ? '/owner/login' : '/login')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="Verify with a quick CAPTCHA, then set a new password. No OTP is sent."
      footer={
        <p>
          Remembered your password?{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:text-brand-800">
            Back to Login
          </Link>
        </p>
      }
    >
      {error ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}

      {step === 'reset' ? (
        <form onSubmit={handleReset} className="space-y-4">
          <div className="rounded-xl bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-700">Account verified</p>
            <p className="mt-0.5 text-slate-500">
              Choose a new password. It must be at least 6 characters.
            </p>
          </div>
          <Field label="New Password" required>
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
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
          <Field label="Confirm New Password" required>
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
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
            <KeyRound className="h-4 w-4" /> Reset Password
          </Button>
          <button
            type="button"
            onClick={() => setStep('identify')}
            className="w-full text-center text-sm font-semibold text-brand-700 hover:text-brand-800"
          >
            ← Use a different account
          </button>
        </form>
      ) : (
        <form onSubmit={handleIdentify} className="space-y-4">
          <Field label="Email or Mobile Number" required>
            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or 10-digit mobile"
              autoComplete="username"
            />
          </Field>
          <Field label="Solve the CAPTCHA" required>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <ShieldQuestion className="h-5 w-5 shrink-0 text-brand-600" />
              <span className="font-display text-lg font-bold tracking-wide text-slate-900">
                {question || 'Loading…'}
              </span>
              <button
                type="button"
                onClick={loadCaptcha}
                disabled={loading}
                className="ml-auto flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 disabled:opacity-50"
                aria-label="Refresh CAPTCHA"
              >
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>
          </Field>
          <Field label="CAPTCHA Answer" required>
            <Input
              value={captchaAnswer}
              onChange={(e) => setCaptchaAnswer(e.target.value.replace(/[^\d]/g, '').slice(0, 3))}
              placeholder="Your answer"
              inputMode="numeric"
              autoComplete="off"
            />
          </Field>
          <Button type="submit" loading={loading} size="lg" className="w-full">
            <KeyRound className="h-4 w-4" /> Verify & Continue
          </Button>
          <p className="text-xs leading-relaxed text-slate-400">
            Enter the registered email or mobile for your account, solve the
            CAPTCHA, and you can set a new password right away. No email or SMS
            OTP is sent.
          </p>
        </form>
      )}
    </AuthShell>
  )
}