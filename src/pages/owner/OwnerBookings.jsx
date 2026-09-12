import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarCheck, Search, CheckCircle2, XCircle } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, inr } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

export default function OwnerBookings() {
  const { bookings, updateBookingStatus } = useData()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    let list = bookings
    if (status !== 'all') list = list.filter((b) => b.status === status)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (b) =>
          b.bookingId?.toLowerCase().includes(q) ||
          b.studentName?.toLowerCase().includes(q) ||
          String(b.roomNumber).includes(q),
      )
    }
    return [...list].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [bookings, query, status])

  const counts = useMemo(
    () => ({
      all: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    }),
    [bookings],
  )

  const setBookingStatus = (id, s) => {
    updateBookingStatus(id, s)
    toast.success(`Booking ${s === 'confirmed' ? 'confirmed' : s === 'cancelled' ? 'cancelled' : 'updated'}.`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="mt-0.5 text-sm text-slate-500">Review and manage every booking request.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'pending', label: 'Pending', count: counts.pending },
          { key: 'confirmed', label: 'Confirmed', count: counts.confirmed },
          { key: 'cancelled', label: 'Cancelled', count: counts.cancelled },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              status === tab.key ? 'bg-brand-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300'
            }`}
          >
            {tab.label}
            <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${status === tab.key ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
              {tab.count}
            </span>
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bookings…"
            className="rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      <Card>
        <CardHeader title="All Bookings" subtitle="Click to confirm or cancel any booking." icon={CalendarCheck} />
        <CardBody className="p-0">
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Booking ID</th>
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Room</th>
                    <th className="px-5 py-3">Bed</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Payment</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b) => (
                    <tr key={b.bookingId || b.id} className="border-b border-slate-50 transition hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">{b.bookingId || b.id}</td>
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-800">{b.studentName}</p>
                        <p className="text-[11px] text-slate-400">{b.college}</p>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-700">{b.roomNumber}</td>
                      <td className="px-5 py-3.5 text-slate-600">{b.bed}</td>
                      <td className="px-5 py-3.5 text-slate-500">{formatDate(b.date)}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{inr(b.amount)}</td>
                      <td className="px-5 py-3.5"><Badge status={b.paymentStatus} label={b.paymentStatus === 'paid' ? 'Paid' : 'Pending'} /></td>
                      <td className="px-5 py-3.5"><Badge status={b.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          {b.status !== 'confirmed' ? (
                            <Button size="xs" variant="success" onClick={() => setBookingStatus(b.bookingId || b.id, 'confirmed')} icon={<CheckCircle2 className="h-3.5 w-3.5" />}>
                              Confirm
                            </Button>
                          ) : null}
                          {b.status !== 'cancelled' ? (
                            <Button size="xs" variant="danger" onClick={() => setBookingStatus(b.bookingId || b.id, 'cancelled')} icon={<XCircle className="h-3.5 w-3.5" />}>
                              Cancel
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5">
              <EmptyState title="No bookings found" description="There are no bookings matching the current filter." />
            </div>
          )}
        </CardBody>
      </Card>

      <p className="text-center text-xs text-slate-400">
        Need booking data in Supabase? See{' '}
        <Link to="/" className="font-bold text-brand-700">database schema docs</Link>.
      </p>
    </div>
  )
}