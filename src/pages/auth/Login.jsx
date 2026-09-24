import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Eye, EyeOff } from 'lucide-react'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import { Field, Input } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function Login() {
  const { signInWithEmail } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

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

  return (
    <AuthShell
      title="Student Login"
      subtitle="Welcome back! Log in to manage your booking."
      footer={
        <div className="space-y-3">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-700 hover:text-brand-800">
              Register
            </Link>
          </p>
          <p className="flex items-center justify-center gap-4 border-t border-slate-200 pt-3 text-xs text-slate-400">
            <Link to="/owner/login" className="font-semibold text-slate-600 hover:text-brand-700">
              Owner Login
            </Link>
          </p>
        </div>
      }
    >
      {error ? (
        <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}

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
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={loading} size="lg" className="w-full">
          <Mail className="h-4 w-4" /> Login
        </Button>
      </form>
    </AuthShell>
  )
}