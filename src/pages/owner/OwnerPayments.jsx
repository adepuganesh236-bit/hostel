import { useMemo, useState } from 'react'
import { Wallet, TrendingUp, IndianRupee, Download, Search } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate, inr } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

export default function OwnerPayments() {
  const { payments, students, bookings } = useData()
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')

  const filtered = useMemo(() => {
    let list = payments
    if (status !== 'all') list = list.filter((p) => p.status === status)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.studentName?.toLowerCase().includes(q) ||
          p.transactionId?.toLowerCase().includes(q) ||
          String(p.roomNumber).includes(q),
      )
    }
    return [...list].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
  }, [payments, query, status])

  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + Number(p.amount || 0), 0)
  const paidCount = payments.filter((p) => p.status === 'paid').length
  const pendingStudents = students.filter((s) => s.paymentStatus === 'pending').length
  const bookingRevenue = bookings.filter((b) => b.paymentStatus === 'paid').reduce((s, b) => s + Number(b.amount || 0), 0)

  const thisMonth = new Date().getMonth()
  const thisMonthRevenue = payments
    .filter((p) => p.status === 'paid' && new Date(p.date).getMonth() === thisMonth)
    .reduce((s, p) => s + Number(p.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-slate-900">Payments & Revenue</h1>
          <p className="mt-0.5 text-sm text-slate-500">Track every rupee collected across the hostel.</p>
        </div>
        <button
          onClick={() => toast.info('Revenue report downloaded (demo).')}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-brand-300 hover:text-brand-700"
        >
          <Download className="h-4 w-4" /> Download Report
        </button>
      </div>

      {/* Dashboard */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Revenue" value={inr(totalRevenue + bookingRevenue)} sub="Collected all-time" icon={IndianRupee} accent="emerald" />
        <StatCard title="Paid" value={paidCount} sub="Successful transactions" icon={Wallet} accent="brand" />
        <StatCard title="Pending" value={pendingStudents} sub="Students with dues" icon={TrendingUp} accent="amber" />
        <StatCard title="This Month" value={inr(thisMonthRevenue)} sub={`${new Date().toLocaleString('default', { month: 'long' })} collections`} icon={IndianRupee} accent="violet" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {[
          { key: 'all', label: 'All Payments' },
          { key: 'paid', label: 'Paid' },
          { key: 'pending', label: 'Pending' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatus(tab.key)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
              status === tab.key ? 'bg-brand-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search payments…"
            className="rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm shadow-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      <Card>
        <CardHeader title="Payment Records" subtitle="Every transaction recorded against a student." icon={Wallet} />
        <CardBody className="p-0">
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Payment ID</th>
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Room</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Transaction ID</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.paymentId || p.id} className="border-b border-slate-50 transition hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">{p.paymentId || p.id}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{p.studentName}</td>
                      <td className="px-5 py-3.5 font-mono font-semibold text-slate-600">{p.roomNumber} {p.bed}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{inr(p.amount)}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{p.transactionId}</td>
                      <td className="px-5 py-3.5 text-slate-500">{formatDate(p.date)}</td>
                      <td className="px-5 py-3.5"><Badge status={p.status} label={p.status === 'paid' ? 'Paid' : 'Pending'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5">
              <EmptyState title="No payments found" description="Records will appear here as students pay." />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}