import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import {
  CreditCard,
  Smartphone,
  Building,
  Landmark,
  ShieldCheck,
  Lock,
  Info,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { inr, cx, uid } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Card, CardBody } from '../../components/ui/Card'
import { Field, Input } from '../../components/ui/Field'

const METHODS = [
  { key: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
  { key: 'card', label: 'Credit Card', icon: CreditCard, desc: 'Visa, Mastercard, Amex' },
  { key: 'debit', label: 'Debit Card', icon: Landmark, desc: 'Any Indian bank debit card' },
  { key: 'netbanking', label: 'Net Banking', icon: Building, desc: 'All major banks supported' },
]

export default function Payment() {
  const [params] = useSearchParams()
  const bookingId = params.get('booking')
  const { bookings, addPayment } = useData()
  const toast = useToast()
  const navigate = useNavigate()

  const booking = useMemo(
    () => bookings.find((b) => String(b.bookingId) === String(bookingId)),
    [bookings, bookingId],
  )

  const [method, setMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [errors, setErrors] = useState({})
  const [processing, setProcessing] = useState(false)

  if (!booking) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <Badge status="pending" label="Booking required" />
        <h1 className="font-display text-2xl font-bold text-slate-900">No booking selected</h1>
        <p className="max-w-sm text-slate-500">
          Please complete the booking flow first. Choose a room and bed to get here.
        </p>
        <Link to="/booking">
          <Button>Start a Booking</Button>
        </Link>
      </div>
    )
  }

  const validate = () => {
    const next = {}
    if (method === 'upi') {
      if (!/^[\w.-]{2,}@[a-z]{2,}$/i.test(upiId)) next.upiId = 'Enter a valid UPI ID (e.g. name@upi).'
    } else {
      if (!/^\d{15,16}$/.test(number.replace(/\s/g, ''))) next.number = 'Enter a valid card number.'
      if (name.trim().length < 3) next.name = 'Enter the name on the card.'
      if (!/^\d{2}\/\d{2}$/.test(expiry)) next.expiry = 'MM/YY'
      if (!/^\d{3,4}$/.test(cvv)) next.cvv = 'CVV'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handlePay = (e) => {
    e.preventDefault()
    if (!validate()) return
    setProcessing(true)
    // In production, redirect to a secure hosted checkout. Card/CVV data is
    // never stored by this app.
    setTimeout(() => {
      const paymentId = `PAY${Date.now().toString().slice(-6)}`
      addPayment({
        id: paymentId,
        paymentId,
        studentId: booking.studentId,
        studentName: booking.studentName,
        roomNumber: booking.roomNumber,
        bed: booking.bed,
        amount: booking.amount,
        method: METHODS.find((m) => m.key === method)?.label || 'UPI',
        transactionId: uid('TXN'),
        date: new Date().toISOString().slice(0, 10),
        status: 'paid',
        type: 'Advance + First Month',
      })
      setProcessing(false)
      toast.success('Payment successful! Your booking is being confirmed.')
      navigate(`/payment-success?booking=${booking.bookingId}&payment=${paymentId}`)
    }, 1500)
  }

  const cardDisplay = number.replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19)

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-950 py-10 text-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link to={`/booking?room=${booking.roomNumber}`} className="text-sm font-semibold text-brand-200 hover:text-white">
            ← Back to booking
          </Link>
          <h1 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Secure Payment</h1>
          <p className="mt-1 text-sm text-slate-300">
            Booking {booking.bookingId} · Room {booking.roomNumber} · {booking.bed}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Payment methods */}
          <div className="lg:col-span-3">
            <Card>
              <CardBody>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" /> Choose Payment Method
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  For a real deployment this redirects to a secure hosted payment gateway (Razorpay/Cashfree). Card & CVV are never stored in this app.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {METHODS.map((m) => (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMethod(m.key)}
                      className={cx(
                        'flex items-start gap-3 rounded-xl border-2 p-4 text-left transition-all',
                        method === m.key ? 'border-brand-500 bg-brand-50 shadow-sm' : 'border-slate-200 bg-white hover:border-brand-300',
                      )}
                    >
                      <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', method === m.key ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-500')}>
                        <m.icon className="h-5 w-5" />
                      </span>
                      <span>
                        <p className="text-sm font-bold text-slate-900">{m.label}</p>
                        <p className="text-xs text-slate-500">{m.desc}</p>
                      </span>
                    </button>
                  ))}
                </div>

                <form onSubmit={handlePay} className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                  {method === 'upi' ? (
                    <Field label="UPI ID" error={errors.upiId}>
                      <Input
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        error={errors.upiId}
                      />
                    </Field>
                  ) : (
                    <>
                      <Field label="Card Number" error={errors.number}>
                        <Input
                          value={cardDisplay}
                          onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          placeholder="1234 5678 9012 3456"
                          inputMode="numeric"
                          error={errors.number}
                        />
                      </Field>
                      <Field label="Name on Card" error={errors.name}>
                        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. PRIYA PATEL" error={errors.name} />
                      </Field>
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Expiry" error={errors.expiry}>
                          <Input
                            value={expiry}
                            onChange={(e) => setExpiry(e.target.value)}
                            placeholder="MM/YY"
                            inputMode="numeric"
                            maxLength={5}
                            error={errors.expiry}
                          />
                        </Field>
                        <Field label="CVV" error={errors.cvv}>
                          <Input
                            type="password"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            placeholder="•••"
                            inputMode="numeric"
                            error={errors.cvv}
                          />
                        </Field>
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
                    <Lock className="h-4 w-4 shrink-0" />
                    256-bit SSL encrypted &amp; PCI-DSS compliant checkout. We never see your full card or CVV.
                  </div>

                  <Button type="submit" size="lg" loading={processing} className="w-full">
                    <ShieldCheck className="h-5 w-5" /> Pay {inr(booking.amount)} Securely
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 space-y-4">
              <Card>
                <CardBody>
                  <p className="font-display text-sm font-bold uppercase tracking-wide text-slate-400">Payment Summary</p>
                  <div className="mt-4 space-y-2 text-sm">
                    <Row label="Booking ID" value={<Badge status="pending" label={booking.bookingId} />} />
                    <Row label="Hostel" value="StayNest Premium Hostel" />
                    <Row label="Room" value={`Room ${booking.roomNumber}`} />
                    <Row label="Bed" value={booking.bed} />
                    <Row label="Student" value={booking.studentName} />
                  </div>
                  <div className="mt-4 space-y-1.5 rounded-xl bg-slate-50 p-4 text-sm">
                    <Cost label="Monthly Rent" value={inr(booking.rent)} />
                    <Cost label="Advance" value={inr(booking.advance)} />
                    <Cost label="Food Charges" value={inr(booking.food || 2000)} />
                    <Cost label="Electricity" value={inr(booking.electricity || 500)} />
                    <Cost label="Other Charges" value={inr(0)} />
                    <div className="my-2 border-t border-slate-200" />
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-slate-900">Total</span>
                      <span className="font-display text-xl font-extrabold text-brand-700">{inr(booking.amount)}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
                <p className="flex items-start gap-2 text-xs text-slate-500">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                  Advance secures your bed for 30 days. Rent, food and electricity are billed monthly. Refunds follow the hostel policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}</span>
    </div>
  )
}

function Cost({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-800">{value}</span>
    </div>
  )
}