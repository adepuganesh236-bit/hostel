import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BedDouble,
  Users,
  CalendarCheck,
  IndianRupee,
  DoorOpen,
  TrendingUp,
  Wallet,
  AlertTriangle,
  Building2,
  FileSpreadsheet,
} from 'lucide-react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from 'recharts'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { inr } from '../../lib/utils'
import { exportStudentsExcel } from '../../lib/exportStudents'
import StatCard from '../../components/ui/StatCard'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { HOSTEL } from '../../config'

const PIE_COLORS = ['#10b981', '#f43f5e', '#f59e0b']
const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']

function buildMonthlySeries(rooms, bookings, payments) {
  const now = new Date()
  const buckets = MONTHS.map((m, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    return {
      month: m,
      key: `${d.getFullYear()}-${d.getMonth()}`,
      revenue: 0,
      bookings: 0,
    }
  })
  bookings.forEach((b) => {
    const d = new Date(b.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const bucket = buckets.find((x) => x.key === key)
    if (bucket) {
      bucket.bookings += 1
      if (b.paymentStatus === 'paid') bucket.revenue += Number(b.amount || 0)
    }
  })
  payments.forEach((p) => {
    const d = new Date(p.date)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const bucket = buckets.find((x) => x.key === key)
    if (bucket) bucket.revenue += p.status === 'paid' ? Number(p.amount || 0) : 0
  })
  return buckets
}

export default function OwnerDashboard() {
  const { rooms, students, bookings, payments, stats } = useData()
  const toast = useToast()
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!students.length) {
      toast.info('No registered students to export yet.')
      return
    }
    setExporting(true)
    try {
      const fileName = await exportStudentsExcel(students)
      toast.success(`Exported ${students.length} students to ${fileName}`)
    } catch (err) {
      toast.error(`Export failed: ${err.message}`)
    } finally {
      setExporting(false)
    }
  }

  const occupancyPie = [
    { name: 'Occupied', value: stats.occupied },
    { name: 'Available', value: stats.available },
    { name: 'Reserved', value: stats.reserved },
  ].filter((x) => x.value > 0)

  const series = buildMonthlySeries(rooms, bookings, payments)

  const pendingBookings = bookings.filter((b) => b.status === 'pending')
  const pendingFeesList = students.filter((s) => s.paymentStatus === 'pending')

  const occupancyPct = stats.totalBeds ? Math.round((stats.occupied / stats.totalBeds) * 100) : 0

  const roomsByType = [6, 10].map((share) => {
    const list = rooms.filter((r) => r.sharing === share)
    const occupied = list.reduce(
      (s, r) => s + r.beds.filter((b) => b.status === 'occupied').length,
      0,
    )
    return { name: `${share} sharing`, occupied, total: list.reduce((s, r) => s + r.beds.length, 0) }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Owner Dashboard</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Welcome back! Here's {HOSTEL.name} at a glance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {exporting ? 'Exporting…' : 'Export to Excel'}
          </button>
          <Link to="/owner/rooms">
            <button className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-700">
              <BedDouble className="h-4 w-4" /> Manage Rooms
            </button>
          </Link>
        </div>
      </div>

      {/* Top cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard title="Total Rooms" value={stats.totalRooms} sub="Across 4 floors" icon={DoorOpen} accent="brand" />
        <StatCard title="Total Beds" value={stats.totalBeds} sub={`${occupancyPct}% occupied`} icon={BedDouble} accent="violet" />
        <StatCard title="Occupied" value={stats.occupied} sub="Currently occupied beds" icon={Users} accent="rose" />
        <StatCard title="Available" value={stats.available} sub="Ready to book now" icon={BedDouble} accent="emerald" />
        <StatCard title="Pending Fees" value={pendingFeesList.length} sub="Students with pending dues" icon={AlertTriangle} accent="amber" />
        <StatCard title="Revenue" value={inr(stats.revenue)} sub="Collected so far" icon={IndianRupee} accent="emerald" />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Occupancy */}
        <Card>
          <CardHeader title="Occupancy" subtitle="Beds occupied vs available" icon={BedDouble} />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyPie}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {occupancyPie.map((entry, i) => (
                      <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} beds`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Revenue trend */}
        <Card>
          <CardHeader title="Revenue Trend" subtitle="Collected amount over the last 6 months" icon={TrendingUp} />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip formatter={(v) => [inr(v), 'Revenue']} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Bookings */}
        <Card>
          <CardHeader title="Bookings" subtitle="New bookings per month" icon={CalendarCheck} />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip formatter={(v) => [`${v} bookings`, 'Bookings']} />
                  <Bar dataKey="bookings" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        {/* Available beds by type */}
        <Card>
          <CardHeader title="Occupied Beds by Room Type" subtitle="Beds in use per sharing type" icon={Building2} />
          <CardBody>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={roomsByType} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip formatter={(v, name) => [v, name === 'occupied' ? 'Occupied' : 'Total']} />
                  <Legend />
                  <Bar dataKey="occupied" name="Occupied" fill="#f43f5e" radius={[0, 6, 6, 0]} />
                  <Bar dataKey="total" name="Total" fill="#c7d2fe" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Pending action points */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Pending Bookings"
            subtitle="Awaiting your confirmation"
            icon={CalendarCheck}
            action={
              <Link to="/owner/bookings" className="text-sm font-bold text-brand-700 hover:text-brand-800">Manage →</Link>
            }
          />
          <CardBody>
            {pendingBookings.length ? (
              <ul className="space-y-3">
                {pendingBookings.slice(0, 4).map((b) => (
                  <li key={b.bookingId} className="flex items-center justify-between gap-3 rounded-xl border border-amber-100 bg-amber-50/50 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{b.studentName}</p>
                      <p className="text-xs text-slate-500">Room {b.roomNumber} · {b.bed} · {b.bookingId}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">{inr(b.amount)}</p>
                      <Badge status="pending" />
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">No pending bookings. All clear!</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Students With Pending Fees"
            subtitle="Collect dues before the end of the month"
            icon={Wallet}
            action={
              <Link to="/owner/payments" className="text-sm font-bold text-brand-700 hover:text-brand-800">View →</Link>
            }
          />
          <CardBody>
            {pendingFeesList.length ? (
              <ul className="space-y-3">
                {pendingFeesList.slice(0, 4).map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{s.name}</p>
                      <p className="text-xs text-slate-500">Room {s.roomNumber} · {s.bed}</p>
                    </div>
                    <Badge status="pending" label="Fees due" />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">Everyone has paid. Nice!</p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}