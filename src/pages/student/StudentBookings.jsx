import { Link } from 'react-router-dom'
import { CalendarCheck, CalendarPlus } from 'lucide-react'
import { useStudent } from './useStudent'
import { inr, formatDate } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

export default function StudentBookings() {
  const { student, bookings } = useStudent()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {student ? `${student.name}'s booking history` : 'Booking history'}
          </p>
        </div>
        <Link to="/booking" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700">
          <CalendarPlus className="h-4 w-4" /> New Booking
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Booking History"
          subtitle="Booking statuses: Pending, Confirmed or Cancelled."
          icon={CalendarCheck}
        />
        <CardBody className="p-0">
          {bookings.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Hostel</th>
                    <th className="px-5 py-3">Room</th>
                    <th className="px-5 py-3">Bed</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Payment</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b, i) => (
                    <tr key={b.bookingId || i} className="border-b border-slate-50 transition hover:bg-slate-50/50">
                      <td className="px-5 py-3.5">
                        <p className="font-bold text-slate-800">StayNest</p>
                        <p className="font-mono text-[11px] text-slate-400">{b.bookingId}</p>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">Room {b.roomNumber}</td>
                      <td className="px-5 py-3.5 text-slate-600">{b.bed}</td>
                      <td className="px-5 py-3.5 text-slate-500">{formatDate(b.date)}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{inr(b.amount)}</td>
                      <td className="px-5 py-3.5"><Badge status={b.paymentStatus} label={b.paymentStatus === 'paid' ? 'Paid' : 'Pending'} /></td>
                      <td className="px-5 py-3.5"><Badge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5">
              <EmptyState
                title="No bookings yet"
                description="Book a room and it will show up here."
                action={
                  <Link to="/booking" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white">
                    Book Now
                  </Link>
                }
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}