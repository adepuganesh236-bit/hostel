import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ShieldCheck, Lock, Info } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { inr, uid } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Card, CardBody } from '../../components/ui/Card'

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

  const handlePay = (e) => {
    e.preventDefault()
    setProcessing(true)
    // In production, redirect to a secure hosted checkout. This app never
    // collects or stores payment details.
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
          {/* Payment */}
          <div className="lg:col-span-3">
            <Card>
              <CardBody>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                  <ShieldCheck className="h-5 w-5 text-emerald-500" /> Pay for Your Booking
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  For a real deployment this redirects to a secure hosted payment gateway (Razorpay/Cashfree).
                </p>

                <form onSubmit={handlePay} className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-medium text-emerald-800">
                    <Lock className="h-4 w-4 shrink-0" />
                    256-bit SSL encrypted &amp; PCI-DSS compliant checkout. We never see or store payment details.
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
                    <Row label="Hostel" value="Hostel" />
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