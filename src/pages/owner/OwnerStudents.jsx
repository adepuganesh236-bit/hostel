import { useMemo, useState } from 'react'
import { Search, Users, Filter } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatDate, cx } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

export default function OwnerStudents() {
  const { students, rooms } = useData()
  const [query, setQuery] = useState('')
  const [roomFilter, setRoomFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const roomNumbers = useMemo(
    () => [...new Set(rooms.map((r) => r.roomNumber))].sort(),
    [rooms],
  )

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
    if (statusFilter !== 'all') list = list.filter((s) => s.paymentStatus === statusFilter)
    return list
  }, [students, query, roomFilter, statusFilter])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Students</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          {students.length} students currently staying · {students.filter((s) => s.paymentStatus === 'paid').length} paid up
        </p>
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
              <label className="mb-1 block text-xs font-semibold text-slate-500">Payment Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-400 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
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
                    <th className="px-5 py-3">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.id} className="border-b border-slate-50 transition hover:bg-slate-50/50">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                            {s.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800">{s.name}</p>
                            <p className="text-[11px] text-slate-400">{s.course}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">{s.mobile}</td>
                      <td className="px-5 py-3.5 text-slate-500">{s.email}</td>
                      <td className="max-w-44 truncate px-5 py-3.5 text-slate-600">{s.college}</td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-700">{s.roomNumber}</td>
                      <td className="px-5 py-3.5 text-slate-600">{s.bed}</td>
                      <td className="px-5 py-3.5 text-slate-500">{formatDate(s.joiningDate)}</td>
                      <td className="px-5 py-3.5">
                        <Badge status={s.paymentStatus} label={s.paymentStatus === 'paid' ? 'Paid' : 'Pending'} />
                      </td>
                    </tr>
                  ))}
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
    </div>
  )
}