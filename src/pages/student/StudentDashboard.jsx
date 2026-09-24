import { Link } from 'react-router-dom'
import {
  Building2,
  BedDouble,
  IndianRupee,
  Wallet,
  CalendarCheck,
  CalendarClock,
  History,
  ArrowRight,
  Sparkles,
  Sparkle,
  MapPin,
} from 'lucide-react'
import { useStudent } from './useStudent'
import { useData } from '../../context/DataContext'
import { inr, formatDate, cx } from '../../lib/utils'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { HOSTEL, PRICING } from '../../config'

export default function StudentDashboard() {
  const { student, room, bookings, payments } = useStudent()
  const { stats } = useData()

  if (!student) {
    return (
      <EmptyState
        title="No student profile found"
        description="Book a room to see your dashboard here."
        action={<Link to="/booking" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white">Book a Room</Link>}
      />
    )
  }

  const currentBooking = bookings.find((b) => b.status !== 'cancelled') || bookings[0]
  const nextPaymentDate = currentBooking
    ? new Date(new Date(currentBooking.date).setMonth(new Date(currentBooking.date).getMonth() + 1))
    : null

  const statusCard = (b) => {
    if (!b) return 'pending'
    if (b.status === 'confirmed' && b.paymentStatus === 'paid') return 'paid'
    if (b.status === 'confirmed' && b.paymentStatus === 'pending') return 'pending'
    return b.status
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">
            Welcome back, {student.firstName}! 👋
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Here's the status of your stay at {HOSTEL.name}.
          </p>
        </div>
        <Link to="/booking">
          <button className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700">
            <Sparkle className="h-4 w-4" /> Book Another Bed
          </button>
        </Link>
      </div>

      {/* My hostel cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="My Hostel"
          value={HOSTEL.shortName}
          sub={HOSTEL.city}
          icon={Building2}
          accent="brand"
        />
        <StatCard
          title="My Room"
          value={student.roomNumber || '—'}
          sub={room ? `${room.typeLabel} · Floor ${room.floor}` : 'Not assigned'}
          icon={BedDouble}
          accent="emerald"
        />
        <StatCard
          title="My Bed"
          value={student.bed || '—'}
          sub="Assigned bed"
          icon={BedDouble}
          accent="amber"
        />
        <StatCard
          title="Monthly Rent"
          value={room ? inr(room.rent) : '—'}
          sub={room ? `+ ${inr(PRICING.foodCharges)} food & ${inr(PRICING.electricityCharges)} elec.` : ''}
          icon={IndianRupee}
          accent="violet"
        />
        <StatCard
          title="Payment"
          value={student.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
          sub="Current month status"
          icon={Wallet}
          accent={student.paymentStatus === 'paid' ? 'emerald' : 'rose'}
        />
        <StatCard
          title="Booking"
          value={statusCard(currentBooking) === 'confirmed' ? 'Confirmed' : 'Pending'}
          sub={currentBooking ? currentBooking.bookingId : 'No active booking'}
          icon={CalendarCheck}
          accent={statusCard(currentBooking) === 'confirmed' ? 'emerald' : 'amber'}
        />
      </div>

      {/* Next payment + recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Next Payment Due"
            subtitle="Get it done before the date to avoid reminders."
            icon={CalendarClock}
            action={
              <Badge
                status={student.paymentStatus === 'paid' ? 'paid' : 'pending'}
                label={student.paymentStatus === 'paid' ? 'Paid' : 'Due'}
              />
            }
          />
          <CardBody>
            {currentBooking ? (
              <div className="space-y-4">
                <div className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Amount due</span>
                    <span className="font-display text-2xl font-bold text-slate-900">{inr(room ? room.rent + PRICING.foodCharges + PRICING.electricityCharges : currentBooking.amount)}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Due date</span>
                    <span className="font-bold text-slate-800">{nextPaymentDate ? formatDate(nextPaymentDate) : '—'}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-slate-500">Pay by</span>
                    <span className="font-bold text-brand-700">{HOSTEL.whatsappBooking ? `WhatsApp ${HOSTEL.whatsappBooking}` : 'Hostel office / online'}</span>
                  </div>
                </div>
                <Link to="/payment" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
                  Pay the Due Amount <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <EmptyState title="No payment scheduled" description="Once you book a room, your payment schedule will appear here." />
            )}
          </CardBody>
        </Card>

        {/* Booking history */}
        <Card>
          <CardHeader
            title="Recent Bookings"
            subtitle="Your latest booking activity."
            icon={History}
            action={<Link to="/student/bookings" className="text-sm font-bold text-brand-700 hover:text-brand-800">View all →</Link>}
          />
          <CardBody className="space-y-3">
            {bookings.length ? (
              bookings.slice(0, 4).map((b) => (
                <div key={b.bookingId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3">
                  <div>
                    <p className="font-mono text-xs font-bold text-slate-700">{b.bookingId}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Room {b.roomNumber} · {b.bed} · {formatDate(b.date)}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge status={b.status} />
                    <p className="mt-1 text-sm font-bold text-slate-800">{inr(b.amount)}</p>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState title="No bookings yet" description="Your bookings will show up here." />
            )}
          </CardBody>
        </Card>
      </div>

      {/* Payment history */}
      <Card>
        <CardHeader
          title="Payment History"
          subtitle="All payments made towards your stay."
          icon={Wallet}
          action={<Link to="/student/payments" className="text-sm font-bold text-brand-700 hover:text-brand-800">View all →</Link>}
        />
        <CardBody className="p-0">
          {payments.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Payment ID</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.slice(0, 6).map((p) => (
                    <tr key={p.paymentId || p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-mono text-xs font-bold text-slate-700">{p.paymentId || p.id}</td>
                      <td className="px-5 py-3 text-slate-500">{formatDate(p.date)}</td>
                      <td className="px-5 py-3 font-bold text-slate-800">{inr(p.amount)}</td>
                      <td className="px-5 py-3"><Badge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5"><EmptyState title="No payments yet" description="Payments will appear after you book and pay." /></div>
          )}
        </CardBody>
      </Card>

      {/* Live availability banner */}
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-6 py-5 sm:flex-row">
        <p className={cx('flex items-center gap-2 text-sm font-semibold text-emerald-800')}>
          <Sparkles className="h-4 w-4" /> {stats.available} beds are available right now across {stats.totalRooms} rooms.
        </p>
        <Link to="/booking" className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700">
          Check Availability <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Footer map pin */}
      <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
        <MapPin className="h-3.5 w-3.5" /> {HOSTEL.address}
      </p>
    </div>
  )
}