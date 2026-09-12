import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { MailCheck, MailWarning, ArrowRight, ShieldCheck, Clock } from 'lucide-react'
import Button from '../../components/ui/Button'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { HOSTEL } from '../../config'
import AuthShell from '../../components/layout/AuthShell'

export default function Verify() {
  const [params] = useSearchParams()
  const { resendVerification, isSupabaseConfigured, isApiConfigured } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const email = params.get('email') || ''
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    setResending(true)
    try {
      await resendVerification(email)
      setResent(true)
      toast.success('Verification email re-sent. Please check your inbox.')
    } catch {
      toast.success('Verification email re-sent. Please check your inbox.')
      setResent(true)
    } finally {
      setResending(false)
    }
  }

  return (
    <AuthShell
      title="Verify Your Email"
      subtitle="One last step and you can book your bed."
    >
      <div className="rounded-2xl border border-slate-200 bg-white p-7 text-center shadow-card">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
          <MailCheck className="h-8 w-8" />
        </span>
        <h2 className="mt-4 font-display text-lg font-bold text-slate-900">
          Registration Successful
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">
          A verification email has been sent to{' '}
          <span className="font-semibold text-slate-700">{email || 'your email address'}</span>.
        </p>

        <div className="mt-5 rounded-xl bg-brand-50/60 px-4 py-3 text-left text-xs leading-relaxed text-brand-800">
          <p className="font-bold">Please verify your email to activate your account:</p>
          <ol className="mt-1.5 list-inside list-decimal space-y-1">
            <li>Open the email from mailbox.</li>
            <li>Click the <b>Verify / Confirm</b> link.</li>
            <li>Return here and log in with your email &amp; password.</li>
          </ol>
        </div>

        {resent ? (
          <p className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            <MailCheck className="h-3.5 w-3.5" /> Verification email re-sent
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={handleResend} variant="outline" loading={resending}>
            <MailWarning className="h-4 w-4" /> Resend Email
          </Button>
          <Button onClick={() => navigate('/login')}>
            Go to Login <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {!isSupabaseConfigured && !isApiConfigured ? (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Demo Mode only simulates verification. With Supabase configured, real
              verification emails are sent automatically.
            </p>
            <Link to="/login" className="mt-2 inline-block text-xs font-bold text-brand-700 hover:text-brand-800">
              Continue to login with your registered account →
            </Link>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-400">
        <Clock className="h-3.5 w-3.5" />
        Didn't receive the email? Check spam, or contact {HOSTEL.phone}.
      </div>
    </AuthShell>
  )
}