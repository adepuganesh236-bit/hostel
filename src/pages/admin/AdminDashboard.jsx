import { Link } from 'react-router-dom'
import {
  Users,
  DoorOpen,
  BedDouble,
  CalendarCheck,
  IndianRupee,
  Star,
  MessageSquareWarning,
  Wallet,
  Building2,
  ArrowRight,
  Clock3,
  UserCog,
  ClipboardCheck,
  BellRing,
  BadgeAlert,
  Sparkles,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { inr } from '../../lib/utils'
import StatCard from '../../components/ui/StatCard'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { HOSTEL } from '../../config'

const FUTURE = [
  { icon: UserCog, title: 'Parent Login', text: 'Let parents view attendance & dues.' },
  { icon: ClipboardCheck, title: 'Attendance', text: 'Mark daily student attendance.' },
  { icon: Clock3, title: 'Leave Management', text: 'Approve in/out leave requests.' },
  { icon: UserCog, title: 'Visitor Management', text: 'Digital visitor logs & approvals.' },
  { icon: BadgeAlert, title: 'Emergency Alerts', text: 'Instant SMS to all residents.' },
  { icon: BellRing, title: 'Notifications', text: 'Broadcast announcements to students.' },
  { icon: ClipboardCheck, title: 'Warden Management', text: 'Assign wardens to floors.' },
  { icon: Star, title: 'Advanced Complaints', text: 'Prioritised complaint tickets.' },
]

export default function AdminDashboard() {
  const { rooms, students, bookings, reviews, complaints, stats } = useData()
  const revenue = stats.revenue

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Admin Panel</h1>
          <p className="mt-0.5 text-sm text-slate-500">Single-hostel management for {HOSTEL.name}.</p>
        </div>
        <Link to="/owner/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800">
          <Building2 className="h-4 w-4" /> Owner View
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Students" value={students.length} sub="Currently staying" icon={Users} accent="brand" />
        <StatCard title="Total Rooms" value={rooms.length} sub="Across 4 floors" icon={DoorOpen} accent="violet" />
        <StatCard title="Total Beds" value={stats.totalBeds} sub={`${stats.occupied} occupied · ${stats.available} free`} icon={BedDouble} accent="sky" />
        <StatCard title="Bookings" value={bookings.length} sub={`${bookings.filter((b) => b.status === 'pending').length} pending`} icon={CalendarCheck} accent="amber" />
        <StatCard title="Revenue" value={inr(revenue)} sub="All time collections" icon={IndianRupee} accent="emerald" />
        <StatCard title="Pending Payments" value={students.filter((s) => s.paymentStatus === 'pending').length} sub="Students with dues" icon={Wallet} accent="rose" />
        <StatCard title="Reviews" value={reviews.length} sub="Verified student reviews" icon={Star} accent="amber" />
        <StatCard title="Complaints" value={complaints.length} sub={`${complaints.filter((c) => c.status === 'open').length} open`} icon={MessageSquareWarning} accent="rose" />
      </div>

      {/* Quick management */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Quick Management" subtitle="Jump straight into any module." icon={Sparkles} />
          <CardBody className="grid gap-3 sm:grid-cols-2">
            {[
              { to: '/admin/students', label: 'Students', icon: Users },
              { to: '/admin/rooms', label: 'Rooms & Beds', icon: BedDouble },
              { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
              { to: '/admin/payments', label: 'Payments', icon: Wallet },
              { to: '/admin/reviews', label: 'Reviews', icon: Star },
              { to: '/admin/complaints', label: 'Complaints', icon: MessageSquareWarning },
            ].map((m) => (
              <Link
                key={m.to}
                to={m.to}
                className="group flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3.5 transition hover:border-brand-300 hover:bg-brand-50/40"
              >
                <span className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                  <m.icon className="h-4 w-4 text-brand-600" /> {m.label}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600" />
              </Link>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recently Reported" subtitle="Latest complaints & reviews needing attention." icon={MessageSquareWarning} />
          <CardBody className="space-y-3">
            {complaints.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3">
                <div>
                  <p className="text-sm font-bold text-slate-800">{c.type} · {c.student}</p>
                  <p className="truncate text-xs text-slate-500">{c.message}</p>
                </div>
                <Badge status={c.status} />
              </div>
            ))}
            {!complaints.length ? <p className="py-6 text-center text-sm text-slate-400">No complaints.</p> : null}
          </CardBody>
        </Card>
      </div>

      {/* Coming soon */}
      <Card>
        <CardHeader title="Coming Soon" subtitle="Planned upgrades for the next phase (not yet available)." icon={Sparkles} />
        <CardBody>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FUTURE.map((f) => (
              <div key={f.title} className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <Badge status="pending" label="Soon" />
                </div>
                <p className="mt-3 text-sm font-bold text-slate-700">{f.title}</p>
                <p className="mt-1 text-xs text-slate-500">{f.text}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}