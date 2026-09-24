import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Users,
  Filter,
  Eye,
  LogOut,
  User,
  Phone,
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Wrench,
  IndianRupee,
  MapPin,
  Building2,
  BedDouble,
  Wallet,
  FileSpreadsheet,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, cx } from '../../lib/utils'
import { exportStudentsExcel } from '../../lib/exportStudents'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { HOSTEL } from '../../config'

const isActive = (s) => !s.checkoutDate

export default function OwnerStudents() {
  const { students, rooms, checkoutStudent } = useData()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [roomFilter, setRoomFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [detailsFor, setDetailsFor] = useState(null)
  const [checkoutFor, setCheckoutFor] = useState(null)
  const [checkingOut, setCheckingOut] = useState(false)
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (!filtered.length) {
      toast.info('No students to export yet.')
      return
    }
    setExporting(true)
    try {
      const fileName = await exportStudentsExcel(filtered)
      toast.success(`Exported ${filtered.length} students to ${fileName}`)
    } catch (err) {
      toast.error(`Export failed: ${err.message}`)
    } finally {
      setExporting(false)
    }
  }

  const roomNumbers = useMemo(
    () => [...new Set(rooms.map((r) => r.roomNumber))].sort(),
    [rooms],
  )

  const activeCount = useMemo(() => students.filter(isActive).length, [students])

  const filtered = useMemo(() => {
    let list = students
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.mobile?.includes(q) ||
          s.email?.toLowerCase().includes(q) ||
          s.college?.toLowerCase().includes(q),
      )
    }
    if (roomFilter !== 'all') list = list.filter((s) => s.roomNumber === roomFilter)
    if (statusFilter !== 'all') {
      list = list.filter((s) => (statusFilter === 'active' ? isActive(s) : !isActive(s)))
    }
    return list
  }, [students, query, roomFilter, statusFilter])

  const confirmCheckout = async () => {
    if (!checkoutFor) return
    setCheckingOut(true)
    try {
      await checkoutStudent(checkoutFor.id, checkoutFor.date)
      toast.success(`${checkoutFor.name} checked out on ${formatDate(checkoutFor.date)}. Bed freed.`)
      setCheckoutFor(null)
    } catch (err) {
      toast.error(`Checkout failed: ${err.message}`)
    } finally {
      setCheckingOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Students</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {activeCount} currently staying · {students.length - activeCount} checked out
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {exporting ? 'Exporting…' : 'Export Students to Excel'}
          </button>
          <Link
            to="/owner/payments"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
          >
            <Wallet className="h-4 w-4" /> View Payments
          </Link>
        </div>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, mobile, email or college…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cx(
              'inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition',
              showFilters ? 'border-brand-400 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600',
            )}
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        {showFilters ? (
          <div className="anim-fade-up flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Room</label>
              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              >
                <option value="all">All Rooms</option>
                {roomNumbers.map((r) => (
                  <option key={r} value={r}>Room {r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-500">Stay Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="checked_out">Checked Out</option>
              </select>
            </div>
          </div>
        ) : null}
      </div>

      <Card>
        <CardHeader
          title="Student Directory"
          subtitle={`${filtered.length} of ${students.length} students shown`}
          icon={Users}
        />
        <CardBody className="p-0">
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Mobile</th>
                    <th className="px-5 py-3">Email</th>
                    <th className="px-5 py-3">College</th>
                    <th className="px-5 py-3">Room</th>
                    <th className="px-5 py-3">Bed</th>
                    <th className="px-5 py-3">Joining</th>
                    <th className="px-5 py-3">Stay Status</th>
                    <th className="px-5 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => {
                    const active = isActive(s)
                    return (
                      <tr key={s.id} className={cx('border-b border-slate-50 transition hover:bg-slate-50/50', !active && 'bg-slate-50/40')}>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                              {s.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                            </span>
                            <div>
                              <p className="font-bold text-slate-800">{s.name}</p>
                              <p className="text-[11px] text-slate-400">{s.course || '—'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600">{s.mobile || '—'}</td>
                        <td className="px-5 py-3.5 text-slate-500">{s.email || '—'}</td>
                        <td className="max-w-44 truncate px-5 py-3.5 text-slate-600">{s.college || '—'}</td>
                        <td className="px-5 py-3.5 font-mono font-bold text-slate-700">{s.roomNumber || '—'}</td>
                        <td className="px-5 py-3.5 text-slate-600">{s.bed || '—'}</td>
                        <td className="px-5 py-3.5 text-slate-500">{formatDate(s.joiningDate)}</td>
                        <td className="px-5 py-3.5">
                          <Badge status={active ? 'active' : 'checked_out'} label={active ? 'Active' : 'Checked Out'} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setDetailsFor(s)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
                            >
                              <Eye className="h-3.5 w-3.5" /> Details
                            </button>
                            {active ? (
                              <button
                                onClick={() => setCheckoutFor({ id: s.id, name: s.name, date: new Date().toISOString().slice(0, 10) })}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100"
                              >
                                <LogOut className="h-3.5 w-3.5" /> Check Out
                              </button>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5">
              <EmptyState title="No students found" description="Try adjusting your search or filters." />
            </div>
          )}
        </CardBody>
      </Card>

      {detailsFor ? (
        <StudentDetailsModal student={detailsFor} onClose={() => setDetailsFor(null)} />
      ) : null}

      {checkoutFor ? (
        <CheckoutModal
          student={checkoutFor}
          checkingOut={checkingOut}
          onChange={(date) => setCheckoutFor((c) => ({ ...c, date }))}
          onCancel={() => setCheckoutFor(null)}
          onConfirm={confirmCheckout}
        />
      ) : null}
    </div>
  )
}

function StudentDetailsModal({ student: s, onClose }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
              {s.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
            </span>
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">{s.name}</h3>
              <p className="text-sm text-slate-500">Student ID · {s.id}</p>
            </div>
          </div>
          <Badge status={isActive(s) ? 'active' : 'checked_out'} label={isActive(s) ? 'Active' : 'Checked Out'} />
        </div>

        <div className="mt-6 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Detail icon={User} label="Full Name" value={s.name} />
          <Detail icon={Phone} label="Mobile" value={s.mobile} />
          <Detail icon={Mail} label="Email" value={s.email} />
          <Detail icon={GraduationCap} label="College" value={s.college} />
          <Detail icon={BookOpen} label="Course" value={s.course} />
          <Detail icon={Calendar} label="Year of Study" value={s.yearOfStudy ? `Year ${s.yearOfStudy}` : null} />
          <Detail icon={Users} label="Gender" value={s.gender} />
          <Detail icon={BedDouble} label="Preferred Room" value={s.preferredRoom} />
          <Detail icon={IndianRupee} label="Monthly Budget" value={s.budget ? `₹${Number(s.budget).toLocaleString('en-IN')}` : null} />
          <Detail icon={Building2} label="Hostel" value={HOSTEL.name} />
          <Detail icon={MapPin} label="Room" value={s.roomNumber ? `Room ${s.roomNumber}` : null} />
          <Detail icon={BedDouble} label="Bed" value={s.bed} />
          <Detail icon={Calendar} label="Joining Date" value={s.joiningDate ? formatDate(s.joiningDate) : null} />
          {s.checkoutDate ? <Detail icon={LogOut} label="Checked Out" value={formatDate(s.checkoutDate)} /> : null}
          <Detail icon={Wrench} label="Father Name" value={s.fatherName} />
          <Detail icon={Wrench} label="Mother Name" value={s.motherName} />
          <Detail icon={Phone} label="Parent Phone" value={s.parentPhone} />
        </div>

        <p className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-500">
          <Wallet className="mr-1 inline h-3.5 w-3.5" />
          Payment status and dues are tracked separately under{' '}
          <Link to="/owner/payments" onClick={onClose} className="font-bold text-brand-700 hover:text-brand-800">
            Payments
          </Link>
          .
        </p>

        <div className="mt-5 flex justify-end">
          <Button variant="ghost" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-0.5 text-sm font-bold text-slate-800">{value || '—'}</p>
      </div>
    </div>
  )
}

function CheckoutModal({ student, checkingOut, onChange, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
          <LogOut className="h-5 w-5 text-rose-500" /> Confirm Checkout
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          {student.name} is leaving. The checkout date will be recorded and their bed will be freed for the next student.
        </p>

        <label className="mt-5 block text-xs font-semibold text-slate-500">Checkout Date</label>
        <input
          type="date"
          value={student.date}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />

        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" loading={checkingOut} onClick={onConfirm}>
            {checkingOut ? 'Checking Out…' : 'Confirm Checkout'}
          </Button>
        </div>
      </div>
    </div>
  )
}