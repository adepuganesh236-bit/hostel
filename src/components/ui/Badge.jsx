import { cx } from '../../lib/utils'

const STATUS_COLORS = {
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  occupied: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  reserved: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  confirmed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  cancelled: 'bg-slate-100 text-slate-600 ring-slate-500/20',
  paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  unpaid: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  open: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  in_progress: 'bg-sky-50 text-sky-700 ring-sky-600/20',
  resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-600/20',
}

export default function Badge({ status, label, className }) {
  const key = String(status || '').replace(/-/g, '_')
  const text = label || String(status || '')
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset',
        STATUS_COLORS[key] || 'bg-slate-100 text-slate-600 ring-slate-500/20',
        className,
      )}
    >
      {text}
    </span>
  )
}