import { useMemo } from 'react'
import { Wallet, IndianRupee } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { formatDate, inr } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

export default function AdminPayments() {
  const { payments } = useData()

  const filtered = useMemo(
    () => [...payments].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)),
    [payments],
  )

  const total = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amount, 0)
  const pending = payments.filter((p) => p.status !== 'paid').reduce((s, p) => s + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Payments</h1>
        <p className="mt-0.5 text-sm text-slate-500">All transactions across the hostel.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Collected" value={inr(total)} sub="From all payments" icon={IndianRupee} accent="emerald" />
        <StatCard title="Pending Amount" value={inr(pending)} sub="Not yet collected" icon={IndianRupee} accent="amber" />
        <StatCard title="Transactions" value={payments.length} sub="Total records" icon={Wallet} accent="brand" />
      </div>

      <Card>
        <CardHeader title="Payment Records" icon={Wallet} />
        <CardBody className="p-0">
          {filtered.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Payment</th>
                    <th className="px-5 py-3">Student</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3">Transaction</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.paymentId || p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">{p.paymentId || p.id}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{p.studentName}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{inr(p.amount)}</td>
                      <td className="px-5 py-3.5 text-slate-600">{p.method || 'UPI'}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{p.transactionId}</td>
                      <td className="px-5 py-3.5 text-slate-500">{formatDate(p.date)}</td>
                      <td className="px-5 py-3.5"><Badge status={p.status} label={p.status === 'paid' ? 'Paid' : 'Pending'} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5"><EmptyState title="No payments yet" /></div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}