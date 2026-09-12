import { useMemo, useState } from 'react'
import { CalendarCheck, CheckCircle2, XCircle } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, inr } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminBookings() {
  const { bookings, updateBookingStatus } = useData()
  const toast = useToast()
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () => (status === 'all' ? bookings : bookings.filter((b) => b.status === status)),
    [bookings, status],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">All Bookings</h1>
          <p className="mt-0.5 text-sm text-slate-500">Approve or cancel bookings from here.</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'confirmed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all ${
              status === s ? 'bg-brand-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader title="Booking Registry" icon={CalendarCheck} />
        <CardBody className="p-0">
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Booking</th>
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Room / Bed</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Payment</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.bookingId || b.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">{b.bookingId || b.id}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{b.studentName}</td>
                      <td className="px-5 py-3.5 text-slate-600">{b.roomNumber} · {b.bed}</td>
                      <td className="px-5 py-3.5 text-slate-500">{formatDate(b.date)}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{inr(b.amount)}</td>
                      <td className="px-5 py-3.5"><Badge status={b.paymentStatus} /></td>
                      <td className="px-5 py-3.5"><Badge status={b.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          {b.status !== 'confirmed' && (
                            <Button size="xs" variant="success" onClick={() => { updateBookingStatus(b.bookingId || b.id, 'confirmed'); toast.success('Booking confirmed.') }}>
                              <CheckCircle2 className="h-3.5 w-3.5" /> Confirm
                            </Button>
                          )}
                          {b.status !== 'cancelled' && (
                            <Button size="xs" variant="danger" onClick={() => { updateBookingStatus(b.bookingId || b.id, 'cancelled'); toast.success('Booking cancelled.') }}>
                              <XCircle className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5"><EmptyState title="No bookings in this status" /></div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}