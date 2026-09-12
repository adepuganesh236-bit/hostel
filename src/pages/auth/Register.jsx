import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import { Field, Input, Select } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { PRICING } from '../../config'

const COURSES = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'MBA', 'B.Sc Computer Science', 'B.Com', 'MCA', 'BCA', 'Other']

export default function Register() {
  const { signUp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    college: '',
    course: '',
    year: '1',
    gender: 'Male',
    budget: '5000 - 8000',
    preferredRoom: '2 Sharing',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (form.fullName.trim().length < 3) next.fullName = 'Enter your full name (min 3 chars).'
    if (!/^\d{10}$/.test(form.mobile)) next.mobile = 'Enter a valid 10-digit mobile number.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (!form.college.trim()) next.college = 'Enter your college name.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signUp({ ...form, password: form.password, preferredRoom: form.preferredRoom })
      toast.success('Account created! Check your email to verify.') // demo mode only simulates
      navigate(`/verify?email=${encodeURIComponent(form.email)}`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle="Register to book your bed at StayNest Premium Hostel."
      demoHint="Demo Mode: registration creates a local account and simulates the email-verification step."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-700 hover:text-brand-800">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full Name" required error={errors.fullName}>
          <Input value={form.fullName} onChange={set('fullName')} placeholder="e.g. Priya Patel" error={errors.fullName} />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Mobile Number" required error={errors.mobile}>
            <Input
              value={form.mobile}
              onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
              placeholder="10-digit mobile"
              inputMode="numeric"
              maxLength={10}
              error={errors.mobile}
            />
          </Field>
          <Field label="Email" required error={errors.email}>
            <Input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" error={errors.email} />
          </Field>
        </div>

        <Field label="Password" required error={errors.password}>
          <Input
            type="password"
            value={form.password}
            onChange={set('password')}
            placeholder="Create a password (min 6 chars)"
            error={errors.password}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="College" required error={errors.college}>
            <Input value={form.college} onChange={set('college')} placeholder="Your college/university" error={errors.college} />
          </Field>
          <Field label="Course" required>
            <Select value={form.course} onChange={set('course')}>
              <option value="">Select course</option>
              {COURSES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Year">
            <Select value={form.year} onChange={set('year')}>
              {['1', '2', '3', '4'].map((y) => (
                <option key={y} value={y}>Year {y}</option>
              ))}
            </Select>
          </Field>
          <Field label="Gender">
            <Select value={form.gender} onChange={set('gender')}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </Select>
          </Field>
          <Field label="Budget / month">
            <Select value={form.budget} onChange={set('budget')}>
              <option>₹5,000 – 6,000</option>
              <option>₹6,000 – 8,000</option>
              <option>₹8,000 – 10,000</option>
              <option>₹10,000 – 15,000</option>
            </Select>
          </Field>
        </div>

        <Field label="Preferred Room Type">
          <Select value={form.preferredRoom} onChange={set('preferredRoom')}>
            <option>Single Sharing</option>
            <option>2 Sharing</option>
            <option>3 Sharing</option>
            <option>4 Sharing</option>
          </Select>
        </Field>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Room rents start at {PRICING.rooms.quad.rent.toLocaleString('en-IN')} ₹/month. Advance, food and electricity are charged separately at booking time.
        </div>

        <Button type="submit" loading={loading} size="lg" className="w-full">
          Register
        </Button>
      </form>
    </AuthShell>
  )
}