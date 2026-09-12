import { useMemo, useState } from 'react'
import { MessageSquareWarning, AlertTriangle, Wrench, ShieldCheck, Zap, Sparkles, Wifi } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useToast } from '../../context/ToastContext'
import { formatDate } from '../../lib/utils'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import EmptyState from '../../components/ui/EmptyState'

const TYPE_ICON = {
  Electrical: { icon: Zap, color: 'text-amber-600 bg-amber-50' },
  Cleaning: { icon: Sparkles, color: 'text-emerald-600 bg-emerald-50' },
  'Wi-Fi': { icon: Wifi, color: 'text-sky-600 bg-sky-50' },
  'Maintenance Issue': { icon: Wrench, color: 'text-amber-600 bg-amber-50' },
  'Food Quality': { icon: AlertTriangle, color: 'text-orange-600 bg-orange-50' },
  'Noise Disturbance': { icon: ShieldCheck, color: 'text-slate-600 bg-slate-100' },
  Hygiene: { icon: Sparkles, color: 'text-emerald-600 bg-emerald-50' },
  Other: { icon: AlertTriangle, color: 'text-slate-600 bg-slate-100' },
}

export default function AdminComplaints() {
  const { complaints, updateComplaintStatus } = useData()
  const toast = useToast()
  const [status, setStatus] = useState('all')

  const filtered = useMemo(
    () => (status === 'all' ? complaints : complaints.filter((c) => c.status === status)),
    [complaints, status],
  )

  const mark = (id, next) => {
    updateComplaintStatus(id, next)
    toast.success(`Marked as ${next}.`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Complaints Desk</h1>
        <p className="mt-0.5 text-sm text-slate-500">Track and resolve student complaints.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['all', 'open', 'in-progress', 'resolved'].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize transition-all ${
              status === s ? 'bg-brand-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-brand-300'
            }`}
          >
            {s === 'all' ? 'All' : s}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader title="Complaint Register" subtitle="Incoming complaints from students." icon={MessageSquareWarning} />
        <CardBody className="p-0">
          {filtered.length ? (
            <ul className="divide-y divide-slate-100">
              {filtered.map((c) => {
                const meta = TYPE_ICON[c.type] || TYPE_ICON.Other
                return (
                  <li key={c.id} className="flex flex-col gap-3 px-5 py-4 hover:bg-slate-50/50 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 gap-3">
                      <span className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${meta.color}`}>
                        <meta.icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-bold text-slate-800">{c.type}</p>
                          <span className="text-xs text-slate-400">{c.student} · Room {c.room || c.roomNumber} · {formatDate(c.date)}</span>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">{c.message}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge status={c.status} label={c.status === 'in-progress' ? 'In Progress' : c.status[0].toUpperCase() + c.status.slice(1)} />
                      {c.status !== 'resolved' ? (
                        <Button size="xs" variant="success" onClick={() => mark(c.id, 'resolved')}>Resolve</Button>
                      ) : null}
                      {c.status === 'open' ? (
                        <Button size="xs" onClick={() => mark(c.id, 'in-progress')}>Start</Button>
                      ) : null}
                    </div>
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="px-5"><EmptyState title="No complaints" description="The inbox is clean right now." /></div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}