import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  CheckCircle2,
  Download,
  Printer,
  LayoutDashboard,
  ArrowLeft,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { inr, formatDate } from '../../lib/utils'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Card, CardBody } from '../../components/ui/Card'

export default function PaymentSuccess() {
  const [params] = useSearchParams()
  const bookingId = params.get('booking')
  const paymentId = params.get('payment')
  const { bookings } = useData()
  const { role } = useAuth()
  const toast = useToast()

  const booking = useMemo(
    () => bookings.find((b) => String(b.bookingId) === String(bookingId)),
    [bookings, bookingId],
  )

  const handleDownload = () => {
    toast.success('Receipt downloaded (demo). In production this generates a PDF.')
  }

  const handlePrint = () => {
    window.print()
  }

  const dashPath =
    role === 'owner' || role === 'admin'
      ? '/owner/dashboard'
      : '/student/dashboard'

  return (
    <div className="min-h-screen bg-emerald-50/60 py-14">
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        {/* Success */}
        <div className="text-center">
          <span className="anim-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lift">
            <CheckCircle2 className="h-10 w-10" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-extrabold text-slate-900">Payment Successful</h1>
          <p className="mt-1.5 text-slate-500">Your booking has been confirmed with Hostel.</p>
        </div>

        {/* Receipt */}
        <Card className="mt-8 overflow-hidden">
          <div className="bg-gradient-to-r from-brand-700 to-brand-900 px-6 py-5 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg font-bold">Payment Receipt</p>
                <p className="text-xs text-brand-200">Hostel · {formatDate(new Date())}</p>
              </div>
              <Badge status="paid" label="Paid" className="bg-emerald-500/20 text-emerald-200 ring-emerald-300/30" />
            </div>
          </div>
          <CardBody>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
              <Detail label="Booking ID" value={booking?.bookingId || bookingId || '—'} mono />
              <Detail label="Payment ID" value={paymentId || '—'} mono />
              <Detail label="Student Name" value={booking?.studentName || '—'} />
              <Detail label="College" value={booking?.college || '—'} />
              <Detail label="Room" value={booking ? `Room ${booking.roomNumber}` : '—'} />
              <Detail label="Bed" value={booking?.bed || '—'} />
              <Detail label="Amount Paid" value={booking ? inr(booking.amount) : '—'} strong />
              <Detail label="Date" value={booking ? formatDate(booking.date || new Date()) : formatDate(new Date())} />
            </dl>

            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
              A confirmation SMS and email have been sent. Keep this receipt for future reference.
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button variant="outline" onClick={handleDownload} icon={<Download className="h-4 w-4" />}>
                Download Receipt
              </Button>
              <Button variant="outline" onClick={handlePrint} icon={<Printer className="h-4 w-4" />}>
                Print
              </Button>
              <Link to={dashPath}>
                <Button icon={<LayoutDashboard className="h-4 w-4" />}>Go to Dashboard</Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        <div className="mt-8 text-center">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}

function Detail({ label, value, strong, mono }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className={`mt-0.5 text-slate-800 ${mono ? 'font-mono font-semibold' : 'font-semibold'} ${strong ? 'text-lg text-emerald-600' : ''}`}>
        {value}
      </dd>
    </div>
  )
}