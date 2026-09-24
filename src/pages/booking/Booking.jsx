import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  BedDouble,
  User,
  CreditCard,
  Check,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Info,
  GraduationCap,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { PRICING } from '../../config'
import { inr, cx } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Field, Input } from '../../components/ui/Field'
import { Card, CardBody } from '../../components/ui/Card'

const STEPS = ['Select Room', 'Select Bed', 'Your Details', 'Review']

export default function Booking() {
  const { rooms, addBooking } = useData()
  const { profile, isDemo } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()

  const [step, setStep] = useState(0)
  const [roomNumber, setRoomNumber] = useState(params.get('room') || '')
  const [bedId, setBedId] = useState('')
  const [form, setForm] = useState({
    fullName: profile?.full_name || profile?.name || '',
    mobile: profile?.mobile || '',
    email: profile?.email || '',
    college: profile?.college || '',
    joiningDate: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.roomNumber === String(roomNumber)) || null,
    [rooms, roomNumber],
  )
  const selectedBed = useMemo(
    () => selectedRoom?.beds.find((b) => b.id === String(bedId)) || null,
    [selectedRoom, bedId],
  )

  const summary = useMemo(() => {
    if (!selectedRoom || !selectedBed) return null
    const rent = selectedRoom.rent
    const advance = selectedRoom.advance
    const food = PRICING.foodCharges
    const electricity = PRICING.electricityCharges
    return {
      rent,
      advance,
      food,
      electricity,
      total: rent + advance + food + electricity,
    }
  }, [selectedRoom, selectedBed])

  const availableBeds = selectedRoom?.beds.filter((b) => b.status === 'available') || []

  const goNext = () => {
    if (step === 0 && !selectedRoom) {
      toast.warning('Please select a room first.')
      return
    }
    if (step === 1 && !selectedBed) {
      toast.warning('Please select an available bed.')
      return
    }
    if (step === 2 && !validateDetails()) return
    setStep((s) => s + 1)
  }

  const validateDetails = () => {
    const next = {}
    if (form.fullName.trim().length < 3) next.fullName = 'Enter your full name.'
    if (!/^[6-9]\d{9}$/.test(form.mobile)) next.mobile = 'Valid 10-digit mobile number.'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email.'
    if (!form.college.trim()) next.college = 'Enter your college name.'
    if (!form.joiningDate) next.joiningDate = 'Pick your joining date.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleConfirm = () => {
    setSubmitting(true)
    setTimeout(() => {
      const bookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`
      const room = selectedRoom
      const bed = selectedBed
      const s = summary
      addBooking({
        id: bookingId,
        bookingId,
        studentId: profile?.id?.replace('STU-', '') ? profile.id : `STU-${Date.now().toString().slice(-4)}`,
        studentName: form.fullName,
        studentMobile: form.mobile,
        studentEmail: form.email,
        college: form.college,
        roomNumber: room.roomNumber,
        sharing: room.sharing,
        bed: bed.bedNumber,
        bedId: bed.id,
        date: form.joiningDate,
        rent: s.rent,
        advance: s.advance,
        food: s.food,
        electricity: s.electricity,
        amount: s.total,
        total: s.total,
        paymentStatus: 'pending',
        status: 'pending',
        paymentMethod: null,
      })
      setSubmitting(false)
      toast.success('Booking created! Complete payment to confirm.')
      navigate(`/payment?booking=${bookingId}`)
    }, 800)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-12 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link to="/facilities" className="text-sm font-semibold text-brand-200 hover:text-white">
            ← Back to Facilities
          </Link>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Complete Your Booking</h1>
          <p className="mt-1.5 text-sm text-slate-300">
            {isDemo ? 'Demo Mode — live room & bed selection from real availability.' : 'Choose a room and bed, review charges and pay.'}
          </p>

          {/* Stepper */}
          <ol className="mt-6 flex items-center gap-2 overflow-x-auto pb-1">
            {STEPS.map((label, i) => (
              <li key={label} className="flex shrink-0 items-center gap-2">
                <span
                  className={cx(
                    'flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold',
                    i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-white text-brand-800' : 'bg-white/15 text-white/70',
                  )}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-black/10">
                    {i < step ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  {label}
                </span>
                {i < STEPS.length - 1 ? <ArrowRight className="h-3.5 w-3.5 text-white/40" /> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Main column */}
          <div className="lg:col-span-3">
            {step === 0 ? (
              <Card>
                <CardBody>
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <BedDouble className="h-5 w-5 text-brand-600" /> Step 1 · Choose Your Room
                  </h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {rooms.map((room) => {
                      const avail = room.beds.filter((b) => b.status === 'available').length
                      const active = roomNumber === room.roomNumber
                      return (
                        <button
                          key={room.roomNumber}
                          type="button"
                          disabled={avail === 0}
                          onClick={() => {
                            setRoomNumber(room.roomNumber)
                            setBedId('')
                          }}
                          className={cx(
                            'rounded-xl border-2 p-4 text-left transition-all',
                            active ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-slate-200 bg-white hover:border-brand-300',
                            avail === 0 && 'cursor-not-allowed opacity-50 hover:border-slate-200',
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <p className="font-display text-sm font-bold text-slate-900">
                              Room {room.roomNumber}
                            </p>
                            <Badge status={avail > 0 ? 'available' : 'occupied'} label={avail > 0 ? `${avail} free` : 'Full'} />
                          </div>
                          <p className="mt-1 text-sm text-slate-500">{room.typeLabel}</p>
                          <p className="mt-1 font-display text-base font-bold text-brand-700">{inr(room.rent)}<span className="text-xs font-semibold text-slate-400">/mo</span></p>
                        </button>
                      )
                    })}
                  </div>
                </CardBody>
              </Card>
            ) : null}

            {step === 1 && selectedRoom ? (
              <Card>
                <CardBody>
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <BedDouble className="h-5 w-5 text-brand-600" /> Step 2 · Select a Bed — Room {selectedRoom.roomNumber}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedRoom.typeLabel} · {inr(selectedRoom.rent)}/month
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {selectedRoom.beds.map((bed) => {
                      const isAvailable = bed.status === 'available'
                      const active = bedId === bed.id
                      return (
                        <button
                          key={bed.id}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => setBedId(bed.id)}
                          className={cx(
                            'flex flex-col gap-1 rounded-xl border-2 p-4 text-center transition-all',
                            isAvailable
                              ? active
                                ? 'border-brand-500 bg-brand-50 shadow-sm'
                                : 'border-emerald-300 bg-emerald-50/50 hover:border-emerald-500 hover:bg-emerald-50'
                              : 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60',
                          )}
                        >
                          <p className={cx('text-sm font-bold', isAvailable ? 'text-slate-800' : 'text-slate-400')}>
                            {bed.bedNumber}
                          </p>
                          <p className={cx('text-xs font-bold', isAvailable ? 'text-emerald-600' : 'text-rose-500')}>
                            {isAvailable ? 'Available' : bed.status === 'occupied' ? 'Occupied' : 'Reserved'}
                          </p>
                        </button>
                      )
                    })}
                  </div>
                  <p className="mt-4 text-xs text-slate-400">
                    Only {availableBeds.length} bed{availableBeds.length !== 1 ? 's' : ''} available here.
                  </p>
                </CardBody>
              </Card>
            ) : null}

            {step === 2 ? (
              <Card>
                <CardBody>
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <User className="h-5 w-5 text-brand-600" /> Step 3 · Your Booking Details
                  </h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name" required error={errors.fullName}>
                      <Input value={form.fullName} onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} error={errors.fullName} placeholder="Your full name" />
                    </Field>
                    <Field label="Mobile" required error={errors.mobile}>
                      <Input value={form.mobile} onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value.replace(/\D/g, '').slice(0, 10) }))} error={errors.mobile} placeholder="10-digit mobile" inputMode="numeric" maxLength={10} />
                    </Field>
                    <Field label="Email" required error={errors.email}>
                      <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email} placeholder="you@example.com" />
                    </Field>
                    <Field label="College" required error={errors.college}>
                      <Input value={form.college} onChange={(e) => setForm((f) => ({ ...f, college: e.target.value }))} error={errors.college} placeholder="Your college / university" />
                    </Field>
                    <Field label="Joining Date" required error={errors.joiningDate}>
                      <Input
                        type="date"
                        value={form.joiningDate}
                        min={new Date().toISOString().slice(0, 10)}
                        onChange={(e) => setForm((f) => ({ ...f, joiningDate: e.target.value }))}
                        error={errors.joiningDate}
                      />
                    </Field>
                  </div>
                  <div className="mt-5 rounded-xl bg-brand-50/60 p-4 text-sm text-brand-800">
                    <p className="flex items-center gap-1.5 font-bold">
                      <ShieldCheck className="h-4 w-4" /> Locked selection
                    </p>
                    <p className="mt-1">
                      Room {selectedRoom?.roomNumber} · {selectedBed?.bedNumber} · {selectedRoom?.typeLabel} — not finalized until you review on the next step.
                    </p>
                  </div>
                </CardBody>
              </Card>
            ) : null}

            {step === 3 && summary ? (
              <Card>
                <CardBody>
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                    <CreditCard className="h-5 w-5 text-brand-600" /> Step 4 · Review Your Booking
                  </h2>
                  <dl className="mt-5 space-y-3 text-sm">
                    <Row label="Hostel" value="Hostel" />
                    <Row label="Room" value={`Room ${selectedRoom.roomNumber} (${selectedRoom.typeLabel})`} />
                    <Row label="Bed" value={selectedBed.bedNumber} />
                    <Row label="Student" value={form.fullName} />
                    <Row label="Joining" value={form.joiningDate} />
                  </dl>
                  <div className="mt-6 space-y-1.5 rounded-xl bg-slate-50 p-5 text-sm">
                    <CostRow label="Monthly Rent" value={inr(summary.rent)} />
                    <CostRow label="Advance" value={inr(summary.advance)} />
                    <CostRow label="Food" value={inr(summary.food)} />
                    <CostRow label="Electricity" value={inr(summary.electricity)} />
                    <div className="my-2 border-t border-slate-200" />
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base font-bold text-slate-900">Total</span>
                      <span className="font-display text-xl font-extrabold text-brand-700">{inr(summary.total)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ) : null}
          </div>

          {/* Summary column */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <Card>
                <CardBody>
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-slate-400">Booking Summary</p>
                  <div className="mt-4 space-y-2.5 text-sm">
                    <MiniRow label="Hostel" value="Hostel" />
                    <MiniRow label="Room" value={selectedRoom ? `Room ${selectedRoom.roomNumber}` : '—'} />
                    <MiniRow label="Bed" value={selectedBed?.bedNumber || '—'} />
                  </div>
                  <div className="mt-4 space-y-1.5 rounded-lg bg-slate-50 p-4 text-sm">
                    <CostRow label="Monthly Rent" value={selectedRoom ? inr(selectedRoom.rent) : '—'} small />
                    <CostRow label="Advance" value={selectedRoom ? inr(selectedRoom.advance) : '—'} small />
                    <CostRow label="Food" value={inr(PRICING.foodCharges)} small />
                    <CostRow label="Electricity" value={inr(PRICING.electricityCharges)} small />
                    <div className="my-1.5 border-t border-slate-100" />
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Total</span>
                      <span className="text-brand-700">{summary ? inr(summary.total) : '—'}</span>
                    </div>
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                    <Info className="h-3.5 w-3.5" /> Advance is one-time. Rent, food & electricity are monthly.
                  </p>
                </CardBody>
              </Card>

              {/* Nav buttons */}
              <div className="mt-4 flex items-center justify-between gap-3">
                {step > 0 ? (
                  <Button variant="outline" onClick={() => setStep((s) => s - 1)} icon={<ArrowLeft className="h-4 w-4" />}>
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                {step < 3 ? (
                  <Button onClick={goNext}>
                    {step === 2 ? 'Review Booking' : 'Next'} <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="success" loading={submitting} onClick={handleConfirm}>
                    <Lock className="h-4 w-4" /> Proceed to Payment
                  </Button>
                )}
              </div>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
                <GraduationCap className="h-3.5 w-3.5" /> Secure booking · No card needed until payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="font-semibold text-slate-500">{label}</dt>
      <dd className="text-right font-bold text-slate-800">{value}</dd>
    </div>
  )
}

function MiniRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value}</span>
    </div>
  )
}

function CostRow({ label, value, small }) {
  return (
    <div className={cx('flex items-center justify-between', small ? 'text-xs' : 'text-sm')}>
      <span className={small ? 'text-slate-500' : 'font-medium text-slate-600'}>{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  )
}