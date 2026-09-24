import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import AuthShell from '../../components/layout/AuthShell'
import Button from '../../components/ui/Button'
import { Field, Input, Select } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { PRICING, HOSTEL } from '../../config'

const COURSES = ['B.Tech CSE', 'B.Tech ECE', 'B.Tech Mechanical', 'MBA', 'B.Sc Computer Science', 'B.Com', 'MCA', 'BCA', 'Other']

const BRANCHES = ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Aeronautical', 'IT', 'Biotech', 'Data Science', 'Other']

export default function Register() {
  const { signUp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    course: '',
    branch: '',
    year: '1',
    gender: 'Male',
    preferredRoom: '6 Sharing',
    roomNumber: '',
    motherName: '',
    fatherName: '',
    parentPhone: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const validate = () => {
    const next = {}
    if (form.fullName.trim().length < 3) next.fullName = 'Enter your full name (min 3 chars).'
    if (!/^\d{10}$/.test(form.mobile)) next.mobile = 'Enter a valid 10-digit mobile number.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Password must be at least 6 characters.'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'
    if (!form.college.trim()) next.college = 'Enter your college name.'
    if (!form.motherName.trim()) next.motherName = 'Enter your mother name.'
    if (!form.fatherName.trim()) next.fatherName = 'Enter your father name.'
    if (!/^\d{10}$/.test(form.parentPhone)) next.parentPhone = 'Enter a valid 10-digit parent phone number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signUp({ ...form, password: form.password, preferredRoom: form.preferredRoom })
      toast.success('Account created! You can now log in.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create Account"
      subtitle={`Register to book your bed at ${HOSTEL.name}.`}
      footer={
        <div className="space-y-3">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-700 hover:text-brand-800">
              Log in
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
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              placeholder="Create a password (min 6 chars)"
              error={errors.password}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <Field label="Confirm Password" required error={errors.confirmPassword}>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              placeholder="Re-enter your password"
              error={errors.confirmPassword}
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Toggle confirm password visibility"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
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
          <Field label="Branch" required>
            <Select value={form.branch} onChange={set('branch')}>
              <option value="">Select branch</option>
              {BRANCHES.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </Select>
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
        </div>

        <Field label="Preferred Room Type">
          <Select value={form.preferredRoom} onChange={set('preferredRoom')}>
            <option>4 Sharing</option>
            <option>6 Sharing</option>
            <option>10 Sharing</option>
          </Select>
        </Field>

        <Field label="Room Number">
          <Input
            value={form.roomNumber}
            onChange={set('roomNumber')}
            placeholder="e.g. 101"
            inputMode="numeric"
            error={errors.roomNumber}
          />
        </Field>

        <div className="pt-2">
          <h3 className="font-display text-sm font-bold text-slate-900">Parent / Guardian Details</h3>
          <p className="mt-0.5 text-xs text-slate-500">We contact parents for emergencies and security updates only.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Mother Name" required error={errors.motherName}>
            <Input value={form.motherName} onChange={set('motherName')} placeholder="Mother's full name" error={errors.motherName} />
          </Field>
          <Field label="Father Name" required error={errors.fatherName}>
            <Input value={form.fatherName} onChange={set('fatherName')} placeholder="Father's full name" error={errors.fatherName} />
          </Field>
        </div>
        <Field label="Parent Phone Number" required error={errors.parentPhone}>
          <Input
            value={form.parentPhone}
            onChange={(e) => setForm((f) => ({ ...f, parentPhone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
            placeholder="10-digit parent phone"
            inputMode="numeric"
            maxLength={10}
            error={errors.parentPhone}
          />
        </Field>

        <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          Room rents start at {PRICING.rooms.ten.rent.toLocaleString('en-IN')} ₹/month. Advance, food and electricity are charged separately at booking time.
        </div>

        <Button type="submit" loading={loading} size="lg" className="w-full">
          Register
        </Button>
      </form>
    </AuthShell>
  )
}