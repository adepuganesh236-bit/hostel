import { Link } from 'react-router-dom'
import { Wallet, Download } from 'lucide-react'
import { useStudent } from './useStudent'
import { inr, formatDate } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'
import { useToast } from '../../context/ToastContext'

export default function StudentPayments() {
  const { payments, student } = useStudent()
  const toast = useToast()

  const paid = payments.filter((p) => p.status === 'paid')
  const pending = student?.paymentStatus === 'pending'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">My Payments</h1>
        <p className="mt-0.5 text-sm text-slate-500">Every payment you've made towards your stay.</p>
      </div>

      {/* Mini stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-sm font-semibold text-slate-500">Total Paid</p>
          <p className="mt-1 font-display text-2xl font-bold text-emerald-600">{inr(paid.reduce((s, p) => s + p.amount, 0))}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
          <p className="text-sm font-semibold text-slate-500">Payments Made</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">{paid.length}</p>
        </div>
        <div className={`rounded-2xl border p-5 shadow-card ${pending ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}>
          <p className="text-sm font-semibold text-slate-600">Current Month</p>
          <p className="mt-1 font-display text-2xl font-bold text-slate-900">{pending ? 'Due' : 'Paid'}</p>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Payment History"
          subtitle="Dated record of all payments."
          icon={Wallet}
          action={
            payments.length ? (
              <button onClick={() => toast.info('Payment statement downloaded (demo).')} className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800">
                <Download className="h-4 w-4" /> Statement
              </button>
            ) : null
          }
        />
        <CardBody className="p-0">
          {payments.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-5 py-3">Payment ID</th>
                    <th className="px-5 py-3">Type</th>
                    <th className="px-5 py-3">Method</th>
                    <th className="px-5 py-3">Transaction ID</th>
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.paymentId || p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-5 py-3.5 font-mono text-xs font-bold text-slate-700">{p.paymentId || p.id}</td>
                      <td className="px-5 py-3.5 text-slate-600">{p.type || 'Monthly Rent'}</td>
                      <td className="px-5 py-3.5 text-slate-600">{p.method || 'UPI'}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{p.transactionId}</td>
                      <td className="px-5 py-3.5 text-slate-500">{formatDate(p.date)}</td>
                      <td className="px-5 py-3.5 font-bold text-slate-800">{inr(p.amount)}</td>
                      <td className="px-5 py-3.5"><Badge status={p.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="px-5">
              <EmptyState
                title="No payments yet"
                description="Complete the booking and payment flow to see records here."
                action={<Link to="/booking" className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white">Book & Pay</Link>}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}