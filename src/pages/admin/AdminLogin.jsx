import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldAlert, LockKeyhole, KeyRound } from 'lucide-react'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { HOSTEL } from '../../config'

export default function AdminLogin() {
  const { demoLogin, signInWithEmail, isSupabaseConfigured, isApiConfigured } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSupabaseConfigured || isApiConfigured) {
        await signInWithEmail({ email, password })
        toast.success('Welcome back, Admin!')
        navigate('/admin/dashboard')
        return
      }
      await demoLogin({ role: 'admin', email: email || HOSTEL.adminEmail })
      toast.success('Welcome back, Admin!')
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Admin Login"
      subtitle="Restricted access — only for hostel administrators."
      demoHint={
        isSupabaseConfigured
          ? `Supabase configured. Admins authenticate with email & password through Supabase (demo admin email: ${HOSTEL.adminEmail}).`
          : isApiConfigured
            ? `MySQL backend connected. Log in with the demo admin email (${HOSTEL.adminEmail}) and password admin123.`
            : `Demo Mode: use the demo admin email (${HOSTEL.adminEmail}) with any non-empty password to enter the admin panel.`
      }
      footer={
        <>
          <Link to="/" className="font-bold text-brand-700 hover:text-brand-800">← Back to website</Link>
        </>
      }
    >
      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <div>
          <p className="font-display text-sm font-bold text-slate-900">Admin Panel</p>
          <p className="text-xs text-slate-500">Single-hostel management</p>
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Admin Email" required>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={HOSTEL.adminEmail}
          />
        </Field>
        <Field label="Password" required hint={isSupabaseConfigured || isApiConfigured ? 'Checked against the user database.' : 'Demo mode accepts any value.'}>
          <div className="relative">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <LockKeyhole className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </Field>
        <Button type="submit" loading={loading} size="lg" className="w-full">
          <KeyRound className="h-4 w-4" /> Sign In as Admin
        </Button>
      </form>

      {!isSupabaseConfigured && !isApiConfigured ? (
        <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-center text-xs text-rose-700">
          Demo admin email: <b>{HOSTEL.adminEmail}</b> · Any password works in demo mode.
        </div>
      ) : null}
    </AuthShell>
  )
}